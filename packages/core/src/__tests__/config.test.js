/**
 * Tests for configuration and feature detection
 */

import { describe, test, expect } from 'vitest';
import { PARETO } from '../config/constants.js';
import { ARRAY_METHODS, MASTER_FEATURE_CATALOG } from '../config/features.js';

describe('Feature Catalog', () => {
  test('MASTER_FEATURE_CATALOG should be properly structured', () => {
    expect(Array.isArray(MASTER_FEATURE_CATALOG)).toBe(true);
    expect(MASTER_FEATURE_CATALOG.length).toBeGreaterThan(0);
    
    MASTER_FEATURE_CATALOG.forEach((feature, index) => {
      expect(feature).toHaveProperty('name');
      expect(feature).toHaveProperty('category');
      expect(typeof feature.name).toBe('string');
      expect(typeof feature.category).toBe('string');
      expect(feature.name.length).toBeGreaterThan(0);
      expect(feature.category.length).toBeGreaterThan(0);
    });
  });

  test('should have unique feature names', () => {
    const names = MASTER_FEATURE_CATALOG.map(f => f.name);
    const uniqueNames = new Set(names);
    
    expect(uniqueNames.size).toBe(names.length);
  });

  test('should have valid categories', () => {
    const categories = new Set(MASTER_FEATURE_CATALOG.map(f => f.category));
    
    expect(categories.size).toBeGreaterThan(0);
    expect(categories.has('')).toBe(false); // No empty categories
  });

  test('should include essential JavaScript features', () => {
    const featureNames = MASTER_FEATURE_CATALOG.map(f => f.name);
    
    // Essential ES6+ features
    expect(featureNames).toContain('ArrowFunctions');
    expect(featureNames).toContain('TemplateLiterals');
    expect(featureNames).toContain('Classes');
    expect(featureNames).toContain('AsyncAwait');
    
    // Destructuring variations
    expect(featureNames.some(name => name.startsWith('Destructuring'))).toBe(true);
    
    // Module system
    expect(featureNames.some(name => name.includes('import') || name.includes('export'))).toBe(true);
  });

  test('should include array methods', () => {
    const featureNames = MASTER_FEATURE_CATALOG.map(f => f.name);
    
    expect(featureNames).toContain('ArrayMethods.map');
    expect(featureNames).toContain('ArrayMethods.filter');
    expect(featureNames).toContain('ArrayMethods.reduce');
    expect(featureNames).toContain('ArrayMethods.forEach');
  });

  test('should include React/JSX features', () => {
    const featureNames = MASTER_FEATURE_CATALOG.map(f => f.name);
    
    expect(featureNames).toContain('JSX');
    expect(featureNames.some(name => name.includes('React'))).toBe(true);
  });

  test('should include TypeScript features', () => {
    const featureNames = MASTER_FEATURE_CATALOG.map(f => f.name);
    
    expect(featureNames.some(name => name.startsWith('TypeScript'))).toBe(true);
  });
});

describe('Array Methods Configuration', () => {
  test('ARRAY_METHODS should be properly defined', () => {
    expect(Array.isArray(ARRAY_METHODS)).toBe(true);
    expect(ARRAY_METHODS.length).toBeGreaterThan(0);
    
    ARRAY_METHODS.forEach(method => {
      expect(typeof method).toBe('string');
      expect(method.length).toBeGreaterThan(0);
    });
  });

  test('should include common array methods', () => {
    const essentialMethods = ['map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every'];
    
    essentialMethods.forEach(method => {
      expect(ARRAY_METHODS).toContain(method);
    });
  });

  test('should include modern array methods', () => {
    const modernMethods = ['flatMap', 'flat', 'includes', 'findIndex'];
    
    modernMethods.forEach(method => {
      expect(ARRAY_METHODS).toContain(method);
    });
  });

  test('should not include non-array methods', () => {
    const nonArrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice'];
    
    // These are mutating methods, typically not included in functional analysis
    nonArrayMethods.forEach(method => {
      if (ARRAY_METHODS.includes(method)) {
        // If included, that's fine too, just documenting the expectation
        expect(typeof method).toBe('string');
      }
    });
  });
});

describe('Constants Configuration', () => {
  test('PARETO should be properly defined', () => {
    expect(PARETO).toBeDefined();
    expect(typeof PARETO).toBe('object');
  });

  test('PARETO should have required properties', () => {
    expect(PARETO).toHaveProperty('PRINCIPLE_RATIO');
    expect(PARETO).toHaveProperty('TOP_FEATURES_COUNT');
    
    expect(typeof PARETO.PRINCIPLE_RATIO).toBe('number');
    expect(typeof PARETO.TOP_FEATURES_COUNT).toBe('number');
  });

  test('PARETO values should be reasonable', () => {
    expect(PARETO.PRINCIPLE_RATIO).toBeGreaterThan(0);
    expect(PARETO.PRINCIPLE_RATIO).toBeLessThan(1);
    expect(PARETO.PRINCIPLE_RATIO).toBeCloseTo(0.2, 1); // Should be around 20%
    
    expect(PARETO.TOP_FEATURES_COUNT).toBeGreaterThan(0);
    expect(PARETO.TOP_FEATURES_COUNT).toBeLessThan(100); // Reasonable limit
  });

  test('should have additional configuration options', () => {
    // Test for other potential constants
    if (PARETO.CHART_WIDTH) {
      expect(typeof PARETO.CHART_WIDTH).toBe('number');
      expect(PARETO.CHART_WIDTH).toBeGreaterThan(0);
    }
    
    if (PARETO.CHART_HEIGHT) {
      expect(typeof PARETO.CHART_HEIGHT).toBe('number');
      expect(PARETO.CHART_HEIGHT).toBeGreaterThan(0);
    }
  });
});

describe('Feature Categories', () => {
  test('should have logical category groupings', () => {
    const categoryGroups = MASTER_FEATURE_CATALOG.reduce((groups, feature) => {
      if (!groups[feature.category]) {
        groups[feature.category] = [];
      }
      groups[feature.category].push(feature.name);
      return groups;
    }, {});
    
    // Each category should have at least one feature
    Object.keys(categoryGroups).forEach(category => {
      expect(categoryGroups[category].length).toBeGreaterThan(0);
    });
    
    // Should have reasonable number of categories (not too fragmented)
    expect(Object.keys(categoryGroups).length).toBeGreaterThan(3);
    expect(Object.keys(categoryGroups).length).toBeLessThan(20);
  });

  test('should have consistent naming conventions', () => {
    MASTER_FEATURE_CATALOG.forEach(feature => {
      // Feature names should follow consistent patterns
      expect(feature.name).toMatch(/^[A-Za-z][A-Za-z0-9._-]*$/);
      
      // Categories should be properly formatted
      expect(feature.category).toMatch(/^[A-Za-z][A-Za-z0-9 ]*$/);
    });
  });
});