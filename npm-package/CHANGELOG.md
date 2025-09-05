## [1.0.1-alpha.7] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.7

## [1.0.1-alpha.6] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.6

## [1.0.1-alpha.5] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.5

## [1.0.1-alpha.4] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.4

## [1.0.1-alpha.3] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.3

## [1.0.1-alpha.2] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.2

## [1.0.1-alpha.1] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.1

## [1.0.1-alpha.0] - 2025-09-05

### Changes
- Version bump to 1.0.1-alpha.0

# Changelog

All notable changes to the `@llmprofiles/core` NPM package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of `@llmprofiles/core` NPM package
- 15 core profile definitions optimized for minimal bundle size
- Builder pattern classes for easy structured data creation
- Comprehensive validation with Google Rich Results and LLM optimization checks
- **Comprehensive input sanitization for security**
  - HTML tag removal and XSS protection
  - URL validation and dangerous protocol blocking
  - Email, phone, date, and number validation
  - Language code and SKU format validation
  - Security warnings in validation results
- TypeScript support with full type definitions
- Minimal dependencies (only AJV for validation)

### Profiles Included
- **Business**: JobPosting, LocalBusiness, ProductOffer, Review
- **Content**: Article, Book, Course, Dataset, HowTo, Recipe, VideoObject
- **Interaction**: Event, FAQPage, QAPage
- **Technology**: SoftwareApplication

### Features
- 🎯 **Minimal Bundle Size**: ~70KB with maximum utility
- 🏗️ **Builder Pattern**: Easy construction of structured data
- ✅ **Comprehensive Validation**: Schema validation + Google Rich Results + LLM optimization checks
- 📱 **TypeScript Support**: Full type definitions included
- 🚀 **Zero Heavy Dependencies**: Only AJV for validation
- 🎨 **Developer Experience**: Clear error messages and warnings

### Usage Examples
```javascript
const { ArticleBuilder, validateStructuredData } = require('@llmprofiles/core');

// Build structured data
const article = new ArticleBuilder()
  .headline('How to Use LLMProfiles')
  .author('Jane Smith')
  .datePublished('2024-01-15')
  .build();

// Validate with comprehensive checks
const result = validateStructuredData(article, 'Article');
console.log(result.valid); // true
console.log(result.googleRichResults.compliant); // true
console.log(result.llmOptimization.optimized); // true
```

### Documentation
- [NPM Package](https://www.npmjs.com/package/@llmprofiles/core)
- [Full Documentation](https://llmprofiles.org)
- [GitHub Repository](https://github.com/HaMi-IQ/llmprofiles)

---

**Note**: This package is automatically generated and synchronized from the main LLMProfiles repository. Version numbers match the main repository for consistency.

