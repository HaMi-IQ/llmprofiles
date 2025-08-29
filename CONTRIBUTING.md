# Contributing to llmprofiles

Thank you for your interest in contributing to llmprofiles! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Profile Development](#profile-development)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git
- Basic understanding of JSON-LD, SKOS, and SHACL
- Familiarity with JSON Schema

### Quick Start

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/llmprofiles.git
   cd llmprofiles
   ```

2. **Install dependencies**
   ```bash
   npm install -D ajv ajv-formats jsonlint
   ```

3. **Run validation**
   ```bash
   npx jsonlint -q **/*.json **/*.jsonld
   ```

## Development Setup

### Project Structure

```
llmprofiles/
├── {profile}/              # Profile directories
│   └── v1/                 # Version directories
│       ├── index.jsonld    # Profile definition
│       └── output.schema.json # Validation schema
├── docs/                   # Documentation
├── .github/                # GitHub workflows and templates
├── index.json              # Profile registry
└── README.md               # Project documentation
```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-profile
   ```

2. **Make your changes**
   - Add new profiles or update existing ones
   - Update documentation
   - Add tests if applicable

3. **Validate your changes**
   ```bash
   npm run validate
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new profile for X"
   ```

5. **Push and create a PR**
   ```bash
   git push origin feature/new-profile
   ```

## Profile Development

### Creating a New Profile

1. **Create the profile directory structure**
   ```bash
   mkdir -p {profile-name}/v1
   ```

2. **Create the profile definition** (`index.jsonld`)
   ```json
   {
     "@context": {
       "schema": "https://schema.org/",
       "skos": "http://www.w3.org/2004/02/skos/core#",
       "sh": "http://www.w3.org/ns/shacl#",
       "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
       "x": "https://llmprofiles.org/vocab#"
     },
     "@id": "https://llmprofiles.org/{profile-name}/v1",
     "rdfs:seeAlso": "https://schema.org/{SchemaType}",
     "skos:prefLabel": "Profile Name",
     "skos:definition": "Clear description of what this profile covers",
     "skos:scopeNote": "Usage scope and limitations",
     "skos:example": "Example usage scenario",
     "x:dos": [
       "Best practice 1",
       "Best practice 2"
     ],
     "x:donts": [
       "Anti-pattern 1",
       "Anti-pattern 2"
     ],
     "sh:shapesGraph": {
       "@type": "sh:NodeShape",
       "sh:targetClass": "schema:{SchemaType}",
       "sh:property": [
         {
           "sh:path": "schema:mainEntity",
           "sh:minCount": 1
         }
       ]
     },
     "x:outputSchema": "https://llmprofiles.org/{profile-name}/v1/output.schema.json",
     "x:profileVersion": "1.0.0",
     "x:created": "2025-08-28"
   }
   ```

3. **Create the output schema** (`output.schema.json`)
   ```json
   {
     "$schema": "https://json-schema.org/draft/2020-12/schema",
     "$id": "https://llmprofiles.org/{profile-name}/v1/output.schema.json",
     "title": "Profile Extracted Content",
     "type": "object",
     "properties": {
       "property1": {
         "type": "string",
         "description": "Description of the property"
       }
     },
     "required": ["property1"],
     "additionalProperties": false
   }
   ```

4. **Update the registry** (`index.json`)
   ```json
   {
     "profiles": {
       "ExistingProfile": "https://llmprofiles.org/existing-profile/v1",
       "NewProfile": "https://llmprofiles.org/new-profile/v1"
     }
   }
   ```

### Profile Guidelines

#### Content Guidelines

- **Keep profiles ≤5KB** in total size
- **Use concise SKOS definitions** that are clear and specific
- **Include minimal SHACL constraints** - only essential validation rules
- **Provide practical examples** that developers can understand
- **Follow established naming conventions** for consistency

#### Schema Guidelines

- **Use JSON Schema Draft 2020-12** for output schemas
- **Include proper descriptions** for all properties
- **Set appropriate validation rules** (minLength, maxLength, etc.)
- **Use consistent property naming** across profiles
- **Include required fields** in the `required` array

#### Best Practices

- **Reference existing Schema.org types** when possible
- **Provide clear scope notes** to avoid misuse
- **Include both positive and negative examples**
- **Use semantic web standards** (SKOS, SHACL, RDFS)
- **Version profiles appropriately** for breaking changes

### Updating Existing Profiles

1. **Create a new version directory** if making breaking changes
   ```bash
   mkdir -p {profile-name}/v2
   ```

2. **Update version numbers** in both files
   - `x:profileVersion` in `index.jsonld`
   - `$id` in `output.schema.json`

3. **Update the registry** to point to the new version
   ```json
   {
     "profiles": {
       "ProfileName": "https://llmprofiles.org/profile-name/v2"
     }
   }
   ```

4. **Document changes** in `CHANGELOG.md`

## Code Standards

### JSON-LD Standards

- **Use proper context definitions** with all required namespaces
- **Follow JSON-LD syntax** strictly
- **Use meaningful property names** and descriptions
- **Include proper `@id` values** for all resources

### JSON Schema Standards

- **Use consistent formatting** and indentation
- **Include comprehensive property descriptions**
- **Use appropriate data types** and validation rules
- **Follow JSON Schema best practices**

### Documentation Standards

- **Write clear, concise descriptions**
- **Include practical examples**
- **Use consistent terminology**
- **Update all related documentation**

## Testing

### Validation Testing

```bash
# Validate all JSON files
npx jsonlint -q **/*.json **/*.jsonld

# Validate specific schema
node -e "
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

const ajv = new Ajv({strict: false, allErrors: true});
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('{profile}/v1/output.schema.json', 'utf8'));
ajv.compile(schema);
console.log('Schema validation passed');
"
```

### Manual Testing

1. **Test profile accessibility**
   ```bash
   curl https://llmprofiles.org/{profile}/v1
   curl https://llmprofiles.org/{profile}/v1/output.schema.json
   ```

2. **Test schema validation** with sample data
3. **Verify JSON-LD parsing** with online validators
4. **Check profile consistency** with existing profiles

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm run validate
   ```

2. **Update documentation**
   - Update README.md if needed
   - Add examples to docs/examples.md
   - Update API documentation if applicable

3. **Check for breaking changes**
   - If making breaking changes, create new version
   - Update CHANGELOG.md appropriately

### PR Guidelines

1. **Use descriptive titles** that explain the change
2. **Include detailed descriptions** of what was changed and why
3. **Reference related issues** using `#issue-number`
4. **Add screenshots or examples** for UI changes
5. **Ensure CI/CD passes** before requesting review

### PR Template

```markdown
## Summary

Brief description of the changes made.

## Changes Made

- [ ] Added new profile for X
- [ ] Updated existing profile Y
- [ ] Fixed issue with Z
- [ ] Updated documentation

## Testing

- [ ] All JSON files validate
- [ ] Schema validation passes
- [ ] Manual testing completed
- [ ] Documentation updated

## Breaking Changes

- [ ] No breaking changes
- [ ] Breaking changes documented in CHANGELOG.md

## Related Issues

Closes #123
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes to profiles or schemas
- **MINOR**: New features or profiles added
- **PATCH**: Bug fixes and documentation updates

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is updated
- [ ] Version numbers are bumped
- [ ] Git tag is created
- [ ] GitHub release is published

### Creating a Release

1. **Update version numbers**
   ```bash
   # Update profile versions
   # Update CHANGELOG.md
   # Update README.md if needed
   ```

2. **Create and push tag**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **Create GitHub release**
   - Go to GitHub releases page
   - Create new release from tag
   - Add release notes
   - Publish release

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions and general discussion
- **Pull Requests**: Use PRs for code changes and improvements

### Getting Help

- **Documentation**: Check the [docs/](docs/) directory
- **Examples**: See [docs/examples.md](docs/examples.md)
- **API Reference**: See [docs/api.md](docs/api.md)
- **Issues**: Search existing issues before creating new ones

### Recognition

Contributors will be recognized in:
- [CHANGELOG.md](CHANGELOG.md) for significant contributions
- GitHub contributors list
- Release notes for major releases

## Questions?

If you have questions about contributing:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/HaMi-IQ/llmprofiles/issues)
3. Start a [discussion](https://github.com/HaMi-IQ/llmprofiles/discussions)
4. Contact the maintainers

Thank you for contributing to llmprofiles! 🚀
