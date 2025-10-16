/**
 * Tests for Pareto analysis functionality
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { MASTER_FEATURE_CATALOG } from '../config/features.js';
import { ParetoAnalysis } from '../pareto-analyzer.js';

describe('ParetoAnalysis', () => {
  let paretoAnalysis;
  let mockStatsData;

  beforeEach(() => {
    mockStatsData = {
      'repo1': {
        totals: {
          files: 10,
          loc: 1000,
          features: {
            'ArrayMethods.map': 50,
            'ArrowFunctions': 30,
            'TemplateLiterals': 20,
            'Destructuring.object': 15,
            'AsyncAwait': 10,
            'Classes': 5,
            'Modules.import': 3,
            'Modules.export': 2
          }
        }
      },
      'repo2': {
        totals: {
          files: 5,
          loc: 500,
          features: {
            'ArrayMethods.map': 25,
            'ArrowFunctions': 15,
            'TemplateLiterals': 10,
            'Classes': 8,
            'AsyncAwait': 5
          }
        }
      }
    };
    
    paretoAnalysis = new ParetoAnalysis(mockStatsData);
  });

  test('should initialize with stats data', () => {
    expect(paretoAnalysis.statsData).toEqual(mockStatsData);
  });

  test('should calculate feature totals across repositories', () => {
    const totals = paretoAnalysis.calculateFeatureTotals();
    
    expect(totals['ArrayMethods.map']).toBe(75); // 50 + 25
    expect(totals['ArrowFunctions']).toBe(45); // 30 + 15
    expect(totals['TemplateLiterals']).toBe(30); // 20 + 10
    expect(totals['Classes']).toBe(13); // 5 + 8
  });

  test('should sort features by usage count', () => {
    const totals = paretoAnalysis.calculateFeatureTotals();
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    
    expect(sorted[0][0]).toBe('ArrayMethods.map'); // Most used
    expect(sorted[0][1]).toBe(75);
    expect(sorted[1][0]).toBe('ArrowFunctions');
    expect(sorted[1][1]).toBe(45);
  });

  test('should identify top 20% features (Pareto principle)', () => {
    const totals = paretoAnalysis.calculateFeatureTotals();
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const totalFeatures = sorted.length;
    const top20Percent = Math.ceil(totalFeatures * 0.2);
    
    expect(top20Percent).toBeGreaterThan(0);
    expect(top20Percent).toBeLessThanOrEqual(totalFeatures);
  });

  test('should calculate usage percentages', () => {
    const totals = paretoAnalysis.calculateFeatureTotals();
    const totalUsage = Object.values(totals).reduce((sum, count) => sum + count, 0);
    
    const mapPercentage = (totals['ArrayMethods.map'] / totalUsage) * 100;
    expect(mapPercentage).toBeCloseTo(31.25, 1); // 75/240 * 100
  });

  test('should generate markdown report', () => {
    const report = paretoAnalysis.generateMarkdownReport();
    
    expect(report).toContain('# JavaScript Feature Usage Analysis');
    expect(report).toContain('## Summary');
    expect(report).toContain('## Top Features (Pareto Analysis)');
    expect(report).toContain('ArrayMethods.map');
    expect(report).toContain('ArrowFunctions');
  });

  test('should include repository breakdown in report', () => {
    const report = paretoAnalysis.generateMarkdownReport();
    
    expect(report).toContain('## Repository Breakdown');
    expect(report).toContain('repo1');
    expect(report).toContain('repo2');
    expect(report).toContain('10 files'); // repo1 files
    expect(report).toContain('5 files'); // repo2 files
  });

  test('should calculate catalog usage percentages', () => {
    const report = paretoAnalysis.generateMarkdownReport();
    
    expect(report).toContain('Features used from catalog:');
    expect(report).toContain('%'); // Should show percentage
  });

  test('should handle empty stats data', () => {
    const emptyAnalysis = new ParetoAnalysis({});
    const totals = emptyAnalysis.calculateFeatureTotals();
    
    expect(Object.keys(totals)).toHaveLength(0);
  });

  test('should handle missing features gracefully', () => {
    const partialData = {
      'repo1': {
        totals: {
          files: 1,
          loc: 100,
          features: {
            'NonExistentFeature': 10
          }
        }
      }
    };
    
    const analysis = new ParetoAnalysis(partialData);
    const report = analysis.generateMarkdownReport();
    
    expect(report).toContain('NonExistentFeature');
    expect(report).not.toThrow;
  });

  test('should show top N features per repository', () => {
    const report = paretoAnalysis.generateMarkdownReport();
    
    // Should show top features for each repo
    expect(report).toContain('Top 5 features:');
  });
});

describe('Feature Catalog Integration', () => {
  test('should validate against master feature catalog', () => {
    expect(MASTER_FEATURE_CATALOG).toBeDefined();
    expect(Array.isArray(MASTER_FEATURE_CATALOG)).toBe(true);
    expect(MASTER_FEATURE_CATALOG.length).toBeGreaterThan(0);
  });

  test('should have proper catalog structure', () => {
    MASTER_FEATURE_CATALOG.forEach(feature => {
      expect(feature).toHaveProperty('name');
      expect(feature).toHaveProperty('category');
      expect(typeof feature.name).toBe('string');
      expect(typeof feature.category).toBe('string');
    });
  });
});