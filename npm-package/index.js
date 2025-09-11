/**
 * @fileoverview @llmprofiles/core - Minimal Schema.org profiles for LLMs and Rich Results
 * 
 * This is the main entry point for the @llmprofiles/core package, providing:
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
 * // Basic usage with Article builder
 * const { ArticleBuilder, MODES } = require('@llmprofiles/core');
 * 
 * const article = new ArticleBuilder(MODES.STRICT_SEO)
 *   .headline('Breaking News: Important Update')
 *   .author('John Doe', 'https://example.com/author')
 *   .datePublished('2024-01-01T00:00:00Z')
 *   .publisher('News Corp', 'https://example.com', 'https://example.com/logo.png')
 *   .build();
 * 
 * @example
 * // Using the simplified factory function
 * const { createBuilder } = require('@llmprofiles/core');
 * 
 * const jobPosting = createBuilder('JobPosting', { mode: 'strict-seo' })
 *   .title('Software Engineer')
 *   .hiringOrganization('Tech Corp', 'https://techcorp.com')
 *   .jobLocation('San Francisco, CA')
 *   .datePosted('2024-01-01')
 *   .build();
 * 
 * @example
 * // Validation with detailed error reporting
 * const { validateStructuredData } = require('@llmprofiles/core');
 * 
 * const result = validateStructuredData(myData, 'Article');
 * if (!result.valid) {
 *   console.log('Validation errors:', result.errors);
 *   console.log('Missing recommended fields:', result.warnings);
 * }
 */

const profiles = require('./profiles/index.json');
const { ProfileValidator } = require('./lib/validator');
const builders = require('./lib/builder');
const { MODES, ModeConfig } = require('./lib/modes');
const { InputSanitizer, defaultSanitizer } = require('./lib/sanitizer');

// Import additional builders
const { BookBuilder } = require('./lib/builders/book-builder');
const { CourseBuilder } = require('./lib/builders/course-builder');
const { DatasetBuilder } = require('./lib/builders/dataset-builder');
const { HowToBuilder } = require('./lib/builders/howto-builder');
const { RecipeBuilder } = require('./lib/builders/recipe-builder');
const { VideoObjectBuilder } = require('./lib/builders/videoobject-builder');
const { FAQPageBuilder } = require('./lib/builders/faqpage-builder');
const { QAPageBuilder } = require('./lib/builders/qapage-builder');
const { SoftwareApplicationBuilder } = require('./lib/builders/softwareapplication-builder');
const { ReviewBuilder } = require('./lib/builders/review-builder');
const { 
  FIELD_IMPORTANCE, 
  FIELD_CATEGORY, 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints,
  getEnhancedFieldSuggestions
} = require('./lib/field-metadata');

/**
 * Get a specific profile definition by type
 * 
 * Retrieves the complete profile definition for a given Schema.org type,
 * including required fields, recommended fields, optional fields, and
 * metadata about Google Rich Results and LLM optimization.
 * 
 * @param {string} type - Profile type (e.g., 'Article', 'JobPosting', 'Book')
 * @returns {Object|null} Profile definition object or null if not found
 * 
 * @example
 * const articleProfile = getProfile('Article');
 * console.log('Required fields:', Object.keys(articleProfile.required));
 * console.log('Google Rich Results fields:', articleProfile.googleRichResults);
 * 
 * @example
 * const profile = getProfile('NonExistentType');
 * if (profile === null) {
 *   console.log('Profile not found');
 * }
 * 
 * @see {@link listProfiles} Get all available profile types
 * @see {@link getProfilesByCategory} Get profiles by category
 */
function getProfile(type) {
  return profiles[type] || null;
}

/**
 * List all available profile types
 * 
 * Returns an array of all supported Schema.org profile types that can be used
 * with builders, validation, and other utilities in this package.
 * 
 * @returns {string[]} Array of profile type names (e.g., ['Article', 'JobPosting', 'Book'])
 * 
 * @example
 * const allProfiles = listProfiles();
 * console.log('Available profiles:', allProfiles);
 * // Output: ['Article', 'JobPosting', 'Book', 'Course', ...]
 * 
 * @example
 * // Check if a profile type is supported
 * const supportedTypes = listProfiles();
 * if (supportedTypes.includes('Article')) {
 *   console.log('Article profile is supported');
 * }
 * 
 * @see {@link getProfile} Get a specific profile definition
 * @see {@link getProfilesByCategory} Get profiles by category
 */
function listProfiles() {
  return Object.keys(profiles);
}

/**
 * List profiles by category
 * 
 * Filters and returns profile types that belong to a specific category.
 * Categories help organize profiles by their primary use case.
 * 
 * @param {string} category - Category name
 *   - 'business': Business-related profiles (JobPosting, LocalBusiness, ProductOffer)
 *   - 'content': Content-related profiles (Article, Book, Course, Recipe)
 *   - 'interaction': Interactive profiles (Event, FAQPage, QAPage)
 *   - 'technology': Technology-related profiles (SoftwareApplication, Dataset)
 * @returns {string[]} Array of profile types in the specified category
 * 
 * @example
 * const businessProfiles = getProfilesByCategory('business');
 * console.log('Business profiles:', businessProfiles);
 * // Output: ['JobPosting', 'LocalBusiness', 'ProductOffer']
 * 
 * @example
 * const contentProfiles = getProfilesByCategory('content');
 * console.log('Content profiles:', contentProfiles);
 * // Output: ['Article', 'Book', 'Course', 'Recipe', ...]
 * 
 * @throws {Error} When category is not one of the valid categories
 * 
 * @see {@link CATEGORIES} Available category constants
 * @see {@link listProfiles} Get all available profile types
 */
function getProfilesByCategory(category) {
  return Object.keys(profiles).filter(type => 
    profiles[type].category === category
  );
}

/**
 * Validate structured data against a profile
 * 
 * Performs comprehensive validation of JSON-LD structured data against a specific
 * profile definition. Returns detailed validation results including errors,
 * warnings, and suggestions for improvement.
 * 
 * @param {Object} data - The JSON-LD data to validate
 * @param {string} profileType - Profile type to validate against (e.g., 'Article', 'JobPosting')
 * @returns {Object} Validation result object with the following properties:
 *   - `valid` {boolean} - Whether the data is valid according to the profile
 *   - `errors` {Array<Object>} - Array of validation errors with detailed information
 *   - `warnings` {Array<Object>} - Array of warnings for missing recommended fields
 *   - `googleRichResults` {Object} - Google Rich Results compliance information
 *   - `llmOptimization` {Object} - LLM optimization score and missing fields
 *   - `sanitized` {Object|null} - Sanitized version of the input data (if sanitization enabled)
 *   - `securityWarnings` {Array<Object>} - Security-related warnings (if any)
 * 
 * @example
 * const articleData = {
 *   "@context": "https://schema.org",
 *   "@type": "Article",
 *   "headline": "Breaking News",
 *   "author": "John Doe"
 * };
 * 
 * const result = validateStructuredData(articleData, 'Article');
 * if (!result.valid) {
 *   console.log('Validation errors:', result.errors);
 *   console.log('Missing recommended fields:', result.warnings);
 * }
 * 
 * @example
 * // Check Google Rich Results compliance
 * const result = validateStructuredData(data, 'Product');
 * console.log('Google Rich Results compliant:', result.googleRichResults.compliant);
 * console.log('Coverage:', result.googleRichResults.coverage + '%');
 * 
 * @see {@link ProfileValidator} For more advanced validation options
 * @see {@link validate} Alias for this function
 */
function validateStructuredData(data, profileType) {
  const validator = new ProfileValidator();
  return validator.validate(data, profileType);
}

/**
 * Simplified builder factory function
 * 
 * Creates a builder instance for the specified profile type. This is a convenience
 * function that automatically selects the appropriate builder class based on the
 * profile type string. The function normalizes the input to handle various formats
 * (e.g., 'Article', 'article', 'ARTICLE' all work).
 * 
 * @param {string} profileType - Profile type name (case-insensitive)
 *   Supported types: 'Article', 'JobPosting', 'LocalBusiness', 'Product', 'Event',
 *   'Book', 'Course', 'Dataset', 'HowTo', 'Recipe', 'VideoObject', 'FAQPage',
 *   'QAPage', 'SoftwareApplication', 'Review'
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.mode=MODES.STRICT_SEO] - Output mode
 *   - 'strict-seo': Standard SEO-optimized output (default)
 *   - 'split-channels': Separate SEO and LLM blocks
 *   - 'standards-header': Include profile metadata in headers
 * @param {boolean} [options.sanitize=true] - Whether to sanitize input data
 * @returns {BaseProfileBuilder} Builder instance for the specified profile type
 * 
 * @throws {Error} When profileType is not supported
 * 
 * @example
 * // Create an Article builder
 * const articleBuilder = createBuilder('Article');
 * const article = articleBuilder
 *   .headline('My Article')
 *   .author('John Doe')
 *   .build();
 * 
 * @example
 * // Create a JobPosting builder with custom options
 * const jobBuilder = createBuilder('JobPosting', {
 *   mode: 'split-channels',
 *   sanitize: false
 * });
 * 
 * @example
 * // Case-insensitive profile type
 * const bookBuilder = createBuilder('book'); // Works the same as 'Book'
 * const productBuilder = createBuilder('PRODUCT'); // Works the same as 'Product'
 * 
 * @see {@link MODES} Available output modes
 * @see {@link BaseProfileBuilder} Base builder class
 */
function createBuilder(profileType, options = {}) {
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
 * 
 * Generates a minimal JSON-LD example for a given profile type, including
 * all required fields with placeholder values. This is useful for understanding
 * the structure of a profile and as a starting point for creating structured data.
 * 
 * @param {string} profileType - Profile type (e.g., 'Article', 'JobPosting')
 * @param {string} [mode=MODES.STRICT_SEO] - Output mode for the example
 * @returns {Object|null} Minimal example object or null if profile not found
 * 
 * @example
 * const articleExample = createMinimalExample('Article');
 * console.log(JSON.stringify(articleExample, null, 2));
 * // Output: {
 * //   "@context": "https://schema.org",
 * //   "@type": "Article",
 * //   "headline": "[headline]",
 * //   "author": "[author]",
 * //   ...
 * // }
 * 
 * @example
 * // Create example with different mode
 * const jobExample = createMinimalExample('JobPosting', 'split-channels');
 * 
 * @example
 * // Check if profile exists before creating example
 * const profile = getProfile('NonExistentType');
 * if (profile) {
 *   const example = createMinimalExample('NonExistentType');
 *   console.log('Example created:', example);
 * } else {
 *   console.log('Profile not found');
 * }
 * 
 * @see {@link getProfile} Get profile definition
 * @see {@link MODES} Available output modes
 */
function createMinimalExample(profileType, mode = MODES.STRICT_SEO) {
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
 * 
 * Creates appropriate placeholder values for different field types when
 * generating minimal examples. This is used internally by createMinimalExample.
 * 
 * @private
 * @param {string} fieldName - Name of the field
 * @param {Object} fieldDef - Field definition object with type information
 * @returns {*} Appropriate placeholder value for the field type
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
 * 
 * Returns the list of fields that are specifically required or recommended
 * for Google Rich Results eligibility for a given profile type. These fields
 * are important for ensuring your structured data appears in enhanced search
 * results on Google.
 * 
 * @param {string} profileType - Profile type (e.g., 'Article', 'JobPosting')
 * @returns {string[]|null} Array of field names or null if profile not found
 * 
 * @example
 * const articleFields = getGoogleRichResultsFields('Article');
 * console.log('Google Rich Results fields for Article:', articleFields);
 * // Output: ['headline', 'author', 'datePublished', 'publisher', ...]
 * 
 * @example
 * const jobFields = getGoogleRichResultsFields('JobPosting');
 * if (jobFields) {
 *   console.log('Required for Google job posting rich results:', jobFields);
 * }
 * 
 * @see {@link getLLMOptimizedFields} Get LLM-optimized fields
 * @see {@link validateStructuredData} Validate against Google Rich Results requirements
 */
function getGoogleRichResultsFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.googleRichResults || [] : null;
}

/**
 * Get fields optimized for LLM processing
 * 
 * Returns the list of fields that are specifically optimized for Large Language
 * Model (LLM) processing. These fields are designed to provide better context
 * and understanding for AI systems when processing structured data.
 * 
 * @param {string} profileType - Profile type (e.g., 'Article', 'Book')
 * @returns {string[]|null} Array of field names or null if profile not found
 * 
 * @example
 * const articleLLMFields = getLLMOptimizedFields('Article');
 * console.log('LLM-optimized fields for Article:', articleLLMFields);
 * // Output: ['about', 'mentions', 'keywords', ...]
 * 
 * @example
 * const bookLLMFields = getLLMOptimizedFields('Book');
 * if (bookLLMFields) {
 *   console.log('Fields optimized for LLM processing:', bookLLMFields);
 * }
 * 
 * @see {@link getGoogleRichResultsFields} Get Google Rich Results fields
 * @see {@link validateStructuredData} Validate LLM optimization score
 */
function getLLMOptimizedFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.llmOptimized || [] : null;
}

/**
 * Get the schema.org URL for a profile type
 * 
 * Returns the official Schema.org URL for a given profile type. This URL
 * points to the Schema.org documentation for the specific type and can be
 * used for reference or in structured data.
 * 
 * @param {string} profileType - Profile type (e.g., 'Article', 'JobPosting')
 * @returns {string|null} Schema.org URL or null if profile not found
 * 
 * @example
 * const articleUrl = getSchemaOrgUrl('Article');
 * console.log('Schema.org URL for Article:', articleUrl);
 * // Output: 'https://schema.org/Article'
 * 
 * @example
 * const jobUrl = getSchemaOrgUrl('JobPosting');
 * if (jobUrl) {
 *   console.log('Official Schema.org documentation:', jobUrl);
 * }
 * 
 * @see {@link https://schema.org} Official Schema.org website
 * @see {@link getProfile} Get complete profile definition
 */
function getSchemaOrgUrl(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.schemaType : null;
}

/**
 * @namespace llmprofiles
 * @description Main exports for the @llmprofiles/core package
 */
module.exports = {
  // Profile data
  /** @type {Object<string, Object>} All available profile definitions */
  profiles,
  
  // Builder classes
  /** @type {Object} Builder classes from lib/builder */
  ...builders,
  /** @type {typeof BookBuilder} Book structured data builder */
  BookBuilder,
  /** @type {typeof CourseBuilder} Course structured data builder */
  CourseBuilder,
  /** @type {typeof DatasetBuilder} Dataset structured data builder */
  DatasetBuilder,
  /** @type {typeof HowToBuilder} HowTo structured data builder */
  HowToBuilder,
  /** @type {typeof RecipeBuilder} Recipe structured data builder */
  RecipeBuilder,
  /** @type {typeof VideoObjectBuilder} VideoObject structured data builder */
  VideoObjectBuilder,
  /** @type {typeof FAQPageBuilder} FAQPage structured data builder */
  FAQPageBuilder,
  /** @type {typeof QAPageBuilder} QAPage structured data builder */
  QAPageBuilder,
  /** @type {typeof SoftwareApplicationBuilder} SoftwareApplication structured data builder */
  SoftwareApplicationBuilder,
  /** @type {typeof ReviewBuilder} Review structured data builder */
  ReviewBuilder,
  
  // Utility classes
  /** @type {typeof ProfileValidator} Profile validation utility */
  ProfileValidator,
  /** @type {typeof InputSanitizer} Input sanitization utility */
  InputSanitizer,
  /** @type {InputSanitizer} Default sanitizer instance */
  defaultSanitizer,
  
  // Field metadata utilities
  /** @type {Object} Field importance level constants */
  FIELD_IMPORTANCE,
  /** @type {Object} Field category constants */
  FIELD_CATEGORY,
  /** @type {Function} Get metadata for a specific field */
  getFieldMetadata,
  /** @type {Function} Get all field metadata for a profile type */
  getAllFieldsMetadata,
  /** @type {Function} Get field suggestions based on current state */
  getFieldSuggestions,
  /** @type {Function} Get completion hints for IDE autocomplete */
  getCompletionHints,
  
  // Helper functions
  /** @type {Function} Get a specific profile definition */
  getProfile,
  /** @type {Function} List all available profile types */
  listProfiles,
  /** @type {Function} List profiles by category */
  getProfilesByCategory,
  /** @type {Function} Validate structured data against a profile */
  validateStructuredData,
  /** @type {Function} Create a minimal example for a profile type */
  createMinimalExample,
  /** @type {Function} Get fields required for Google Rich Results */
  getGoogleRichResultsFields,
  /** @type {Function} Get fields optimized for LLM processing */
  getLLMOptimizedFields,
  /** @type {Function} Get the schema.org URL for a profile type */
  getSchemaOrgUrl,
  // Simplified API
  /** @type {Function} Simplified builder factory function */
  createBuilder,
  /** @type {Function} Alias for validateStructuredData */
  validate: validateStructuredData,
  
  // Mode-specific functions
  /** @type {Function} Alias for createMinimalExample */
  createMinimalExampleWithMode: createMinimalExample,
  /** @type {Function} Get mode configuration object */
  getModeConfiguration: (mode) => new ModeConfig(mode),
  /** @type {Function} Get HTML rel profile attribute value */
  getHTMLRelProfile: (mode) => new ModeConfig(mode).getRelProfileValue(),
  /** @type {Function} Get HTTP Link header value */
  getHTTPLinkHeader: (mode) => new ModeConfig(mode).getLinkHeaderValue(),
  
  // Enhanced field metadata and suggestions
  /** @type {Function} Get enhanced field suggestions with detailed metadata */
  getEnhancedFieldSuggestions,
  
  // Category constants
  /** @type {Object} Profile category constants */
  CATEGORIES: {
    /** @type {string} Business-related profiles */
    BUSINESS: 'business',
    /** @type {string} Content-related profiles */
    CONTENT: 'content',
    /** @type {string} Interactive profiles */
    INTERACTION: 'interaction',
    /** @type {string} Technology-related profiles */
    TECHNOLOGY: 'technology'
  },

  // Mode constants and classes
  /** @type {Object} Available output modes */
  MODES,
  /** @type {typeof ModeConfig} Mode configuration class */
  ModeConfig
};
