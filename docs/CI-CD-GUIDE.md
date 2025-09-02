# CI/CD & Release Management Guide

This guide explains how to use the automated CI/CD system for managing releases, changelogs, and deployments in the LLM Profiles repository.

## 🚀 Overview

The CI/CD system provides:
- **Automated validation** of all profiles and schemas
- **Intelligent changelog generation** based on git commits and profile changes
- **Automated releases** with semantic versioning
- **Profile change detection** and documentation updates
- **GitHub Pages deployment** for documentation and examples

## 📋 Prerequisites

1. **Node.js 20+** and npm 9+
2. **Git** with proper remote configuration
3. **GitHub CLI** (optional, for automated releases)
4. **GitHub Actions** enabled for the repository

## 🔧 Setup

### 1. Repository Configuration

Ensure your repository has:
- GitHub Actions enabled
- GitHub Pages enabled (for deployment)
- Proper branch protection rules (recommended)

### 2. Environment Variables

The following secrets should be configured in your repository:
- `GITHUB_TOKEN` (automatically provided)
- Any additional API keys if needed

## 📝 Available Scripts

### Changelog Generation

```bash
# Generate changelog for the last 10 commits
npm run changelog

# Generate changelog since a specific reference
npm run changelog -- --since HEAD~20

# Generate changelog for a specific version
npm run changelog -- --version 1.1.0

# Preview without updating files
npm run changelog -- --no-update-file
```

### Release Management

```bash
# Check release status
npm run release:status

# Prepare a patch release (1.0.0 → 1.0.1)
npm run release:patch

# Prepare a minor release (1.0.0 → 1.1.0)
npm run release:minor

# Prepare a major release (1.0.0 → 2.0.0)
npm run release:major

# Prepare release with custom version
npm run release:prepare -- --version 2.0.0

# Dry run (see what would happen)
npm run release:prepare -- --type minor --dry-run
```

### Full CI Pipeline

```bash
# Run complete CI pipeline locally
npm run ci:full

# Individual steps
npm run validate          # Validate all profiles
npm run build:docs       # Build documentation
npm run build:md         # Convert markdown to HTML
npm run generate-api     # Generate API docs
npm run create-readmes   # Update profile READMEs
npm run generate-images  # Generate generic images
```

## 🔄 Workflow Types

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Release events

**What it does:**
- Validates all profiles and schemas
- Runs tests and CI validation
- Builds documentation and generates assets
- Deploys to GitHub Pages
- Creates automated releases

### 2. Automated Release (`auto-release.yml`)

**Triggers:**
- Manual workflow dispatch
- Git tag pushes

**What it does:**
- Prepares releases with semantic versioning
- Updates package.json and CHANGELOG.md
- Creates git tags
- Generates GitHub releases

### 3. Profile Change Detection (`profile-changes.yml`)

**Triggers:**
- Changes to profile files (`**/v*/index.jsonld`, `**/v*/*.schema.json`, etc.)

**What it does:**
- Detects which profiles have changed
- Validates changed profiles
- Updates documentation automatically
- Creates issues for schema changes
- Commits documentation updates

## 🎯 Release Workflow

### Automatic Release Process

1. **Make Changes**: Commit your profile updates
2. **Push to Main**: Changes trigger the CI/CD pipeline
3. **Validation**: All profiles are validated
4. **Build**: Documentation and assets are generated
5. **Deploy**: Updates are deployed to GitHub Pages
6. **Release**: New version is automatically created

### Manual Release Process

1. **Check Status**: `npm run release:status`
2. **Prepare Release**: `npm run release:minor` (or patch/major)
3. **Review Changes**: Check the generated changelog
4. **Push**: Changes are automatically committed and tagged
5. **GitHub Release**: Release is created on GitHub

### Release Types

- **Patch** (`1.0.0 → 1.0.1`): Bug fixes, minor updates
- **Minor** (`1.0.0 → 1.1.0`): New features, profile additions
- **Major** (`1.0.0 → 2.0.0`): Breaking changes, major updates

## 📊 Changelog Generation

The system automatically generates changelogs by:

1. **Analyzing Git Commits**: Parses commit messages for patterns
2. **Detecting Profile Changes**: Monitors file modifications
3. **Categorizing Changes**: Groups by type (Added, Changed, Fixed, etc.)
4. **Profile Grouping**: Organizes changes by profile type
5. **Auto-detection**: Identifies schema and example changes

### Commit Message Conventions

For best changelog generation, use descriptive commit messages:

```bash
# Good examples
git commit -m "feat: add new recipe profile v1"
git commit -m "fix: resolve validation issue in article schema"
git commit -m "docs: update howto profile examples"
git commit -m "feat: enhance localbusiness profile with new fields"

# Avoid
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

## 🔍 Profile Change Detection

The system automatically detects:

- **New Profiles**: Addition of new profile types
- **Schema Updates**: Changes to validation schemas
- **Example Additions**: New implementation examples
- **Training Data**: Updates to training datasets
- **Documentation**: README and API doc changes

### Automatic Actions

When profile changes are detected:

1. **Validation**: Changed profiles are validated
2. **Documentation**: READMEs are updated
3. **API Docs**: API documentation is regenerated
4. **Issues**: Schema changes create review issues
5. **Commits**: Documentation updates are committed

## 🚀 Deployment

### GitHub Pages

The system automatically deploys to GitHub Pages:

1. **Build**: All assets are generated in the `dist/` directory
2. **Upload**: Build artifacts are uploaded to GitHub Pages
3. **Deploy**: Site is deployed and available at your domain

### Deployment Triggers

- Push to `main` branch
- Successful validation and build
- Clean working directory

## 🛠️ Troubleshooting

### Common Issues

1. **Validation Failures**
   ```bash
   # Check specific validation errors
   npm run validate:json
   npm run validate:schemas
   ```

2. **Build Failures**
   ```bash
   # Clean and rebuild
   rm -rf dist/ node_modules/
   npm install
   npm run ci:full
   ```

3. **Release Issues**
   ```bash
   # Check release status
   npm run release:status
   
   # Dry run to see what would happen
   npm run release:prepare -- --dry-run
   ```

4. **Git Issues**
   ```bash
   # Check git status
   git status
   
   # Check remote configuration
   git remote -v
   ```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
DEBUG=* npm run changelog

# Check workflow logs in GitHub Actions
# Go to Actions tab → Select workflow → View logs
```

## 📈 Best Practices

### 1. Commit Strategy

- Use descriptive commit messages
- Group related changes in single commits
- Follow conventional commit format
- Test locally before pushing

### 2. Release Strategy

- Use semantic versioning
- Release frequently (smaller, manageable releases)
- Test releases in development first
- Document breaking changes clearly

### 3. Profile Development

- Validate schemas before committing
- Add examples for new features
- Update training data when profiles change
- Test endpoints after changes

### 4. Documentation

- Keep READMEs up to date
- Document breaking changes
- Provide migration guides for major versions
- Include usage examples

## 🔗 Integration

### External Tools

- **GitHub CLI**: For automated releases
- **Prettier**: Code formatting
- **AJV**: JSON Schema validation
- **Marked**: Markdown processing

### Webhooks

The system can be extended with webhooks for:
- Slack notifications
- Email alerts
- External validation services
- Custom deployment targets

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [JSON Schema Validation](https://json-schema.org/)

## 🤝 Contributing

To contribute to the CI/CD system:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues with the CI/CD system:

1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Create an issue with detailed information
4. Include error messages and logs

---

*This guide is automatically generated and updated with the CI/CD system.*
