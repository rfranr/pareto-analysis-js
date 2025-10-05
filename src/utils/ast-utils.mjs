/**
 * AST parsing utilities for JavaScript code analysis
 */

import { tsPlugin } from '@sveltejs/acorn-typescript';
import { Parser } from 'acorn';
import { importAssertions } from 'acorn-import-assertions';
import { importAttributes } from 'acorn-import-attributes';
import jsx from 'acorn-jsx';
import * as AcornLoose from 'acorn-loose';
import * as walk from 'acorn-walk';

// Extended Acorn parser with JSX and import support
const ExtendedJavascriptParser = Parser.extend(jsx(), importAttributes, importAssertions);
const TypeScriptParser = Parser.extend(importAssertions, importAttributes, tsPlugin()); // jsx(), 

/**
 * Infers source type (module vs script) from filename and content
 * @param {string} filename - File name
 * @param {string} code - Code content
 * @returns {string} 'module' or 'script'
 */
export function inferSourceType(filename, code) {
  if (filename?.endsWith('.mjs')) {
    return 'module';
  }
  
  if (/\b(import|export)\b/.test(code)) {
    return 'module';
  }
  
  return 'script';
}


function isTypeScriptFile(filename) {
  return filename?.endsWith('.ts') || filename?.endsWith('.tsx');
}


/**
 * Parses a file into an AST
 * @param {string} code - Code to parse
 * @param {Object} options - Parse options
 * @returns {Object} AST object
 */
export function parseFile(code, options = {}) {
  if (isTypeScriptFile(options.filename)) {
    return parseTypeScript(code, options);
  }

  return parseJavaScript(code, options);
}

/**
 * Parses TypeScript code into an AST
 * @param {string} code - Code to parse
 * @param {Object} options - Parse options
 * @param {string} options.filename - Source filename
 * @param {Array} options.comments - Array to collect comments
 * @returns {Object} AST object
 */
function parseTypeScript(code, { filename,  comments = [] } = {}) {
  const parseOptions = {
		sourceType: 'module',
		ecmaVersion: 'latest',
		locations: true
  };

  try {
    return TypeScriptParser.parse(code, parseOptions);
  } catch (error) {
    // Handle parse errors
    console.error(`Error: parsing TypeScript in ${filename}:`, error);
    return { type: 'Program', body: [] }; // Return empty AST on error
  }
}

/**
 * Parses JavaScript code into an AST with error recovery
 * @param {string} code - Code to parse
 * @param {Object} options - Parse options
 * @param {string} options.filename - Source filename
 * @param {boolean|null} options.asModule - Force module/script mode
 * @param {Array} options.comments - Array to collect comments
 * @returns {Object} AST object
 */
function parseJavaScript(code, { filename, asModule = null, comments = [] } = {}) {
  const sourceType = asModule === null 
    ? inferSourceType(filename, code)
    : (asModule ? 'module' : 'script');

  const parseOptions = {
    ecmaVersion: 'latest',
    sourceType,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    onComment: comments
  };

  try {
    return ExtendedJavascriptParser.parse(code, parseOptions);
  } catch (strictError) {
    try {
      // Retry as script if module parsing failed
      return ExtendedJavascriptParser.parse(code, { 
        ...parseOptions, 
        sourceType: 'script' 
      });
    } catch (scriptError) {
      // Fall back to loose parsing
      const ast = AcornLoose.parse(code, parseOptions);
      ast.loose = true;
      ast._strictErrors = [strictError, scriptError];
      ast.sourceType = sourceType;
      return ast;
    }
  }
}

function genericWalker_deprecated(node, st, c) {
  // TODO: track info about unhandled nodes
  console.log("Warning: Unhandled Node type: " + node.type);
  for (const k of Object.keys(node)) {
    const child = node[k];
    if (!child) continue;
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        const ch = child[i];
        if (ch && typeof ch.type === 'string') c(ch, st);
      }
    } else if (child && typeof child.type === 'string') {
      c(child, st);
    }
  }
}

const genericWalker = (() => {

  // TODO: track info about unhandled nodes
  console.log("Warning: +++++++++++ Unhandled Node type: " + node.type);


  const isNode = (x) => x && typeof x.type === 'string';
  return function genericWalker(node, st, c) {
    // Iterative + without visiting properties that are not nodes
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (!child) continue;
      if (Array.isArray(child)) {
        for (let i = 0; i < child.length; i++) {
          const ch = child[i];
          if (isNode(ch)) c(ch, st);
        }
      } else if (isNode(child)) {
        c(child, st);
      }
    }
  };
})();


export function createExtendedWalkBase() {
  const base = walk.make({ ...walk.base });

  augmentJsxWalkBase(base);
  augmentTypeScriptWalkBase(base);
  // augmentStage3Base(base); 

  const cache = new Map(); 

  return new Proxy(base, {
    get(target, prop, receiver) {
      // Acorn can look at internal symbols; don't touch them
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop, receiver);
      }

      // If we have already resolved this prop, return it
      if (cache.has(prop)) return cache.get(prop);

      // Real handler if it exists and is a function
      const v = Reflect.get(target, prop, receiver);
      if (typeof v === 'function') {
        cache.set(prop, v);
        return v;
      }

      // Fallback handler: return the generic walker
      cache.set(prop, genericWalker);
      return genericWalker;
    }
  });
}


export function augmentTypeScriptWalkBase(base) {
 
  // Decorators (stage-3)
  base.Decorator ??= (n, st, c) => { if (n.expression) c(n.expression, st); };

  // Class fields / static blocks / private ids
  base.PropertyDefinition ??= (n, st, c) => {
    if (n.key) c(n.key, st);
    if (n.value) c(n.value, st);
    if (n.decorators) n.decorators.forEach(d => c(d, st));
  };
  base.StaticBlock ??= (n, st, c) => { n.body.forEach(s => c(s, st)); };
  base.PrivateIdentifier ??= () => {};

  // Optional chaining wrapper
  base.ChainExpression ??= (n, st, c) => c(n.expression, st);

  // Import Attributes
  base.ImportAttribute ??= (n, st, c) => { c(n.key, st); c(n.value, st); };
  base.ImportAttributes ??= (n, st, c) => { n.attributes.forEach(a => c(a, st)); };


  // TypeScript specific nodes that wrap expressions
  base.TSInstantiationExpression ??= (n, st, c) => c(n.expression, st);
  base.TSParameterProperty ??= (n, st, c) => c(n.parameter, st);

  // TypeScript 'satisfies' operator
  base.TSSatisfiesExpression ??= (n, st, c) => c(n.expression, st);

  // TS nodes (no-op majoria)
  const noOps = [
    'TSTypeAnnotation','TSTypeReference','TSQualifiedName','TSUnionType','TSIntersectionType',
    'TSTypeLiteral','TSInterfaceDeclaration','TSTypeAliasDeclaration','TSEnumDeclaration',
    'TSEnumMember','TSModuleDeclaration','TSModuleBlock','TSImportType','TSIndexedAccessType',
    'TSArrayType','TSTupleType','TSLiteralType','TSMappedType','TSConditionalType','TSInferType',
    'TSThisType','TSParenthesizedType','TSTypeParameter','TSTypeParameterDeclaration',
    'TSTypeParameterInstantiation','TSDeclareFunction','TSDeclareMethod',
    'TSImportEqualsDeclaration','TSExportAssignment','TSNamespaceExportDeclaration',
    'TSIndexSignature'
  ];
  for (const t of noOps) base[t] ??= () => {};

  // TS nodes que embolcallen expressions
  base.TSAsExpression = (n, st, c) => c(n.expression, st);
  base.TSTypeAssertion = (n, st, c) => c(n.expression, st);
  base.TSNonNullExpression = (n, st, c) => c(n.expression, st);
  base.TSTypeParameterInstantiation ??= (n, st, c) => {
    if (n.params) n.params.forEach(p => c(p, st));
  };

  return base;
}


/**
 * Creates extended walk base for JSX support
 * @returns {Object} Walk base object with JSX handlers
 */
export function augmentJsxWalkBase(base) {

  // JSX Element handlers
  base.JSXElement = (node, state, callback) => {
    callback(node.openingElement, state, 'JSXOpeningElement');
    node.children.forEach(child => callback(child, state));
    if (node.closingElement) {
      callback(node.closingElement, state, 'JSXClosingElement');
    }
  };

  base.JSXFragment = (node, state, callback) => {
    callback(node.openingFragment, state, 'JSXOpeningFragment');
    node.children.forEach(child => callback(child, state));
    callback(node.closingFragment, state, 'JSXClosingFragment');
  };

  // JSX attribute and expression handlers
  base.JSXOpeningElement = (node, state, callback) => {
    callback(node.name, state);
    node.attributes.forEach(attr => callback(attr, state));
  };
  
  base.JSXClosingElement = (node, state, callback) => {
    callback(node.name, state);
  };
  
  base.JSXAttribute = (node, state, callback) => {
    callback(node.name, state);
    if (node.value) callback(node.value, state);
  };
  
  base.JSXSpreadAttribute = (node, state, callback) => {
    callback(node.argument, state);
  };
  
  base.JSXExpressionContainer = (node, state, callback) => {
    callback(node.expression, state);
  };

  // Simple JSX node types (no traversal needed)
  base.JSXOpeningFragment = () => {};
  base.JSXClosingFragment = () => {};
  base.JSXText = () => {};
  base.JSXIdentifier = () => {};
  base.JSXEmptyExpression = () => {};
  
  base.JSXMemberExpression = (node, state, callback) => {
    callback(node.object, state);
    callback(node.property, state);
  };
  
  base.JSXNamespacedName = (node, state, callback) => {
    callback(node.namespace, state);
    callback(node.name, state);
  };

  return base;
}

/**
 * Wraps a walker function to provide ancestor information
 * @param {Function} walkerFn - Walker function
 * @returns {Function} Wrapped walker function
 */
export function withAncestors(walkerFn) {
  return (node, ancestorsOrState, stateOrAncestors) => {
    const ancestors = Array.isArray(stateOrAncestors) 
      ? stateOrAncestors 
      : (Array.isArray(ancestorsOrState) ? ancestorsOrState : []);
    return walkerFn(node, ancestors);
  };
}

/**
 * Checks if a node type represents a function
 * @param {string} nodeType - AST node type
 * @returns {boolean}
 */
export function isFunctionNode(nodeType) {
  return [
    'FunctionDeclaration',
    'FunctionExpression', 
    'ArrowFunctionExpression'
  ].includes(nodeType);
}