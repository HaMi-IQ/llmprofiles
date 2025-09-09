/**
 * BaseProfileBuilder class for creating structured data objects
 * ES Module version
 */

import { ModeConfig, MODES } from '../modes.js';
import { defaultSanitizer } from '../sanitizer.js';

// Re-export MODES for use in other builder files
export { MODES };

export class BaseProfileBuilder {
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
   * Build the final structured data object
   * @param {string} [mode] - Override the mode for this build
   * @returns {Object} The structured data object
   */
  build(mode) {
    if (mode && mode !== this.modeConfig.mode) {
      // Rebuild with new mode
      const newBuilder = new this.constructor(this.profileType, this.category, mode, this.sanitizeInputs);
      // Copy all properties except the mode-specific ones
      Object.keys(this.data).forEach(key => {
        if (!['additionalType', 'schemaVersion', 'identifier', 'additionalProperty'].includes(key)) {
          newBuilder.data[key] = this.data[key];
        }
      });
      return newBuilder.build();
    }

    if (this.modeConfig.separatesLLMBlock()) {
      return this.buildSplitChannels();
    }

    return { ...this.data };
  }

  /**
   * Build split channels output
   * @private
   */
  buildSplitChannels() {
    const seoData = { ...this.data };
    const llmData = { ...this.data };

    // Add LLM-specific metadata
    if (this.modeConfig.includesProfileMetadata()) {
      llmData['@context'] = [
        "https://schema.org",
        {
          "llmprofiles": "https://llmprofiles.org/vocab#",
          "profile": {
            "@id": `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`,
            "version": "1.0.0",
            "category": this.category,
            "optimizedFor": ["google-rich-results", "llm-processing"]
          }
        }
      ];
    }

    return {
      seo: seoData,
      llm: llmData
    };
  }

  /**
   * Add a property to the data object
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {BaseProfileBuilder} This builder instance
   */
  addProperty(property, value) {
    if (this.sanitizeInputs && typeof value === 'string') {
      value = this.sanitizer.sanitizeString(value);
    }
    this.data[property] = value;
    return this;
  }

  /**
   * Set the URL property
   * @param {string} url - URL value
   * @returns {BaseProfileBuilder} This builder instance
   */
  url(url) {
    if (this.sanitizeInputs) {
      url = this.sanitizer.sanitizeUrl(url);
    }
    this.data.url = url;
    return this;
  }

  /**
   * Set the name property
   * @param {string} name - Name value
   * @returns {BaseProfileBuilder} This builder instance
   */
  name(name) {
    if (this.sanitizeInputs) {
      name = this.sanitizer.sanitizeString(name);
    }
    this.data.name = name;
    return this;
  }

  /**
   * Set the description property
   * @param {string} description - Description value
   * @returns {BaseProfileBuilder} This builder instance
   */
  description(description) {
    if (this.sanitizeInputs) {
      description = this.sanitizer.sanitizeString(description);
    }
    this.data.description = description;
    return this;
  }

  /**
   * Set the image property
   * @param {string|Object} image - Image URL or object
   * @returns {BaseProfileBuilder} This builder instance
   */
  image(image) {
    if (typeof image === 'string') {
      if (this.sanitizeInputs) {
        image = this.sanitizer.sanitizeUrl(image);
      }
      this.data.image = image;
    } else if (typeof image === 'object' && image !== null) {
      this.data.image = image;
    }
    return this;
  }

  /**
   * Get the rel profile value for HTML
   * @returns {string|null} The rel profile value
   */
  getRelProfile() {
    return this.modeConfig.getRelProfileValue();
  }

  /**
   * Get the link header value for HTTP
   * @returns {string|null} The link header value
   */
  getLinkHeader() {
    return this.modeConfig.getLinkHeaderValue();
  }
}
