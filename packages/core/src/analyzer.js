/**
 * Main JavaScript code analyzer
 * Analyzes JavaScript/TypeScript files to extract language feature usage statistics
 */

import * as walk from 'acorn-walk';
import path from 'node:path';

import { PARETO } from './config/constants.js';
import { ARRAY_METHODS, MASTER_FEATURE_CATALOG } from './config/features.js';
import {
  createExtendedWalkBase,
  isFunctionNode,
  parseFile,
  withAncestors,
  mapParserNodeToFeature
} from './utils/ast-utils.js';
import {
  exitWithError,
  exitWithSuccess,
  parseArguments
} from './utils/cli-utils.js';
import { readFileContent, saveJsonFile, walkDirectory } from './utils/file-utils.js';

/**
 * Analyzes a single JavaScript file
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeFile(filePath) {
  const code = await readFileContent(filePath);
  const comments = [];
  const featureTracker = new FeatureTracker();
  const missingDetectors = {};
  
  try {
    console.info(`Info: Analyzing file: ${filePath}`);

    const ast = parseFile(code, { filename: filePath, comments });
    analyzeAst(ast, featureTracker, missingDetectors);

    const lineCount = countLines(code);
    
    return {
      file: filePath,
      counts: featureTracker.getCounts(),
      present: featureTracker.getPresence(),
      loc: lineCount,
      comments: comments.length,
      unknown: featureTracker.getUnknown(),
      loose: !!ast.loose,
      missingDetectors: missingDetectors,
      errors: ast._errors || []
    };
  } catch (error) {
    throw new Error(`Failed to analyze ${filePath}: ${error.message}`);
  }
}

/**
 * Feature tracking utility class
 */
class FeatureTracker {
  constructor() {
    this.counts = Object.create(null);
    this.knownFeatures = new Set(MASTER_FEATURE_CATALOG);
    this.unknownFeatures = new Set();
  }

  /**
   * Increments count for a feature
   * @param {string} feature - Feature name
   * @param {number} increment - Amount to increment
   */
  increment(feature, increment = 1) {
    if (!this.knownFeatures.has(feature)) {
      this.unknownFeatures.add(feature);
    }
    this.counts[feature] = (this.counts[feature] || 0) + increment;
  }

  /**
   * Gets all feature counts
   * @returns {Object} Feature counts
   */
  getCounts() {
    return this.counts;
  }

  /**
   * Gets presence map (0 or 1 for each feature)
   * @returns {Object} Feature presence
   */
  getPresence() {
    const presence = {};
    for (const feature of MASTER_FEATURE_CATALOG) {
      presence[feature] = (this.counts[feature] || 0) > 0 ? 1 : 0;
    }
    return presence;
  }

  /**
   * Gets unknown features found during analysis
   * @returns {string[]} Unknown feature names
   */
  getUnknown() {
    return Array.from(this.unknownFeatures).sort();
  }
}


function createWalkerMapProxy(detectors, missingDetectors = Object.create(null), tracker) {
  const walkerMap = Object.fromEntries(
    detectors.map(({ nodeType, detector }) => [
      nodeType,
      // keep your wrapper that normalizes ancestors if you use it
      withAncestors((node, ancestors) => detector(node, ancestors)),
    ])
  );

  return new Proxy(walkerMap, {
    get(target, prop, receiver) {
      // acorn-walk will only ask for string node types, but be safe
      if (typeof prop !== 'string') return Reflect.get(target, prop, receiver);

      const handler = Reflect.get(target, prop, receiver);

      if (typeof handler === 'function') {
        // IMPORTANT: preserve all args that walk.ancestor passes:
        // (node, stateOrAncestors, ancestors)
        return function proxiedVisitor(node, stateOrAncestors, ancestors) {
          return handler(node, stateOrAncestors, ancestors);
        };
      } else {
        console.warn(`Warning: No visitor function defined for node type: ${prop}`);
      }

      // Count a visit for a node type that has no detector
      const rec = (missingDetectors[prop] ||= { visited: 0 });
      rec.visited++;

      // Add a generic visitor for unhandled node types
      // must call features handler function 
      // FeatureTracker 

      const genericVisitor = (node, stateOrAncestors, ancestors) => {
        console.warn(`Warning: No specific visitor for node type: ${prop}`);
        tracker.increment(`unhandled_${prop}`);
      };

      return genericVisitor;

    },
  });
}

/**
 * Analyzes an AST to extract feature usage
 * @param {Object} ast - AST to analyze
 * @param {FeatureTracker} tracker - Feature tracker instance
 * @param {Object} missingDetectors - Map of unhandled visitors
 */
function analyzeAst(ast, tracker, missingDetectors = Object.create(null)) {
  const detectors = createFeatureDetectors(tracker);
  const base = createExtendedWalkBase();
  const walkerMap = createWalkerMapProxy(detectors, missingDetectors, tracker);

  try {
    walk.ancestor(ast, walkerMap, base);
  } catch (error) {
    console.error(`Error analyzing AST: ${error.message}`);
    throw new Error(`Error analyzing AST: ${error.message}`);
  }
}


/**
 * Creates feature detection functions
 * @param {FeatureTracker} tracker - Feature tracker instance
 * @returns {Array} Array of detector objects
 */
function createFeatureDetectors(tracker) {
  const detectors = [];

  const addDetector = (nodeType, detector) => {
    detectors.push({ nodeType, detector });
  };

  // Function declarations and expressions
  addDetector('FunctionDeclaration', (node) => {
    tracker.increment('functions');
    if (node.async) tracker.increment('asyncFunctions');
    if (node.generator) tracker.increment('generatorFunctions');
    analyzeParameters(node.params, tracker);
  });

  addDetector('FunctionExpression', (node) => {
    tracker.increment('functions');
    if (node.async) tracker.increment('asyncFunctions');
    if (node.generator) tracker.increment('generatorFunctions');
    analyzeParameters(node.params, tracker);
  });

  addDetector('ArrowFunctionExpression', (node) => {
    tracker.increment('arrowFunctions');
    if (node.async) tracker.increment('asyncFunctions');
    analyzeParameters(node.params, tracker);
  });

  // Async/await
  addDetector('AwaitExpression', (node, ancestors) => {
    tracker.increment('awaitExpressions');
    if (!ancestors.some(ancestor => isFunctionNode(ancestor.type))) {
      tracker.increment('topLevelAwait');
    }
  });

  // Optional chaining and nullish coalescing
  addDetector('ChainExpression', () => {
    tracker.increment('optionalChaining');
  });

  addDetector('LogicalExpression', (node) => {
    switch (node.operator) {
      case '??':
        tracker.increment('nullishCoalescing');
        break;
      case '&&':
        tracker.increment('logicalAND');
        break;
      case '||':
        tracker.increment('logicalOR');
        break;
    }
  });

  // Import/Export declarations
  addDetector('ImportDeclaration', (node) => {
    tracker.increment('importDecls');
    if (node.importKind === 'type') {
      tracker.increment('importTypeOnly');
    }
  });

  addDetector('ExportAllDeclaration', () => {
    tracker.increment('exportDecls_all');
  });

  addDetector('ExportNamedDeclaration', (node) => {
    tracker.increment('exportDecls_named');
    if (node.source) {
      tracker.increment('exportFrom');
    }
    if (node.specifiers?.some(spec => spec.exported?.name === 'default')) {
      tracker.increment('exportNamedDefault');
    }
  });

  addDetector('ExportDefaultDeclaration', () => {
    tracker.increment('exportDecls_default');
  });

  addDetector('ImportExpression', () => {
    tracker.increment('dynamicImports');
  });

  // Classes
  addDetector('ClassDeclaration', (node) => {
    tracker.increment('classDecls');
    if (node.superClass) tracker.increment('classExtends');
  });

  addDetector('ClassExpression', (node) => {
    if (node.superClass) tracker.increment('classExtends');
  });

  addDetector('MethodDefinition', (node) => {
    if (['method', 'get', 'set'].includes(node.kind)) {
      tracker.increment('classMethods');
    }
    if (node.static) {
      tracker.increment('classStaticMethods');
    }
    if (node.value?.async) {
      tracker.increment('classAsyncMethods');
    }
  });

  addDetector('PropertyDefinition', (node) => {
    tracker.increment('classFields');
    if (node.static) tracker.increment('classStaticFields');
  });

  addDetector('FieldDefinition', (node) => {
    tracker.increment('classFields');
    if (node.static) tracker.increment('classStaticFields');
  });

  addDetector('PrivateIdentifier', () => {
    tracker.increment('classPrivateMembers');
  });

  // JSX
  addDetector('JSXElement', () => {
    tracker.increment('jsxElements');
  });

  // Promises
  addDetector('NewExpression', (node) => {
    if (node.callee?.type === 'Identifier' && node.callee.name === 'Promise') {
      tracker.increment('newPromise');
    }
  });

  addDetector('CallExpression', (node) => {
    analyzeCallExpression(node, tracker);
  });

  // Destructuring
  addDetector('VariableDeclarator', (node) => {
    if (node.id?.type === 'ObjectPattern') {
      tracker.increment('destructuringObject');
    }
    if (node.id?.type === 'ArrayPattern') {
      tracker.increment('destructuringArray');
    }
  });

  // Spread and rest
  addDetector('SpreadElement', () => {
    tracker.increment('spreadElement');
  });

  addDetector('RestElement', () => {
    tracker.increment('restElement');
  });

  // Template literals
  addDetector('TemplateLiteral', (node) => {
    tracker.increment('templateLiterals');
    if (node.expressions?.length) {
      tracker.increment('interpolatedTemplates');
    }
  });

  addDetector('TaggedTemplateExpression', () => {
    tracker.increment('taggedTemplates');
  });

  // Generators and yield
  addDetector('YieldExpression', () => {
    tracker.increment('yieldExpressions');
  });

  // Iteration statements
  addDetector('ForOfStatement', (node) => {
    tracker.increment('forOf');
    if (node.await) tracker.increment('forAwaitOf');
  });

  addDetector('ForInStatement', () => {
    tracker.increment('forIn');
  });

  addDetector('ForStatement', () => {
    tracker.increment('forClassic');
  });

  addDetector('WhileStatement', () => {
    tracker.increment('while');
  });

  addDetector('DoWhileStatement', () => {
    tracker.increment('doWhile');
  });

  // Control flow
  addDetector('IfStatement', () => {
    tracker.increment('if');
  });

  addDetector('SwitchStatement', () => {
    tracker.increment('switch');
  });

  addDetector('SwitchCase', (node) => {
    if (node.test) {
      tracker.increment('switchCases');
    } else {
      tracker.increment('switchDefault');
    }
  });

  addDetector('TryStatement', () => {
    tracker.increment('try');
  });

  addDetector('CatchClause', (node) => {
    tracker.increment('catch');
    if (!node.param) tracker.increment('catchNoParam');
  });

  addDetector('ThrowStatement', () => {
    tracker.increment('throw');
  });

  addDetector('BreakStatement', () => {
    tracker.increment('break');
  });

  addDetector('ContinueStatement', () => {
    tracker.increment('continue');
  });

  addDetector('ReturnStatement', () => {
    tracker.increment('return');
  });

  addDetector('ConditionalExpression', () => {
    tracker.increment('ternary');
  });

  // Operators
  addDetector('BinaryExpression', (node) => {
    const feature = mapParserNodeToFeature(node);
    if (feature) {
      tracker.increment(feature);
    }
  });

  addDetector('AssignmentExpression', (node) => {
    const feature = mapParserNodeToFeature(node);
    if (feature) {
      tracker.increment(feature);
    }
  });

  addDetector('UpdateExpression', (node) => {
    const feature = mapParserNodeToFeature(node);
    if (feature) {
      tracker.increment(feature);
    }
  });

  // Literals and special nodes
  addDetector('Literal', (node) => {
    analyzeLiteral(node, tracker);
  });

  addDetector('MetaProperty', (node) => {
    if (node.meta?.name === 'import' && node.property?.name === 'meta') {
      tracker.increment('importMeta');
    }
  });

  addDetector('LabeledStatement', () => {
    tracker.increment('labels');
  });

  // TypeScript specific
  addDetector('TSAsExpression', (node) => {
    tracker.increment('tsAsExpression');
  });

  addDetector('TSSatisfiesExpression', (node) => {
    tracker.increment('tsSatisfiesExpression');
  });

////////
  // const noOps = [
  //   'TSTypeAnnotation','TSTypeReference','TSQualifiedName','TSUnionType','TSIntersectionType',
  //   'TSTypeLiteral','TSInterfaceDeclaration','TSTypeAliasDeclaration','TSEnumDeclaration',
  //   'TSEnumMember','TSModuleDeclaration','TSModuleBlock','TSImportType','TSIndexedAccessType',
  //   'TSArrayType','TSTupleType','TSLiteralType','TSMappedType','TSConditionalType','TSInferType',
  //   'TSThisType','TSParenthesizedType','TSTypeParameter','TSTypeParameterDeclaration',
  //   'TSTypeParameterInstantiation','TSDeclareFunction','TSDeclareMethod',
  //   'TSImportEqualsDeclaration','TSExportAssignment','TSNamespaceExportDeclaration',
  //   'TSIndexSignature'
  // ];
////

  return detectors;
}

/**
 * Analyzes function parameters for destructuring and defaults
 * @param {Array} params - Parameter nodes
 * @param {FeatureTracker} tracker - Feature tracker
 */
function analyzeParameters(params, tracker) {
  if (!params) return;
  
  for (const param of params) {
    switch (param.type) {
      case 'ObjectPattern':
        tracker.increment('paramDestructuringObject');
        break;
      case 'ArrayPattern':
        tracker.increment('paramDestructuringArray');
        break;
      case 'RestElement':
        tracker.increment('paramRest');
        break;
      case 'AssignmentPattern':
        tracker.increment('paramDefault');
        break;
    }
  }
}

/**
 * Analyzes call expressions for Promise methods and array methods
 * @param {Object} node - CallExpression node
 * @param {FeatureTracker} tracker - Feature tracker
 */
function analyzeCallExpression(node, tracker) {
  const callee = node.callee;
  
  if (callee?.type === 'MemberExpression' && !callee.computed && 
      callee.property?.type === 'Identifier') {
    
    // Check for Promise static methods
    if (callee.object?.type === 'Identifier' && 
        callee.object.name === 'Promise' &&
        ['all', 'race', 'allSettled', 'any'].includes(callee.property.name)) {
      tracker.increment('promiseAllRaceEtc');
    }
    
    // Check for array methods
    const methodName = callee.property.name;
    if (ARRAY_METHODS.includes(methodName)) {
      tracker.increment(`arrayMethod_${methodName}`);
    }
  }
}

/**
 * Analyzes literal nodes for special types
 * @param {Object} node - Literal node
 * @param {FeatureTracker} tracker - Feature tracker
 */
function analyzeLiteral(node, tracker) {
  if (typeof node.value === 'bigint') {
    tracker.increment('bigintLiteral');
  }
  
  if (typeof node.value === 'number' && 
      typeof node.raw === 'string' && 
      node.raw.includes('_')) {
    tracker.increment('numericSeparator');
  }
  
  if (typeof node.value === 'string' && 
      /^\/.+\/[dgimsuvy]*$/.test(node.raw ?? '')) {
    if (node.regex?.flags) {
      tracker.increment('regexpLiteral');
      for (const flag of node.regex.flags) {
        tracker.increment(`regexpFlag_${flag}`);
      }
    }
  }
}

/**
 * Counts lines in code
 * @param {string} code - Source code
 * @returns {number} Line count
 */
function countLines(code) {
  return code.split(/\r?\n/).length;
}

/**
 * Analyzes an entire repository
 * @param {string} repositoryPath - Path to repository
 * @param {Object} options - Analysis options
 * @param {string} options.repositoryName - Name of the repository
 * @returns {Promise<Object>} Analysis summary
 */
async function analyzeRepository(repositoryPath, options = {
  repositoryName: null
}) {
  const results = [];
  const resolvedPath = path.resolve(process.cwd(), repositoryPath);

  console.log(`Info: Analyzing repository: ${resolvedPath}`);

  for await (const filePath of walkDirectory(resolvedPath)) {
    try {
      const result = await analyzeFile(filePath);

      results.push(result);
    } catch (error) {
      console.warn(`Warning: Could not analyze: ${filePath} (${error.message})`);
    }
  }

  return createRepositorySummary(results, resolvedPath, options);
}

/**
 * Creates a summary of repository analysis results
 * @param {Array} results - Individual file results
 * @param {string} repositoryPath - Repository path
 * @param {Object} options - Summary options
 * @param {string} options.repositoryName - Optional repository name
 * @returns {Object} Repository summary
 */
function createRepositorySummary(results, repositoryPath, options = {
  repositoryName: null
}) {
  const relativeRepoPath = path.relative(process.cwd(), repositoryPath);

  const repoName = options.repositoryName || path.basename(repositoryPath);

  const summary = {
    repo: repoName,
    rootDir: relativeRepoPath,
    filesAnalyzed: results.length,
    totals: {},
    presence: {},
    perKLOC: {},
    locTotal: 0,
    totalOccurrences: 0,
    featuresCatalog: Object.fromEntries(
      MASTER_FEATURE_CATALOG.map(feature => [feature, true])
    ),
    featuresTotal: MASTER_FEATURE_CATALOG.length,
    featuresObserved: 0,
    missingDetectors: {},
    totalMissingDetections: 0,
    generatedAt: new Date().toISOString()
  };

  // TODO: move this to a utility function
  // Unhandled visitors aggregation
  const structural = new Set([
    "Program","Identifier","Expression","Statement",
    "BlockStatement","ExpressionStatement","Pattern","VariablePattern","MemberPattern",
    "ForInit","Class","ClassBody","Property","ObjectExpression","ArrayExpression","ArrayPattern","TemplateElement"
  ]);
  
  for (const result of results) {
    if (result.missingDetectors) {

      const realMissing = result.missingDetectors && Object.fromEntries(
        Object.entries(result.missingDetectors).filter(([type]) => !structural.has(type))
      );

      if (!realMissing) continue;

      for (const [detector, info] of Object.entries(realMissing)) {
        if (!summary.missingDetectors[detector]) {
          summary.missingDetectors[detector] = { visited: 0 };
        }
        summary.missingDetectors[detector].visited += info.visited;
      }
    }
  }
  summary.totalMissingDetections = Object.values(summary.missingDetectors)
    .reduce((sum, v) => sum + v.visited, 0);

  // Initialize all features to 0
  for (const feature of MASTER_FEATURE_CATALOG) {
    summary.totals[feature] = 0;
    summary.presence[feature] = 0;
  }

  // Aggregate results
  for (const result of results) {
    summary.locTotal += result.loc;
    
    for (const [feature, count] of Object.entries(result.counts)) {
      if (feature in summary.totals) {
        summary.totals[feature] += count;
      }
    }
    
    for (const [feature, present] of Object.entries(result.present)) {
      if (feature in summary.presence) {
        summary.presence[feature] += present;
      }
    }
  }

  // Calculate derived metrics
  const kloc = Math.max(1, summary.locTotal / PARETO.KLOC_DIVISOR);
  
  for (const feature of MASTER_FEATURE_CATALOG) {
    summary.perKLOC[feature] = summary.totals[feature] / kloc;
  }

  summary.totalOccurrences = MASTER_FEATURE_CATALOG
    .reduce((total, feature) => total + summary.totals[feature], 0);

  summary.featuresObserved = MASTER_FEATURE_CATALOG
    .reduce((count, feature) => count + (summary.totals[feature] > 0 ? 1 : 0), 0);

  return summary;
}

/**
 * Main CLI function
 */
async function main() {
  const { inputFiles, flags } = parseArguments(process.argv.slice(2));
  
  const usageText = `
Usage: node src/analyzer.js --repo <path> --repository-name <name> --output <file.json>
       node src/analyzer.js --repo <path> [--json]

Options:
  --repo <path>     Repository path to analyze (required)
  --repository-name <name>  Optional repository name to include in results
  --output <file>   Output JSON file path
  --json           Output JSON to stdout
`;

  if (!flags.repo) {
    exitWithError(usageText);
  }

  try {
    const analysis = await analyzeRepository(flags.repo, {
      repositoryName: flags['repository-name'] || null
    });
    
    if (flags.output || flags.json) {
      const json = JSON.stringify(analysis, null, 2);
      
      if (flags.output) {
        await saveJsonFile(flags.output, analysis);
        console.log(`Info: Analysis saved to ${flags.output}`);
      } else {
        console.log(json);
      }
    } else {
      // Text output
      console.log('=== JavaScript Analysis Results ===');
      console.log(`Files analyzed:         ${analysis.filesAnalyzed}`);
      console.log(`Features total:         ${analysis.featuresTotal}`);
      console.log(`Features observed:      ${analysis.featuresObserved}`);
      console.log(`LOC total:             ${analysis.locTotal}`);
      console.log(`Total occurrences:     ${analysis.totalOccurrences}`);
      console.log(`Total unhandled visits: ${analysis.totalMissingDetections}`);
      if (analysis.totalMissingDetections > 0) {
        console.log('Missing detectors:');
        for (const [detector, info] of Object.entries(analysis.missingDetectors)) {
          console.log(`  ${detector}: ${info.visited}`);
        }
      }
      
      console.log('\\n— Top features (non-zero) —');
      const topFeatures = Object.entries(analysis.totals)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25);
        
      for (const [feature, count] of topFeatures) {
        console.log(`${feature.padEnd(24)} ${count}`);
      }
    }
    
    exitWithSuccess();
  } catch (error) {
    exitWithError(`Analysis failed: ${error.message}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeFile, analyzeRepository };
