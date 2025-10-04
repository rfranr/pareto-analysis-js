/**
 * TypeScript definitions for the JavaScript Pareto Rule Analysis Tool
 */

export interface AnalysisResult {
  file: string;
  counts: Record<string, number>;
  present: Record<string, number>;
  loc: number;
  comments: number;
  unknown: string[];
  loose: boolean;
}

export interface RepositorySummary {
  repo: string;
  rootDir: string;
  filesAnalyzed: number;
  totals: Record<string, number>;
  presence: Record<string, number>;
  perKLOC: Record<string, number>;
  locTotal: number;
  totalOccurrences: number;
  featuresCatalog: Record<string, boolean>;
  featuresTotal: number;
  featuresObserved: number;
  generatedAt: string;
}

export interface ParetoRow {
  feature: string;
  count: number;
  percentage: number;
  cumulativeCount: number;
  cumulativePercentage: number;
}

export interface ParetoAnalysisOptions {
  cuts?: number[];
  topCount?: number;
  includeRepositoryBreakdown?: boolean;
}

export interface RepositoryStats {
  repository: string;
  featuresTotal: number;
  featuresObserved: number;
  series: Record<string, number>;
}

export interface MetricAnalysisResult {
  metric: string;
  pareto: ParetoAnalysis;
  repositories: RepositoryStats[];
  aggregatedSeries: Record<string, number>;
}

export interface ChartOptions {
  outputDir?: string;
  width?: number;
  height?: number;
  cuts?: number[];
}

export interface ParsedArguments {
  inputFiles: string[];
  flags: Record<string, string>;
}

export interface AnalysisConfig {
  MAX_FILE_SIZE: number;
  IGNORE_PATTERNS: string[];
  FILE_EXTENSIONS: RegExp;
  IGNORE_FILES: RegExp;
}

export interface ParetoConfig {
  DEFAULT_CUTS: number[];
  METRICS: string[];
  DEFAULT_TOP_COUNT: number;
  KLOC_DIVISOR: number;
}

export interface ChartConfig {
  DEFAULT_WIDTH: number;
  DEFAULT_HEIGHT: number;
  DEFAULT_OUTPUT_DIR: string;
  COLORS: Record<string, string>;
}

declare class ParetoAnalysis {
  cuts: number[];
  entries: [string, number][];
  sum: number;
  rows: ParetoRow[];
  cutMap: Map<number, number>;
  
  constructor(series: Record<string, number>, cuts?: number[]);
  getFeaturesAtCut(percentage: number): ParetoRow[];
  getTopFeatures(count: number): ParetoRow[];
}

declare class MultiRepositoryAnalysis {
  reports: RepositorySummary[];
  metrics: string[];
  
  constructor(reports: RepositorySummary[]);
  analyzeMetric(metric: string): MetricAnalysisResult;
}

declare class ChartGenerator {
  constructor(width?: number, height?: number);
  createOverlayChart(report: RepositorySummary, cuts?: number[], outputPath?: string): Promise<void>;
  createComparisonChart(reports: RepositorySummary[], metric: string, cuts?: number[], outputPath?: string): Promise<void>;
}

export declare function analyzeRepository(repositoryPath: string): Promise<RepositorySummary>;
export declare function analyzeFile(filePath: string): Promise<AnalysisResult>;
export declare function generateMarkdownReport(analysisResults: MetricAnalysisResult[], options?: ParetoAnalysisOptions): string;
export declare function generateAllCharts(inputFiles: string[], options?: ChartOptions): Promise<void>;

export declare const MASTER_FEATURE_CATALOG: string[];
export declare const BINARY_OPERATORS: string[];
export declare const ASSIGNMENT_OPERATORS: string[];
export declare const UPDATE_OPERATORS: string[];
export declare const ARRAY_METHODS: string[];
export declare const REGEXP_FLAGS: string[];