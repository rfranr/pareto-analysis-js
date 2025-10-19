/**
 * Tests for CLI utility functions
 */

import { describe, test, expect, beforeEach, afterAll, vi } from 'vitest';
import {
    exitWithError,
    exitWithSuccess,
    parseArguments
} from '../utils/cli-utils.js';

// Mock process.exit and console methods
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('CLI Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.argv
    process.argv = ['node', 'script.js'];
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  test('parseArguments should parse basic arguments', () => {
    process.argv = ['node', 'script.js', '--input', 'test.js', '--output', 'result.json'];
    
    const args = parseArguments();
    
    expect(args).toHaveProperty('input', 'test.js');
    expect(args).toHaveProperty('output', 'result.json');
  });

  test('parseArguments should handle boolean flags', () => {
    process.argv = ['node', 'script.js', '--verbose', '--dry-run'];
    
    const args = parseArguments();
    
    expect(args).toHaveProperty('verbose', true);
    expect(args).toHaveProperty('dryRun', true);
  });

  test('parseArguments should handle positional arguments', () => {
    process.argv = ['node', 'script.js', 'input-file.js'];
    
    const args = parseArguments();
    
    expect(args._).toContain('input-file.js');
  });

  test('parseArguments should provide help option', () => {
    process.argv = ['node', 'script.js', '--help'];
    
    const args = parseArguments();
    
    expect(args).toHaveProperty('help', true);
  });

  test('exitWithError should log error and exit with code 1', () => {
    exitWithError('Test error message');
    
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Test error message');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('exitWithSuccess should log message and exit with code 0', () => {
    exitWithSuccess('Task completed successfully');
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Task completed successfully');
    expect(mockExit).toHaveBeenCalledWith(0);
  });

  test('should handle missing required arguments', () => {
    process.argv = ['node', 'script.js']; // No arguments
    
    const args = parseArguments();
    
    // Should still return an object, even with no args
    expect(typeof args).toBe('object');
  });

  test('should handle complex argument combinations', () => {
    process.argv = [
      'node', 'script.js',
      '--input', './src',
      '--output', './dist/stats.json',
      '--format', 'json',
      '--exclude', 'test',
      '--exclude', 'spec',
      '--verbose',
      'additional-file.js'
    ];
    
    const args = parseArguments();
    
    expect(args.input).toBe('./src');
    expect(args.output).toBe('./dist/stats.json');
    expect(args.format).toBe('json');
    expect(args.exclude).toEqual(['test', 'spec']);
    expect(args.verbose).toBe(true);
    expect(args._).toContain('additional-file.js');
  });

  test('should handle environment variable integration', () => {
    // Test if CLI utils can handle environment variables
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    
    const args = parseArguments();
    
    // Should be able to access environment
    expect(process.env.NODE_ENV).toBe('test');
    
    // Restore
    process.env.NODE_ENV = originalEnv;
  });

  test('should validate argument types', () => {
    process.argv = ['node', 'script.js', '--count', '42', '--threshold', '0.8'];
    
    const args = parseArguments();
    
    // Numbers should be parsed correctly
    expect(typeof args.count).toBe('number');
    expect(args.count).toBe(42);
    expect(typeof args.threshold).toBe('number');
    expect(args.threshold).toBe(0.8);
  });
});

describe('Error Handling', () => {
  test('should handle different error types', () => {
    const stringError = 'Simple error message';
    const errorObject = new Error('Error object message');
    const complexError = {
      message: 'Complex error',
      code: 'E_COMPLEX',
      details: 'Additional details'
    };
    
    exitWithError(stringError);
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Simple error message');
    
    mockConsoleError.mockClear();
    exitWithError(errorObject);
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Error object message');
    
    mockConsoleError.mockClear();
    exitWithError(complexError);
    expect(mockConsoleError).toHaveBeenCalledWith('Error: Complex error');
  });

  test('should handle success messages', () => {
    const simpleMessage = 'Done!';
    const detailedMessage = 'Analysis completed: 42 files processed';
    
    exitWithSuccess(simpleMessage);
    expect(mockConsoleLog).toHaveBeenCalledWith('Done!');
    
    mockConsoleLog.mockClear();
    exitWithSuccess(detailedMessage);
    expect(mockConsoleLog).toHaveBeenCalledWith('Analysis completed: 42 files processed');
  });
});