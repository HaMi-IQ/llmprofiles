/**
 * @fileoverview Profile validation utilities
 * 
 * This module provides comprehensive validation functionality for structured data
 * against Schema.org profiles. It includes enhanced error reporting, Google Rich
 * Results compliance checking, LLM optimization scoring, and security validation.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic validation
 * const { ProfileValidator } = require('./validator');
 * const validator = new ProfileValidator();
 * const result = validator.validate(myData, 'Article');
 * 
 * @example
 * // Batch validation
 * const batchResult = validator.validateBatch([data1, data2, data3], 'Product');
 * console.log('Batch summary:', batchResult.summary);
 * 
 * @example
 * // Get validation statistics
 * const stats = validator.getValidationStats(dataset, 'JobPosting');
 * console.log('Average compliance:', stats.averageGoogleCompliance);
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { defaultSanitizer } = require('./sanitizer');
const { 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions,
  FIELD_IMPORTANCE 
} = require('./field-metadata');

/**
 * Profile validation class with enhanced error reporting and compliance checking
 * 
 * Provides comprehensive validation of structured data against Schema.org profiles
 * with detailed error reporting, Google Rich Results compliance checking, LLM
 * optimization scoring, and security validation.
 * 
 * @class ProfileValidator
 * @example
 * // Create validator with default settings
 * const validator = new ProfileValidator();
 * 
 * @example
 * // Create validator without input sanitization
 * const validator = new ProfileValidator(false);
 * 
 * @example
 * // Validate data and get detailed results
 * const result = validator.validate(articleData, 'Article');
 * if (!result.valid) {
 *   console.log('Errors:', result.errors);
 *   console.log('Warnings:', result.warnings);
 * }
 */
class ProfileValidator {
  /**
   * Create a new ProfileValidator instance
   * 
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data for security
   * @param {Object} [options] - Additional configuration options
   * @param {boolean} [options.allErrors=true] - Whether to collect all validation errors
   * @param {boolean} [options.verbose=true] - Whether to include verbose error information
   * @param {boolean} [options.strict=false] - Whether to use strict JSON Schema validation
   */
  constructor(sanitizeInputs = true) {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);
    this.profiles = require('../profiles/index.json');
    this.sanitizeInputs = sanitizeInputs;
    this.sanitizer = defaultSanitizer;
  }

  /**
   * Validate data against a profile
   * 
   * Performs comprehensive validation of structured data against a specific profile
   * definition. Returns detailed validation results including errors, warnings,
   * Google Rich Results compliance, LLM optimization score, and security warnings.
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
   * const result = validator.validate(articleData, 'Article');
   * if (!result.valid) {
   *   console.log('Validation errors:', result.errors);
   *   console.log('Missing recommended fields:', result.warnings);
   * }
   * 
   * @example
   * // Check Google Rich Results compliance
   * const result = validator.validate(data, 'Product');
   * console.log('Google Rich Results compliant:', result.googleRichResults.compliant);
   * console.log('Coverage:', result.googleRichResults.coverage + '%');
   * 
   * @throws {Error} When profileType is not found in available profiles
   */
  validate(data, profileType) {
    const profile = this.profiles[profileType];
    if (!profile) {
      return {
        valid: false,
        errors: [`Unknown profile type: ${profileType}`],
        warnings: []
      };
    }

    // Sanitize input data if enabled
    let sanitizedData = data;
    if (this.sanitizeInputs) {
      sanitizedData = this.sanitizer.sanitizeStructuredData(data, profileType);
    }

    // Create schema from profile definition
    const schema = this.createSchema(profile);
    const validate = this.ajv.compile(schema);
    const valid = validate(sanitizedData);

    const result = {
      valid,
      errors: this.formatErrors(validate.errors || [], profileType),
      warnings: this.checkRecommended(sanitizedData, profile),
      sanitized: this.sanitizeInputs ? sanitizedData : null
    };

    // Add Google Rich Results compliance check
    result.googleRichResults = this.checkGoogleRichResults(sanitizedData, profile);
    
    // Add LLM optimization check
    result.llmOptimization = this.checkLLMOptimization(sanitizedData, profile);

    // Add security warnings for potentially dangerous content
    if (this.sanitizeInputs) {
      result.securityWarnings = this.checkSecurityIssues(data, sanitizedData);
    }

    return result;
  }

  /**
   * Create JSON Schema from profile definition
   * @private
   */
  createSchema(profile) {
    const properties = {
      ...profile.required,
      ...profile.recommended,
      ...profile.optional
    };

    return {
      type: 'object',
      properties,
      required: Object.keys(profile.required),
      additionalProperties: true
    };
  }

  /**
   * Format AJV errors for better readability with field-specific guidance
   * @private
   */
  formatErrors(errors, profileType) {
    return errors.map(error => {
      const fieldName = this.extractFieldName(error.instancePath || error.schemaPath);
      const fieldMetadata = getFieldMetadata(profileType, fieldName);
      
      const baseError = {
        field: fieldName,
        message: error.message,
        value: error.data,
        path: error.instancePath || error.schemaPath
      };

      // Add field-specific guidance if available
      if (fieldMetadata) {
        baseError.guidance = {
          description: fieldMetadata.description,
          examples: fieldMetadata.examples,
          importance: fieldMetadata.importance,
          category: fieldMetadata.category,
          googleRichResults: fieldMetadata.googleRichResults,
          llmOptimized: fieldMetadata.llmOptimized
        };

        // Enhance error message with specific guidance
        baseError.enhancedMessage = this.enhanceErrorMessage(error, fieldMetadata);
        baseError.suggestions = this.getFieldSuggestions(fieldName, fieldMetadata, error);
      }

      return baseError;
    });
  }

  /**
   * Extract field name from error path
   * @private
   */
  extractFieldName(path) {
    if (!path) return '';
    // Remove leading slash and array indices
    return path.replace(/^\//, '').replace(/\[\d+\]/g, '');
  }

  /**
   * Enhance error message with field-specific guidance
   * @private
   */
  enhanceErrorMessage(error, fieldMetadata) {
    let enhancedMessage = error.message;

    // Add specific guidance based on error type
    if (error.keyword === 'required') {
      enhancedMessage = `Required field '${fieldMetadata.name}' is missing. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'type') {
      enhancedMessage = `Field '${fieldMetadata.name}' must be of type ${error.schema}. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'format') {
      enhancedMessage = `Field '${fieldMetadata.name}' has invalid format. Expected ${error.schema} format. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'minLength') {
      enhancedMessage = `Field '${fieldMetadata.name}' is too short. Minimum length is ${error.schema} characters. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'maxLength') {
      enhancedMessage = `Field '${fieldMetadata.name}' is too long. Maximum length is ${error.schema} characters. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'minimum') {
      enhancedMessage = `Field '${fieldMetadata.name}' value is too small. Minimum value is ${error.schema}. ${fieldMetadata.guidance.message}`;
    } else if (error.keyword === 'maximum') {
      enhancedMessage = `Field '${fieldMetadata.name}' value is too large. Maximum value is ${error.schema}. ${fieldMetadata.guidance.message}`;
    }

    return enhancedMessage;
  }

  /**
   * Get field-specific suggestions for fixing errors
   * @private
   */
  getFieldSuggestions(fieldName, fieldMetadata, error) {
    const suggestions = [];

    // Add examples
    if (fieldMetadata.examples && fieldMetadata.examples.length > 0) {
      suggestions.push({
        type: 'examples',
        title: 'Example values:',
        items: fieldMetadata.examples
      });
    }

    // Add type-specific suggestions
    if (error.keyword === 'type') {
      suggestions.push({
        type: 'type-help',
        title: `Expected type: ${error.schema}`,
        items: this.getTypeExamples(error.schema)
      });
    } else if (error.keyword === 'format') {
      suggestions.push({
        type: 'format-help',
        title: `Expected format: ${error.schema}`,
        items: this.getFormatExamples(error.schema)
      });
    }

    // Add field-specific suggestions
    if (fieldName === 'url' || fieldName === 'image') {
      suggestions.push({
        type: 'url-help',
        title: 'URL format:',
        items: ['https://example.com/path', 'Must be a valid HTTP/HTTPS URL']
      });
    } else if (fieldName === 'datePublished' || fieldName === 'dateModified') {
      suggestions.push({
        type: 'date-help',
        title: 'Date format:',
        items: ['2024-01-01T00:00:00Z', '2024-01-01', 'ISO 8601 format preferred']
      });
    } else if (fieldName === 'email') {
      suggestions.push({
        type: 'email-help',
        title: 'Email format:',
        items: ['user@example.com', 'Must be a valid email address']
      });
    }

    return suggestions;
  }

  /**
   * Get type examples for common types
   * @private
   */
  getTypeExamples(type) {
    const examples = {
      'string': ['"text value"', '"example"'],
      'number': ['123', '45.67'],
      'integer': ['123', '456'],
      'boolean': ['true', 'false'],
      'array': ['["item1", "item2"]', '[]'],
      'object': ['{}', '{ "property": "value" }']
    };
    return examples[type] || ['Valid value'];
  }

  /**
   * Get format examples for common formats
   * @private
   */
  getFormatExamples(format) {
    const examples = {
      'date': ['2024-01-01', 'YYYY-MM-DD format'],
      'date-time': ['2024-01-01T00:00:00Z', 'ISO 8601 format'],
      'uri': ['https://example.com', 'Valid URL'],
      'email': ['user@example.com', 'Valid email address'],
      'uri-reference': ['/path', 'Relative or absolute URI']
    };
    return examples[format] || ['Valid format'];
  }

  /**
   * Check for missing recommended fields with enhanced guidance
   * @private
   */
  checkRecommended(data, profile) {
    const warnings = [];
    Object.keys(profile.recommended || {}).forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        const fieldDef = profile.recommended[field];
        const fieldMetadata = getFieldMetadata(profile.type, field);
        
        const warning = {
          field,
          message: `Recommended field '${field}' is missing`,
          description: fieldDef.description || '',
          importance: 'recommended'
        };

        // Add enhanced guidance if field metadata is available
        if (fieldMetadata) {
          warning.guidance = {
            description: fieldMetadata.description,
            examples: fieldMetadata.examples,
            importance: fieldMetadata.importance,
            category: fieldMetadata.category,
            googleRichResults: fieldMetadata.googleRichResults,
            llmOptimized: fieldMetadata.llmOptimized
          };

          // Enhance message with specific guidance
          warning.enhancedMessage = `Recommended field '${field}' is missing. ${fieldMetadata.guidance.message}`;
          warning.suggestions = this.getFieldSuggestions(field, fieldMetadata, { keyword: 'recommended' });
          
          // Add priority based on Google Rich Results and LLM optimization
          if (fieldMetadata.googleRichResults) {
            warning.priority = 'high';
            warning.reason = 'Important for Google Rich Results';
          } else if (fieldMetadata.llmOptimized) {
            warning.priority = 'medium';
            warning.reason = 'Optimized for LLM processing';
          } else {
            warning.priority = 'low';
            warning.reason = 'Recommended for better SEO';
          }
        }

        warnings.push(warning);
      }
    });
    return warnings;
  }

  /**
   * Get field suggestions for a profile type
   * @param {string} profileType - Profile type
   * @param {Object} currentData - Current data object
   * @returns {Object} Field suggestions organized by priority
   */
  getFieldSuggestions(profileType, currentData = {}) {
    return getFieldSuggestions(profileType, currentData);
  }

  /**
   * Get all field metadata for a profile type
   * @param {string} profileType - Profile type
   * @returns {Object} All field metadata organized by importance
   */
  getAllFieldMetadata(profileType) {
    return getAllFieldsMetadata(profileType);
  }

  /**
   * Get field metadata for a specific field
   * @param {string} profileType - Profile type
   * @param {string} fieldName - Field name
   * @returns {Object|null} Field metadata or null if not found
   */
  getFieldMetadata(profileType, fieldName) {
    return getFieldMetadata(profileType, fieldName);
  }

  /**
   * Check Google Rich Results compliance
   * @private
   */
  checkGoogleRichResults(data, profile) {
    const requiredFields = profile.googleRichResults || [];
    const missing = [];
    const present = [];

    requiredFields.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      } else {
        present.push(field);
      }
    });

    return {
      compliant: missing.length === 0,
      coverage: requiredFields.length > 0 ? (present.length / requiredFields.length) * 100 : 100,
      missing,
      present,
      totalRequired: requiredFields.length
    };
  }

  /**
   * Check LLM optimization
   * @private
   */
  checkLLMOptimization(data, profile) {
    const optimizedFields = profile.llmOptimized || [];
    const missing = [];
    const present = [];

    optimizedFields.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missing.push(field);
      } else {
        present.push(field);
      }
    });

    return {
      optimized: missing.length === 0,
      score: optimizedFields.length > 0 ? (present.length / optimizedFields.length) * 100 : 100,
      missing,
      present,
      totalOptimized: optimizedFields.length
    };
  }

  /**
   * Validate multiple data objects
   * @param {Array} dataArray - Array of data objects
   * @param {string} profileType - Profile type
   * @returns {Object} Batch validation result
   */
  validateBatch(dataArray, profileType) {
    const results = dataArray.map((data, index) => ({
      index,
      ...this.validate(data, profileType)
    }));

    const summary = {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      withWarnings: results.filter(r => r.warnings.length > 0).length,
      googleCompliant: results.filter(r => r.googleRichResults?.compliant).length,
      llmOptimized: results.filter(r => r.llmOptimization?.optimized).length
    };

    return {
      summary,
      results
    };
  }

  /**
   * Get validation statistics for a dataset
   * @param {Array} dataArray - Array of data objects
   * @param {string} profileType - Profile type
   * @returns {Object} Statistics
   */
  getValidationStats(dataArray, profileType) {
    const batchResult = this.validateBatch(dataArray, profileType);
    const { summary, results } = batchResult;

    // Calculate field coverage statistics
    const profile = this.profiles[profileType];
    const allFields = [
      ...Object.keys(profile.required || {}),
      ...Object.keys(profile.recommended || {}),
      ...Object.keys(profile.optional || {})
    ];

    const fieldCoverage = {};
    allFields.forEach(field => {
      const presentCount = results.filter(r => 
        r.data && r.data[field] !== undefined && r.data[field] !== null && r.data[field] !== ''
      ).length;
      fieldCoverage[field] = {
        count: presentCount,
        percentage: (presentCount / results.length) * 100
      };
    });

    return {
      ...summary,
      averageGoogleCompliance: results.reduce((sum, r) => sum + (r.googleRichResults?.coverage || 0), 0) / results.length,
      averageLLMOptimization: results.reduce((sum, r) => sum + (r.llmOptimization?.score || 0), 0) / results.length,
      fieldCoverage,
      commonErrors: this.getCommonErrors(results),
      commonWarnings: this.getCommonWarnings(results)
    };
  }

  /**
   * Get most common errors
   * @private
   */
  getCommonErrors(results) {
    const errorCounts = {};
    results.forEach(result => {
      result.errors.forEach(error => {
        const key = `${error.field}: ${error.message}`;
        errorCounts[key] = (errorCounts[key] || 0) + 1;
      });
    });

    return Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([error, count]) => ({ error, count }));
  }

  /**
   * Get most common warnings
   * @private
   */
  getCommonWarnings(results) {
    const warningCounts = {};
    results.forEach(result => {
      result.warnings.forEach(warning => {
        const key = warning.field;
        warningCounts[key] = (warningCounts[key] || 0) + 1;
      });
    });

    return Object.entries(warningCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([field, count]) => ({ field, count }));
  }

  /**
   * Check for security issues in the data
   * @private
   */
  checkSecurityIssues(originalData, sanitizedData) {
    const warnings = [];

    // Check for removed HTML tags
    const checkForHtmlRemoval = (original, sanitized, fieldPath = '') => {
      if (typeof original === 'string' && typeof sanitized === 'string') {
        const originalHtml = original.match(/<[^>]*>/g);
        if (originalHtml && originalHtml.length > 0) {
          warnings.push({
            field: fieldPath,
            message: `HTML tags removed from field: ${originalHtml.join(', ')}`,
            severity: 'medium'
          });
        }
      }
    };

    // Check for removed JavaScript protocols
    const checkForJsProtocols = (original, sanitized, fieldPath = '') => {
      if (typeof original === 'string' && typeof sanitized === 'string') {
        if (original.includes('javascript:') && !sanitized.includes('javascript:')) {
          warnings.push({
            field: fieldPath,
            message: 'JavaScript protocol removed from URL',
            severity: 'high'
          });
        }
      }
    };

    // Check for removed data URIs
    const checkForDataUris = (original, sanitized, fieldPath = '') => {
      if (typeof original === 'string' && typeof sanitized === 'string') {
        if (original.includes('data:') && !sanitized.includes('data:')) {
          warnings.push({
            field: fieldPath,
            message: 'Data URI removed from URL',
            severity: 'medium'
          });
        }
      }
    };

    // Recursively check all fields
    const checkFields = (original, sanitized, path = '') => {
      if (typeof original === 'object' && original !== null) {
        Object.keys(original).forEach(key => {
          const currentPath = path ? `${path}.${key}` : key;
          if (sanitized && sanitized[key] !== undefined) {
            checkFields(original[key], sanitized[key], currentPath);
            checkForHtmlRemoval(original[key], sanitized[key], currentPath);
            checkForJsProtocols(original[key], sanitized[key], currentPath);
            checkForDataUris(original[key], sanitized[key], currentPath);
          }
        });
      }
    };

    checkFields(originalData, sanitizedData);

    return warnings;
  }
}

module.exports = { ProfileValidator };

