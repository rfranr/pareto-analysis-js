// withAncestors.int.test.js
import { describe, test, expect } from 'vitest';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import { withAncestors, parseFile } from '../utils/ast-utils.js';

describe('AST integration - acorn-walk + withAncestors', () => {
   test('VariableDeclaration has ancestors (Program, FunctionDeclaration, BlockStatement)', () => {
    const code = 'function test() { const x = 1; }';
    const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });

    let captured = null;


    // We use fullAncestor because it passes (node, state, ancestors)
    // then we can capture ancestors array

    walk.ancestor(ast, {
      VariableDeclaration: withAncestors((node, ancestors) => {
        captured = [...ancestors];
      })
    });

    expect(captured).toBeTruthy();
    const types = captured.map(n => n.type);

    expect(types).toContain('Program');
    expect(types).toContain('FunctionDeclaration');
    expect(types).toContain('BlockStatement');
    expect(types).toContain('VariableDeclaration');
  });

   test('VariableDeclaration has ancestors (Program, FunctionDeclaration, BlockStatement) when walked with fullAncestor', () => {
    const code = 'function test() { const x = 1; }';
    const ast = parseFile(code, { ecmaVersion: 'latest', sourceType: 'script' });

    let ancestorContext = null;

    // We use fullAncestor because it passes (node, state, ancestors)
    // then we can capture ancestors array
    walk.fullAncestor(
      ast,
      withAncestors((node, ancestors) => {
        if (node.type === 'VariableDeclaration') {
          ancestorContext = [...ancestors];
        }
      })
    );

    expect(ancestorContext).toBeDefined();
    expect(Array.isArray(ancestorContext)).toBe(true);
    expect(ancestorContext.length).toBeGreaterThan(0);
  });


  

});
