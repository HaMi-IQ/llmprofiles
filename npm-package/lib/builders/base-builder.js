/**
 * @fileoverview BaseProfileBuilder class for creating structured data objects
 * 
 * This module provides the base builder class that all specific profile builders
 * extend. It includes common functionality for building structured data objects,
 * mode-specific output formatting, field discovery, validation, and enhanced
 * autocomplete support.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Direct usage (not recommended - use specific builders)
 * const { BaseProfileBuilder, MODES } = require('./base-builder');
 * const builder = new BaseProfileBuilder('Article', 'content', MODES.STRICT_SEO);
 * 
 * @example
 * // Using with field discovery
 * const builder = new BaseProfileBuilder('Article', 'content');
 * const suggestions = builder.getSuggestions();
 * console.log('Missing required fields:', suggestions.critical);
 * 
 * @example
 * // Validation and completion status
 * const builder = new BaseProfileBuilder('Article', 'content');
 * builder.name('My Article');
 * const status = builder.getCompletionStatus();
 * console.log('Completion score:', status.overall.score);
 */

const { ModeConfig, MODES } = require('../modes');
const { defaultSanitizer } = require('../sanitizer');
const { 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints,
  getEnhancedFieldSuggestions,
  FIELD_IMPORTANCE 
} = require('../field-metadata');

/**
 * Base profile builder class for creating structured data objects
 * 
 * This is the base class that all specific profile builders extend. It provides
 * common functionality for building structured data objects, including mode-specific
 * output formatting, field discovery, validation, and enhanced autocomplete support.
 * 
 * @class BaseProfileBuilder
 * @abstract
 * @example
 * // This class is typically not used directly
 * // Use specific builders like ArticleBuilder, JobPostingBuilder, etc.
 * 
 * @example
 * // Field discovery and validation
 * const builder = new ArticleBuilder();
 * const suggestions = builder.getSuggestions();
 * const status = builder.getCompletionStatus();
 */
class BaseProfileBuilder {
  /**
   * Create a new BaseProfileBuilder instance
   * 
   * @param {string} profileType - The Schema.org type (e.g., 'Article', 'JobPosting')
   * @param {string} category - The profile category ('business', 'content', 'interaction', 'technology')
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Create base builder (typically done by specific builders)
   * const builder = new BaseProfileBuilder('Article', 'content', MODES.STRICT_SEO);
   */
  constructor(profileType, category, mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    this.data = {
      "@context": "https://schema.org",
      "@type": profileType
    };
    this.profileType = profileType;
    this.category = category;
    this.modeConfig = new ModeConfig(mode);
    this.sanitizeInputs = sanitizeInputs;
    this.sanitizer = defaultSanitizer;
    
    // Add mode-specific properties
    this.applyModeProperties();
  }

  /**
   * Apply mode-specific properties
   * @private
   */
  applyModeProperties() {
    if (this.category && this.profileType) {
      const profileUrl = `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1/index.jsonld`;
      
      if (this.modeConfig.usesAdditionalType()) {
        this.data.additionalType = profileUrl;
      }
      
      if (this.modeConfig.usesSchemaVersion()) {
        this.data.schemaVersion = profileUrl;
      }
      
      if (this.modeConfig.usesIdentifier()) {
        this.data.identifier = profileUrl;
      }
      
      if (this.modeConfig.usesAdditionalProperty()) {
        this.data.additionalProperty = {
          "@type": "PropertyValue",
          "name": "profile",
          "value": profileUrl
        };
      }
    }
  }

  /**
   * Build the final JSON-LD object
   * @param {string} [mode] - Override the mode for this build
   * @param {Object} [options] - Build options
   * @param {boolean} [options.validate=true] - Whether to validate required fields before building
   * @param {boolean} [options.throwOnError=true] - Whether to throw errors for missing required fields
   * @returns {Object|Object[]} The structured data object(s) based on mode
   * @throws {Error} When required fields are missing and throwOnError is true
   */
  build(mode = null, options = {}) {
    const { validate = true, throwOnError = true } = options;
    
    // Validate required fields if requested
    if (validate) {
      const validation = this.validateInline();
      if (!validation.valid) {
        const missingFields = validation.errors.map(e => e.field).join(', ');
        const errorMessage = `Missing required fields: ${missingFields}. Use validateInline() for detailed validation results.`;
        
        if (throwOnError) {
          throw new Error(errorMessage);
        } else {
          console.warn(`Warning: ${errorMessage}`);
        }
      }
    }
    
    if (mode) {
      const tempModeConfig = new ModeConfig(mode);
      return this.buildWithMode(tempModeConfig);
    }
    return this.buildWithMode(this.modeConfig);
  }

  /**
   * Build with specific mode configuration
   * @private
   */
  buildWithMode(modeConfig) {
    if (modeConfig.separatesLLMBlock()) {
      return this.buildSplitChannels();
    }
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Build split channels output (SEO + LLM blocks)
   * @private
   */
  buildSplitChannels() {
    const seoBlock = JSON.parse(JSON.stringify(this.data));
    const llmBlock = this.buildLLMBlock();
    
    return {
      seo: seoBlock,
      llm: llmBlock
    };
  }

  /**
   * Build LLM-specific block with profile metadata
   * @private
   */
  buildLLMBlock() {
    const profileUrl = `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`;
    const llmData = {
      "@context": [
        "https://schema.org",
        "https://llmprofiles.org/contexts/llm.jsonld"
      ],
      "@type": this.profileType,
      "additionalType": profileUrl,
      "schemaVersion": profileUrl,
      "identifier": profileUrl,
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "profile",
        "value": profileUrl
      }
    };

    // Copy all data except mode-specific properties
    Object.keys(this.data).forEach(key => {
      if (!['additionalType', 'schemaVersion', 'identifier', 'additionalProperty'].includes(key)) {
        llmData[key] = this.data[key];
      }
    });

    return llmData;
  }

  /**
   * Get HTML rel profile attribute for Standards Header mode
   * @returns {string|null} rel profile value or null if not applicable
   */
  getRelProfile() {
    return this.modeConfig.getRelProfileValue();
  }

  /**
   * Get HTTP Link header for Standards Header mode
   * @returns {string|null} Link header value or null if not applicable
   */
  getLinkHeader() {
    return this.modeConfig.getLinkHeaderValue();
  }

  /**
   * Add any custom property
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  addProperty(property, value) {
    if (this.sanitizeInputs && typeof value === 'string') {
      this.data[property] = this.sanitizer.sanitizeString(value);
    } else {
      this.data[property] = value;
    }
    return this;
  }

  /**
   * Add URL
   * @param {string} url - URL
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  url(url) {
    if (this.sanitizeInputs) {
      this.data.url = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.url = url;
    }
    return this;
  }

  /**
   * Add name
   * @param {string} name - Name
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  name(name) {
    if (this.sanitizeInputs) {
      this.data.name = this.sanitizer.sanitizeString(name);
    } else {
      this.data.name = name;
    }
    return this;
  }

  /**
   * Add description
   * @param {string} description - Description
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  description(description) {
    if (this.sanitizeInputs) {
      this.data.description = this.sanitizer.sanitizeString(description);
    } else {
      this.data.description = description;
    }
    return this;
  }

  /**
   * Add image
   * @param {string|Object} image - Image URL or ImageObject
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      if (sanitizedUrl) {
        this.data.image = {
          "@type": "ImageObject",
          "url": sanitizedUrl
        };
      }
    } else if (image && typeof image === 'object') {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeStructuredData(image, 'ImageObject');
      } else {
        this.data.image = image;
      }
    }
    return this;
  }

  // ===== ENHANCED FIELD DISCOVERY AND AUTCOMPLETE METHODS =====

  /**
   * Get metadata for a specific field
   * @param {string} fieldName - Field name
   * @returns {Object|null} Field metadata or null if not found
   */
  getFieldMetadata(fieldName) {
    return getFieldMetadata(this.profileType, fieldName);
  }

  /**
   * Get all available fields with metadata organized by importance
   * @returns {Object} Object with field metadata organized by importance
   */
  getAllFieldsMetadata() {
    return getAllFieldsMetadata(this.profileType);
  }

  /**
   * Get field suggestions based on current state
   * @returns {Object} Suggestions organized by priority
   */
  getSuggestions() {
    return getFieldSuggestions(this.profileType, this.data);
  }

  /**
   * Get completion hints for IDE autocomplete
   * @param {string} [partialField] - Partial field name being typed
   * @returns {Array} Array of completion hints
   */
  getCompletionHints(partialField = '') {
    return getCompletionHints(this.profileType, partialField);
  }

  /**
   * Get missing required fields
   * @returns {Array} Array of missing required field metadata
   */
  getMissingRequired() {
    const suggestions = this.getSuggestions();
    return suggestions.critical || [];
  }

  /**
   * Get missing recommended fields
   * @returns {Array} Array of missing recommended field metadata
   */
  getMissingRecommended() {
    const suggestions = this.getSuggestions();
    return [...(suggestions.important || []), ...(suggestions.helpful || [])];
  }

  /**
   * Get available optional fields
   * @returns {Array} Array of available optional field metadata
   */
  getAvailableOptional() {
    const suggestions = this.getSuggestions();
    return suggestions.optional || [];
  }

  /**
   * Get fields that are important for Google Rich Results
   * @returns {Array} Array of Google Rich Results field metadata
   */
  getGoogleRichResultsFields() {
    const allFields = this.getAllFieldsMetadata();
    const allFieldsList = [
      ...allFields.required,
      ...allFields.recommended,
      ...allFields.optional
    ];
    
    return allFieldsList.filter(field => field.googleRichResults);
  }

  /**
   * Get fields that are optimized for LLM processing
   * @returns {Array} Array of LLM-optimized field metadata
   */
  getLLMOptimizedFields() {
    const allFields = this.getAllFieldsMetadata();
    const allFieldsList = [
      ...allFields.required,
      ...allFields.recommended,
      ...allFields.optional
    ];
    
    return allFieldsList.filter(field => field.llmOptimized);
  }

  /**
   * Get completion status for the current builder
   * @returns {Object} Completion status with scores and missing fields
   */
  getCompletionStatus() {
    const suggestions = this.getSuggestions();
    const allFields = this.getAllFieldsMetadata();
    
    const totalRequired = allFields.required.length;
    const totalRecommended = allFields.recommended.length;
    const totalOptional = allFields.optional.length;
    
    const completedRequired = totalRequired - (suggestions.critical?.length || 0);
    const completedRecommended = totalRecommended - (suggestions.important?.length || 0) - (suggestions.helpful?.length || 0);
    
    const requiredScore = totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 100;
    const recommendedScore = totalRecommended > 0 ? (completedRecommended / totalRecommended) * 100 : 100;
    const overallScore = totalRequired + totalRecommended > 0 ? 
      ((completedRequired + completedRecommended) / (totalRequired + totalRecommended)) * 100 : 100;

    return {
      overall: {
        score: Math.round(overallScore),
        status: overallScore === 100 ? 'complete' : overallScore >= 80 ? 'good' : overallScore >= 60 ? 'fair' : 'incomplete'
      },
      required: {
        score: Math.round(requiredScore),
        completed: completedRequired,
        total: totalRequired,
        missing: suggestions.critical || []
      },
      recommended: {
        score: Math.round(recommendedScore),
        completed: completedRecommended,
        total: totalRecommended,
        missing: [...(suggestions.important || []), ...(suggestions.helpful || [])]
      },
      optional: {
        available: totalOptional,
        suggested: suggestions.optional || []
      }
    };
  }

  /**
   * Validate current state and return detailed validation results
   * @returns {Object} Detailed validation results with suggestions
   */
  validateInline() {
    const completionStatus = this.getCompletionStatus();
    const suggestions = this.getSuggestions();
    
    const validation = {
      valid: completionStatus.required.score === 100,
      score: completionStatus.overall.score,
      status: completionStatus.overall.status,
      errors: [],
      warnings: [],
      suggestions: [],
      summary: {
        required: completionStatus.required,
        recommended: completionStatus.recommended,
        optional: completionStatus.optional
      }
    };

    // Add errors for missing required fields
    if (suggestions.critical) {
      suggestions.critical.forEach(field => {
        validation.errors.push({
          field: field.name,
          message: field.guidance.message,
          action: field.guidance.action,
          examples: field.examples,
          severity: 'error'
        });
      });
    }

    // Add warnings for missing recommended fields
    if (suggestions.important) {
      suggestions.important.forEach(field => {
        validation.warnings.push({
          field: field.name,
          message: field.guidance.message,
          action: field.guidance.action,
          examples: field.examples,
          severity: 'warning',
          googleRichResults: true
        });
      });
    }

    if (suggestions.helpful) {
      suggestions.helpful.forEach(field => {
        validation.warnings.push({
          field: field.name,
          message: field.guidance.message,
          action: field.guidance.action,
          examples: field.examples,
          severity: 'warning'
        });
      });
    }

    // Add suggestions for optional fields
    if (suggestions.optional && suggestions.optional.length > 0) {
      validation.suggestions = suggestions.optional.slice(0, 5).map(field => ({
        field: field.name,
        message: field.guidance.message,
        action: field.guidance.action,
        examples: field.examples,
        severity: 'info'
      }));
    }

    return validation;
  }

  /**
   * Get a summary of the current builder state
   * @returns {Object} Builder state summary
   */
  getStateSummary() {
    const completionStatus = this.getCompletionStatus();
    const allFields = this.getAllFieldsMetadata();
    
    return {
      profileType: this.profileType,
      category: this.category,
      mode: this.modeConfig.mode,
      completion: completionStatus,
      fieldCounts: {
        required: allFields.required.length,
        recommended: allFields.recommended.length,
        optional: allFields.optional.length,
        total: allFields.required.length + allFields.recommended.length + allFields.optional.length
      },
      currentFields: Object.keys(this.data).filter(key => 
        !['@context', '@type', 'additionalType', 'schemaVersion', 'identifier', 'additionalProperty'].includes(key)
      ),
      nextSteps: this.getNextSteps()
    };
  }

  /**
   * Get recommended next steps for completing the builder
   * @returns {Array} Array of recommended next steps
   */
  getNextSteps() {
    const suggestions = this.getSuggestions();
    const nextSteps = [];

    // Priority 1: Missing required fields
    if (suggestions.critical && suggestions.critical.length > 0) {
      nextSteps.push({
        priority: 1,
        type: 'required',
        message: `Add ${suggestions.critical.length} required field(s)`,
        fields: suggestions.critical.map(f => f.name),
        action: 'Complete required fields to make the schema valid'
      });
    }

    // Priority 2: Missing Google Rich Results fields
    if (suggestions.important && suggestions.important.length > 0) {
      nextSteps.push({
        priority: 2,
        type: 'google-rich-results',
        message: `Add ${suggestions.important.length} Google Rich Results field(s)`,
        fields: suggestions.important.map(f => f.name),
        action: 'Add these fields to improve search result appearance'
      });
    }

    // Priority 3: Missing recommended fields
    if (suggestions.helpful && suggestions.helpful.length > 0) {
      nextSteps.push({
        priority: 3,
        type: 'recommended',
        message: `Consider adding ${suggestions.helpful.length} recommended field(s)`,
        fields: suggestions.helpful.map(f => f.name),
        action: 'Add these fields for better SEO and completeness'
      });
    }

    // Priority 4: Optional enhancements
    if (suggestions.optional && suggestions.optional.length > 0) {
      nextSteps.push({
        priority: 4,
        type: 'optional',
        message: `${suggestions.optional.length} optional field(s) available`,
        fields: suggestions.optional.slice(0, 3).map(f => f.name),
        action: 'Add these fields for enhanced functionality'
      });
    }

    return nextSteps;
  }

  /**
   * Check if the builder is in a valid state (all required fields present)
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    const validation = this.validateInline();
    return validation.valid;
  }

  /**
   * Get missing required fields
   * @returns {Array} Array of missing required field names
   */
  getMissingRequiredFields() {
    const validation = this.validateInline();
    return validation.errors.map(e => e.field);
  }

  /**
   * Build without validation (for cases where you want to build incomplete schemas)
   * @param {string} [mode] - Override the mode for this build
   * @returns {Object|Object[]} The structured data object(s) based on mode
   */
  buildUnsafe(mode = null) {
    return this.build(mode, { validate: false });
  }

  /**
   * Build with warnings instead of errors for missing required fields
   * @param {string} [mode] - Override the mode for this build
   * @returns {Object|Object[]} The structured data object(s) based on mode
   */
  buildWithWarnings(mode = null) {
    return this.build(mode, { validate: true, throwOnError: false });
  }

  /**
   * Get enhanced field suggestions with detailed metadata
   * @param {Object} [options] - Options for suggestions
   * @param {boolean} [options.includeOptional=true] - Whether to include optional fields
   * @param {boolean} [options.prioritizeGoogleRichResults=true] - Whether to prioritize Google Rich Results fields
   * @returns {Object} Enhanced suggestions with metadata
   */
  getEnhancedSuggestions(options = {}) {
    return getEnhancedFieldSuggestions(this.profileType, this.data, options);
  }
}

module.exports = { BaseProfileBuilder, MODES };
