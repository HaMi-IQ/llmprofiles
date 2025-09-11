/**
 * @fileoverview SoftwareApplicationBuilder class for creating SoftwareApplication structured data objects
 * 
 * This module provides a specialized builder for creating SoftwareApplication structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * application-specific properties like category, operating system, price,
 * download URL, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic software application creation
 * import { SoftwareApplicationBuilder, MODES } from './softwareapplication-builder.mjs';
 * const app = new SoftwareApplicationBuilder(MODES.STRICT_SEO)
 *   .name('Task Manager Pro')
 *   .description('Professional task management application')
 *   .applicationCategory('BusinessApplication')
 *   .operatingSystem('Windows, macOS, Linux')
 *   .price('29.99', 'USD')
 *   .downloadUrl('https://example.com/download')
 *   .build();
 * 
 * @example
 * // Mobile app with detailed information
 * const app = new SoftwareApplicationBuilder()
 *   .name('Photo Editor')
 *   .description('Advanced photo editing app with AI features')
 *   .applicationCategory('MultimediaApplication')
 *   .operatingSystem('iOS, Android')
 *   .price('4.99', 'USD')
 *   .downloadUrl('https://apps.apple.com/photo-editor')
 *   .screenshot('https://example.com/screenshot1.jpg')
 *   .screenshot('https://example.com/screenshot2.jpg')
 *   .aggregateRating(4.5, 1200)
 *   .author('Photo Apps Inc', 'https://photoapps.com')
 *   .datePublished('2024-01-01')
 *   .build();
 * 
 * @example
 * // Free software with system requirements
 * const app = new SoftwareApplicationBuilder()
 *   .name('Code Editor')
 *   .description('Lightweight code editor for developers')
 *   .applicationCategory('DeveloperApplication')
 *   .operatingSystem('Windows, macOS, Linux')
 *   .price('0', 'USD')
 *   .downloadUrl('https://example.com/code-editor')
 *   .systemRequirements('Windows 10, macOS 10.15, Ubuntu 18.04')
 *   .memoryRequirements('512MB RAM')
 *   .storageRequirements('100MB free space')
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * SoftwareApplicationBuilder class for creating SoftwareApplication structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * SoftwareApplication structured data according to Schema.org specifications. Includes
 * support for application categories, operating systems, prices, download URLs,
 * system requirements, and more.
 * 
 * @class SoftwareApplicationBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a software application builder
 * const appBuilder = new SoftwareApplicationBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const appBuilder = new SoftwareApplicationBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete software application
 * const app = new SoftwareApplicationBuilder()
 *   .name('My App')
 *   .applicationCategory('BusinessApplication')
 *   .operatingSystem('Windows')
 *   .price('19.99', 'USD')
 *   .build();
 */
export class SoftwareApplicationBuilder extends BaseProfileBuilder {
  /**
   * Create a new SoftwareApplicationBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const appBuilder = new SoftwareApplicationBuilder();
   * 
   * @example
   * // Custom configuration
   * const appBuilder = new SoftwareApplicationBuilder(MODES.SPLIT_CHANNELS, false);
   */
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
   * Set offers
   * @param {number|Object} price - Price or Offer object
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability
   * @returns {SoftwareApplicationBuilder} This builder for chaining
   */
  offers(price, currency = 'USD', availability = 'InStock') {
    if (typeof price === 'number' || typeof price === 'string') {
      this.data.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      };
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
}

export default SoftwareApplicationBuilder; 
