/**
 * JavaScript language features catalog
 * Defines all trackable language features for analysis
 */

// Binary operators from ECMAScript specification
export const BINARY_OPERATORS = [
  '==', '!=', '===', '!==',
  '<', '<=', '>', '>=',
  '<<', '>>', '>>>',
  '+', '-', '*', '/', '%', '**',
  '|', '^', '&',
  'in', 'instanceof'
];

// Assignment operators including compound assignments
export const ASSIGNMENT_OPERATORS = [
  '=', '+=', '-=', '*=', '/=', '%=', '**=',
  '<<=', '>>=', '>>>=', '&=', '^=', '|=',
  '&&=', '||=', '??='
];

// Update operators
export const UPDATE_OPERATORS = ['++', '--'];

// Array methods commonly used in modern JavaScript
export const ARRAY_METHODS = [
  'map', 'filter', 'reduce', 'some', 'every',
  'find', 'findIndex', 'flatMap'
];

// Regular expression flags
export const REGEXP_FLAGS = ['d', 'g', 'i', 'm', 's', 'u', 'v', 'y'];

// Core language features to track
export const CORE_FEATURES = [
  // Functions and async
  'functions',
  'arrowFunctions', 
  'asyncFunctions',
  'awaitExpressions',
  'topLevelAwait',
  
  // Modern operators
  'optionalChaining',
  'nullishCoalescing',
  'logicalAND',
  'logicalOR',
  
  // Modules
  'importDecls',
  'importTypeOnly',
  'dynamicImports',
  'importMeta',
  'exportDecls_all',
  'exportDecls_named',
  'exportDecls_default',
  'exportFrom',
  'exportNamedDefault',
  
  // Classes
  'classDecls',
  'classMethods',
  'classFields',
  'classStaticMethods',
  'classStaticFields',
  'classPrivateMembers',
  'classExtends',
  'classAsyncMethods',
  
  // JSX
  'jsxElements',
  
  // Promises
  'newPromise',
  'promiseAllRaceEtc',
  
  // Destructuring and parameters
  'destructuringObject',
  'destructuringArray',
  'paramDestructuringObject',
  'paramDestructuringArray',
  'paramRest',
  'paramDefault',
  'spreadElement',
  'restElement',
  
  // Template literals
  'templateLiterals',
  'interpolatedTemplates',
  'taggedTemplates',
  
  // Generators
  'generatorFunctions',
  'yieldExpressions',
  
  // Iteration
  'forOf',
  'forAwaitOf',
  'forIn',
  'forClassic',
  'while',
  'doWhile',
  
  // Control flow
  'if',
  'switch',
  'switchCases',
  'switchDefault',
  'try',
  'catch',
  'catchNoParam',
  'throw',
  'break',
  'continue',
  'return',
  'ternary',
  
  // Literals
  'bigintLiteral',
  'numericSeparator',
  'regexpLiteral',
  
  // Other
  'labels',
  'typeAnnotations'
];

/**
 * Builds the complete feature catalog by combining core features
 * with dynamically generated operator and method features
 */
export function buildFeatureCatalog() {
  const features = [...CORE_FEATURES];
  
  // Add binary operators
  BINARY_OPERATORS.forEach(op => features.push(`binaryOp_${op}`));
  
  // Add assignment operators  
  ASSIGNMENT_OPERATORS.forEach(op => features.push(`assignOp_${op}`));
  
  // Add update operators
  UPDATE_OPERATORS.forEach(op => features.push(`updateOp_${op}`));
  
  // Add array methods
  ARRAY_METHODS.forEach(method => features.push(`arrayMethod_${method}`));
  
  // Add regexp flags
  REGEXP_FLAGS.forEach(flag => features.push(`regexpFlag_${flag}`));
  
  return Array.from(new Set(features)).sort();
}

/**
 * The master feature catalog used for consistent analysis across repositories
 */
export const MASTER_FEATURE_CATALOG = buildFeatureCatalog();