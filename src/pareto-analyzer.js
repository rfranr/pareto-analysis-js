/**
 * Pareto principle analysis for JavaScript feature usage
 * Identifies the distribution of feature usage following the 80/20 rule
 */

import path from 'node:path';
import { PARETO } from './config/constants.js';
import { MASTER_FEATURE_CATALOG } from './config/features.js';
import {
  exitWithError,
  exitWithSuccess,
  parseArguments,
  parseCommaSeparated,
  parseParetocuts,
  validateArguments
} from './utils/cli-utils.js';
import { loadJsonFile, writeFileContent } from './utils/file-utils.js';

/**
 * Pareto analysis result for a single metric
 */
class ParetoAnalysis {
  constructor(series, cuts = PARETO.DEFAULT_CUTS) {
    this.cuts = cuts;
    this.entries = this._createSortedEntries(series);
    this.sum = this._calculateSum();
    this.rows = this._createRows();
    this.cutMap = this._createCutMap();
  }

  _createSortedEntries(series) {
    return Object.entries(series)
      .filter(([, value]) => typeof value === 'number' && isFinite(value) && value > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  _calculateSum() {
    return this.entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  }

  _createRows() {
    let cumulativeCount = 0;
    
    return this.entries.map(([feature, count]) => {
      cumulativeCount += count;
      return {
        feature,
        count,
        percentage: count / this.sum,
        cumulativeCount,
        cumulativePercentage: cumulativeCount / this.sum
      };
    });
  }

  _createCutMap() {
    const cutMap = new Map();
    
    for (const cut of this.cuts) {
      let index = this.rows.findIndex(row => row.cumulativePercentage >= cut);
      if (index === -1) {
        index = this.rows.length - 1;
      }
      cutMap.set(cut, index);
    }
    
    return cutMap;
  }

  /**
   * Gets features that contribute to a specific percentage
   * @param {number} percentage - Target percentage (0-1)
   * @returns {Array} Features contributing to this percentage
   */
  getFeaturesAtCut(percentage) {
    const cutIndex = this.cutMap.get(percentage);
    if (cutIndex === undefined) return [];
    
    return this.rows.slice(0, cutIndex + 1);
  }

  /**
   * Gets the top N features by usage
   * @param {number} count - Number of top features to return
   * @returns {Array} Top features
   */
  getTopFeatures(count) {
    return this.rows.slice(0, count);
  }
}

/**
 * Multi-repository Pareto analysis
 */
class MultiRepositoryAnalysis {
  constructor(reports) {
    this.reports = reports;
    this.metrics = PARETO.METRICS;
  }

  /**
   * Analyzes a specific metric across all repositories
   * @param {string} metric - Metric name ('totals', 'presence', 'perKLOC')
   * @returns {Object} Analysis results
   */
  analyzeMetric(metric) {
    const aggregatedSeries = {};
    const repositoryStats = [];

    // Initialize aggregated series
    for (const feature of MASTER_FEATURE_CATALOG) {
      aggregatedSeries[feature] = 0;
    }

    // Aggregate across repositories
    for (const report of this.reports) {
      const { series } = this._extractSeries(report, metric);
      const repoName = report.repo || path.basename(report.rootDir || report.path || 'unknown');
      
      const catalog = this._getCatalog(report, series);
      const featuresTotal = catalog.size;
      const featuresObserved = this._countObserved(series);

      repositoryStats.push({
        repository: repoName,
        featuresTotal,
        featuresObserved,
        series
      });

      // Add to aggregated series
      for (const [feature, value] of Object.entries(series)) {
        if (feature in aggregatedSeries) {
          aggregatedSeries[feature] += value || 0;
        }
      }
    }

    const pareto = new ParetoAnalysis(aggregatedSeries);

    return {
      metric,
      pareto,
      repositories: repositoryStats,
      aggregatedSeries
    };
  }

  _extractSeries(report, wantedMetric) {
    if (wantedMetric in report && report[wantedMetric] && 
        typeof report[wantedMetric] === 'object') {
      return { 
        series: report[wantedMetric], 
        metricUsed: wantedMetric, 
        fallback: false 
      };
    }

    // Fallback to totals if requested metric not available
    if ('totals' in report && report.totals && 
        typeof report.totals === 'object') {
      return { 
        series: report.totals, 
        metricUsed: 'totals', 
        fallback: wantedMetric !== 'totals' 
      };
    }

    return { 
      series: {}, 
      metricUsed: wantedMetric, 
      fallback: true 
    };
  }

  _getCatalog(report, series) {
    if (Array.isArray(report.featuresCatalog) && report.featuresCatalog.length) {
      return new Set(report.featuresCatalog);
    }
    return new Set(Object.keys(series));
  }

  _countObserved(series) {
    return Object.entries(series)
      .reduce((count, [, value]) => {
        return count + (typeof value === 'number' && value > 0 ? 1 : 0);
      }, 0);
  }
}

/**
 * Generates a Markdown report from analysis results
 * @param {Object} analysisResults - Results from MultiRepositoryAnalysis
 * @param {Object} options - Report options
 * @returns {string} Markdown content
 */
function generateMarkdownReport(analysisResults, options = {}) {
  const { 
    cuts = PARETO.DEFAULT_CUTS,
    topCount = PARETO.DEFAULT_TOP_COUNT,
    includeRepositoryBreakdown = true 
  } = options;

  let markdown = `# Pareto Analysis Report\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;

  // Aggregate Analysis Summary
  if (analysisResults.length > 0) {
    const totalRepos = analysisResults[0].repositories.length;
    const catalogSize = MASTER_FEATURE_CATALOG.length;
    
    markdown += `## Aggregate Analysis Summary\n\n`;
    markdown += `**Dataset Overview:**\n`;
    markdown += `- Total repositories analyzed: ${totalRepos}\n`;
    markdown += `- Total features in JavaScript catalog: ${catalogSize}\n`;
    markdown += `- Analysis covers: ${PARETO.METRICS.join(', ')} metrics\n\n`;
    
    // For each metric, show the aggregate Pareto analysis
    for (const result of analysisResults) {
      const { metric, pareto } = result;
      
      markdown += `### ${formatMetricName(metric)} - Aggregate Results\n\n`;
      
      // Aggregate Pareto cuts
      for (const cut of cuts) {
        const featuresAtCut = pareto.getFeaturesAtCut(cut);
        const percentage = cut * 100;
        const featurePercentage = ((featuresAtCut.length / catalogSize) * 100).toFixed(1);
        
        markdown += `- **${percentage}% of ${metric}** achieved with `;
        markdown += `**${featuresAtCut.length}** features `;
        markdown += `**(${featurePercentage}% of catalog)**\n`;
      }
      markdown += '\n';
    }
    
    markdown += `---\n\n`;
  }

  for (const result of analysisResults) {
    const { metric, pareto, repositories } = result;
    
    markdown += `## ${formatMetricName(metric)}\n\n`;
    
    // Summary statistics
    markdown += `**Summary:**\n`;
    markdown += `- Repositories analyzed: ${repositories.length}\n`;
    markdown += `- Features with data: ${pareto.rows.length}\n`;
    markdown += `- Total occurrences: ${pareto.sum}\n\n`;

    // Top features
    markdown += `### Top ${topCount} Features\n\n`;
    markdown += '| Rank | Feature | Count | % | Cumulative % |\n';
    markdown += '|------|---------|-------|---|--------------|\n';
    
    const topFeatures = pareto.getTopFeatures(topCount);
    topFeatures.forEach((row, index) => {
      markdown += `| ${index + 1} | ${row.feature} | ${row.count} | `;
      markdown += `${(row.percentage * 100).toFixed(2)}% | `;
      markdown += `${(row.cumulativePercentage * 100).toFixed(2)}% |\n`;
    });
    markdown += '\n';

    // Pareto cuts
    markdown += `### Pareto Analysis\n\n`;
    
    // Calculate total features in catalog for percentage calculation
    const catalogSize = MASTER_FEATURE_CATALOG.length;
    
    for (const cut of cuts) {
      const featuresAtCut = pareto.getFeaturesAtCut(cut);
      const percentage = cut * 100;
      const featurePercentage = ((featuresAtCut.length / catalogSize) * 100).toFixed(1);
      
      markdown += `**${percentage}% of usage** comes from `;
      markdown += `**${featuresAtCut.length}** features `;
      markdown += `**(${featurePercentage}% of catalog)**:\n`;
      
      const featureNames = featuresAtCut.map(f => f.feature).join(', ');
      markdown += `${featureNames}\n\n`;
    }

    // Catalog Usage Summary
    markdown += `### Catalog Usage Summary\n\n`;
    markdown += `Total features in JavaScript catalog: **${catalogSize}**\n\n`;
    markdown += '| Usage Threshold | Features Required | Catalog Percentage |\n';
    markdown += '|-----------------|-------------------|--------------------|\n';
    
    for (const cut of cuts) {
      const featuresAtCut = pareto.getFeaturesAtCut(cut);
      const percentage = cut * 100;
      const featurePercentage = ((featuresAtCut.length / catalogSize) * 100).toFixed(1);
      
      markdown += `| ${percentage}% | ${featuresAtCut.length} | ${featurePercentage}% |\n`;
    }
    markdown += '\n';

    // Repository breakdown (optional)
    if (includeRepositoryBreakdown) {
      markdown += `### Repository Breakdown\n\n`;
      
      for (const repo of repositories) {
        const catalogUsage = ((repo.featuresObserved / catalogSize) * 100).toFixed(1);
        
        markdown += `#### ${repo.repository}\n\n`;
        markdown += `- **Features Total:** ${repo.featuresTotal}\n`;
        markdown += `- **Features Observed:** ${repo.featuresObserved}\n`;
        markdown += `- **Catalog Usage:** ${catalogUsage}%\n\n`;
        
        // Get top features for this repository
        const topFeatures = Object.entries(repo.series)
          .filter(([, value]) => typeof value === 'number' && value > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, topCount);
        
        if (topFeatures.length > 0) {
          markdown += `**Top ${Math.min(topCount, topFeatures.length)} Features:**\n`;
          topFeatures.forEach(([feature, count], index) => {
            markdown += `${index + 1}. **${feature}**: ${count}\n`;
          });
          markdown += '\n';
        }
        
        markdown += '---\n\n';
      }
    }
  }

  return markdown;
}

/**
 * Formats metric names for display
 * @param {string} metric - Metric name
 * @returns {string} Formatted name
 */
function formatMetricName(metric) {
  switch (metric) {
    case 'totals':
      return 'Total Occurrences';
    case 'presence':
      return 'File Presence';
    case 'perKLOC':
      return 'Per 1000 Lines of Code';
    default:
      return metric.charAt(0).toUpperCase() + metric.slice(1);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const { inputFiles, flags } = parseArguments(process.argv.slice(2));
  
  const usageText = `
Usage: node src/pareto-analyzer.js <stats-files...> [options]

Options:
  --metrics <list>    Comma-separated metrics to analyze (default: totals,presence,perKLOC)
  --cuts <list>       Comma-separated Pareto cuts (default: 0.8,0.9,0.95)
  --top <number>      Number of top features to show (default: 5)
  --output <file>     Output file for Markdown report
  --json              Output JSON instead of Markdown

Examples:
  node src/pareto-analyzer.js stats/*.json
  node src/pareto-analyzer.js stats/*.json --metrics totals --cuts 0.8,0.9
  node src/pareto-analyzer.js stats/*.json --output report.md
`;

  if (!validateArguments({ inputFiles }, usageText)) {
    return;
  }

  try {
    // Load analysis reports
    console.log('Info: Loading analysis reports...');
    const reports = await Promise.all(inputFiles.map(loadJsonFile));
    
    // Parse options
    const metrics = parseCommaSeparated(flags.metrics || PARETO.METRICS.join(','));
    const cuts = parseParetocuts(flags.cuts || PARETO.DEFAULT_CUTS.join(','));
    const topCount = parseInt(flags.top) || PARETO.DEFAULT_TOP_COUNT;

    console.log(`Info: 1: Analyzing ${reports.length} repositories...`);
    console.log(`Info: 2: Metrics: ${metrics.join(', ')}`);
    console.log(`Info: 3: Cuts: ${cuts.map(c => (c * 100).toFixed(0) + '%').join(', ')}`);

    // Perform analysis
    const analyzer = new MultiRepositoryAnalysis(reports);
    const results = metrics.map(metric => analyzer.analyzeMetric(metric));

    // Generate output
    if (flags.json) {
      const jsonOutput = {
        metadata: {
          generatedAt: new Date().toISOString(),
          repositories: reports.length,
          metrics,
          cuts
        },
        results: results.map(({ metric, pareto, repositories }) => ({
          metric,
          summary: {
            featuresWithData: pareto.rows.length,
            totalOccurrences: pareto.sum
          },
          paretoAnalysis: cuts.map(cut => ({
            cut,
            featuresCount: pareto.getFeaturesAtCut(cut).length,
            features: pareto.getFeaturesAtCut(cut).map(f => f.feature)
          })),
          topFeatures: pareto.getTopFeatures(topCount),
          repositories: repositories.map(({ repository, featuresTotal, featuresObserved }) => ({
            repository,
            featuresTotal,
            featuresObserved,
            coverage: featuresTotal > 0 ? featuresObserved / featuresTotal : 0
          }))
        }))
      };
      
      const jsonString = JSON.stringify(jsonOutput, null, 2);
      
      if (flags.output) {
        await writeFileContent(flags.output, jsonString);
        console.log(`Info: JSON report saved to ${flags.output}`);
      } else {
        console.log(jsonString);
      }
    } else {
      // Markdown output
      const markdown = generateMarkdownReport(results, { cuts, topCount });
      
      if (flags.output) {
        await writeFileContent(flags.output, markdown);
        console.log(`Info: Markdown report saved to ${flags.output}`);
      } else {
        console.log(markdown);
      }
    }

    exitWithSuccess();
  } catch (error) {
    exitWithError(`Error: Analysis failed: ${error.message}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateMarkdownReport, MultiRepositoryAnalysis, ParetoAnalysis };
