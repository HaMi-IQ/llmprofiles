/**
 * Mode configuration for different output strategies
 */

const MODES = {
  STRICT_SEO: 'strict-seo',
  SPLIT_CHANNELS: 'split-channels',
  STANDARDS_HEADER: 'standards-header'
};

/**
 * Mode configuration class
 */
class ModeConfig {
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

