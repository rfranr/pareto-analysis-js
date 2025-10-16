import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.js'],
    setupFiles: ['src/__tests__/setup.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.js'],
      exclude: [
        'src/__tests__/**',
        'src/**/*.test.js',
        '**/node_modules/**'
      ],
      thresholds: {
        branches: 70,
        functions: 75,
        lines: 75,
        statements: 75
      }
    },
    testTimeout: 10000,
    clearMocks: true,
    restoreMocks: true
  }
});