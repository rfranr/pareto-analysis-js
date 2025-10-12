/**
 * Chart generation for Pareto analysis visualization
 * Creates PNG charts showing feature usage distributions
 */

import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import fse from 'fs-extra';
import path from 'node:path';

import { ParetoAnalysis } from '../pareto-analyzer.js';
import { CHARTS, PARETO } from './config/constants.js';
import { MASTER_FEATURE_CATALOG } from './config/features.js';
import {
    exitWithError,
    exitWithSuccess,
    parseArguments,
    parseParetocuts,
    validateArguments
} from './utils/cli-utils.js';
import { loadJsonFile, writeFileContent } from './utils/file-utils.js';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend,
  Tooltip,
  BarController,
  BarElement
);

/**
 * Chart generator for Pareto analysis visualizations
 */
class ChartGenerator {
  constructor(width = CHARTS.DEFAULT_WIDTH, height = CHARTS.DEFAULT_HEIGHT) {
    this.canvas = new ChartJSNodeCanvas({ width, height });
    this.width = width;
    this.height = height;
  }

  /**
   * Creates an overlay chart showing multiple metrics for a repository
   * @param {Object} report - Repository analysis report
   * @param {Array} cuts - Pareto cut points
   * @param {string} outputPath - Output file path
   */
  async createOverlayChart(report, cuts = PARETO.DEFAULT_CUTS, outputPath) {
    const repoName = report.repo || path.basename(report.rootDir || 'Unknown');
    const metricData = this._prepareMetricData(report, cuts);
    
    if (metricData.length === 0) {
      console.warn(`Warning: No valid data for ${repoName}, skipping chart generation`);
      return;
    }

    const chartConfig = this._createOverlayChartConfig(metricData, repoName, cuts);
    const buffer = await this.canvas.renderToBuffer(chartConfig);
    
    await fse.ensureDir(path.dirname(outputPath));
    await fse.writeFile(outputPath, buffer);
  }

  /**
   * Creates a comparison chart showing multiple repositories
   * @param {Array} reports - Array of repository reports
   * @param {string} metric - Metric to compare
   * @param {Array} cuts - Pareto cut points
   * @param {string} outputPath - Output file path
   */
  async createComparisonChart(reports, metric, cuts = PARETO.DEFAULT_CUTS, outputPath) {
    const chartData = this._prepareComparisonData(reports, metric, cuts);
    const chartConfig = this._createComparisonChartConfig(chartData, metric, cuts);
    
    const buffer = await this.canvas.renderToBuffer(chartConfig);
    
    await fse.ensureDir(path.dirname(outputPath));
    await fse.writeFile(outputPath, buffer);
  }

  /**
   * Creates an aggregate chart showing combined data from all repositories
   * @param {Array} reports - Array of repository reports
   * @param {string} metric - Metric to analyze
   * @param {Array} cuts - Pareto cut points
   * @param {string} outputPath - Output file path
   */
  async createAggregateChart(reports, metric, cuts = PARETO.DEFAULT_CUTS, outputPath) {
    // Aggregate all data
    const aggregatedSeries = {};
    
    // Initialize with all features
    for (const feature of MASTER_FEATURE_CATALOG) {
      aggregatedSeries[feature] = 0;
    }
    
    // Sum up across all repositories
    for (const report of reports) {
      const series = this._extractSeries(report, metric);
      for (const [feature, value] of Object.entries(series)) {
        if (feature in aggregatedSeries) {
          aggregatedSeries[feature] += value || 0;
        }
      }
    }
    
    const pareto = new ParetoAnalysis(aggregatedSeries, cuts);
    
    if (pareto.rows.length === 0) {
      console.warn(`Warning: No aggregate data for ${metric}`);
      return;
    }
    
    // Create chart data
    const data = pareto.rows.map(row => row.cumulativePercentage * 100);
    const labels = Array.from({ length: data.length }, (_, i) => i + 1);
    
    const chartConfig = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `Aggregate ${this._formatMetricLabel(metric)}`,
          data,
          borderColor: CHARTS.COLORS[metric] || 'rgba(54, 162, 235, 0.8)',
          backgroundColor: (CHARTS.COLORS[metric] || 'rgba(54, 162, 235, 0.8)').replace('0.8', '0.1'),
          fill: true
        }]
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: `Aggregate Analysis: ${this._formatMetricLabel(metric)} (${reports.length} repositories)`,
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Feature Rank'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cumulative Percentage'
            },
            min: 0,
            max: 100
          }
        },
        annotation: {
          annotations: this._createCutLineAnnotations(cuts, data.length)
        }
      }
    };
    
    const buffer = await this.canvas.renderToBuffer(chartConfig);
    
    await fse.ensureDir(path.dirname(outputPath));
    await fse.writeFile(outputPath, buffer);
  }

  _prepareMetricData(report, cuts) {
    const metricData = [];

    for (const metric of PARETO.METRICS) {
      const series = this._extractSeries(report, metric);
      if (!series || Object.keys(series).length === 0) {
        console.warn(`Warning: ${report.repo || 'Unknown'}: "${metric}" is empty or missing`);
        continue;
      }

      const pareto = new ParetoAnalysis(series, cuts);
      if (pareto.rows.length === 0) {
        continue;
      }

      metricData.push({
        metric,
        pareto,
        color: CHARTS.COLORS[metric] || 'rgba(128, 128, 128, 0.8)'
      });
    }

    return metricData;
  }

  _prepareComparisonData(reports, metric, cuts) {
    const datasets = [];
    const maxLength = Math.max(...reports.map(report => {
      const series = this._extractSeries(report, metric);
      const pareto = new ParetoAnalysis(series, cuts);
      return pareto.rows.length;
    }));

    reports.forEach((report, index) => {
      const repoName = report.repo || path.basename(report.rootDir || `Repo${index + 1}`);
      const series = this._extractSeries(report, metric);
      const pareto = new ParetoAnalysis(series, cuts);
      
      const data = pareto.rows.map(row => row.cumulativePercentage * 100);
      const paddedData = this._padArray(data, maxLength);
      
      datasets.push({
        label: repoName,
        data: paddedData,
        borderColor: this._getColor(index),
        backgroundColor: this._getColor(index, 0.1),
        fill: false
      });
    });

    return {
      labels: Array.from({ length: maxLength }, (_, i) => i + 1),
      datasets
    };
  }

  _createOverlayChartConfig(metricData, repoName, cuts) {
    const maxLength = Math.max(...metricData.map(data => data.pareto.rows.length));
    const labels = Array.from({ length: maxLength }, (_, i) => i + 1);

    const datasets = metricData.map(({ metric, pareto, color }) => {
      const data = pareto.rows.map(row => row.cumulativePercentage * 100);
      const paddedData = this._padArray(data, maxLength);

      return {
        label: this._formatMetricLabel(metric),
        data: paddedData,
        borderColor: color,
        backgroundColor: color.replace('0.8', '0.1'),
        fill: false
      };
    });

    // Add cut lines
    const cutLines = this._createCutLineAnnotations(cuts, maxLength);

    return {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: `Pareto Analysis: ${repoName}`,
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Feature Rank'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cumulative Percentage'
            },
            min: 0,
            max: 100
          }
        },
        annotation: {
          annotations: cutLines
        }
      }
    };
  }

  _createComparisonChartConfig(chartData, metric, cuts) {
    const cutLines = this._createCutLineAnnotations(cuts, chartData.labels.length);

    return {
      type: 'line',
      data: chartData,
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: `Repository Comparison: ${this._formatMetricLabel(metric)}`,
            font: { size: 16 }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Feature Rank'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cumulative Percentage'
            },
            min: 0,
            max: 100
          }
        },
        annotation: {
          annotations: cutLines
        }
      }
    };
  }

  _createCutLineAnnotations(cuts, maxX) {
    return cuts.map((cut, index) => ({
      type: 'line',
      yMin: cut * 100,
      yMax: cut * 100,
      borderColor: 'rgba(255, 0, 0, 0.5)',
      borderWidth: 2,
      borderDash: [5, 5],
      label: {
        content: `${(cut * 100).toFixed(0)}%`,
        enabled: true,
        position: 'end'
      }
    }));
  }

  _extractSeries(report, metric) {
    if (metric in report && report[metric] && typeof report[metric] === 'object') {
      return report[metric];
    }
    
    // Fallback to totals
    if ('totals' in report && report.totals && typeof report.totals === 'object') {
      return report.totals;
    }
    
    return {};
  }

  _formatMetricLabel(metric) {
    switch (metric) {
      case 'totals':
        return 'Total Occurrences';
      case 'presence':
        return 'File Presence';
      case 'perKLOC':
        return 'Per 1K LOC';
      default:
        return metric;
    }
  }

  _padArray(array, length) {
    const padded = [...array];
    while (padded.length < length) {
      padded.push(null);
    }
    return padded;
  }

  _getColor(index, alpha = 0.8) {
    const colors = [
      `rgba(54, 162, 235, ${alpha})`,   // Blue
      `rgba(75, 192, 192, ${alpha})`,   // Teal
      `rgba(255, 206, 86, ${alpha})`,   // Yellow
      `rgba(255, 99, 132, ${alpha})`,   // Red
      `rgba(153, 102, 255, ${alpha})`,  // Purple
      `rgba(255, 159, 64, ${alpha})`,   // Orange
      `rgba(199, 199, 199, ${alpha})`,  // Grey
      `rgba(83, 102, 255, ${alpha})`    // Indigo
    ];
    
    return colors[index % colors.length];
  }
}

/**
 * Generates charts for all repositories in the input files
 * @param {Array} inputFiles - Array of analysis file paths
 * @param {Object} options - Generation options
 */
async function generateAllCharts(inputFiles, options = {}) {
  const {
    outputDir = CHARTS.DEFAULT_OUTPUT_DIR,
    width = CHARTS.DEFAULT_WIDTH,
    height = CHARTS.DEFAULT_HEIGHT,
    cuts = PARETO.DEFAULT_CUTS
  } = options;

  console.log('Info: Loading analysis reports...');
  const reports = await Promise.all(inputFiles.map(loadJsonFile));
  
  const generator = new ChartGenerator(width, height);

  console.log(`Info: Generating charts for ${reports.length} repositories...`);
  
  // Generate overlay charts for each repository
  for (const report of reports) {
    const repoName = report.repo || path.basename(report.rootDir || 'unknown');
    const outputPath = path.join(outputDir, `${repoName}-overlay.png`);
    
    try {
      await generator.createOverlayChart(report, cuts, outputPath);
      console.log(`Info: Generated overlay chart: ${outputPath}`);
    } catch (error) {
      console.error(`Error: Failed to generate chart for ${repoName}: ${error.message}`);
    }
  }

  // Generate comparison charts for each metric
  for (const metric of PARETO.METRICS) {
    const outputPath = path.join(outputDir, `comparison-${metric}.png`);
    
    try {
      await generator.createComparisonChart(reports, metric, cuts, outputPath);
      console.log(`Info: Generated comparison chart: ${outputPath}`);
    } catch (error) {
      console.error(`Error: Failed to generate comparison chart for ${metric}: ${error.message}`);
    }
  }

  // Generate aggregate charts for all repositories combined
  for (const metric of PARETO.METRICS) {
    const outputPath = path.join(outputDir, `aggregate-${metric}.png`);
    
    try {
      await generator.createAggregateChart(reports, metric, cuts, outputPath);
      console.log(`Info: Generated aggregate chart: ${outputPath}`);
    } catch (error) {
      console.error(`Error: Failed to generate aggregate chart for ${metric}: ${error.message}`);
    }
  }

  // Generate markdown file with chart references
  const markdownContent = generateChartMarkdown(reports, outputDir);
  const markdownPath = path.join(outputDir, 'charts.md');
  
  await writeFileContent(markdownPath, markdownContent);
  console.log(`Info: Generated chart index: ${markdownPath}`);
}

/**
 * Generates markdown content with chart references
 * @param {Array} reports - Analysis reports
 * @param {string} outputDir - Chart output directory
 * @returns {string} Markdown content
 */
function generateChartMarkdown(reports, outputDir) {
  let markdown = `# Pareto Analysis Charts\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;

  // Repository overlay charts
  markdown += `## Repository Analysis\n\n`;
  for (const report of reports) {
    const repoName = report.repo || path.basename(report.rootDir || 'unknown');
    const chartPath = `${repoName}-overlay.png`;
    
    markdown += `### ${repoName}\n\n`;
    markdown += `![${repoName} Pareto Analysis](${chartPath})\n\n`;
    
    // Add some stats
    if (report.featuresObserved !== undefined && report.featuresTotal !== undefined) {
      const coverage = report.featuresTotal > 0 
        ? (report.featuresObserved / report.featuresTotal * 100).toFixed(1)
        : '0.0';
      
      markdown += `**Statistics:**\n`;
      markdown += `- Files analyzed: ${report.filesAnalyzed || 'N/A'}\n`;
      markdown += `- Features observed: ${report.featuresObserved}/${report.featuresTotal} (${coverage}%)\n`;
      markdown += `- Total LOC: ${report.locTotal || 'N/A'}\n\n`;
    }
  }

  // Comparison charts
  markdown += `## Metric Comparisons\n\n`;
  for (const metric of PARETO.METRICS) {
    const chartPath = `comparison-${metric}.png`;
    const metricLabel = metric === 'totals' ? 'Total Occurrences' :
                       metric === 'presence' ? 'File Presence' :
                       metric === 'perKLOC' ? 'Per 1K LOC' : metric;
    
    markdown += `### ${metricLabel}\n\n`;
    markdown += `![${metricLabel} Comparison](${chartPath})\n\n`;
  }

  // Aggregate charts
  markdown += `## Aggregate Analysis\n\n`;
  markdown += `Combined analysis across all ${reports.length} repositories:\n\n`;
  
  for (const metric of PARETO.METRICS) {
    const chartPath = `aggregate-${metric}.png`;
    const metricLabel = metric === 'totals' ? 'Total Occurrences' :
                       metric === 'presence' ? 'File Presence' :
                       metric === 'perKLOC' ? 'Per 1K LOC' : metric;
    
    markdown += `### Aggregate ${metricLabel}\n\n`;
    markdown += `![Aggregate ${metricLabel}](${chartPath})\n\n`;
  }

  return markdown;
}

/**
 * Main CLI function
 */
async function main() {
  const { inputFiles, flags } = parseArguments(process.argv.slice(2));
  
  const usageText = `
Usage: node src/chart-generator.js <stats-files...> [options]

Options:
  --output-dir <dir>   Output directory for charts (default: charts)
  --width <number>     Chart width in pixels (default: 1200)
  --height <number>    Chart height in pixels (default: 700)
  --cuts <list>        Comma-separated Pareto cuts (default: 0.8,0.9,0.95)

Examples:
  node src/chart-generator.js stats/*.json
  node src/chart-generator.js stats/*.json --output-dir ./charts --width 1600
`;

  if (!validateArguments({ inputFiles }, usageText)) {
    return;
  }

  try {
    const options = {
      outputDir: flags['output-dir'] || CHARTS.DEFAULT_OUTPUT_DIR,
      width: parseInt(flags.width) || CHARTS.DEFAULT_WIDTH,
      height: parseInt(flags.height) || CHARTS.DEFAULT_HEIGHT,
      cuts: parseParetocuts(flags.cuts) || PARETO.DEFAULT_CUTS
    };

    await generateAllCharts(inputFiles, options);

    console.log(`Info: Chart generation complete!`);
    console.log(`Info: Charts saved to: ${path.resolve(options.outputDir)}`);

    exitWithSuccess();
  } catch (error) {
    exitWithError(`Error: Chart generation failed: ${error.message}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ChartGenerator, generateAllCharts };
