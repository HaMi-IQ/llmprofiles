# ES Module Support Guide

The `@llmprofiles/core` package now supports both CommonJS and ES modules, allowing you to import individual profiles without loading the entire package.

## Installation

```bash
npm install @llmprofiles/core
```

## ES Module Usage

### Import Individual Profiles

You can now import individual profiles directly:

```javascript
// Import specific profiles
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { jobpostingProfile } from '@llmprofiles/core/profiles/jobposting';
import { productofferProfile } from '@llmprofiles/core/profiles/productoffer';

// Use profile data
console.log(articleProfile.type); // "Article"
console.log(articleProfile.required); // Required fields
console.log(articleProfile.googleRichResults); // Google Rich Results fields
```

### Import Builders and Utilities

```javascript
// Import builders and utilities
import { ArticleBuilder, JobPostingBuilder, MODES } from '@llmprofiles/core';

// Use builders
const article = new ArticleBuilder(MODES.STRICT_SEO)
  .headline('My Article')
  .author('John Doe')
  .build();
```

### Import Everything

```javascript
// Import everything (same as before)
import { 
  ArticleBuilder, 
  getProfile, 
  listProfiles,
  articleProfile 
} from '@llmprofiles/core';
```

## Available Individual Profile Imports

| Profile | Import Path |
|---------|-------------|
| Article | `@llmprofiles/core/profiles/article` |
| JobPosting | `@llmprofiles/core/profiles/jobposting` |
| LocalBusiness | `@llmprofiles/core/profiles/localbusiness` |
| Product | `@llmprofiles/core/profiles/productoffer` |
| Review | `@llmprofiles/core/profiles/review` |
| Book | `@llmprofiles/core/profiles/book` |
| Course | `@llmprofiles/core/profiles/course` |
| Dataset | `@llmprofiles/core/profiles/dataset` |
| HowTo | `@llmprofiles/core/profiles/howto` |
| Recipe | `@llmprofiles/core/profiles/recipe` |
| VideoObject | `@llmprofiles/core/profiles/videoobject` |
| Event | `@llmprofiles/core/profiles/event` |
| FAQPage | `@llmprofiles/core/profiles/faqpage` |
| QAPage | `@llmprofiles/core/profiles/qapage` |
| SoftwareApplication | `@llmprofiles/core/profiles/softwareapplication` |

## CommonJS Compatibility

The package maintains full backward compatibility with CommonJS:

```javascript
// CommonJS still works
const { ArticleBuilder, MODES } = require('@llmprofiles/core');

const article = new ArticleBuilder(MODES.STRICT_SEO)
  .headline('My Article')
  .build();
```

## Tree Shaking Benefits

With ES modules, bundlers can perform tree shaking to include only the profiles you actually use:

```javascript
// Only the Article profile will be included in your bundle
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { ArticleBuilder } from '@llmprofiles/core';
```

## TypeScript Support

TypeScript definitions are available for all individual profiles:

```typescript
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { ArticleBuilder } from '@llmprofiles/core';

// Full type safety
const article: ProfileDefinition = articleProfile;
const builder = new ArticleBuilder();
```

## Examples

### Basic Usage

```javascript
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { ArticleBuilder, MODES } from '@llmprofiles/core';

// Check profile requirements
console.log('Required fields:', Object.keys(articleProfile.required));

// Build structured data
const article = new ArticleBuilder(MODES.STRICT_SEO)
  .headline('ES Modules with LLM Profiles')
  .author('Jane Developer')
  .datePublished('2024-01-15T10:00:00Z')
  .build();
```

### Multiple Profiles

```javascript
import { 
  articleProfile,
  jobpostingProfile,
  productofferProfile 
} from '@llmprofiles/core/profiles/article';
import { 
  ArticleBuilder, 
  JobPostingBuilder, 
  ProductBuilder 
} from '@llmprofiles/core';

// Work with multiple profile types
const profiles = [articleProfile, jobpostingProfile, productofferProfile];
profiles.forEach(profile => {
  console.log(`${profile.type}: ${profile.description}`);
});
```

### Validation with Individual Profiles

```javascript
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { validateStructuredData } from '@llmprofiles/core';

const data = {
  '@type': 'Article',
  'headline': 'Test Article',
  'author': 'John Doe'
};

const result = validateStructuredData(data, 'Article');
console.log('Valid:', result.valid);
console.log('Google Rich Results compliant:', result.googleRichResults.compliant);
```

## Migration from CommonJS

If you're migrating from CommonJS to ES modules:

### Before (CommonJS)
```javascript
const { getProfile } = require('@llmprofiles/core');
const articleProfile = getProfile('Article');
```

### After (ES Modules)
```javascript
import { articleProfile } from '@llmprofiles/core/profiles/article';
// or
import { getProfile } from '@llmprofiles/core';
const articleProfile = getProfile('Article');
```

## Package.json Configuration

To use ES modules in your project, add to your `package.json`:

```json
{
  "type": "module"
}
```

Or use `.mjs` file extensions for individual files.

## Browser Support

ES modules are supported in all modern browsers. For older browsers, use a bundler like Webpack, Rollup, or Vite.

## Performance Benefits

- **Smaller bundle sizes**: Only import what you need
- **Faster loading**: Individual profile imports load faster
- **Better caching**: Individual profiles can be cached separately
- **Tree shaking**: Unused code is eliminated during bundling
