/**
 * CourseBuilder class for creating Course structured data objects
 */

import { BaseProfileBuilder, MODES } from('./base-builder');

class CourseBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Course', 'content', mode, sanitizeInputs);
  }

  /**
   * Set course provider
   * @param {string|Object} provider - Provider name or Organization object
   * @param {string} [url] - Provider URL (if provider is string)
   * @returns {CourseBuilder} This builder for chaining
   */
  provider(provider, url = null) {
    if (typeof provider === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(provider) : provider;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.provider = {
        "@type": "Organization",
        "name": sanitizedName
      
      if (sanitizedUrl) this.data.provider.url = sanitizedUrl;
    } else if (provider && typeof provider === 'object') {
      if (this.sanitizeInputs) {
        this.data.provider = this.sanitizer.sanitizeStructuredData(provider, 'Organization');
      } else {
        this.data.provider = provider;
      }
    }
    return this;
  }

  /**
   * Set instructor
   * @param {string|Object} instructor - Instructor name or Person object
   * @param {string} [url] - Instructor URL (if instructor is string)
   * @returns {CourseBuilder} This builder for chaining
   */
  instructor(instructor, url = null) {
    if (typeof instructor === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(instructor) : instructor;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.instructor = {
        "@type": "Person",
        "name": sanitizedName
      
      if (sanitizedUrl) this.data.instructor.url = sanitizedUrl;
    } else if (instructor && typeof instructor === 'object') {
      if (this.sanitizeInputs) {
        this.data.instructor = this.sanitizer.sanitizeStructuredData(instructor, 'Person');
      } else {
        this.data.instructor = instructor;
      }
    }
    return this;
  }

  /**
   * Set course prerequisites
   * @param {string} prerequisites - Course prerequisites
   * @returns {CourseBuilder} This builder for chaining
   */
  coursePrerequisites(prerequisites) {
    if (this.sanitizeInputs) {
      this.data.coursePrerequisites = this.sanitizer.sanitizeString(prerequisites);
    } else {
      this.data.coursePrerequisites = prerequisites;
    }
    return this;
  }

  /**
   * Set educational level
   * @param {string} level - Educational level (e.g., 'Beginner', 'Intermediate', 'Advanced')
   * @returns {CourseBuilder} This builder for chaining
   */
  educationalLevel(level) {
    if (this.sanitizeInputs) {
      this.data.educationalLevel = this.sanitizer.sanitizeString(level);
    } else {
      this.data.educationalLevel = level;
    }
    return this;
  }

  /**
   * Set course mode
   * @param {string} mode - Course mode (e.g., 'Online', 'In-person', 'Hybrid')
   * @returns {CourseBuilder} This builder for chaining
   */
  courseMode(mode) {
    if (this.sanitizeInputs) {
      this.data.courseMode = this.sanitizer.sanitizeString(mode);
    } else {
      this.data.courseMode = mode;
    }
    return this;
  }

  /**
   * Set time required
   * @param {string} time - Time required (e.g., 'P40H' for 40 hours)
   * @returns {CourseBuilder} This builder for chaining
   */
  timeRequired(time) {
    if (this.sanitizeInputs) {
      this.data.timeRequired = this.sanitizer.sanitizeString(time);
    } else {
      this.data.timeRequired = time;
    }
    return this;
  }

  /**
   * Set number of credits
   * @param {number} credits - Number of credits
   * @returns {CourseBuilder} This builder for chaining
   */
  numberOfCredits(credits) {
    if (this.sanitizeInputs) {
      this.data.numberOfCredits = this.sanitizer.sanitizeNumber(credits, { min: 1 });
    } else {
      this.data.numberOfCredits = credits;
    }
    return this;
  }

  /**
   * Set educational credential awarded
   * @param {string} credential - Educational credential awarded
   * @returns {CourseBuilder} This builder for chaining
   */
  educationalCredentialAwarded(credential) {
    if (this.sanitizeInputs) {
      this.data.educationalCredentialAwarded = this.sanitizer.sanitizeString(credential);
    } else {
      this.data.educationalCredentialAwarded = credential;
    }
    return this;
  }

  /**
   * Set course offers
   * @param {number|Object} price - Price or Offer object
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability
   * @returns {CourseBuilder} This builder for chaining
   */
  offers(price, currency = 'USD', availability = 'InStock') {
    if (typeof price === 'number' || typeof price === 'string') {
      this.data.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      
    } else {
      this.data.offers = price;
    }
    return this;
  }
}

export { CourseBuilder 
