/**
 * @fileoverview CourseBuilder class for creating Course structured data objects
 * 
 * This module provides a specialized builder for creating Course structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * course-specific properties like provider, instructor, prerequisites, duration,
 * and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic course creation
 * import { CourseBuilder, MODES } from './course-builder.mjs';
 * const course = new CourseBuilder(MODES.STRICT_SEO)
 *   .name('Introduction to JavaScript')
 *   .description('Learn the fundamentals of JavaScript programming')
 *   .provider('Tech Academy', 'https://techacademy.com')
 *   .instructor('John Smith', 'https://techacademy.com/instructor')
 *   .courseMode('online')
 *   .build();
 * 
 * @example
 * // Course with detailed information
 * const course = new CourseBuilder()
 *   .name('Advanced React Development')
 *   .description('Master advanced React concepts and patterns')
 *   .provider({
 *     "@type": "Organization",
 *     "name": "React University",
 *     "url": "https://reactuniversity.com",
 *     "logo": "https://reactuniversity.com/logo.png"
 *   })
 *   .instructor({
 *     "@type": "Person",
 *     "name": "Sarah Johnson",
 *     "url": "https://reactuniversity.com/instructor/sarah",
 *     "sameAs": "https://twitter.com/sarahreact"
 *   })
 *   .courseMode('online')
 *   .timeRequired('PT40H')
 *   .coursePrerequisites('Basic JavaScript knowledge')
 *   .educationalCredentialAwarded('Certificate of Completion')
 *   .build();
 * 
 * @example
 * // Course with multiple instructors and prerequisites
 * const course = new CourseBuilder()
 *   .name('Full-Stack Web Development')
 *   .description('Complete course covering frontend and backend development')
 *   .provider('Web Dev Academy')
 *   .instructor('Frontend Expert')
 *   .addInstructor('Backend Specialist')
 *   .coursePrerequisites(['HTML', 'CSS', 'Basic Programming'])
 *   .timeRequired('PT120H')
 *   .courseMode('blended')
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * CourseBuilder class for creating Course structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * Course structured data according to Schema.org specifications. Includes
 * support for providers, instructors, prerequisites, duration, modes,
 * and more.
 * 
 * @class CourseBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a course builder
 * const courseBuilder = new CourseBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const courseBuilder = new CourseBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete course
 * const course = new CourseBuilder()
 *   .name('JavaScript Basics')
 *   .provider('Tech Academy')
 *   .instructor('Expert Teacher')
 *   .build();
 */
export class CourseBuilder extends BaseProfileBuilder {
  /**
   * Create a new CourseBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const courseBuilder = new CourseBuilder();
   * 
   * @example
   * // Custom configuration
   * const courseBuilder = new CourseBuilder(MODES.SPLIT_CHANNELS, false);
   */
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
      };
      
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
      };
      
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
      };
    } else {
      this.data.offers = price;
    }
    return this;
  }
}

export { CourseBuilder };
