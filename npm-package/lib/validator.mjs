/**
 * Profile validation utilities
 * ES Module version
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { defaultSanitizer } from './sanitizer.js';
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
   * Check recommended fields and generate warnings
   * @private
   */
  checkRecommended(data, profile) {
    const warnings = [];
    const recommendedFields = Object.keys(profile.recommended || {});

    recommendedFields.forEach(field => {
      if (!(field in data)) {
        warnings.push({
          field,
          message: `Recommended field '${field}' is missing`,
          description: `This field is recommended for better SEO and LLM optimization`,
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
