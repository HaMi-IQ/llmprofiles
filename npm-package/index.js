/**
 * @llmprofiles/core - Minimal Schema.org profiles for LLMs and Rich Results
 * 
 * Main entry point providing profile definitions, builders, and validation utilities
 */

const profiles = require('./profiles/index.json');
const { ProfileValidator } = require('./lib/validator');
const builders = require('./lib/builder');
const { MODES, ModeConfig } = require('./lib/modes');
const { InputSanitizer, defaultSanitizer } = require('./lib/sanitizer');

/**
 * Get a specific profile definition
 * @param {string} type - Profile type (e.g., 'Article', 'JobPosting')
 * @returns {Object|null} Profile definition or null if not found
 */
function getProfile(type) {
  return profiles[type] || null;
}

/**
 * List all available profile types
 * @returns {string[]} Array of profile type names
 */
function listProfiles() {
  return Object.keys(profiles);
}

/**
 * List profiles by category
 * @param {string} category - Category name ('business', 'content', 'interaction', 'technology')
 * @returns {string[]} Array of profile types in the category
 */
function getProfilesByCategory(category) {
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
function validateStructuredData(data, profileType) {
  const validator = new ProfileValidator();
  return validator.validate(data, profileType);
}

/**
 * Simplified builder factory
 * @param {string} profileType - e.g., 'Product', 'Article', 'JobPosting'
 * @param {{ mode?: string, sanitize?: boolean }} [options]
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
 * @param {string} profileType - Profile type
 * @returns {Object|null} Minimal example or null if profile not found
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
function getGoogleRichResultsFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.googleRichResults || [] : null;
}

/**
 * Get fields optimized for LLM processing
 * @param {string} profileType - Profile type
 * @returns {string[]|null} Array of field names or null if profile not found
 */
function getLLMOptimizedFields(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.llmOptimized || [] : null;
}

/**
 * Get the schema.org URL for a profile type
 * @param {string} profileType - Profile type
 * @returns {string|null} Schema.org URL or null if profile not found
 */
function getSchemaOrgUrl(profileType) {
  const profile = profiles[profileType];
  return profile ? profile.schemaType : null;
}

module.exports = {
  // Profile data
  profiles,
  
  // Builder classes
  ...builders,
  
  // Utility classes
  ProfileValidator,
  InputSanitizer,
  defaultSanitizer,
  
  // Helper functions
  getProfile,
  listProfiles,
  getProfilesByCategory,
  validateStructuredData,
  createMinimalExample,
  getGoogleRichResultsFields,
  getLLMOptimizedFields,
  getSchemaOrgUrl,
  // Simplified API
  createBuilder,
  validate: validateStructuredData,
  
  // Mode-specific functions
  createMinimalExampleWithMode: createMinimalExample,
  getModeConfiguration: (mode) => new ModeConfig(mode),
  getHTMLRelProfile: (mode) => new ModeConfig(mode).getRelProfileValue(),
  getHTTPLinkHeader: (mode) => new ModeConfig(mode).getLinkHeaderValue(),
  
  // Category constants
  CATEGORIES: {
    BUSINESS: 'business',
    CONTENT: 'content',
    INTERACTION: 'interaction',
    TECHNOLOGY: 'technology'
  },

  // Mode constants and classes
  MODES,
  ModeConfig
};
