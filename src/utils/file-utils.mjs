/**
 * File system utilities for repository analysis
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ANALYSIS } from '../config/constants.mjs';

/**
 * Recursively walks through directory and yields JavaScript/TypeScript files
 * @param {string} dir - Directory to walk
 * @yields {string} File paths
 */
export async function* walkDirectory(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (shouldIgnoreEntry(entry.name)) {
        continue;
      }
      
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        yield* walkDirectory(fullPath);
      } else if (isAnalyzableFile(entry.name)) {
        const stats = await fs.stat(fullPath);
        if (stats.size <= ANALYSIS.MAX_FILE_SIZE) {
          yield fullPath;
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
  }
}

/**
 * Checks if a directory entry should be ignored
 * @param {string} name - Entry name
 * @returns {boolean}
 */
function shouldIgnoreEntry(name) {
  return ANALYSIS.IGNORE_PATTERNS.includes(name);
}

/**
 * Checks if a file should be analyzed based on extension and pattern
 * @param {string} filename - File name
 * @returns {boolean}
 */
function isAnalyzableFile(filename) {
  return ANALYSIS.FILE_EXTENSIONS.test(filename) && 
         !ANALYSIS.IGNORE_FILES.test(filename);
}

/**
 * Safely reads a file and returns its content
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} File content
 */
export async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Safely writes content to a file, creating directories if needed
 * @param {string} filePath - Path to write to
 * @param {string} content - Content to write
 */
export async function writeFileContent(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

/**
 * Loads and parses a JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function loadJsonFile(filePath) {
  try {
    const content = await readFileContent(filePath);
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Saves an object as a JSON file
 * @param {string} filePath - Path to save to
 * @param {Object} data - Data to save
 */
export async function saveJsonFile(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  await writeFileContent(filePath, content);
}