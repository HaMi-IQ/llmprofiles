/**
 * Profile validation utilities
 */

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { defaultSanitizer } = require('./sanitizer');

class ProfileValidator {
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
      errors: this.formatErrors(validate.errors || []),
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
   * Format AJV errors for better readability
   * @private
   */
  formatErrors(errors) {
    return errors.map(error => ({
      field: error.instancePath || error.schemaPath,
      message: error.message,
      value: error.data
    }));
  }

  /**
   * Check for missing recommended fields
   * @private
   */
  checkRecommended(data, profile) {
    const warnings = [];
    Object.keys(profile.recommended || {}).forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        const fieldDef = profile.recommended[field];
        const description = fieldDef.description || '';
        warnings.push({
          field,
          message: `Recommended field '${field}' is missing`,
          description,
          importance: 'recommended'
        });
      }
    });
    return warnings;
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

