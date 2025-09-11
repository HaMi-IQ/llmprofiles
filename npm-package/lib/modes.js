/**
 * @fileoverview Mode configuration for different output strategies
 * 
 * This module provides configuration management for different output modes
 * that control how structured data is formatted and what metadata is included.
 * The three modes are designed for different use cases: SEO optimization,
 * split-channel processing, and standards-compliant headers.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic mode usage
 * const { MODES, ModeConfig } = require('./modes');
 * const config = new ModeConfig(MODES.STRICT_SEO);
 * 
 * @example
 * // Check mode capabilities
 * const config = new ModeConfig('split-channels');
 * if (config.separatesLLMBlock()) {
 *   console.log('This mode creates separate LLM blocks');
 * }
 * 
 * @example
 * // Get HTML and HTTP headers for Standards Header mode
 * const config = new ModeConfig(MODES.STANDARDS_HEADER);
 * const relProfile = config.getRelProfileValue();
 * const linkHeader = config.getLinkHeaderValue();
 */

/**
 * Available output modes for structured data generation
 * 
 * @constant {Object} MODES
 * @property {string} STRICT_SEO - Standard SEO-optimized output mode
 * @property {string} SPLIT_CHANNELS - Split channels mode with separate SEO and LLM blocks
 * @property {string} STANDARDS_HEADER - Standards header mode with profile metadata
 * 
 * @example
 * // Use different modes
 * const { MODES } = require('./modes');
 * 
 * // Standard SEO mode (default)
 * const seoMode = MODES.STRICT_SEO;
 * 
 * // Split channels for different processing
 * const splitMode = MODES.SPLIT_CHANNELS;
 * 
 * // Standards header for compliance
 * const headerMode = MODES.STANDARDS_HEADER;
 */
const MODES = {
  /** @type {string} Standard SEO-optimized output mode */
  STRICT_SEO: 'strict-seo',
  /** @type {string} Split channels mode with separate SEO and LLM blocks */
  SPLIT_CHANNELS: 'split-channels',
  /** @type {string} Standards header mode with profile metadata */
  STANDARDS_HEADER: 'standards-header'
};

/**
 * Mode configuration class for managing output strategies
 * 
 * Provides configuration management for different output modes, allowing
 * control over how structured data is formatted and what metadata is included.
 * Each mode is optimized for different use cases and processing requirements.
 * 
 * @class ModeConfig
 * @example
 * // Create mode configuration
 * const config = new ModeConfig(MODES.STRICT_SEO);
 * 
 * @example
 * // Check mode capabilities
 * const config = new ModeConfig('split-channels');
 * if (config.separatesLLMBlock()) {
 *   console.log('This mode creates separate LLM blocks');
 * }
 * 
 * @example
 * // Get configuration object
 * const config = new ModeConfig(MODES.STANDARDS_HEADER);
 * const modeConfig = config.getConfig();
 * console.log('Mode configuration:', modeConfig);
 */
class ModeConfig {
  /**
   * Create a new ModeConfig instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode to configure
   * @throws {Error} When mode is not one of the valid modes
   * 
   * @example
   * // Default mode (Strict SEO)
   * const config = new ModeConfig();
   * 
   * @example
   * // Specific mode
   * const config = new ModeConfig(MODES.SPLIT_CHANNELS);
   * 
   * @example
   * // Invalid mode (will throw error)
   * const config = new ModeConfig('invalid-mode'); // Throws Error
   */
  constructor(mode = MODES.STRICT_SEO) {
    this.mode = mode;
    this.validateMode();
  }

  /**
   * Validate the selected mode
   */
  validateMode() {
    if (!Object.values(MODES).includes(this.mode)) {
      throw new Error(`Invalid mode: ${this.mode}. Valid modes are: ${Object.values(MODES).join(', ')}`);
    }
  }

  /**
   * Get mode-specific configuration
   */
  getConfig() {
    switch (this.mode) {
      case MODES.STRICT_SEO:
        return {
          useAdditionalType: true,
          useSchemaVersion: true,
          useAdditionalProperty: true,
          useIdentifier: true,
          useConformsTo: false,
          includeProfileMetadata: false
        };
      
      case MODES.SPLIT_CHANNELS:
        return {
          useAdditionalType: true,
          useSchemaVersion: true,
          useAdditionalProperty: true,
          useIdentifier: true,
          useConformsTo: false,
          includeProfileMetadata: true,
          separateLLMBlock: true
        };
      
      case MODES.STANDARDS_HEADER:
        return {
          useAdditionalType: true,
          useSchemaVersion: true,
          useAdditionalProperty: true,
          useIdentifier: true,
          useConformsTo: false,
          includeProfileMetadata: true,
          includeRelProfile: true
        };
      
      default:
        return this.getConfig(MODES.STRICT_SEO);
    }
  }

  /**
   * Check if mode uses additionalType
   */
  usesAdditionalType() {
    return this.getConfig().useAdditionalType;
  }

  /**
   * Check if mode uses schemaVersion
   */
  usesSchemaVersion() {
    return this.getConfig().useSchemaVersion;
  }

  /**
   * Check if mode uses additionalProperty
   */
  usesAdditionalProperty() {
    return this.getConfig().useAdditionalProperty;
  }

  /**
   * Check if mode uses identifier
   */
  usesIdentifier() {
    return this.getConfig().useIdentifier;
  }

  /**
   * Check if mode includes profile metadata
   */
  includesProfileMetadata() {
    return this.getConfig().includeProfileMetadata;
  }

  /**
   * Check if mode separates LLM block
   */
  separatesLLMBlock() {
    return this.getConfig().separateLLMBlock;
  }

  /**
   * Check if mode includes rel profile
   */
  includesRelProfile() {
    return this.getConfig().includeRelProfile;
  }

  /**
   * Get HTML rel profile attribute value
   */
  getRelProfileValue() {
    if (!this.includesRelProfile()) return null;
    return 'https://llmprofiles.org/profiles';
  }

  /**
   * Get HTTP Link header value
   */
  getLinkHeaderValue() {
    if (!this.includesRelProfile()) return null;
    return '<https://llmprofiles.org/profiles>; rel="profile"';
  }
}

module.exports = {
  MODES,
  ModeConfig
};

