#!/usr/bin/env bash
set -euo pipefail

# JavaScript Pareto Analysis Batch Processor
# This script analyzes multiple repositories and generates comprehensive reports

# Configuration
readonly REPOS_DIR="repos"
readonly STATS_DIR="docs/stats"
readonly CHARTS_DIR="docs/charts"
readonly REPORTS_DIR="docs/reports"

# Colors for output
readonly BLUE="$(tput setaf 4)"
readonly GREEN="$(tput setaf 2)"
readonly YELLOW="$(tput setaf 3)"
readonly RED="$(tput setaf 1)"
readonly NC="$(tput sgr0)"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create necessary directories
setup_directories() {
    log_info "Setting up directories..."
    mkdir -p "${STATS_DIR}" "${CHARTS_DIR}" "${REPORTS_DIR}"
}

# Analyze a single repository
analyze_repository() {
    local repo_path="$1"
    local repo_name
    repo_name=$(basename "${repo_path}")
    local stats_file="${STATS_DIR}/${repo_name}-stats.json"
    
    if [[ ! -d "${repo_path}" ]]; then
        log_warning "Repository not found: ${repo_path}"
        return 1
    fi
    
    log_info "Analyzing repository: ${repo_name}"
    log_info "Running: node src/core/analyzer.js --repo \"${repo_path}\" --output \"${stats_file}\""
    
    if node src/core/analyzer.js --repo "${repo_path}" --output "${stats_file}"; then
        log_success "Analysis complete: ${stats_file}"
        return 0
    else
        log_error "Analysis failed for: ${repo_name}"
        return 1
    fi
}

# Analyze all repositories in the repos directory
analyze_all_repositories() {
    log_info "Analyzing all repositories in ${REPOS_DIR}..."
    
    if [[ ! -d "${REPOS_DIR}" ]]; then
        log_warning "Repositories directory not found: ${REPOS_DIR}"
        return 1
    fi
    
    local success_count=0
    local total_count=0

    # Count total repositories first
    for repo_dir in "${REPOS_DIR}"/*; do
        if [[ -d "${repo_dir}" ]]; then
            total_count=$(( total_count + 1 ))
        fi
    done

    log_info "Found ${total_count} repositories to analyze"
    
    local current=0
    for repo_dir in "${REPOS_DIR}"/*; do
        if [[ -d "${repo_dir}" ]]; then
            current=$((current + 1))
            local repo_name=$(basename "${repo_dir}")
            log_info "[${current}/${total_count}] Processing: ${repo_name}"
            
            # Try to analyze, but continue even if it fails
            if analyze_repository "${repo_dir}"; then
                success_count=$((success_count + 1))
            else
                log_warning "Repository ${repo_name} failed, continuing..."
            fi
        fi
    done
    
    if [[ ${total_count} -eq 0 ]]; then
        log_warning "No repositories found in ${REPOS_DIR}/"
        return 1
    fi
    
    log_info "Analysis summary: ${success_count}/${total_count} repositories processed successfully"
}

# Generate Pareto analysis reports
generate_reports() {
    log_info "Generating Pareto analysis reports..."
    
    # Find all stats files
    local stats_files=()
    while IFS= read -r -d '' file; do
        stats_files+=("$file")
    done < <(find "${STATS_DIR}" -name "*.json" -type f -print0)
    
    if [[ ${#stats_files[@]} -eq 0 ]]; then
        log_warning "No statistics files found in ${STATS_DIR}"
        return 1
    fi
    
    log_info "Found ${#stats_files[@]} statistics files"
    
    # Generate comprehensive report
    local report_file="${REPORTS_DIR}/pareto-analysis.md"
    if node src/core/pareto-analyzer.js "${stats_files[@]}" --output "${report_file}"; then
        log_success "Pareto analysis report: ${report_file}"
    else
        log_error "Failed to generate Pareto analysis report"
    fi
    
    # Generate JSON report for programmatic access
    local json_report="${REPORTS_DIR}/pareto-analysis.json"
    if node src/core/pareto-analyzer.js "${stats_files[@]}" --json --output "${json_report}"; then
        log_success "JSON analysis report: ${json_report}"
    else
        log_error "Failed to generate JSON analysis report"
    fi
}

# Generate visualization charts
generate_charts() {
    log_info "Generating visualization charts..."
    
    # Find all stats files
    local stats_files=()
    while IFS= read -r -d '' file; do
        stats_files+=("$file")
    done < <(find "${STATS_DIR}" -name "*.json" -type f -print0)
    
    if [[ ${#stats_files[@]} -eq 0 ]]; then
        log_warning "No statistics files found for chart generation"
        return 1
    fi
    
    if node src/core/chart-generator.js "${stats_files[@]}" --output-dir "${CHARTS_DIR}"; then
        log_success "Charts generated in: ${CHARTS_DIR}"
    else
        log_error "Failed to generate charts"
    fi
}

# Show quick statistics from existing analysis files
show_stats() {
    log_info "Showing existing statistics..."
    
    # Find all stats files
    local stats_files=()
    while IFS= read -r -d '' file; do
        stats_files+=("$file")
    done < <(find "${STATS_DIR}" -name "*.json" -type f -print0)
    
    if [[ ${#stats_files[@]} -eq 0 ]]; then
        log_warning "No statistics files found in ${STATS_DIR}"
        log_info "Run './analyze.sh analyze <repo>' or './analyze.sh full' first"
        return 1
    fi
    
    log_info "Found ${#stats_files[@]} analysis files"
    
    # Show quick summary for each repository
    for stats_file in "${stats_files[@]}"; do
        local repo_name
        repo_name=$(basename "${stats_file}" -stats.json)
        log_info "Repository: ${repo_name}"
        
        # Extract key metrics using jq if available, otherwise basic text processing
        if command -v jq >/dev/null 2>&1; then
            local files_analyzed files_observed features_total loc_total
            files_analyzed=$(jq -r '.filesAnalyzed // "N/A"' "${stats_file}")
            features_observed=$(jq -r '.featuresObserved // "N/A"' "${stats_file}")
            features_total=$(jq -r '.featuresTotal // "N/A"' "${stats_file}")
            loc_total=$(jq -r '.locTotal // "N/A"' "${stats_file}")
            
            if [[ "${features_total}" != "N/A" && "${features_observed}" != "N/A" ]]; then
                local coverage
                coverage=$(echo "scale=1; ${features_observed} * 100 / ${features_total}" | bc 2>/dev/null || echo "N/A")
                echo "  Files: ${files_analyzed}, Features: ${features_observed}/${features_total} (${coverage}%), LOC: ${loc_total}"
            else
                echo "  Files: ${files_analyzed}, Features: ${features_observed}, LOC: ${loc_total}"
            fi
        else
            # Fallback without jq
            echo "  $(grep -o '"filesAnalyzed":[0-9]*' "${stats_file}" | cut -d: -f2 || echo "N/A") files analyzed"
        fi
        echo ""
    done
    
    # Show aggregate summary
    if command -v jq >/dev/null 2>&1; then
        log_info "Aggregate Summary:"
        local total_files total_loc total_repos
        total_files=$(jq -s 'map(.filesAnalyzed // 0) | add' "${stats_files[@]}")
        total_loc=$(jq -s 'map(.locTotal // 0) | add' "${stats_files[@]}")
        total_repos=${#stats_files[@]}
        
        echo "  Total repositories: ${total_repos}"
        echo "  Total files analyzed: ${total_files}"
        echo "  Total lines of code: ${total_loc}"
    fi
}

# Clean up generated files
clean_output() {
    log_info "Cleaning up generated files..."
    rm -rf "${STATS_DIR}" "${CHARTS_DIR}" "${REPORTS_DIR}"
    log_success "Cleanup complete"
}

# Show usage information
show_usage() {
    cat << EOF
JavaScript Pareto Analysis Tool

Usage: $0 [COMMAND] [OPTIONS]

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
    $0 analyze ./repos/my-project
    $0 generate-stats                # Generate stats for all repos in repos/
    $0 stats                         # Quick overview of analyzed repos
    $0 reports                       # Generate markdown/JSON reports
    $0 charts                        # Generate visualization charts
    $0 full                          # Analyze all repos in repos/
    $0 full ./repos/my-project       # Analyze specific repo
    $0 clean

Output:
    Statistics:  ${STATS_DIR}/
    Reports:     ${REPORTS_DIR}/
    Charts:      ${CHARTS_DIR}/
EOF
}

# Main function
main() {
    local command="${1:-help}"
    
    case "${command}" in
        "analyze")
            setup_directories
            if [[ -n "${2:-}" ]]; then
                analyze_repository "$2"
            else
                log_error "Repository path required. Usage: $0 analyze <repo_path>"
                exit 1
            fi
            ;;
        "generate-stats")
            setup_directories
            analyze_all_repositories
            ;;
        "stats")
            show_stats
            ;;
        "reports")
            setup_directories
            generate_reports
            ;;
        "charts")
            setup_directories
            generate_charts
            ;;
        "full")
            setup_directories
            if [[ -n "${2:-}" ]]; then
                # Analyze specific repository
                if analyze_repository "$2"; then
                    generate_reports
                    generate_charts
                    log_success "Complete analysis pipeline finished for: $2"
                else
                    log_error "Analysis failed, skipping reports and charts"
                    exit 1
                fi
            else
                # Analyze all repositories
                analyze_all_repositories
                generate_reports
                generate_charts
                log_success "Complete analysis pipeline finished!"
            fi
            log_info "Check the following directories for results:"
            log_info "  Statistics: ${STATS_DIR}/"
            log_info "  Reports:    ${REPORTS_DIR}/"
            log_info "  Charts:     ${CHARTS_DIR}/"
            ;;
        "clean")
            clean_output
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            log_error "Unknown command: ${command}"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"