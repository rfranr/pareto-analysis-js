/**
 * Basic test to verify Vitest is working correctly
 */

import { describe, it, expect } from 'vitest';

function helloWorld() {
  return "Hello, World!";
}

describe('Hello World', () => {
  it('should return "Hello, World!"', () => {
    expect(helloWorld()).toBe("Hello, World!");
  });

  it('should be a function', () => {
    expect(typeof helloWorld).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof helloWorld()).toBe('string');
  });
});
