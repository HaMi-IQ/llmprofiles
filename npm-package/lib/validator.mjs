/**
 * Profile validation utilities
 * ES Module version
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { defaultSanitizer } from './sanitizer.mjs';
import { 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions,
  FIELD_IMPORTANCE 
} from './field-metadata.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const profiles = JSON.parse(readFileSync(join(__dirname, '../profiles/index.json'), 'utf8'));

export class ProfileValidator {
  constructor(sanitizeInputs = true) {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);
    this.profiles = profiles;
    this.sanitizeInputs = sanitizeInputs;
    this.sanitizer = defaultSanitizer;
  }

  /**
   * Validate data against a profile
   * @param {Object} data - Data to validate
   * @param {string} profileType - Profile type
   * @returns {Object} Validation result
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
    const googleFields = profile.googleRichResults || [];
    const present = googleFields.filter(field => field in data);
    const missing = googleFields.filter(field => !(field in data));

    return {
      compliant: missing.length === 0,
      coverage: googleFields.length > 0 ? (present.length / googleFields.length) * 100 : 100,
      missing,
      present,
      totalRequired: googleFields.length
    };
  }

  /**
   * Check LLM optimization
   * @private
   */
  checkLLMOptimization(data, profile) {
    const llmFields = profile.llmOptimized || [];
    const present = llmFields.filter(field => field in data);
    const missing = llmFields.filter(field => !(field in data));

    return {
      optimized: missing.length === 0,
      score: llmFields.length > 0 ? (present.length / llmFields.length) * 100 : 100,
      missing,
      present,
      totalOptimized: llmFields.length
    };
  }

  /**
   * Check for security issues in sanitized data
   * @private
   */
  checkSecurityIssues(originalData, sanitizedData) {
    const warnings = [];

    // Check for HTML tags that were removed
    const checkForRemovedTags = (original, sanitized, fieldPath = '') => {
      if (typeof original === 'string' && typeof sanitized === 'string') {
        const originalTags = (original.match(/<[^>]*>/g) || []).length;
        const sanitizedTags = (sanitized.match(/<[^>]*>/g) || []).length;
        
        if (originalTags > sanitizedTags) {
          const removedTags = original.match(/<[^>]*>/g) || [];
          warnings.push({
            field: fieldPath,
            message: `HTML tags removed from field: ${removedTags.join(', ')}`,
            severity: 'medium'
          });
        }
      } else if (typeof original === 'object' && typeof sanitized === 'object') {
        Object.keys(original).forEach(key => {
          if (original[key] !== sanitized[key]) {
            checkForRemovedTags(original[key], sanitized[key], fieldPath ? `${fieldPath}.${key}` : key);
          }
        });
      }
    };

    checkForRemovedTags(originalData, sanitizedData);

    return warnings;
  }

  /**
   * Validate multiple data objects in batch
   * @param {Array} dataArray - Array of data objects to validate
   * @param {string} profileType - Profile type
   * @returns {Object} Batch validation result
   */
  validateBatch(dataArray, profileType) {
    const results = dataArray.map((data, index) => ({
      ...this.validate(data, profileType),
      index
    }));

    const summary = {
      total: dataArray.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      withWarnings: results.filter(r => r.warnings.length > 0).length,
      googleCompliant: results.filter(r => r.googleRichResults.compliant).length,
      llmOptimized: results.filter(r => r.llmOptimization.optimized).length
    };

    return {
      summary,
      results
    };
  }

  /**
   * Get validation statistics for a batch of data
   * @param {Array} dataArray - Array of data objects
   * @param {string} profileType - Profile type
   * @returns {Object} Validation statistics
   */
  getValidationStats(dataArray, profileType) {
    const batchResult = this.validateBatch(dataArray, profileType);
    const results = batchResult.results;

    // Calculate average compliance scores
    const avgGoogleCompliance = results.reduce((sum, r) => sum + r.googleRichResults.coverage, 0) / results.length;
    const avgLLMOptimization = results.reduce((sum, r) => sum + r.llmOptimization.score, 0) / results.length;

    // Calculate field coverage
    const fieldCoverage = {};
    const profile = this.profiles[profileType];
    if (profile) {
      const allFields = [
        ...Object.keys(profile.required || {}),
        ...Object.keys(profile.recommended || {}),
        ...Object.keys(profile.optional || {})
      ];

      allFields.forEach(field => {
        const count = results.filter(r => field in r.sanitized || field in r).length;
        fieldCoverage[field] = {
          count,
          percentage: (count / results.length) * 100
        };
      });
    }

    // Find common errors
    const errorCounts = {};
    results.forEach(r => {
      r.errors.forEach(error => {
        const key = error.message;
        errorCounts[key] = (errorCounts[key] || 0) + 1;
      });
    });
    const commonErrors = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Find common warnings
    const warningCounts = {};
    results.forEach(r => {
      r.warnings.forEach(warning => {
        const key = warning.field;
        warningCounts[key] = (warningCounts[key] || 0) + 1;
      });
    });
    const commonWarnings = Object.entries(warningCounts)
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      ...batchResult.summary,
      averageGoogleCompliance: avgGoogleCompliance,
      averageLLMOptimization: avgLLMOptimization,
      fieldCoverage,
      commonErrors,
      commonWarnings
    };
  }
}

// Default export for CommonJS compatibility
export default ProfileValidator;
