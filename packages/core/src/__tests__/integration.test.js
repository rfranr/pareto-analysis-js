/**
 * Integration tests for the complete analysis pipeline
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import fs from 'fs-extra';
import { ChartGenerator } from '../chart-generator.js';
import { ParetoAnalysis } from '../pareto-analyzer.js';

// Mock file operations for integration tests
vi.mock('fs-extra');
vi.mock('../utils/file-utils.js');

describe('Analysis Pipeline Integration', () => {
  const mockRepoStructure = {
    'modern-app': {
      totals: {
        files: 25,
        loc: 2500,
        features: {
          'ArrayMethods.map': 45,
          'ArrowFunctions': 40,
          'TemplateLiterals': 35,
          'Destructuring.object': 30,
          'AsyncAwait': 25,
          'Classes': 20,
          'JSX': 18,
          'Modules.import': 15,
          'Modules.export': 12,
          'Destructuring.parameter': 10
        }
      }
    },
    'legacy-app': {
      totals: {
        files: 15,
        loc: 1800,
        features: {
          'FunctionDeclaration': 35,
          'ArrayMethods.forEach': 20,
          'Objects': 18,
          'Conditionals': 15,
          'Loops.for': 12,
          'ArrayMethods.map': 10,
          'Variables.var': 8,
          'Prototypes': 5
        }
      }
    }
  };

  test('complete pipeline should work end-to-end', async () => {
    // Setup mocks
    fs.ensureDir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();
    
    // 1. Analyze repositories (simulated)
    const statsData = mockRepoStructure;
    
    // 2. Generate Pareto analysis
    const paretoAnalysis = new ParetoAnalysis(statsData);
    const report = paretoAnalysis.generateMarkdownReport();
    
    // 3. Generate charts
    const chartGenerator = new ChartGenerator(statsData);
    
    // Verify the pipeline produces expected outputs
    expect(report).toContain('# JavaScript Feature Usage Analysis');
    expect(report).toContain('modern-app');
    expect(report).toContain('legacy-app');
    expect(report).toContain('ArrayMethods.map');
    
    // Test chart generation doesn't throw
    await expect(chartGenerator.generateParetoOverlay('modern-app', 'charts'))
      .resolves.toBeDefined();
    
    await expect(chartGenerator.generateComparison(['modern-app', 'legacy-app'], 'charts'))
      .resolves.toBeDefined();
    
    await expect(chartGenerator.createAggregateChart('charts'))
      .resolves.toBeDefined();
  });

  test('should handle mixed modern and legacy code patterns', () => {
    const paretoAnalysis = new ParetoAnalysis(mockRepoStructure);
    const featureTotals = paretoAnalysis.calculateFeatureTotals();
    
    // Should aggregate features across repositories
    expect(featureTotals['ArrayMethods.map']).toBe(55); // 45 + 10
    expect(featureTotals['ArrowFunctions']).toBe(40); // Only in modern-app
    expect(featureTotals['FunctionDeclaration']).toBe(35); // Only in legacy-app
  });

  test('should identify top features following Pareto principle', () => {
    const paretoAnalysis = new ParetoAnalysis(mockRepoStructure);
    const featureTotals = paretoAnalysis.calculateFeatureTotals();
    const sorted = Object.entries(featureTotals).sort((a, b) => b[1] - a[1]);
    
    // Top features should be most used
    expect(sorted[0][0]).toBe('ArrayMethods.map');
    expect(sorted[1][0]).toBe('ArrowFunctions');
    expect(sorted[2][0]).toBe('TemplateLiterals');
    
    // Calculate 80/20 split
    const totalUsage = Object.values(featureTotals).reduce((sum, count) => sum + count, 0);
    const eightyPercentUsage = totalUsage * 0.8;
    
    let cumulativeUsage = 0;
    let featuresFor80Percent = 0;
    
    for (const [, count] of sorted) {
      cumulativeUsage += count;
      featuresFor80Percent++;
      if (cumulativeUsage >= eightyPercentUsage) break;
    }
    
    // Should demonstrate Pareto principle (roughly 20% of features = 80% of usage)
    const twentyPercentOfFeatures = Math.ceil(sorted.length * 0.2);
    expect(featuresFor80Percent).toBeLessThanOrEqual(twentyPercentOfFeatures + 2); // Allow some tolerance
  });

  test('should generate comprehensive report sections', () => {
    const paretoAnalysis = new ParetoAnalysis(mockRepoStructure);
    const report = paretoAnalysis.generateMarkdownReport();
    
    // Should include all expected sections
    expect(report).toContain('## Summary');
    expect(report).toContain('## Top Features (Pareto Analysis)');
    expect(report).toContain('## Repository Breakdown');
    expect(report).toContain('Total repositories analyzed:');
    expect(report).toContain('Features used from catalog:');
    
    // Should show statistics
    expect(report).toMatch(/\d+\.\d+%/); // Percentage format
    expect(report).toMatch(/\d+ files/); // File counts
    expect(report).toMatch(/\d+ LOC/); // Line counts
  });

  test('should handle repositories with different characteristics', () => {
    const diverseRepos = {
      'react-app': {
        totals: {
          files: 30,
          loc: 3000,
          features: {
            'JSX': 50,
            'React.useState': 25,
            'React.useEffect': 20,
            'ArrowFunctions': 40,
            'Destructuring.parameter': 35
          }
        }
      },
      'node-api': {
        totals: {
          files: 20,
          loc: 2000,
          features: {
            'AsyncAwait': 30,
            'Modules.require': 25,
            'Modules.export': 25,
            'TryCatch': 20,
            'ArrayMethods.map': 15
          }
        }
      },
      'typescript-lib': {
        totals: {
          files: 15,
          loc: 1500,
          features: {
            'TypeScript.interface': 20,
            'TypeScript.type': 15,
            'Classes': 12,
            'TypeScript.generic': 10,
            'ArrowFunctions': 25
          }
        }
      }
    };
    
    const paretoAnalysis = new ParetoAnalysis(diverseRepos);
    const report = paretoAnalysis.generateMarkdownReport();
    
    // Should identify different patterns per repository
    expect(report).toContain('react-app');
    expect(report).toContain('node-api');
    expect(report).toContain('typescript-lib');
    
    // Should show diversity in feature usage
    expect(report).toContain('JSX');
    expect(report).toContain('AsyncAwait');
    expect(report).toContain('TypeScript');
  });

  test('should calculate accurate catalog coverage', () => {
    const paretoAnalysis = new ParetoAnalysis(mockRepoStructure);
    const featureTotals = paretoAnalysis.calculateFeatureTotals();
    const usedFeatures = Object.keys(featureTotals);
    
    // Should track which features from the catalog are actually used
    expect(usedFeatures.length).toBeGreaterThan(0);
    
    // Should calculate percentage of catalog utilization
    const report = paretoAnalysis.generateMarkdownReport();
    expect(report).toMatch(/Features used from catalog: \d+\/\d+ \(\d+\.\d+%\)/);
  });

  test('should handle empty or minimal datasets', () => {
    const minimalData = {
      'empty-repo': {
        totals: {
          files: 0,
          loc: 0,
          features: {}
        }
      },
      'tiny-repo': {
        totals: {
          files: 1,
          loc: 10,
          features: {
            'Variables.const': 1
          }
        }
      }
    };
    
    const paretoAnalysis = new ParetoAnalysis(minimalData);
    const report = paretoAnalysis.generateMarkdownReport();
    
    // Should handle gracefully without errors
    expect(report).toContain('# JavaScript Feature Usage Analysis');
    expect(report).toContain('tiny-repo');
    
    const chartGenerator = new ChartGenerator(minimalData);
    expect(() => chartGenerator.prepareChartData(minimalData['tiny-repo']))
      .not.toThrow();
  });
});

describe('Performance and Scalability', () => {
  test('should handle large feature sets efficiently', () => {
    // Create a large dataset
    const largeFeatureSet = {};
    for (let i = 0; i < 100; i++) {
      largeFeatureSet[`Feature${i}`] = Math.floor(Math.random() * 100) + 1;
    }
    
    const largeRepoData = {
      'large-repo': {
        totals: {
          files: 1000,
          loc: 100000,
          features: largeFeatureSet
        }
      }
    };
    
    const startTime = Date.now();
    const paretoAnalysis = new ParetoAnalysis(largeRepoData);
    const report = paretoAnalysis.generateMarkdownReport();
    const endTime = Date.now();
    
    // Should complete in reasonable time (less than 1 second for this size)
    expect(endTime - startTime).toBeLessThan(1000);
    expect(report).toContain('large-repo');
  });

  test('should handle many repositories efficiently', () => {
    const manyRepos = {};
    for (let i = 0; i < 50; i++) {
      manyRepos[`repo${i}`] = {
        totals: {
          files: 10,
          loc: 1000,
          features: {
            'ArrayMethods.map': Math.floor(Math.random() * 20) + 1,
            'ArrowFunctions': Math.floor(Math.random() * 15) + 1,
            'Classes': Math.floor(Math.random() * 10) + 1
          }
        }
      };
    }
    
    const paretoAnalysis = new ParetoAnalysis(manyRepos);
    const featureTotals = paretoAnalysis.calculateFeatureTotals();
    
    // Should aggregate correctly across all repositories
    expect(featureTotals['ArrayMethods.map']).toBeGreaterThan(50); // Sum of all repos
    expect(Object.keys(manyRepos)).toHaveLength(50);
  });
});