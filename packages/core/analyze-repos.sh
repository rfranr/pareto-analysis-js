#!/bin/bash

# analyze-repos.sh
# Script to clone GitHub repositories, analyze them, and clean up
# Usage: ./analyze-repos.sh <repos-list-file> [output-dir]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 <repos-list-file> [output-dir]

Arguments:
  repos-list-file    File containing list of GitHub repositories (one per line)
                     Format: owner/repo-name or full GitHub URLs
  output-dir         Directory to store analysis results (default: ./analysis-results)

Examples:
  $0 repos.txt
  $0 repos.txt ./my-analysis
  
Repository list file format:
  facebook/react
  microsoft/vscode
  https://github.com/nodejs/node
  vercel/next.js

Options:
  -h, --help        Show this help message
  -v, --verbose     Enable verbose output
  --keep-repos      Don't delete repository folders after analysis
  --shallow         Use shallow clone (depth=1, default)
  --deep            Use full clone (slower but complete history)
EOF
}

# Default values
REPOS_FILE=""
OUTPUT_DIR="./analysis-results"
VERBOSE=false
KEEP_REPOS=false
CLONE_DEPTH="--depth=1"
TEMP_DIR=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --keep-repos)
            KEEP_REPOS=true
            shift
            ;;
        --shallow)
            CLONE_DEPTH="--depth=1"
            shift
            ;;
        --deep)
            CLONE_DEPTH=""
            shift
            ;;
        -*)
            log_error "Unknown option $1"
            show_usage
            exit 1
            ;;
        *)
            if [[ -z "$REPOS_FILE" ]]; then
                REPOS_FILE="$1"
            elif [[ -z "$OUTPUT_DIR" || "$OUTPUT_DIR" == "./analysis-results" ]]; then
                OUTPUT_DIR="$1"
            else
                log_error "Too many arguments"
                show_usage
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate required arguments
if [[ -z "$REPOS_FILE" ]]; then
    log_error "Repository list file is required"
    show_usage
    exit 1
fi

if [[ ! -f "$REPOS_FILE" ]]; then
    log_error "Repository list file not found: $REPOS_FILE"
    exit 1
fi

# Verbose logging function
verbose_log() {
    if [[ "$VERBOSE" == true ]]; then
        log_info "$1"
    fi
}

# Function to normalize repository URL
normalize_repo_url() {
    local repo="$1"
    
    # If it already starts with https://github.com, use as is
    if [[ "$repo" =~ ^https://github\.com/ ]]; then
        echo "$repo"
    # If it's in owner/repo format, add GitHub URL
    elif [[ "$repo" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
        echo "https://github.com/$repo"
    else
        log_error "Invalid repository format: $repo"
        return 1
    fi
}

# Function to extract repository name from URL
extract_repo_name() {
    local url="$1"
    basename "$url" .git
}

# Function to extract owner/repo from URL
extract_owner_repo() {
    local url="$1"
    echo "$url" | sed -E 's|https://github\.com/([^/]+)/([^/]+)(\.git)?/?$|\1/\2|'
}

# Function to clone repository
clone_repository() {
    local repo_url="$1"
    local clone_dir="$2"
    
    verbose_log "Cloning $repo_url with options: $CLONE_DEPTH"
    
    if git clone $CLONE_DEPTH --single-branch "$repo_url" "$clone_dir" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to analyze repository
analyze_repository() {
    local repo_dir="$1"
    local output_file="$2"
    local repo_name="$3"
    
    verbose_log "Analyzing repository in $repo_dir name: $repo_name"
    
    # Run the analyzer
    if node src/analyzer.js --repo "$repo_dir" --repository-name "$repo_name" --output "$output_file" >/dev/null 2>&1; then
        # Add repository metadata to the analysis file
        if [[ -f "$output_file" ]]; then
            # Create a temporary file with metadata
            local temp_file="${output_file}.tmp"
            jq --arg repo "$repo_name" --arg analyzed_at "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)" \
               '. + {repositoryUrl: $repo, analyzedAt: $analyzed_at}' \
               "$output_file" > "$temp_file" && mv "$temp_file" "$output_file"
        fi
        return 0
    else
        return 1
    fi
}

# Function to cleanup repository directory
cleanup_repo() {
    local repo_dir="$1"
    
    if [[ "$KEEP_REPOS" == false && -d "$repo_dir" ]]; then
        verbose_log "Cleaning up $repo_dir"
        rm -rf "$repo_dir"
    fi
}

# Function to cleanup on exit
cleanup_on_exit() {
    if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
        log_info "Cleaning up temporary directory: $TEMP_DIR"
        rm -rf "$TEMP_DIR"
    fi
}

# Set up cleanup on exit
trap cleanup_on_exit EXIT

# Main execution
main() {
    log_info "Starting repository analysis batch job"
    log_info "Repository list: $REPOS_FILE"
    log_info "Output directory: $OUTPUT_DIR"
    log_info "Clone depth: ${CLONE_DEPTH:-"full"}"
    log_info "Keep repositories: $KEEP_REPOS"
    
    # Create output directory
    mkdir -p "$OUTPUT_DIR"
    
    # Create temporary directory for cloning
    TEMP_DIR=$(mktemp -d -t analyze-repos-XXXXXX)
    log_info "Using temporary directory: $TEMP_DIR"
    
    # Statistics
    local total_repos=0
    local successful_clones=0
    local successful_analyses=0
    local failed_repos=()
    
    # Read repositories from file
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        
        # Trim whitespace
        local repo=$(echo "$line" | xargs)
        [[ -z "$repo" ]] && continue
        
        total_repos=$((total_repos + 1))
        
        log_info "Processing repository $total_repos: $repo"
        
        # Normalize repository URL
        local repo_url
        if ! repo_url=$(normalize_repo_url "$repo"); then
            failed_repos+=("$repo (invalid format)")
            continue
        fi
        
        # Extract repository information
        local repo_name=$(extract_repo_name "$repo_url")
        local owner_repo=$(extract_owner_repo "$repo_url")
        local clone_dir="$TEMP_DIR/$repo_name"
        local output_file="$OUTPUT_DIR/${owner_repo//\//_}_analysis.json"
        
        verbose_log "Repository URL: $repo_url"
        verbose_log "Clone directory: $clone_dir"
        verbose_log "Output file: $output_file"
        
        # Clone repository
        if clone_repository "$repo_url" "$clone_dir"; then
            log_success "Successfully cloned: $owner_repo"
            successful_clones=$((successful_clones + 1))
            
            # Analyze repository
            if analyze_repository "$clone_dir" "$output_file" "$owner_repo"; then
                log_success "Successfully analyzed: $owner_repo"
                successful_analyses=$((successful_analyses + 1))
            else
                log_error "Failed to analyze: $owner_repo"
                failed_repos+=("$owner_repo (analysis failed)")
            fi
        else
            log_error "Failed to clone: $owner_repo"
            failed_repos+=("$owner_repo (clone failed)")
        fi
        
        # Cleanup repository directory
        cleanup_repo "$clone_dir"
        
        # Small delay to be nice to GitHub
        sleep 1
        
    done < "$REPOS_FILE"
    
    # Print summary
    echo
    log_info "=== ANALYSIS SUMMARY ==="
    log_info "Total repositories processed: $total_repos"
    log_success "Successful clones: $successful_clones"
    log_success "Successful analyses: $successful_analyses"
    
    if [[ ${#failed_repos[@]} -gt 0 ]]; then
        log_warning "Failed repositories: ${#failed_repos[@]}"
        for failed in "${failed_repos[@]}"; do
            log_warning "  - $failed"
        done
    fi
    
    if [[ $successful_analyses -gt 0 ]]; then
        log_info "Analysis results saved in: $OUTPUT_DIR"
        log_info "Files generated:"
        find "$OUTPUT_DIR" -name "*_analysis.json" -type f | while read -r file; do
            local size=$(du -h "$file" | cut -f1)
            log_info "  - $(basename "$file") ($size)"
        done
    fi
    
    # Generate summary report
    local summary_file="$OUTPUT_DIR/batch_summary.json"
    cat > "$summary_file" << EOF
{
  "batchAnalysis": {
    "startedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "completedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "totalRepositories": $total_repos,
    "successfulClones": $successful_clones,
    "successfulAnalyses": $successful_analyses,
    "failedRepositories": $(printf '%s\n' "${failed_repos[@]}" | jq -R . | jq -s .),
    "outputDirectory": "$OUTPUT_DIR",
    "cloneDepth": "${CLONE_DEPTH:-"full"}",
    "repositoriesKept": $KEEP_REPOS
  }
}
EOF
    
    log_success "Batch analysis completed!"
    log_info "Summary saved to: $summary_file"
    
    # Exit with appropriate code
    if [[ $successful_analyses -eq $total_repos ]]; then
        exit 0
    elif [[ $successful_analyses -gt 0 ]]; then
        exit 2  # Partial success
    else
        exit 1  # Complete failure
    fi
}

# Check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command -v git >/dev/null 2>&1; then
        missing_deps+=("git")
    fi
    
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("node")
    fi
    
    if ! command -v jq >/dev/null 2>&1; then
        missing_deps+=("jq")
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and try again"
        exit 1
    fi
}

# Check if analyzer exists
if [[ ! -f "src/analyzer.js" ]]; then
    log_error "Analyzer script not found: src/analyzer.js"
    log_info "Please run this script from the project root directory"
    exit 1
fi

# Check dependencies
check_dependencies

# Run main function
main