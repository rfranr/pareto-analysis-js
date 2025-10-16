/**
 * Tests for unknown features tracking in analyzer
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// Mock the features module BEFORE importing anything else
vi.mock('../config/features.js', () => ({
  buildFeatureCatalog: vi.fn(() => ['knownFeature1', 'knownFeature2']),
  MASTER_FEATURE_CATALOG: ['knownFeature1', 'knownFeature2'],
  ARRAY_METHODS: ['map'],
  BINARY_OPERATORS: ['=='],
  ASSIGNMENT_OPERATORS: ['='],
  UPDATE_OPERATORS: ['++'],
  REGEXP_FLAGS: ['g'],
  CORE_FEATURES: ['functions']
}));

vi.mock('../utils/file-utils.js');

// Import after mocking
import { analyzeFile } from '../analyzer.js';
import { readFileContent } from '../utils/file-utils.js';

describe('Unknown Features Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should track unknown features when feature catalog is limited', async () => {
    const mockCode = `
      const result = someUnknownFeature?.optionalChaining?.();
      const jsx = <UnknownJSXElement prop="value" />;
      const rareExpressions = [1, 2, 3]?.[0];
      const asyncFunction = async () => await fetch('/api');
      const destructuring = { a, b } = obj;
    `;
    
    readFileContent.mockResolvedValue(mockCode);
    
    const result = await analyzeFile('unknown-test.js');

    console.log('Analysis result:', result);
    console.log('Unknown features:', result.unknown);

    expect(result).toHaveProperty('unknown');
    expect(Array.isArray(result.unknown)).toBe(true);
    expect(result.unknown.length).toBeGreaterThan(0);
    
    // Should have some unknown features since our mock catalog is very limited
    expect(result.unknown).toContain('optionalChaining');
  });
});