# GitHub Composite Actions

This directory contains reusable composite actions that eliminate duplication across workflows and provide a more maintainable CI/CD pipeline.

## Available Actions

### 1. Setup (`./setup/action.yml`)
**Purpose**: Common environment setup tasks
**Inputs**:
- `node-version`: Node.js version (default: '20')
- `fetch-depth`: Git fetch depth (default: '0')
- `cache-npm`: Whether to cache npm dependencies (default: 'true')

**Usage**:
```yaml
- uses: ./.github/actions/setup
  with:
    node-version: '18'
    fetch-depth: 0
```

### 2. Validate (`./validate/action.yml`)
**Purpose**: Comprehensive validation of LLM profiles
**Inputs**:
- `validate-json`: Run JSON validation (default: 'true')
- `validate-ajv`: Run AJV schema validation (default: 'true')
- `test-well-known`: Test well-known endpoints (default: 'true')
- `run-tests`: Run npm tests (default: 'false')

**Usage**:
```yaml
- uses: ./.github/actions/validate
  with:
    validate-json: 'true'
    validate-ajv: 'true'
    test-well-known: 'true'
    run-tests: 'true'
```

### 3. Build (`./build/action.yml`)
**Purpose**: Build documentation and generate artifacts
**Inputs**:
- `build-docs`: Build documentation (default: 'true')
- `build-md`: Convert markdown to HTML (default: 'true')
- `generate-api`: Generate API documentation (default: 'true')
- `create-readmes`: Create profile READMEs (default: 'true')
- `generate-images`: Generate generic images (default: 'true')
- `upload-artifacts`: Upload build artifacts (default: 'false')
- `artifact-name`: Artifact name (default: 'build-output')
- `artifact-path`: Artifact path (default: 'web/dist/')

**Usage**:
```yaml
- uses: ./.github/actions/build
  with:
    build-docs: 'true'
    generate-api: 'true'
    upload-artifacts: 'true'
```

### 4. Deploy (`./deploy/action.yml`)
**Purpose**: Deploy to GitHub Pages
**Inputs**:
- `source-path`: Source files path (default: 'web/dist/')
- `download-artifacts`: Download artifacts first (default: 'false')
- `artifact-name`: Artifact name (default: 'build-output')
- `artifact-path`: Artifact download path (default: 'dist/')
- `environment-name`: GitHub Pages environment (default: 'github-pages')

**Usage**:
```yaml
- uses: ./.github/actions/deploy
  with:
    source-path: 'dist/'
    download-artifacts: 'true'
    artifact-name: 'build-output'
```

## Benefits

1. **Eliminates Duplication**: Common tasks are defined once and reused
2. **Easier Maintenance**: Changes to common logic only need to be made in one place
3. **Consistent Behavior**: All workflows use the same implementation
4. **Better Testing**: Actions can be tested independently
5. **Reusability**: Actions can be used across different workflows and repositories

## Migration Guide

To migrate existing workflows:

1. Replace setup steps with `./.github/actions/setup`
2. Replace validation steps with `./.github/actions/validate`
3. Replace build steps with `./.github/actions/build`
4. Replace deployment steps with `./.github/actions/deploy`

## Example Migration

**Before** (duplicated setup):
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
    
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    
- name: Install dependencies
  run: npm ci
```

**After** (using composite action):
```yaml
- uses: ./.github/actions/setup
  with:
    fetch-depth: 0
```

This reduces the workflow from 15 lines to just 3 lines while maintaining the same functionality.
