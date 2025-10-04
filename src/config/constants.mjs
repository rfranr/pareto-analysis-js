/**
 * Application constants and configuration values
 */

// Analysis configuration
export const ANALYSIS = {
  MAX_FILE_SIZE: 1_000_000, // 1MB max file size
  IGNORE_PATTERNS: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.next',
    'out',
    'public',
    'wwwroot',
    'vendor',
    'lib',
    'legacy',
    'bundles',
    '.git'
  ],
  FILE_EXTENSIONS: /\.(m?jsx?)$/,  // JavaScript/JSX only - TypeScript not yet supported
  IGNORE_FILES: /\.(min|bundle|legacy)\.m?js$/
};

// Pareto analysis configuration
export const PARETO = {
  DEFAULT_CUTS: [0.8, 0.9, 0.95],
  METRICS: ['totals', 'presence', 'perKLOC'],
  DEFAULT_TOP_COUNT: 7,
  KLOC_DIVISOR: 1000
};

// Chart generation configuration
export const CHARTS = {
  DEFAULT_WIDTH: 1200,
  DEFAULT_HEIGHT: 700,
  DEFAULT_OUTPUT_DIR: 'charts',
  COLORS: {
    totals: 'rgba(54, 162, 235, 0.8)',
    presence: 'rgba(75, 192, 192, 0.8)',
    perKLOC: 'rgba(255, 206, 86, 0.8)'
  }
};

// CLI configuration
export const CLI = {
  EXIT_CODES: {
    SUCCESS: 0,
    ERROR: 1,
    INVALID_ARGS: 2
  }
};