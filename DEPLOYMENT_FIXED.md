# Fixed Build and Deployment Process for GitHub Pages

## Problem Summary

The original gh-pages branch contained a mix of source code and built files, which is incorrect for GitHub Pages deployment. This caused:
- Unnecessary bloat in the gh-pages branch
- Potential security issues (exposing source code)
- Slower website loading
- Confusion about what should be served

## What Was Fixed

### 1. Build Script (`scripts/build-docs.js`)
- **Before**: Created `web/dist` directory with mixed content
- **After**: Creates `dist` directory at root level with only website files
- **Exclusions**: Added filters to exclude `node_modules`, `.git`, `.github`, and `scripts` directories
- **Clean Build**: Ensures each build starts with a clean slate

### 2. Deployment Script (`scripts/deploy-gh-pages.js`)
- **Before**: Looked for files in `web/dist` and had incorrect paths
- **After**: Looks for files in root `dist` directory and copies them directly
- **Simplified**: Removed complex file copying logic, now just copies the entire dist directory

### 3. New Cleanup Script (`scripts/clean-gh-pages.js`)
- **Purpose**: Completely cleans the gh-pages branch before fresh deployment
- **Safety**: Only runs from main branch to prevent accidental cleanup
- **Placeholder**: Creates a simple README.md to indicate the branch is ready for deployment

## Current Repository Structure

### Main Branch (`main`)
- Contains all source code, profiles, schemas, and documentation
- Has build and deployment scripts
- Contains development files and configuration

### GH-Pages Branch (`gh-pages`)
- **ONLY** contains built website files
- **NO** source code, node_modules, or development files
- **INCLUDES**: HTML, CSS, JS, images, profiles (for API access), schemas, examples, tools
- **EXCLUDES**: Source code, build scripts, node_modules, .git files, package.json

## Build Process

1. **Clean Build**: `npm run build:docs -- --clean`
   - Removes existing dist directory
   - Copies only necessary files for website
   - Creates legacy redirects for backward compatibility
   - Generates `.nojekyll` file

2. **Deploy**: `npm run deploy`
   - Builds the website first
   - Switches to gh-pages branch
   - Removes all existing files
   - Copies built files from `dist` to root of gh-pages
   - Commits and pushes changes

3. **Cleanup** (if needed): `npm run clean:gh-pages`
   - Completely cleans gh-pages branch
   - Useful for troubleshooting or major changes

## File Count Comparison

- **Before**: gh-pages had thousands of files including node_modules
- **After**: gh-pages has ~371 files (only website content)

## Benefits of the Fix

1. **Clean Separation**: Clear distinction between source and built code
2. **Faster Loading**: Smaller, focused website files
3. **Security**: No source code exposure
4. **Maintainability**: Easier to understand what's deployed
5. **Automation**: Simple commands for build and deployment

## Usage

```bash
# Build the website
npm run build:docs

# Deploy to GitHub Pages
npm run deploy

# Clean gh-pages branch (if needed)
npm run clean:gh-pages

# Build with verbose output
npm run build:docs -- --verbose

# Build with clean start
npm run build:docs -- --clean
```

## Next Steps

1. **GitHub Pages Configuration**: Ensure repository settings point to gh-pages branch
2. **Domain Verification**: The `.well-known` directory is properly copied for domain verification
3. **CI/CD**: Consider automating deployment on pushes to main branch
4. **Monitoring**: Regularly check that gh-pages only contains built files

## Verification

To verify the fix worked:
- gh-pages branch should contain ~371 files
- No `node_modules` directory
- No source code files (`.js`, `.md` from scripts)
- Only website assets and API data files
- Website should load faster at `llmprofiles.org`
