/**
 * Tests for Pareto analysis functionality
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { 
  ParetoAnalysis, 
  MultiRepositoryAnalysis, 
  generateMarkdownReport 
} from '../pareto-analyzer.js';

describe('ParetoAnalysis', () => {
  let sampleSeries;

  beforeEach(() => {
    sampleSeries = {
      'feature1': 100,
      'feature2': 50,
      'feature3': 30,
      'feature4': 10,
      'feature5': 5,
      'feature6': 3,
      'feature7': 1,
      'feature8': 1
    };
  });

  test('should create sorted entries from series', () => {
    const pareto = new ParetoAnalysis(sampleSeries);
    
    expect(pareto.entries).toHaveLength(8);
    expect(pareto.entries[0]).toEqual(['feature1', 100]);
    expect(pareto.entries[1]).toEqual(['feature2', 50]);
    expect(pareto.entries[7]).toEqual(['feature8', 1]); // sorted by value then name
  });

  test('should calculate sum correctly', () => {
    const pareto = new ParetoAnalysis(sampleSeries);
    
    expect(pareto.sum).toBe(200); // 100+50+30+10+5+3+1+1
  });

  test('should create rows with cumulative percentages', () => {
    const pareto = new ParetoAnalysis(sampleSeries);
    
    expect(pareto.rows[0]).toEqual({
      feature: 'feature1',
      count: 100,
      percentage: 0.5,
      cumulativeCount: 100,
      cumulativePercentage: 0.5
    });
    
    expect(pareto.rows[1]).toEqual({
      feature: 'feature2',
      count: 50,
      percentage: 0.25,
      cumulativeCount: 150,
      cumulativePercentage: 0.75
    });
  });

  test('should handle empty series', () => {
    const pareto = new ParetoAnalysis({});
    
    expect(pareto.entries).toHaveLength(0);
    expect(pareto.sum).toBe(1); // Default to 1 to avoid division by zero
    expect(pareto.rows).toHaveLength(0);
  });

  test('should filter out zero and negative values', () => {
    const seriesWithZeros = {
      'feature1': 100,
      'feature2': 0,
      'feature3': -5,
      'feature4': 50
    };
    
    const pareto = new ParetoAnalysis(seriesWithZeros);
    
    expect(pareto.entries).toHaveLength(2);
    expect(pareto.entries.map(([name]) => name)).toEqual(['feature1', 'feature4']);
  });

  test('should get features at specific cuts', () => {
    const pareto = new ParetoAnalysis(sampleSeries, [0.5, 0.8]);
    
    const at50 = pareto.getFeaturesAtCut(0.5);
    expect(at50).toHaveLength(1);
    expect(at50[0].feature).toBe('feature1');
    
    const at80 = pareto.getFeaturesAtCut(0.8);
    expect(at80).toHaveLength(2);
    expect(at80.map(f => f.feature)).toEqual(['feature1', 'feature2']);
  });

  test('should get top N features', () => {
    const pareto = new ParetoAnalysis(sampleSeries);
    
    const top3 = pareto.getTopFeatures(3);
    expect(top3).toHaveLength(3);
    expect(top3.map(f => f.feature)).toEqual(['feature1', 'feature2', 'feature3']);
  });

  test('should handle custom cuts', () => {
    const customCuts = [0.6, 0.9, 0.99];
    const pareto = new ParetoAnalysis(sampleSeries, customCuts);
    
    expect(pareto.cuts).toEqual(customCuts);
    expect(pareto.cutMap.has(0.6)).toBe(true);
    expect(pareto.cutMap.has(0.9)).toBe(true);
    expect(pareto.cutMap.has(0.99)).toBe(true);
  });
});

describe('MultiRepositoryAnalysis', () => {
  let sampleReports;

  beforeEach(() => {
    sampleReports = [
      {
        repo: 'repo1',
        rootDir: '/path/to/repo1',
        totals: {
          'functions': 100,
          'classes': 50,
          'imports': 30
        },
        presence: {
          'functions': 1,
          'classes': 1,
          'imports': 1
        },
        perKLOC: {
          'functions': 10.5,
          'classes': 5.2,
          'imports': 3.1
        },
        featuresCatalog: ['functions', 'classes', 'imports', 'exports']
      },
      {
        repo: 'repo2',
        rootDir: '/path/to/repo2',
        totals: {
          'functions': 200,
          'classes': 30,
          'exports': 40
        },
        presence: {
          'functions': 1,
          'classes': 1,
          'exports': 1
        },
        perKLOC: {
          'functions': 15.0,
          'classes': 2.5,
          'exports': 4.0
        },
        featuresCatalog: ['functions', 'classes', 'imports', 'exports']
      }
    ];
  });

  test('should create analyzer with reports', () => {
    const analyzer = new MultiRepositoryAnalysis(sampleReports);
    
    expect(analyzer.reports).toBe(sampleReports);
    expect(analyzer.metrics).toEqual(['totals', 'presence', 'perKLOC']);
  });

  test('should analyze totals metric', () => {
    const analyzer = new MultiRepositoryAnalysis(sampleReports);
    const result = analyzer.analyzeMetric('totals');
    
    expect(result.metric).toBe('totals');
    expect(result.repositories).toHaveLength(2);
    
    // Check aggregated series
    expect(result.aggregatedSeries.functions).toBe(300); // 100 + 200
    expect(result.aggregatedSeries.classes).toBe(80);    // 50 + 30
    expect(result.aggregatedSeries.imports).toBe(30);    // 30 + 0
    expect(result.aggregatedSeries.exports).toBe(40);    // 0 + 40
    
    // Check pareto analysis exists
    expect(result.pareto).toBeInstanceOf(ParetoAnalysis);
  });

  test('should analyze presence metric', () => {
    const analyzer = new MultiRepositoryAnalysis(sampleReports);
    const result = analyzer.analyzeMetric('presence');
    
    expect(result.metric).toBe('presence');
    expect(result.aggregatedSeries.functions).toBe(2); // 1 + 1
    expect(result.aggregatedSeries.classes).toBe(2);   // 1 + 1
    expect(result.aggregatedSeries.imports).toBe(1);   // 1 + 0
    expect(result.aggregatedSeries.exports).toBe(1);   // 0 + 1
  });

  test('should handle missing metric with fallback', () => {
    const analyzer = new MultiRepositoryAnalysis(sampleReports);
    const result = analyzer.analyzeMetric('nonexistent');
    
    expect(result.metric).toBe('nonexistent');
    // Should fallback to totals
    expect(result.aggregatedSeries.functions).toBe(300);
  });

  test('should extract repository stats correctly', () => {
    const analyzer = new MultiRepositoryAnalysis(sampleReports);
    const result = analyzer.analyzeMetric('totals');
    
    const repo1Stats = result.repositories[0];
    expect(repo1Stats.repository).toBe('repo1');
    expect(repo1Stats.featuresTotal).toBe(4); // catalog size
    expect(repo1Stats.featuresObserved).toBe(3); // functions, classes, imports have values > 0
    
    const repo2Stats = result.repositories[1];
    expect(repo2Stats.repository).toBe('repo2');
    expect(repo2Stats.featuresObserved).toBe(3); // functions, classes, exports have values > 0
  });

  test('should handle reports without featuresCatalog', () => {
    const reportsWithoutCatalog = sampleReports.map(report => {
      const { featuresCatalog, ...rest } = report;
      return rest;
    });
    
    const analyzer = new MultiRepositoryAnalysis(reportsWithoutCatalog);
    const result = analyzer.analyzeMetric('totals');
    
    // Should still work, using series keys as catalog
    expect(result.repositories[0].featuresTotal).toBe(3); // functions, classes, imports
    expect(result.repositories[1].featuresTotal).toBe(3); // functions, classes, exports
  });
});

describe('generateMarkdownReport', () => {
  let sampleAnalysisResults;

  beforeEach(() => {
    const sampleSeries = {
      'functions': 300,
      'classes': 80,
      'imports': 30,
      'exports': 40
    };
    
    const pareto = new ParetoAnalysis(sampleSeries, [0.8, 0.9]);
    
    sampleAnalysisResults = [
      {
        metric: 'totals',
        pareto,
        repositories: [
          {
            repository: 'repo1',
            featuresTotal: 4,
            featuresObserved: 3,
            series: { 'functions': 100, 'classes': 50, 'imports': 30 }
          },
          {
            repository: 'repo2',
            featuresTotal: 4,
            featuresObserved: 3,
            series: { 'functions': 200, 'classes': 30, 'exports': 40 }
          }
        ],
        aggregatedSeries: sampleSeries
      }
    ];
  });

  test('should generate markdown report with basic structure', () => {
    const markdown = generateMarkdownReport(sampleAnalysisResults);
    
    expect(markdown).toContain('# Pareto Analysis Report');
    expect(markdown).toContain('## Total Occurrences');
    expect(markdown).toContain('### Top 5 Features');
    expect(markdown).toContain('### Pareto Analysis');
    expect(markdown).toContain('### Repository Breakdown');
  });

  test('should include summary statistics', () => {
    const markdown = generateMarkdownReport(sampleAnalysisResults);
    
    expect(markdown).toContain('Repositories analyzed: 2');
    expect(markdown).toContain('Features with data: 4');
    expect(markdown).toContain('Total occurrences: 450'); // 300+80+30+40
  });

  test('should format top features table correctly', () => {
    const markdown = generateMarkdownReport(sampleAnalysisResults);
    
    expect(markdown).toContain('| Rank | Feature | Count | % | Cumulative % |');
    expect(markdown).toContain('| 1 | functions | 300 |');
    expect(markdown).toContain('| 2 | classes | 80 |');
  });

  test('should include Pareto cuts analysis', () => {
    const markdown = generateMarkdownReport(sampleAnalysisResults);
    
    expect(markdown).toContain('**80% of usage** comes from');
    expect(markdown).toContain('**90% of usage** comes from');
  });

  test('should respect custom options', () => {
    const options = {
      cuts: [0.5, 0.7],
      topCount: 3,
      includeRepositoryBreakdown: false
    };
    
    const markdown = generateMarkdownReport(sampleAnalysisResults, options);
    
    expect(markdown).toContain('**50% of usage** comes from');
    expect(markdown).toContain('**70% of usage** comes from');
    expect(markdown).toContain('### Top 3 Features');
    expect(markdown).not.toContain('### Repository Breakdown');
  });

  test('should handle empty analysis results', () => {
    const markdown = generateMarkdownReport([]);
    
    expect(markdown).toContain('# Pareto Analysis Report');
    expect(markdown).toContain('Generated:');
    // Should not crash and produce valid markdown
  });

  test('should include repository breakdown when enabled', () => {
    const markdown = generateMarkdownReport(sampleAnalysisResults, { 
      includeRepositoryBreakdown: true 
    });
    
    expect(markdown).toContain('#### repo1');
    expect(markdown).toContain('#### repo2');
    expect(markdown).toContain('**Features Observed:** 3');
    expect(markdown).toContain('**Top');
  });

  test('should format metric names correctly', () => {
    const multiMetricResults = [
      { ...sampleAnalysisResults[0], metric: 'totals' },
      { ...sampleAnalysisResults[0], metric: 'presence' },
      { ...sampleAnalysisResults[0], metric: 'perKLOC' }
    ];
    
    const markdown = generateMarkdownReport(multiMetricResults);
    
    expect(markdown).toContain('## Total Occurrences');
    expect(markdown).toContain('## File Presence');
    expect(markdown).toContain('## Per 1000 Lines of Code');
  });
});

describe('Integration tests', () => {
  test('should handle complete workflow', () => {
    const reports = [
      {
        repo: 'test-repo',
        totals: { 'functions': 100, 'classes': 50 },
        presence: { 'functions': 1, 'classes': 1 },
        featuresCatalog: ['functions', 'classes', 'imports']
      }
    ];
    
    const analyzer = new MultiRepositoryAnalysis(reports);
    const results = ['totals', 'presence'].map(metric => analyzer.analyzeMetric(metric));
    const markdown = generateMarkdownReport(results);
    
    expect(markdown).toContain('# Pareto Analysis Report');
    expect(markdown).toContain('## Total Occurrences');
    expect(markdown).toContain('## File Presence');
    expect(results).toHaveLength(2);
  });

  test('should handle edge case with single feature', () => {
    const reports = [
      {
        repo: 'minimal-repo',
        totals: { 'functions': 42 },
        presence: { 'functions': 1 }
      }
    ];
    
    const analyzer = new MultiRepositoryAnalysis(reports);
    const result = analyzer.analyzeMetric('totals');
    
    expect(result.pareto.rows).toHaveLength(1);
    expect(result.pareto.getFeaturesAtCut(0.8)).toHaveLength(1);
    expect(result.pareto.getTopFeatures(5)).toHaveLength(1);
  });
});