#!/bin/bash

# Test script for the Pareto analysis core package
# Usage: ./test.sh [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
RUN_LINT=false
RUN_COVERAGE=false
WATCH_MODE=false
SPECIFIC_TEST=""
VERBOSE=false

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Show this help message"
    echo "  -l, --lint          Run linting before tests"
    echo "  -c, --coverage      Run tests with coverage report"
    echo "  -w, --watch         Run tests in watch mode"
    echo "  -t, --test <name>   Run specific test file or pattern"
    echo "  -v, --verbose       Verbose output"
    echo ""
    echo "Examples:"
    echo "  $0                           # Run all tests"
    echo "  $0 --coverage               # Run tests with coverage"
    echo "  $0 --test analyzer          # Run only analyzer tests"
    echo "  $0 --watch                  # Run tests in watch mode"
    echo "  $0 --lint --coverage        # Run lint and tests with coverage"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -l|--lint)
            RUN_LINT=true
            shift
            ;;
        -c|--coverage)
            RUN_COVERAGE=true
            shift
            ;;
        -w|--watch)
            WATCH_MODE=true
            shift
            ;;
        -t|--test)
            SPECIFIC_TEST="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the core package directory."
    exit 1
fi

# Check if dependencies are installed
if [[ ! -d "node_modules" ]]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Run linting if requested
if [[ "$RUN_LINT" == "true" ]]; then
    print_status "Running linter..."
    if command -v eslint >/dev/null 2>&1; then
        npx eslint src/ || {
            print_warning "Linting found issues but continuing with tests..."
        }
    else
        print_warning "ESLint not found, skipping linting"
    fi
fi

# Prepare Jest command
JEST_CMD="npx jest"

# Add options based on flags
if [[ "$WATCH_MODE" == "true" ]]; then
    JEST_CMD="$JEST_CMD --watch"
elif [[ "$RUN_COVERAGE" == "true" ]]; then
    JEST_CMD="$JEST_CMD --coverage"
fi

if [[ "$VERBOSE" == "true" ]]; then
    JEST_CMD="$JEST_CMD --verbose"
fi

if [[ -n "$SPECIFIC_TEST" ]]; then
    JEST_CMD="$JEST_CMD --testNamePattern=$SPECIFIC_TEST"
fi

# Print test configuration
print_status "Test Configuration:"
echo "  - Lint: $RUN_LINT"
echo "  - Coverage: $RUN_COVERAGE"
echo "  - Watch Mode: $WATCH_MODE"
echo "  - Specific Test: ${SPECIFIC_TEST:-'All tests'}"
echo "  - Verbose: $VERBOSE"
echo ""

# Run tests
print_status "Running tests..."
echo "Command: $JEST_CMD"
echo ""

if eval $JEST_CMD; then
    print_success "All tests passed!"
    
    # Show coverage summary if coverage was run
    if [[ "$RUN_COVERAGE" == "true" ]]; then
        echo ""
        print_status "Coverage report generated in: coverage/"
        if command -v open >/dev/null 2>&1; then
            echo "To view coverage report: open coverage/lcov-report/index.html"
        elif command -v xdg-open >/dev/null 2>&1; then
            echo "To view coverage report: xdg-open coverage/lcov-report/index.html"
        fi
    fi
else
    print_error "Tests failed!"
    exit 1
fi

# Performance tips
if [[ "$WATCH_MODE" == "false" ]]; then
    echo ""
    print_status "Pro tips:"
    echo "  - Use '--watch' for development mode"
    echo "  - Use '--test <pattern>' to run specific tests"
    echo "  - Use '--coverage' to check test coverage"
    echo "  - Check coverage/lcov-report/index.html for detailed coverage"
fi