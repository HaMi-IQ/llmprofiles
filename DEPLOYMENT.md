# Deployment Guide

## Overview

This repository uses **GitHub Actions** for automated deployment to the **gh-pages branch**. The manual deployment script has been disabled to prevent duplication issues.

## Deployment Workflow

### Automatic Deployment (Recommended)

1. **Push to main branch** - Triggers automatic CI/CD pipeline
2. **GitHub Actions builds** the website in the `dist/` directory
3. **GitHub Actions deploys** to the gh-pages branch from the `dist/` directory
4. **No manual intervention required**

### Manual Deployment (Emergency only)

If you need to manually deploy in an emergency:

1. **Build the website:**
   ```bash
   npm run ci:full
   ```

2. **Trigger manual workflow:**
   - Go to Actions tab in GitHub
   - Select "Unified CI/CD Pipeline"
   - Click "Run workflow"
   - Choose "deploy" mode
   - Click "Run workflow"

## Important Notes

### ❌ What NOT to do:
- **Don't run** `npm run deploy` (script disabled)
- **Don't manually copy** files to gh-pages branch
- **Don't manually push** to gh-pages branch

### ✅ What happens automatically:
- Website builds in `dist/` directory
- GitHub Actions deploys from `dist/` to gh-pages branch
- gh-pages branch gets updated with website files

## GitHub Pages Configuration

Ensure your repository settings are configured correctly:

1. **Settings > Pages**
2. **Source:** "Deploy from a branch"
3. **Branch:** "gh-pages"
4. **Folder:** "/ (root)"
5. **Save** the configuration

## Troubleshooting

### If deployment fails:
1. Check the Actions tab for error logs
2. Verify the build step completed successfully
3. Check that the `dist/` directory contains built files

### If you see duplicate content:
1. The gh-pages branch should only contain a README.md
2. If you see website files, run: `npm run clean:gh-pages`
3. This will reset the branch to clean state

## File Structure

```
gh-pages branch (managed by GitHub Actions):
├── website files (deployed from dist/)
├── .nojekyll
├── CNAME
└── other website assets

main branch:
├── dist/ (built website - created by build process)
├── .github/workflows/main.yml (deployment workflow)
└── scripts/ (build scripts)
```

## Benefits of This Approach

1. **No duplication** - Single source of truth in `dist/`
2. **Automated** - No manual deployment steps
3. **Consistent** - Same process every time
4. **Clean** - gh-pages branch stays minimal
5. **Modern** - Uses GitHub's recommended deployment method
