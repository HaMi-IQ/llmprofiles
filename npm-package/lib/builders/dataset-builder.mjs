/**
 * DatasetBuilder class for creating Dataset structured data objects
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

export class DatasetBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Dataset', 'content', mode, sanitizeInputs);
  }

  /**
   * Set dataset creator
   * @param {string|Object|Array} creator - Creator name, Person object, or array of creators
   * @param {string} [url] - Creator URL (if creator is string)
   * @returns {DatasetBuilder} This builder for chaining
   */
  creator(creator, url = null) {
    if (typeof creator === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(creator) : creator;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.creator = {
        "@type": "Person",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.creator.url = sanitizedUrl;
    } else if (Array.isArray(creator)) {
      if (this.sanitizeInputs) {
        this.data.creator = creator.map(c => this.sanitizer.sanitizeStructuredData(c, 'Person'));
      } else {
        this.data.creator = creator;
      }
    } else if (creator && typeof creator === 'object') {
      if (this.sanitizeInputs) {
        this.data.creator = this.sanitizer.sanitizeStructuredData(creator, 'Person');
      } else {
        this.data.creator = creator;
      }
    }
    return this;
  }

  /**
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {DatasetBuilder} This builder for chaining
   */
  datePublished(date) {
    if (this.sanitizeInputs) {
      this.data.datePublished = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.datePublished = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set modification date
   * @param {string|Date} date - Modification date
   * @returns {DatasetBuilder} This builder for chaining
   */
  dateModified(date) {
    if (this.sanitizeInputs) {
      this.data.dateModified = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateModified = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set creation date
   * @param {string|Date} date - Creation date
   * @returns {DatasetBuilder} This builder for chaining
   */
  dateCreated(date) {
    if (this.sanitizeInputs) {
      this.data.dateCreated = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateCreated = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set license
   * @param {string|Object} license - License URL or CreativeWork object
   * @returns {DatasetBuilder} This builder for chaining
   */
  license(license) {
    if (typeof license === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(license) : license;
      this.data.license = sanitizedUrl;
    } else if (license && typeof license === 'object') {
      if (this.sanitizeInputs) {
        this.data.license = this.sanitizer.sanitizeStructuredData(license, 'CreativeWork');
      } else {
        this.data.license = license;
      }
    }
    return this;
  }

  /**
   * Set distribution
   * @param {Array} distribution - Array of DataDownload objects
   * @returns {DatasetBuilder} This builder for chaining
   */
  distribution(distribution) {
    if (Array.isArray(distribution)) {
      if (this.sanitizeInputs) {
        this.data.distribution = distribution.map(d => this.sanitizer.sanitizeStructuredData(d, 'DataDownload'));
      } else {
        this.data.distribution = distribution;
      }
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {DatasetBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        keywords = keywords.map(k => this.sanitizer.sanitizeString(k));
      }
      this.data.keywords = keywords.join(', ');
    } else if (typeof keywords === 'string') {
      if (this.sanitizeInputs) {
        this.data.keywords = this.sanitizer.sanitizeString(keywords);
      } else {
        this.data.keywords = keywords;
      }
    }
    return this;
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {DatasetBuilder} This builder for chaining
   */
  inLanguage(language) {
    if (this.sanitizeInputs) {
      this.data.inLanguage = this.sanitizer.sanitizeLanguageCode(language);
    } else {
      this.data.inLanguage = language;
    }
    return this;
  }

  /**
   * Set about topics
   * @param {Array} topics - Array of topics the dataset is about
   * @returns {DatasetBuilder} This builder for chaining
   */
  about(topics) {
    if (Array.isArray(topics)) {
      if (this.sanitizeInputs) {
        this.data.about = topics.map(topic => this.sanitizer.sanitizeString(topic));
      } else {
        this.data.about = topics;
      }
    }
    return this;
  }

  /**
   * Set spatial coverage
   * @param {string|Object} coverage - Spatial coverage string or Place object
   * @returns {DatasetBuilder} This builder for chaining
   */
  spatialCoverage(coverage) {
    if (typeof coverage === 'string') {
      if (this.sanitizeInputs) {
        this.data.spatialCoverage = this.sanitizer.sanitizeString(coverage);
      } else {
        this.data.spatialCoverage = coverage;
      }
    } else if (coverage && typeof coverage === 'object') {
      if (this.sanitizeInputs) {
        this.data.spatialCoverage = this.sanitizer.sanitizeStructuredData(coverage, 'Place');
      } else {
        this.data.spatialCoverage = coverage;
      }
    }
    return this;
  }

  /**
   * Set temporal coverage
   * @param {string} coverage - Time period covered by the dataset
   * @returns {DatasetBuilder} This builder for chaining
   */
  temporalCoverage(coverage) {
    if (this.sanitizeInputs) {
      this.data.temporalCoverage = this.sanitizer.sanitizeString(coverage);
    } else {
      this.data.temporalCoverage = coverage;
    }
    return this;
  }

  /**
   * Set variables measured
   * @param {Array} variables - Array of variables measured in the dataset
   * @returns {DatasetBuilder} This builder for chaining
   */
  variableMeasured(variables) {
    if (Array.isArray(variables)) {
      if (this.sanitizeInputs) {
        this.data.variableMeasured = variables.map(v => this.sanitizer.sanitizeString(v));
      } else {
        this.data.variableMeasured = variables;
      }
    }
    return this;
  }

  /**
   * Set citations
   * @param {Array} citations - Array of citation objects
   * @returns {DatasetBuilder} This builder for chaining
   */
  citation(citations) {
    if (Array.isArray(citations)) {
      if (this.sanitizeInputs) {
        this.data.citation = citations.map(c => this.sanitizer.sanitizeStructuredData(c, 'CreativeWork'));
      } else {
        this.data.citation = citations;
      }
    }
    return this;
  }

  /**
   * Set accessibility status
   * @param {boolean} isAccessible - Whether the dataset is freely accessible
   * @returns {DatasetBuilder} This builder for chaining
   */
  isAccessibleForFree(isAccessible) {
    this.data.isAccessibleForFree = Boolean(isAccessible);
    return this;
  }
}

export default DatasetBuilder; 
