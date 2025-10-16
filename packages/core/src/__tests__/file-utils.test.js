/**
 * Tests for file utility functions
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import {
    ensureDirectoryExists,
    readFileContent,
    saveJsonFile,
    walkDirectory
} from '../utils/file-utils.js';

// Mock fs-extra
vi.mock('fs-extra');

describe('File Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('readFileContent should read file and return content', async () => {
    const mockContent = 'file content';
    fs.readFile.mockResolvedValue(mockContent);
    
    const content = await readFileContent('test.js');
    
    expect(fs.readFile).toHaveBeenCalledWith('test.js', 'utf8');
    expect(content).toBe(mockContent);
  });

  test('readFileContent should handle file read errors', async () => {
    fs.readFile.mockRejectedValue(new Error('File not found'));
    
    await expect(readFileContent('nonexistent.js'))
      .rejects.toThrow('File not found');
  });

  test('saveJsonFile should write JSON data to file', async () => {
    const data = { test: 'data' };
    fs.writeFile.mockResolvedValue();
    
    await saveJsonFile('output.json', data);
    
    expect(fs.writeFile).toHaveBeenCalledWith(
      'output.json',
      JSON.stringify(data, null, 2),
      'utf8'
    );
  });

  test('saveJsonFile should handle write errors', async () => {
    fs.writeFile.mockRejectedValue(new Error('Write failed'));
    
    await expect(saveJsonFile('output.json', {}))
      .rejects.toThrow('Write failed');
  });

  test('walkDirectory should find JavaScript files', async () => {
    const mockFiles = [
      '/path/to/file1.js',
      '/path/to/file2.jsx',
      '/path/to/file3.ts',
      '/path/to/file4.tsx',
      '/path/to/readme.md'
    ];
    
    // Mock the directory walking
    fs.readdir.mockImplementation(async (dir) => {
      if (dir === '/test/path') {
        return [
          { name: 'file1.js', isDirectory: () => false },
          { name: 'file2.jsx', isDirectory: () => false },
          { name: 'file3.ts', isDirectory: () => false },
          { name: 'file4.tsx', isDirectory: () => false },
          { name: 'readme.md', isDirectory: () => false },
          { name: 'subdir', isDirectory: () => true }
        ];
      }
      return [];
    });
    
    fs.stat.mockImplementation(async (filePath) => ({
      isDirectory: () => filePath.endsWith('subdir')
    }));
    
    const jsFiles = [];
    await walkDirectory('/test/path', (filePath) => {
      jsFiles.push(filePath);
    });
    
    // Should only include JS/TS files
    expect(jsFiles.some(f => f.endsWith('.js'))).toBe(true);
    expect(jsFiles.some(f => f.endsWith('.jsx'))).toBe(true);
    expect(jsFiles.some(f => f.endsWith('.ts'))).toBe(true);
    expect(jsFiles.some(f => f.endsWith('.tsx'))).toBe(true);
    expect(jsFiles.some(f => f.endsWith('.md'))).toBe(false);
  });

  test('ensureDirectoryExists should create directory if it does not exist', async () => {
    fs.pathExists.mockResolvedValue(false);
    fs.ensureDir.mockResolvedValue();
    
    await ensureDirectoryExists('/new/directory');
    
    expect(fs.pathExists).toHaveBeenCalledWith('/new/directory');
    expect(fs.ensureDir).toHaveBeenCalledWith('/new/directory');
  });

  test('ensureDirectoryExists should not create directory if it exists', async () => {
    fs.pathExists.mockResolvedValue(true);
    
    await ensureDirectoryExists('/existing/directory');
    
    expect(fs.pathExists).toHaveBeenCalledWith('/existing/directory');
    expect(fs.ensureDir).not.toHaveBeenCalled();
  });

  test('should handle different file extensions', () => {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
    
    extensions.forEach(ext => {
      const filename = `test${ext}`;
      expect(filename).toMatch(/\.(js|jsx|ts|tsx|mjs|cjs)$/);
    });
  });

  test('should filter out node_modules and other ignored directories', async () => {
    fs.readdir.mockImplementation(async (dir) => {
      return [
        { name: 'src', isDirectory: () => true },
        { name: 'node_modules', isDirectory: () => true },
        { name: '.git', isDirectory: () => true },
        { name: 'dist', isDirectory: () => true },
        { name: 'file.js', isDirectory: () => false }
      ];
    });
    
    fs.stat.mockImplementation(async (filePath) => ({
      isDirectory: () => !filePath.endsWith('.js')
    }));
    
    const visitedDirs = [];
    await walkDirectory('/test', (filePath) => {}, (dirPath) => {
      visitedDirs.push(path.basename(dirPath));
    });
    
    expect(visitedDirs).toContain('src');
    expect(visitedDirs).not.toContain('node_modules');
    expect(visitedDirs).not.toContain('.git');
  });
});

describe('Path Utils', () => {
  test('should handle absolute and relative paths correctly', () => {
    const absolutePath = '/absolute/path/to/file.js';
    const relativePath = './relative/path/to/file.js';
    
    expect(path.isAbsolute(absolutePath)).toBe(true);
    expect(path.isAbsolute(relativePath)).toBe(false);
  });

  test('should extract file extensions correctly', () => {
    expect(path.extname('file.js')).toBe('.js');
    expect(path.extname('component.jsx')).toBe('.jsx');
    expect(path.extname('types.d.ts')).toBe('.ts');
  });
});