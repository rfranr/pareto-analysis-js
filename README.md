

# JavaScript Pareto Rule Analysis Tool

⚠️ This is a personal research project — not meant as a formal measurement tool.
I built it mainly to visualize some ideas around language usage and the Pareto effect in programming.

A small experimental tool to explore how JavaScript features are actually used across real-world repositories — and how the Pareto principle (80/20 rule) might apply to code.

You can explore the reports here:
- [Pareto Analysis](https://rfranr.github.io/pareto-analysis-js/reports/pareto-analysis)
- [Charts](https://rfranr.github.io/pareto-analysis-js/charts/charts)

![Aggregate Chart Example](docs/charts/comparison-perKLOC.png)

## Overview

This project performs a lightweight static analysis on JavaScript/JSX codebases to observe:

- Which language features appear most often
- How usage distributes across files and lines of code
- Whether the 80/20 rule (Pareto principle) holds in practice
- How similar or different repositories behave when compared

It’s not a formal measurement tool — just a personal experiment born out of curiosity.

## Supported File Types

### **Currently Supported**
- **JavaScript (.js, .mjs)** - Full ES2024 + syntax (via Acorn)
- **JSX (.jsx)** - Supported through acorn-jsx
- **Module formats** - CommonJS and ES modules are both recognized

## Features

### **Static Code Analysis**
- Parses JavaScript and JSX files using Acorn and the acorn-jsx plugin
- Handles modern ES syntax (optional chaining, nullish coalescing, top-level await, etc.)
- Scans the parsed code to count occurrences of 100 + JavaScript features
- Works entirely through static inspection — no execution or runtime evaluation


### **Multiple Metrics**
- **Totals** – raw feature occurrences across all files
- **Presence** – how many files contain a given feature  
- **Per-KLOC** – feature density per 1,000 lines of code

### **Pareto Analysis**
- Shows which 20% of features cover ~80% of actual code usage
- Configurable cut-off points (80%, 90%, 95%)
- Supports multi-repository comparison

### **Output**
- **JSON** – structured raw data
- **Markdown** – easy-to-read reports
- **PNG charts** – visual Pareto curves
- **CSV** – for importing elsewhere

## Quick Start

### Installation

```bash
git clone <repository-url>
cd js-pareto-analysis
npm install
```

### Basic Usage

```bash
node src/analyzer.mjs --repo ./repos/my-project --output analysis.json
node src/pareto-analyzer.mjs stats/*.json --output report.md
node src/chart-generator.mjs stats/*.json --output-dir charts/
./analyze.sh full ./repos/my-project
```

### Batch Analysis

```bash
JavaScript Pareto Analysis Tool

Usage: ./analyze.sh [COMMAND] [OPTIONS]

Commands:
    analyze [REPO_PATH]     Analyze a specific repository
    generate-stats         Generate statistics for all repositories
    stats                  Show quick statistics from existing analysis files
    reports                Generate Pareto analysis reports
    charts                 Generate visualization charts
    full [REPO_PATH]       Run complete analysis pipeline
                           If REPO_PATH provided, analyzes only that repository
                           If no REPO_PATH, analyzes all repositories in repos/
    clean                  Clean up generated files
    help                   Show this help message

Examples:
    ./analyze.sh analyze ./repos/my-project
    ./analyze.sh generate-stats                # Generate stats for all repos in repos/
    ./analyze.sh stats                         # Quick overview of analyzed repos
    ./analyze.sh reports                       # Generate markdown/JSON reports
    ./analyze.sh charts                        # Generate visualization charts
    ./analyze.sh full                          # Analyze all repos in repos/
    ./analyze.sh full ./repos/my-project       # Analyze specific repo
    ./analyze.sh clean

Output:
    Statistics:  docs/stats/
    Reports:     docs/reports/
    Charts:      docs/charts/
```

## Project Structure

```
src/
├── analyzer.mjs           # Code analysis engine
├── pareto-analyzer.mjs    # Pareto statistics generator
├── chart-generator.mjs    # Visualization builder
├── config/
│   ├── features.mjs       # JavaScript feature catalog
│   └── constants.mjs      # Default settings
└── utils/                 # File, AST, and CLI helpers

scripts/
└── analyze.sh             # Batch script runner

output/
├── stats/                 # Analysis JSONs
├── reports/               # Markdown reports
└── charts/                # Generated PNG charts
```

## Example Output (JSON)

```json
{
  "repo": "my-project",
  "filesAnalyzed": 156,
  "totals": { "functions": 1234, "arrowFunctions": 856 },
  "presence": { "functions": 98, "arrowFunctions": 67 },
  "perKLOC": { "functions": 45.2, "arrowFunctions": 31.3 },
  "featuresObserved": 47,
  "featuresTotal": 134,
  "locTotal": 27302
}
```

## Example Report (Markdown)

```markdown
# Pareto Analysis

## Summary
- Repositories analyzed: 5
- Features detected: 47
- 80% of total usage comes from just 12 features

### Top 5 Features

| Rank | Feature | Count | % | Cumulative % |
|------|----------|-------|---|--------------|
| 1 | assignOp_= | 3,456 | 22.68% | 22.68% |
| 2 | binaryOp_=== | 2,134 | 14.01% | 36.69% |
| 3 | functions | 1,867 | 12.25% | 48.94% |
| 4 | if | 1,234 | 8.10% | 57.04% |
| 5 | arrowFunctions | 987 | 6.48% | 63.52% |
```

## Example Charts
![Aggregate Chart Example](docs/charts/aggregate-perKLOC.png)

![React Overlay Example](docs/charts/react-overlay.png)

## Use Cases

- Exploring how JavaScript is used in real projects  
- Comparing syntax adoption across libraries or frameworks  
- Educational or research curiosity about language patterns  
- Checking how much of the spec is really used in practice
- Or simply to answer the question: 
  - How hard can it be to jump into a new repo?

## Contributing

This is a hobby project, but feel free to open issues or PRs if something catches your eye.

```bash
npm install
./analyze.sh full ./repos/my-project
```

---

Built as a side project out of curiosity about real-world JavaScript usage.
