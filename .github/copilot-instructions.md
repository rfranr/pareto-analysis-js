---
applyTo: "**/*.js,**/*.sh,**/*.astro"

---
# Copilot instructions for pareto-analysis-js

Use these repository-specific guidelines to be productive immediately when generating or editing code here. Keep changes small, runnable, and aligned with the existing patterns.

## General guidelines
- Ignore everything under the pattern `docs/*.json`.
- Ignore everything under the pattern `stats/*.json`.


## Big picture architecture
- Monorepo with two main parts:
	- packages/core: Node.js ES module library and CLI that analyzes JS/TS/JSX code, performs Pareto analysis, and generates charts and reports.
	- apps/front: Astro site that discovers and displays generated charts from docs/charts.
- Core flow (data pipeline):
	1) src/analyzer.js parses source files (Acorn + plugins) and emits per-repo stats JSON to docs/stats.
	2) src/pareto-analyzer.js aggregates stats into Pareto rows and emits Markdown/JSON reports to docs/reports.
	3) src/chart-generator.js renders PNG charts (Chart.js via chartjs-node-canvas) to docs/charts.
	4) The Astro dashboard reads docs/charts at runtime and lists images by category (overlay, comparison, aggregate).

Key files and dirs (core):
- src/config/constants.js: ANALYSIS, PARETO, CHARTS, CLI knobs (e.g., file globs, Pareto cuts, chart sizes).
- src/config/features.js: MASTER_FEATURE_CATALOG and helpers that define all tracked features. Add feature names here first.
- src/utils/*: ast-utils (parseFile, walk helpers), file-utils (fs-extra I/O), cli-utils (args, exits).
- src/analyzer.js: feature detection with acorn-walk. Extensible via createFeatureDetectors and mapParserNodeToFeature. Tracks unknown features as unhandled_*.
- src/pareto-analyzer.js: ParetoAnalysis and MultiRepositoryAnalysis, plus generateMarkdownReport.
- src/chart-generator.js: createOverlayChart, createComparisonChart, createAggregateChart.
- analyze.sh (in packages/core): orchestrates end-to-end pipeline.

Key files and dirs (front):
- apps/front/src/pages/index.astro and components/Dashboard.astro: load charts from docs/charts and group by type.
- apps/front/src/layouts/Layout.astro: sets page shell and default styles.

## Critical workflows (commands)
- From packages/core:
	- Run analyzer on a repo: node src/analyzer.js --repo ./repos/<name> --output docs/stats/<name>-stats.json
	- Generate reports: node src/pareto-analyzer.js docs/stats/*.json --output docs/reports/pareto-analysis.md
	- Generate charts: node src/chart-generator.js docs/stats/*.json --output-dir docs/charts
	- Full pipeline helper: ./analyze.sh full [./repos/<name>]
	- Clean outputs: ./analyze.sh clean
- Tests (Jest ESM):
	- In packages/core: npm test | npm run test:coverage | npm run test:watch
	- jest.config.js uses ESM export default; test files live in src/__tests__ and end with .test.js; setup at src/__tests__/setup.js
- Frontend:
	- apps/front: npm run dev to preview dashboard; expects charts under docs/charts relative to repo root.

## Conventions and patterns
- ES modules everywhere ("type": "module"). For Node-only adapters use src/adapters/node/*; exported via package.json exports map.
- Feature additions: update src/config/features.js (catalog) then extend detectors in src/analyzer.js (createFeatureDetectors); prefer feature keys like binaryOp_===, assignOp_+=, arrayMethod_map.
- AST parsing: use parseFile from utils/ast-utils.js (already wired with acorn-jsx, acorn-typescript, etc.). Use walk.ancestor and withAncestors for context-aware detection.
- Ignore rules and file extensions configured in ANALYSIS in constants.js. TSX may be disabled; check FILE_EXTENSIONS before assuming support.
- Charts: prefer CHARTS constants for dimensions/colors; repository names derived from report.repo or path.
- Reports: generateMarkdownReport in pareto-analyzer.js; multi-repo metrics defined by PARETO.METRICS (totals, presence, perKLOC).

## External integrations
- Parsing: acorn, acorn-walk, acorn-jsx, @sveltejs/acorn-typescript; keep parse options consistent via utils/ast-utils.js.
- Charts: chart.js + chartjs-node-canvas. canvas is an optional peer/optional dependency; guard code in CI/servers without native canvas.
- FS: fs-extra; always ensureDir before writes; outputs go to docs/{stats,reports,charts}.

## How to change things safely
- When adding detectors:
	1) Add feature name to MASTER_FEATURE_CATALOG (features.js).
	2) Add a detector in createFeatureDetectors in analyzer.js and increment(feature).
	3) Add/adjust tests under src/__tests__ (unit + integration) to cover new features and catalogs.
- When adjusting Pareto behavior: modify PARETO in constants.js (DEFAULT_CUTS, METRICS, DEFAULT_TOP_COUNT) and verify chart/report functions.
- When changing file filtering: update ANALYSIS.FILE_EXTENSIONS/IGNORE_PATTERNS and confirm analyzer CLI still finds files.

## Examples
- Add new array method feature:
	- features.js: include method in ARRAY_METHODS; catalog will include arrayMethod_<name>.
	- analyzer.js: ensure detector tracks arrayMethod_<name> on MemberExpression calls.
- Create aggregate chart for perKLOC:
	- node src/chart-generator.js docs/stats/*.json --metric perKLOC --output-dir docs/charts

## Gotchas
- Jest config must be ESM (export default). If you see "module is not defined", you’re loading CJS by mistake.
- Some datasets may miss metrics; chart-generator and pareto-analyzer fall back to totals or skip gracefully—log warnings, don’t throw.
- TSX parsing may be disabled by constants; don’t assume .tsx is included without updating ANALYSIS.FILE_EXTENSIONS.
- The Astro dashboard is file-based: it only shows what exists in docs/charts; run the pipeline first.

Keep PRs focused and runnable. If you change public behavior (outputs, catalog names), update tests in src/__tests__ and the README quick-start examples.

