---
applyTo: "**/*.js,**/*.sh,**/*.astro"

---
# Copilot instructions for pareto-analysis-js

## General guidelines
- Ignore everything under `docs/` directory - it contains generated output files
- ES modules everywhere ("type": "module")

## Architecture
- packages/core: JS/TS analyzer → Pareto analysis → chart generation
- apps/front: Astro dashboard displaying charts from docs/charts
- Pipeline: analyzer.js → pareto-analyzer.js → chart-generator.js

## Key commands
- Full analysis: `./analyze.sh full [./repos/name]` (from packages/core)
- Tests: `npm test` (Vitest) or `npm run test:coverage`
- Dashboard: `npm run dev` (from apps/front)

## Adding features
1. Add to MASTER_FEATURE_CATALOG in src/config/features.js
2. Add detector in src/analyzer.js createFeatureDetectors()
3. Use feature keys like: binaryOp_===, arrayMethod_map

## Gotchas
- Uses Vitest (not Jest) for testing
- TSX disabled by default in constants.js
- Charts expect docs/charts to exist