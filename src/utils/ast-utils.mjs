/**
 * AST parsing utilities for JavaScript code analysis
 */

import { Parser } from 'acorn';
import { importAssertions } from 'acorn-import-assertions';
import { importAttributes } from 'acorn-import-attributes';
import jsx from 'acorn-jsx';
import * as AcornLoose from 'acorn-loose';
import * as walk from 'acorn-walk';

// Extended Acorn parser with JSX and import support
const ExtendedParser = Parser.extend(jsx(), importAttributes, importAssertions);

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

/**
 * Parses JavaScript code into an AST with error recovery
 * @param {string} code - Code to parse
 * @param {Object} options - Parse options
 * @param {string} options.filename - Source filename
 * @param {boolean|null} options.asModule - Force module/script mode
 * @param {Array} options.comments - Array to collect comments
 * @returns {Object} AST object
 */
export function parseJavaScript(code, { filename, asModule = null, comments = [] } = {}) {
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
    return ExtendedParser.parse(code, parseOptions);
  } catch (strictError) {
    try {
      // Retry as script if module parsing failed
      return ExtendedParser.parse(code, { 
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

/**
 * Creates extended walk base for JSX support
 * @returns {Object} Walk base object with JSX handlers
 */
export function createJsxWalkBase() {
  const base = walk.make({ ...walk.base });

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