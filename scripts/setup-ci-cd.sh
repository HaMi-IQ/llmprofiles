#!/bin/bash

# LLM Profiles CI/CD Setup Script
# This script helps set up the CI/CD system for your repository

set -e

echo "🚀 Setting up CI/CD system for LLM Profiles repository..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This directory is not a git repository. Please run this script from the root of your repository."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "CHANGELOG.md" ]; then
    print_error "This doesn't appear to be the LLM Profiles repository root. Please run this script from the repository root."
    exit 1
fi

print_status "Repository structure verified"

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null || echo "not_installed")
if [ "$NODE_VERSION" = "not_installed" ]; then
    print_error "Node.js is not installed. Please install Node.js 20+ and try again."
    exit 1
fi

NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
    print_warning "Node.js version $NODE_VERSION detected. Version 20+ is recommended."
else
    print_status "Node.js version $NODE_VERSION verified"
fi

# Check npm version
NPM_VERSION=$(npm --version 2>/dev/null || echo "not_installed")
if [ "$NPM_VERSION" = "not_installed" ]; then
    print_error "npm is not installed. Please install npm and try again."
    exit 1
fi

print_status "npm version $NPM_VERSION verified"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    print_status "GitHub CLI detected"
    GH_INSTALLED=true
else
    print_warning "GitHub CLI not found. It's recommended for automated releases."
    print_info "Install with: brew install gh (macOS) or apt install gh (Ubuntu)"
    GH_INSTALLED=false
fi

# Check git configuration
GIT_USER=$(git config user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config user.email 2>/dev/null || echo "")

if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
    print_warning "Git user configuration incomplete"
    print_info "Please configure git with:"
    print_info "  git config --global user.name 'Your Name'"
    print_info "  git config --global user.email 'your.email@example.com'"
else
    print_status "Git configuration verified: $GIT_USER <$GIT_EMAIL>"
fi

# Check remote origin
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    print_warning "No remote origin configured"
    print_info "Please add a remote with: git remote add origin <repository-url>"
else
    print_status "Remote origin configured: $REMOTE_URL"
fi

echo ""
print_info "Installing dependencies..."

# Install npm dependencies
npm ci

print_status "Dependencies installed"

echo ""
print_info "Testing CI/CD scripts..."

# Test changelog generation
echo "Testing changelog generation..."
npm run changelog -- --no-update-file --since HEAD~5 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "Changelog generation test passed"
else
    print_warning "Changelog generation test failed (this might be expected for new repositories)"
fi

# Test release status
echo "Testing release status check..."
npm run release:status > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_status "Release status check test passed"
else
    print_warning "Release status check test failed (this might be expected for new repositories)"
fi

echo ""
print_info "Setting up GitHub Actions..."

# Check if .github/workflows directory exists
if [ ! -d ".github/workflows" ]; then
    print_warning ".github/workflows directory not found"
    print_info "Please ensure the CI/CD workflow files are in place:"
    print_info "  - .github/workflows/ci-cd.yml"
    print_info "  - .github/workflows/auto-release.yml"
    print_info "  - .github/workflows/profile-changes.yml"
else
    print_status "GitHub Actions workflows directory found"
fi

echo ""
print_info "Verifying repository structure..."

# Check for required files
REQUIRED_FILES=(
    "package.json"
    "CHANGELOG.md"
    "README.md"
    "scripts/generate-changelog.js"
    "scripts/manage-release.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file found"
    else
        print_warning "$file not found"
    fi
done

echo ""
print_info "Checking for profile directories..."

# Count profile directories
PROFILE_COUNT=$(find . -maxdepth 2 -name "v1" -type d | wc -l)
print_status "Found $PROFILE_COUNT profile directories"

echo ""
print_info "CI/CD Setup Summary:"

if [ "$GH_INSTALLED" = true ]; then
    print_status "✅ GitHub CLI available for automated releases"
else
    print_warning "⚠️  GitHub CLI not available - manual release creation required"
fi

if [ -n "$GIT_USER" ] && [ -n "$GIT_EMAIL" ]; then
    print_status "✅ Git configuration complete"
else
    print_warning "⚠️  Git configuration incomplete"
fi

if [ -n "$REMOTE_URL" ]; then
    print_status "✅ Remote origin configured"
else
    print_warning "⚠️  Remote origin not configured"
fi

echo ""
print_info "Next steps:"

if [ "$GH_INSTALLED" = false ]; then
    echo "1. Install GitHub CLI: brew install gh (macOS) or apt install gh (Ubuntu)"
fi

if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
    echo "2. Configure git user: git config --global user.name 'Your Name'"
    echo "   git config --global user.email 'your.email@example.com'"
fi

if [ -z "$REMOTE_URL" ]; then
    echo "3. Add remote origin: git remote add origin <repository-url>"
fi

echo "4. Enable GitHub Actions in your repository settings"
echo "5. Enable GitHub Pages in your repository settings"
echo "6. Test the system: npm run release:status"

echo ""
print_info "Available commands:"
echo "  npm run changelog          # Generate changelog"
echo "  npm run release:status     # Check release status"
echo "  npm run release:patch      # Create patch release"
echo "  npm run release:minor      # Create minor release"
echo "  npm run release:major      # Create major release"
echo "  npm run ci:full            # Run full CI pipeline locally"

echo ""
print_status "CI/CD setup complete! 🎉"

# Check if there are any warnings
if [ "$GH_INSTALLED" = false ] || [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ] || [ -z "$REMOTE_URL" ]; then
    echo ""
    print_warning "Some configuration items need attention. Please review the warnings above."
    exit 1
else
    echo ""
    print_status "All checks passed! Your CI/CD system is ready to use."
    exit 0
fi
