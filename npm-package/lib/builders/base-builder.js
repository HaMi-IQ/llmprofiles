/**
 * BaseProfileBuilder class for creating structured data objects
 */

const { ModeConfig, MODES } = require('../modes');
const { defaultSanitizer } = require('../sanitizer');

class BaseProfileBuilder {
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
      const profileUrl = `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`;
      
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
   * @returns {Object|Object[]} The structured data object(s) based on mode
   */
  build(mode = null) {
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
}

module.exports = { BaseProfileBuilder, MODES };
