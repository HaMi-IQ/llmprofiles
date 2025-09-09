/**
 * SoftwareApplicationBuilder class for creating SoftwareApplication structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class SoftwareApplicationBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('SoftwareApplication', 'technology', mode, sanitizeInputs);
  }

  /**
   * Set application category
   * @param {string} category - Application category (e.g., 'Game', 'BusinessApplication')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  applicationCategory(category) {
    if (this.sanitizeInputs) {
      this.data.applicationCategory = this.sanitizer.sanitizeString(category);
    } else {
      this.data.applicationCategory = category;
    }
    return this;
  }

  /**
   * Set application sub-category
   * @param {string} subCategory - Application sub-category
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  applicationSubCategory(subCategory) {
    if (this.sanitizeInputs) {
      this.data.applicationSubCategory = this.sanitizer.sanitizeString(subCategory);
    } else {
      this.data.applicationSubCategory = subCategory;
    }
    return this;
  }

  /**
   * Set application suite
   * @param {string} suite - Application suite name
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  applicationSuite(suite) {
    if (this.sanitizeInputs) {
      this.data.applicationSuite = this.sanitizer.sanitizeString(suite);
    } else {
      this.data.applicationSuite = suite;
    }
    return this;
  }

  /**
   * Set operating system
   * @param {string} os - Operating system (e.g., 'Windows', 'macOS', 'Linux')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  operatingSystem(os) {
    if (this.sanitizeInputs) {
      this.data.operatingSystem = this.sanitizer.sanitizeString(os);
    } else {
      this.data.operatingSystem = os;
    }
    return this;
  }

  /**
   * Set permissions
   * @param {string} permissions - Permissions description
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  permissions(permissions) {
    if (this.sanitizeInputs) {
      this.data.permissions = this.sanitizer.sanitizeString(permissions);
    } else {
      this.data.permissions = permissions;
    }
    return this;
  }

  /**
   * Set software version
   * @param {string} version - Software version (e.g., '1.0.0')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  softwareVersion(version) {
    if (this.sanitizeInputs) {
      this.data.softwareVersion = this.sanitizer.sanitizeString(version);
    } else {
      this.data.softwareVersion = version;
    }
    return this;
  }

  /**
   * Set software requirements
   * @param {string} requirements - Software requirements
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  softwareRequirements(requirements) {
    if (this.sanitizeInputs) {
      this.data.softwareRequirements = this.sanitizer.sanitizeString(requirements);
    } else {
      this.data.softwareRequirements = requirements;
    }
    return this;
  }

  /**
   * Set memory requirements
   * @param {string} memory - Memory requirements (e.g., '4GB RAM')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  memoryRequirements(memory) {
    if (this.sanitizeInputs) {
      this.data.memoryRequirements = this.sanitizer.sanitizeString(memory);
    } else {
      this.data.memoryRequirements = memory;
    }
    return this;
  }

  /**
   * Set storage requirements
   * @param {string} storage - Storage requirements (e.g., '2GB free space')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  storageRequirements(storage) {
    if (this.sanitizeInputs) {
      this.data.storageRequirements = this.sanitizer.sanitizeString(storage);
    } else {
      this.data.storageRequirements = storage;
    }
    return this;
  }

  /**
   * Set processor requirements
   * @param {string} processor - Processor requirements (e.g., 'Intel Core i5')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  processorRequirements(processor) {
    if (this.sanitizeInputs) {
      this.data.processorRequirements = this.sanitizer.sanitizeString(processor);
    } else {
      this.data.processorRequirements = processor;
    }
    return this;
  }

  /**
   * Set feature list
   * @param {string} features - Feature list
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  featureList(features) {
    if (this.sanitizeInputs) {
      this.data.featureList = this.sanitizer.sanitizeString(features);
    } else {
      this.data.featureList = features;
    }
    return this;
  }

  /**
   * Set screenshot
   * @param {string|Object} screenshot - Screenshot URL or ImageObject
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  screenshot(screenshot) {
    if (typeof screenshot === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(screenshot) : screenshot;
      if (sanitizedUrl) {
        this.data.screenshot = {
          "@type": "ImageObject",
          "url": sanitizedUrl
        };
      }
    } else if (screenshot && typeof screenshot === 'object') {
      if (this.sanitizeInputs) {
        this.data.screenshot = this.sanitizer.sanitizeStructuredData(screenshot, 'ImageObject');
      } else {
        this.data.screenshot = screenshot;
      }
    }
    return this;
  }

  /**
   * Set download URL
   * @param {string} url - Download URL
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  downloadUrl(url) {
    if (this.sanitizeInputs) {
      this.data.downloadUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.downloadUrl = url;
    }
    return this;
  }

  /**
   * Set install URL
   * @param {string} url - Install URL
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  installUrl(url) {
    if (this.sanitizeInputs) {
      this.data.installUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.installUrl = url;
    }
    return this;
  }

  /**
   * Set update URL
   * @param {string} url - Update URL
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  updateUrl(url) {
    if (this.sanitizeInputs) {
      this.data.updateUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.updateUrl = url;
    }
    return this;
  }

  /**
   * Set file size
   * @param {string} size - File size (e.g., '50MB')
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  fileSize(size) {
    if (this.sanitizeInputs) {
      this.data.fileSize = this.sanitizer.sanitizeString(size);
    } else {
      this.data.fileSize = size;
    }
    return this;
  }

  /**
   * Set release notes
   * @param {string} notes - Release notes
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  releaseNotes(notes) {
    if (this.sanitizeInputs) {
      this.data.releaseNotes = this.sanitizer.sanitizeString(notes);
    } else {
      this.data.releaseNotes = notes;
    }
    return this;
  }

  /**
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {SoftwareApplicationBuilder} This builder for chaining
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
   * @returns {SoftwareApplicationBuilder} This builder for chaining
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
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  author(author, url = null) {
    if (typeof author === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(author) : author;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.author = {
        "@type": "Person",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.author.url = sanitizedUrl;
    } else if (author && typeof author === 'object') {
      if (this.sanitizeInputs) {
        this.data.author = this.sanitizer.sanitizeStructuredData(author, 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set offers (extended)
   * @param {number|Object} price - Price or Offer object
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability
   * @param {string} [url] - Offer URL
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  offers(price, currency = 'USD', availability = 'InStock', url = null) {
    if (typeof price === 'number' || typeof price === 'string') {
      const offer = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      };
      if (url) {
        offer.url = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      }
      this.data.offers = offer;
    } else {
      this.data.offers = price;
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {number} ratingValue - Rating value
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  aggregateRating(ratingValue, reviewCount, bestRating = 5, worstRating = 1) {
    if (this.sanitizeInputs) {
      ratingValue = this.sanitizer.sanitizeNumber(ratingValue, { min: worstRating, max: bestRating });
      reviewCount = this.sanitizer.sanitizeNumber(reviewCount, { min: 0 });
    }
    this.data.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": bestRating,
      "worstRating": worstRating
    };
    return this;
  }

  /**
   * Set language
   * @param {string} lang - BCP47 language code (e.g., en, en-US)
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  inLanguage(lang) {
    if (this.sanitizeInputs) {
      this.data.inLanguage = this.sanitizer.sanitizeString(lang);
    } else {
      this.data.inLanguage = lang;
    }
    return this;
  }

  /**
   * Add keywords
   * @param {string[]|string} keywords - Array of keywords or comma-separated string
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      this.data.keywords = this.sanitizeInputs ? keywords.map(k => this.sanitizer.sanitizeString(k)) : keywords;
    } else if (typeof keywords === 'string') {
      const parts = keywords.split(',').map(s => s.trim()).filter(Boolean);
      this.data.keywords = this.sanitizeInputs ? parts.map(k => this.sanitizer.sanitizeString(k)) : parts;
    }
    return this;
  }
}

module.exports = { SoftwareApplicationBuilder };
