/**
 * @fileoverview @llmprofiles/core - Minimal Schema.org profiles for LLMs and Rich Results
 * 
 * This is the main ES Module entry point for the @llmprofiles/core package, providing:
 * - Schema.org profile definitions optimized for LLMs and search engines
 * - Builder classes for creating structured data objects
 * - Validation utilities with enhanced error reporting
 * - Field metadata and autocomplete support
 * - Input sanitization for security
 * - Multiple output modes (Strict SEO, Split Channels, Standards Header)
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * @see {@link https://llmprofiles.org} Official documentation
 * @see {@link https://github.com/HaMi-IQ/llmprofiles} Source code
 * 
 * @example
 * // Basic usage with Article builder (ES Module)
 * import { ArticleBuilder, MODES } from '@llmprofiles/core';
 * 
 * const article = new ArticleBuilder(MODES.STRICT_SEO)
 *   .headline('Breaking News: Important Update')
 *   .author('John Doe', 'https://example.com/author')
 *   .datePublished('2024-01-01T00:00:00Z')
 *   .publisher('News Corp', 'https://example.com', 'https://example.com/logo.png')
 *   .build();
 * 
 * @example
 * // Using the simplified factory function (ES Module)
 * import { createBuilder } from '@llmprofiles/core';
 * 
 * const jobPosting = createBuilder('JobPosting', { mode: 'strict-seo' })
 *   .title('Software Engineer')
 *   .hiringOrganization('Tech Corp', 'https://techcorp.com')
 *   .jobLocation('San Francisco, CA')
 *   .datePosted('2024-01-01')
 *   .build();
 * 
 * @example
 * // Validation with detailed error reporting (ES Module)
 * import { validateStructuredData } from '@llmprofiles/core';
 * 
 * const result = validateStructuredData(myData, 'Article');
 * if (!result.valid) {
 *   console.log('Validation errors:', result.errors);
 *   console.log('Missing recommended fields:', result.warnings);
 * }
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ProfileValidator } from './lib/validator.mjs';
import builders from './lib/builder.mjs';
import { MODES, ModeConfig } from './lib/modes.mjs';
import { InputSanitizer, defaultSanitizer } from './lib/sanitizer.mjs';

// Import additional builders
import { BookBuilder } from './lib/builders/book-builder.mjs';
import { DatasetBuilder } from './lib/builders/dataset-builder.mjs';
import { HowToBuilder } from './lib/builders/howto-builder.mjs';
import { RecipeBuilder } from './lib/builders/recipe-builder.mjs';
import { VideoObjectBuilder } from './lib/builders/videoobject-builder.mjs';
import { FAQPageBuilder } from './lib/builders/faqpage-builder.mjs';
import { QAPageBuilder } from './lib/builders/qapage-builder.mjs';
import { SoftwareApplicationBuilder } from './lib/builders/softwareapplication-builder.mjs';
import { ReviewBuilder } from './lib/builders/review-builder.mjs';
import { 
  FIELD_IMPORTANCE, 
  FIELD_CATEGORY, 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints,
  getEnhancedFieldSuggestions
} from './lib/field-metadata.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const profiles = JSON.parse(readFileSync(join(__dirname, 'profiles/index.json'), 'utf8'));

/**
 * Get a specific profile definition
 * @param {string} type - Profile type (e.g., 'Article', 'JobPosting')
 * @returns {Object|null} Profile definition or null if not found
 */
export function getProfile(type) {
  return profiles[type] || null;
}

/**
 * List all available profile types
 * @returns {string[]} Array of profile type names
 */
export function listProfiles() {
  return Object.keys(profiles);
}

/**
 * List profiles by category
 * @param {string} category - Category name ('business', 'content', 'interaction', 'technology')
 * @returns {string[]} Array of profile types in the category
 */
export function getProfilesByCategory(category) {
  return Object.keys(profiles).filter(type => 
    profiles[type].category === category
  );
}

/**
 * Validate structured data against a profile
 * @param {Object} data - The JSON-LD data to validate
 * @param {string} profileType - Profile type to validate against
 * @returns {Object} Validation result with valid, errors, and warnings
 */
export function validateStructuredData(data, profileType) {
  const validator = new ProfileValidator();
  return validator.validate(data, profileType);
}

/**
 * Simplified builder factory
 * @param {string} profileType - e.g., 'Product', 'Article', 'JobPosting'
 * @param {{ mode?: string, sanitize?: boolean }} [options]
 */
export function createBuilder(profileType, options = {}) {
  const { mode = MODES.STRICT_SEO, sanitize = true } = options;
  const normalize = (s) => String(s || '').replace(/[-_\s]/g, '').toLowerCase();
  const key = normalize(profileType);

  const map = {
    article: builders.ArticleBuilder,
    jobposting: builders.JobPostingBuilder,
    localbusiness: builders.LocalBusinessBuilder,
    product: builders.ProductBuilder,
    event: builders.EventBuilder,
    book: builders.BookBuilder,
    course: builders.CourseBuilder,
    dataset: builders.DatasetBuilder,
    howto: builders.HowToBuilder,
    recipe: builders.RecipeBuilder,
    videoobject: builders.VideoObjectBuilder,
    faqpage: builders.FAQPageBuilder,
    qapage: builders.QAPageBuilder,
    softwareapplication: builders.SoftwareApplicationBuilder,
    review: builders.ReviewBuilder
  };

  const Ctor = map[key];
  if (!Ctor) {
    throw new Error(`Unknown builder for type: ${profileType}`);
  }
  return new Ctor(mode, sanitize);
}

/**
 * Create a minimal example for a profile type
 * @param {string} profileType - Profile type
 * @returns {Object|null} Minimal example or null if profile not found
 */
export function createMinimalExample(profileType, mode = MODES.STRICT_SEO) {
  const profile = profiles[profileType];
  if (!profile) return null;
  
  const modeConfig = new ModeConfig(mode);
  const example = {
    "@context": "https://schema.org",
    "@type": profileType
  };
  
  // Add mode-specific properties
  if (profile.profileUrl) {
    if (modeConfig.usesAdditionalType()) {
      example.additionalType = profile.profileUrl;
    }
    if (modeConfig.usesSchemaVersion()) {
      example.schemaVersion = profile.profileUrl;
    }
    if (modeConfig.usesIdentifier()) {
      example.identifier = profile.profileUrl;
    }
    if (modeConfig.usesAdditionalProperty()) {
      example.additionalProperty = {
        "@type": "PropertyValue",
        "name": "profile",
        "value": profile.profileUrl
      };
    }
  }
  
  // Add required fields with placeholder values
  Object.keys(profile.required).forEach(field => {
    if (field !== '@context' && field !== '@type') {
      const fieldDef = profile.required[field];
      example[field] = getPlaceholderValue(field, fieldDef);
    }
  });
  
  return example;
}

/**
 * Generate placeholder value based on field definition
 * @private
 */
function getPlaceholderValue(fieldName, fieldDef) {
  if (fieldDef.type === 'string') {
    return `[${fieldName}]`;
  }
  if (fieldDef.type === 'integer' || fieldDef.type === 'number') {
    return 0;
  }
  if (fieldDef.type === 'boolean') {
    return false;
  }
  if (fieldDef.type === 'object') {
    return {};
  }
  if (fieldDef.type === 'array') {
    return [];
  }
  return `[${fieldName}]`;
}

/**
 * Get fields required for Google Rich Results
 * @param {string} profileType - Profile type
 * @returns {string[]|null} Array of field names or null if profile not found
 */
export function getGoogleRichResultsFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.googleRichResults || [] : null;
}

/**
 * Get fields optimized for LLM processing
 * @param {string} profileType - Profile type
 * @returns {string[]|null} Array of field names or null if profile not found
 */
export function getLLMOptimizedFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.llmOptimized || [] : null;
}

/**
 * Get the schema.org URL for a profile type
 * @param {string} profileType - Profile type
 * @returns {string|null} Schema.org URL or null if profile not found
 */
export function getSchemaOrgUrl(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.schemaType : null;
}

// Re-export all builders
export const {
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
} = builders;

// Export additional builders
export { BookBuilder, DatasetBuilder, HowToBuilder, RecipeBuilder, VideoObjectBuilder, FAQPageBuilder, QAPageBuilder, SoftwareApplicationBuilder, ReviewBuilder };

// Re-export utility classes
export { ProfileValidator, InputSanitizer, defaultSanitizer };

// Re-export field metadata utilities
export { 
  FIELD_IMPORTANCE, 
  FIELD_CATEGORY, 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints 
};

// Re-export mode-related exports
export { MODES, ModeConfig };

// Mode-specific functions
export const createMinimalExampleWithMode = createMinimalExample;
export const getModeConfiguration = (mode) => new ModeConfig(mode);
export const getHTMLRelProfile = (mode) => new ModeConfig(mode).getRelProfileValue();
export const getHTTPLinkHeader = (mode) => new ModeConfig(mode).getLinkHeaderValue();

// Category constants
export const CATEGORIES = {
  BUSINESS: 'business',
  CONTENT: 'content',
  INTERACTION: 'interaction',
  TECHNOLOGY: 'technology'
};

// Individual profile exports
export { articleProfile } from './profiles/article.mjs';
export { jobpostingProfile } from './profiles/jobposting.mjs';
export { localbusinessProfile } from './profiles/localbusiness.mjs';
export { productofferProfile } from './profiles/productoffer.mjs';
export { reviewProfile } from './profiles/review.mjs';
export { bookProfile } from './profiles/book.mjs';
export { courseProfile } from './profiles/course.mjs';
export { datasetProfile } from './profiles/dataset.mjs';
export { howtoProfile } from './profiles/howto.mjs';
export { recipeProfile } from './profiles/recipe.mjs';
export { videoobjectProfile } from './profiles/videoobject.mjs';
export { eventProfile } from './profiles/event.mjs';
export { faqpageProfile } from './profiles/faqpage.mjs';
export { qapageProfile } from './profiles/qapage.mjs';
export { softwareapplicationProfile } from './profiles/softwareapplication.mjs';

// Default export for profile data
export default profiles;

// Simplified API alias
export const validate = validateStructuredData;

// Enhanced field metadata and suggestions (already exported above)
// Note: These are already exported in the field metadata utilities section above
