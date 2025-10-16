import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.js'],
    setupFiles: ['src/__tests__/setup.js'],
    globals: true,
    reporters: ['default', 'verbose'],
    silent: false,
    threads: false,
    isolate: false,
    watch: false,
    clearMocks: true,
    restoreMocks: true,
    coverage: { enabled: false },
  },
});
