/**
 * Command line interface utilities
 */

import { CLI } from '../config/constants.mjs';

/**
 * Parses command line arguments into a structured format
 * @param {string[]} argv - Command line arguments
 * @returns {Object} Parsed arguments object
 */
export function parseArguments(argv) {
  const inputFiles = [];
  const flags = {};
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg.startsWith('--')) {
      if (arg.includes('=')) {
        // Handle --key=value format
        const [key, value] = arg.split('=');
        flags[key.replace(/^--/, '')] = value;
      } else {
        // Handle --key value format
        const key = arg.replace(/^--/, '');
        const nextArg = argv[i + 1];
        
        if (nextArg && !nextArg.startsWith('--')) {
          flags[key] = nextArg;
          i++; // Skip the next argument as it's the value
        } else {
          flags[key] = 'true';
        }
      }
    } else {
      inputFiles.push(arg);
    }
  }

  return { inputFiles, flags };
}

/**
 * Validates required arguments and shows usage if needed
 * @param {Object} args - Parsed arguments
 * @param {string} usageText - Usage help text
 * @returns {boolean} True if valid, false otherwise
 */
export function validateArguments(args, usageText) {
  if (args.inputFiles.length === 0) {
    console.error(usageText);
    return false;
  }
  return true;
}

/**
 * Parses a comma-separated list from flags
 * @param {string} value - Comma-separated string
 * @param {Function} parser - Parser function for individual items
 * @returns {Array} Parsed array
 */
export function parseCommaSeparated(value, parser = String) {
  if (!value) return [];
  
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(parser);
}

/**
 * Parses numeric cuts for Pareto analysis
 * @param {string} cutsString - Comma-separated cuts string
 * @returns {number[]} Valid numeric cuts sorted ascending
 */
export function parseParetocuts(cutsString) {
  if (!cutsString) return [];
  
  return parseCommaSeparated(cutsString, Number)
    .filter(cut => Number.isFinite(cut) && cut > 0 && cut < 1)
    .sort((a, b) => a - b);
}

/**
 * Shows error message and exits with error code
 * @param {string} message - Error message
 * @param {number} exitCode - Exit code (defaults to ERROR)
 */
export function exitWithError(message, exitCode = CLI.EXIT_CODES.ERROR) {
  console.error(message);
  process.exit(exitCode);
}

/**
 * Shows success message and exits with success code
 * @param {string} message - Success message
 */
export function exitWithSuccess(message) {
  if (message) {
    console.log(message);
  }
  process.exit(CLI.EXIT_CODES.SUCCESS);
}