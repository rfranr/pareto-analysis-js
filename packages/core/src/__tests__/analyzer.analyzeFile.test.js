/**
 * Tests for the main analyzer functionality
 */

import { createRequire } from 'node:module';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { analyzeFile } from '../analyzer.js';
import { readFileContent } from '../utils/file-utils.js';

const require = createRequire(import.meta.url);

// Mock file system operations
vi.mock('../utils/file-utils.js');

describe('analyzeFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should analyze simple JavaScript file', async () => {
    const mockCode = `
      const arr = [1, 2, 3];
      arr.map(x => x * 2);
      console.log('Hello');
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('test.js');
    
    expect(result).toHaveProperty('file', 'test.js');
    expect(result).toHaveProperty('counts');
    expect(result).toHaveProperty('present');
    expect(result).toHaveProperty('loc');
    expect(result.loc).toBe(5);
    expect(result.counts).toHaveProperty('arrayMethod_map');
    expect(result.present).toHaveProperty('arrayMethod_map', 1);
  });

  test('should handle ES6 features', async () => {
    const mockCode = `
      const { name, age } = person;
      const greet = (name = 'World') => \`Hello, \${name}!\`;
      const obj = { name, age };
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('es6-test.js');
    
    // Let's see what features are actually detected
    console.log('Detected features:', Object.keys(result.present || {}));
    
    expect(result.present).toHaveProperty('destructuringObject');
    expect(result.present).toHaveProperty('arrowFunctions');
    expect(result.present).toHaveProperty('templateLiterals');
    expect(result.present).toHaveProperty('paramDefault');
  });

  test('should handle async/await', async () => {
    const mockCode = `
      async function fetchData() {
        try {
          const response = await fetch('/api/data');
          return await response.json();
        } catch (error) {
          console.error(error);
        }
      }
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('async-test.js');

    expect(result.present).toHaveProperty('asyncFunctions');
    expect(result.present).toHaveProperty('awaitExpressions');
    expect(result.present).toHaveProperty('try');
    expect(result.present).toHaveProperty('catch');
    expect(result.present).toHaveProperty('TryCatch');
    expect(result.present).toHaveProperty('AsyncAwait');
    
  });

  test('should handle React JSX', async () => {
    const mockCode = `
      import React from 'react';
      
      function Component({ title, children }) {
        return (
          <div className="container">
            <h1>{title}</h1>
            {children}
          </div>
        );
      }
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('component.jsx');
    
    expect(result.present).toHaveProperty('jsxElements');
    expect(result.present).toHaveProperty('paramDestructuringObject');
  });

  test('should handle TypeScript features', async () => {
    const mockCode = `
      interface User {
        id: number;
        name: string;
      }
      
      class UserService implements UserService {
        private users: User[] = [];
        
        public addUser(user: User): void {
          this.users.push(user);
        }
      }
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('typescript-test.ts');

      
    // TODO: Missing detectors: TSInterfaceDeclaration
    
    expect(result.present).toHaveProperty('TypeScript.interface');
    expect(result.present).toHaveProperty('Classes');
    expect(result.present).toHaveProperty('TypeScript.implements');
  });

  test('should handle parsing errors gracefully', async () => {
    const mockCode = `
      const invalid = function(( {
        // Invalid syntax
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('invalid.js');

    expect(result).toHaveProperty('error');
    expect(result.error).toContain('Parse error');
  });

  test('should count lines correctly', async () => {
    const mockCode = `line1
line2
line3
// comment
line5`;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('lines-test.js');
    
    expect(result.loc).toBe(5);
    expect(result.comments).toBe(1);
  });

});

// describe('analyzeDirectory', () => {
//   test('should be defined', () => {
//     expect(analyzeDirectory).toBeDefined();
//     expect(typeof analyzeDirectory).toBe('function');
//   });
// });