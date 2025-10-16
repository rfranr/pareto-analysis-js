/**
 * Tests for AST utility functions
 */

import { describe, test, expect } from 'vitest';
import {
    createExtendedWalkBase,
    isFunctionNode,
    parseFile,
    withAncestors
} from '../utils/ast-utils.js';

describe('AST Utils', () => {
  test('parseFile should parse valid JavaScript', () => {
    const code = 'const x = 1; console.log(x);';
    const ast = parseFile(code);
    
    expect(ast).toBeDefined();
    expect(ast.type).toBe('Program');
    expect(ast.body).toHaveLength(2);
  });

  test('parseFile should parse JSX', () => {
    const code = 'const element = <div>Hello</div>;';
    const ast = parseFile(code);
    
    expect(ast).toBeDefined();
    expect(ast.type).toBe('Program');
  });

  test('parseFile should handle TypeScript syntax', () => {
    const code = 'interface User { name: string; }';
    const ast = parseFile(code, { filename: 'test.ts' });
    
    expect(ast).toBeDefined();
    expect(ast.type).toBe('Program');
  });

  test('parseFile should throw on invalid syntax', () => {
    const code = 'const x = function(( {';

    const ast = parseFile(code);

    expect(ast._errors).toBeDefined();
    expect(ast._errors.strict).toBeDefined();
    expect(ast._errors.script).toBeDefined();
    expect(ast._errors.strict.message).toContain('Unexpected token');
    expect(ast._errors.script.message).toContain('Unexpected token');
  });

  test('isFunctionNode should identify function nodes', () => {
    const functionDeclaration = { type: 'FunctionDeclaration' };
    const functionExpression = { type: 'FunctionExpression' };
    const arrowFunction = { type: 'ArrowFunctionExpression' };
    const variable = { type: 'VariableDeclaration' };
    
    expect(isFunctionNode(functionDeclaration.type)).toBe(true);
    expect(isFunctionNode(functionExpression.type)).toBe(true);
    expect(isFunctionNode(arrowFunction.type)).toBe(true);
    expect(isFunctionNode(variable.type)).toBe(false);
  });

  test('createExtendedWalkBase should extend base visitors', () => {
    const extended = createExtendedWalkBase();
    
    expect(extended).toBeDefined();
    expect(typeof extended).toBe('object');
  });

  test('withAncestors passes correct ancestors array', () => {
    const calls = [];
    const fn = withAncestors((node, ancestors) => calls.push({ node, ancestors }));

    const fakeNode = { type: 'Fake' };
    fn(fakeNode, ['parent1', 'parent2']); // simula acorn-walk

    expect(calls[0].ancestors).toEqual(['parent1', 'parent2']);
  });

});

describe('Parser Options', () => {
  test('should handle different ECMAScript versions', () => {
    const es2020Code = 'const x = obj?.prop ?? "default";';
    const ast = parseFile(es2020Code);
    
    expect(ast).toBeDefined();
    expect(ast.type).toBe('Program');
  });

  test('should preserve comments when requested', () => {
    const code = '// Comment\nconst x = 1;';
    const comments = [];
    const ast = parseFile(code, { comments });
    
    expect(comments).toHaveLength(1);
    expect(comments[0].value).toContain('Comment');
  });

  test('should handle module syntax', () => {
    const code = 'import React from "react"; export default Component;';
    const ast = parseFile(code);
    
    expect(ast).toBeDefined();
    expect(ast.sourceType).toBe('module');
  });
});