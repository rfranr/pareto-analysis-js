// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'production' 
    ? 'https://rfranr.github.io' 
    : 'http://localhost:4321',
  base: process.env.NODE_ENV === 'production' 
    ? '/pareto-analysis-js' 
    : undefined,
  vite: {
    build: {
      sourcemap: true
    }
  }
});
