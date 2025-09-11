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
 * const { CourseBuilder, MODES } = require('./course-builder');
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

const { BaseProfileBuilder, MODES } = require('./base-builder');

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
class CourseBuilder extends BaseProfileBuilder {
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

  /**
   * Set course code
   * @param {string} code - Course code/identifier
   * @returns {CourseBuilder} This builder for chaining
   */
  courseCode(code) {
    if (this.sanitizeInputs) {
      this.data.courseCode = this.sanitizer.sanitizeString(code);
    } else {
      this.data.courseCode = code;
    }
    return this;
  }

  /**
   * Set what the course teaches
   * @param {string|Array} teaches - What the course teaches
   * @returns {CourseBuilder} This builder for chaining
   */
  teaches(teaches) {
    if (Array.isArray(teaches)) {
      if (this.sanitizeInputs) {
        this.data.teaches = teaches.map(item => this.sanitizer.sanitizeString(item));
      } else {
        this.data.teaches = teaches;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.teaches = this.sanitizer.sanitizeString(teaches);
      } else {
        this.data.teaches = teaches;
      }
    }
    return this;
  }

  /**
   * Set course topics/subjects
   * @param {string|Array|Object} about - Course topics
   * @returns {CourseBuilder} This builder for chaining
   */
  about(about) {
    if (Array.isArray(about)) {
      if (this.sanitizeInputs) {
        this.data.about = about.map(item => {
          if (typeof item === 'string') {
            return this.sanitizer.sanitizeString(item);
          } else if (item && typeof item === 'object') {
            return this.sanitizer.sanitizeStructuredData(item, item['@type'] || 'Thing');
          }
          return item;
        });
      } else {
        this.data.about = about;
      }
    } else if (typeof about === 'string') {
      if (this.sanitizeInputs) {
        this.data.about = this.sanitizer.sanitizeString(about);
      } else {
        this.data.about = about;
      }
    } else if (about && typeof about === 'object') {
      if (this.sanitizeInputs) {
        this.data.about = this.sanitizer.sanitizeStructuredData(about, about['@type'] || 'Thing');
      } else {
        this.data.about = about;
      }
    }
    return this;
  }

  /**
   * Set target audience
   * @param {string} role - Educational role
   * @param {string} [type] - Audience type
   * @returns {CourseBuilder} This builder for chaining
   */
  audience(role, type = null) {
    this.data.audience = {
      "@type": "EducationalAudience",
      "educationalRole": this.sanitizeInputs ? this.sanitizer.sanitizeString(role) : role
    };
    if (type) {
      this.data.audience.audienceType = this.sanitizeInputs ? this.sanitizer.sanitizeString(type) : type;
    }
    return this;
  }

  /**
   * Set course language
   * @param {string} language - Language code (BCP-47 format)
   * @returns {CourseBuilder} This builder for chaining
   */
  inLanguage(language) {
    if (this.sanitizeInputs) {
      this.data.inLanguage = this.sanitizer.sanitizeString(language);
    } else {
      this.data.inLanguage = language;
    }
    return this;
  }

  /**
   * Set course keywords
   * @param {string|Array} keywords - Course keywords
   * @returns {CourseBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        this.data.keywords = keywords.map(keyword => this.sanitizer.sanitizeString(keyword));
      } else {
        this.data.keywords = keywords;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.keywords = this.sanitizer.sanitizeString(keywords);
      } else {
        this.data.keywords = keywords;
      }
    }
    return this;
  }

  /**
   * Add course instance
   * @param {string} mode - Course mode
   * @param {string} startDate - Start date
   * @param {string} [endDate] - End date
   * @param {string|Object} [location] - Location
   * @returns {CourseBuilder} This builder for chaining
   */
  addCourseInstance(mode, startDate, endDate = null, location = null) {
    if (!this.data.hasCourseInstance) {
      this.data.hasCourseInstance = [];
    }

    const instance = {
      "@type": "CourseInstance",
      "courseMode": this.sanitizeInputs ? this.sanitizer.sanitizeString(mode) : mode,
      "startDate": this.sanitizeInputs ? this.sanitizer.sanitizeString(startDate) : startDate
    };

    if (endDate) {
      instance.endDate = this.sanitizeInputs ? this.sanitizer.sanitizeString(endDate) : endDate;
    }

    if (location) {
      if (typeof location === 'string') {
        instance.location = this.sanitizeInputs ? this.sanitizer.sanitizeString(location) : location;
      } else if (location && typeof location === 'object') {
        instance.location = this.sanitizeInputs ? 
          this.sanitizer.sanitizeStructuredData(location, 'Place') : location;
      }
    }

    this.data.hasCourseInstance.push(instance);
    return this;
  }

  /**
   * Set course prerequisites with enhanced structure
   * @param {string|Array|Object} prerequisites - Course prerequisites
   * @returns {CourseBuilder} This builder for chaining
   */
  coursePrerequisites(prerequisites) {
    if (Array.isArray(prerequisites)) {
      if (this.sanitizeInputs) {
        this.data.coursePrerequisites = prerequisites.map(prereq => {
          if (typeof prereq === 'string') {
            return this.sanitizer.sanitizeString(prereq);
          } else if (prereq && typeof prereq === 'object') {
            return this.sanitizer.sanitizeStructuredData(prereq, prereq['@type'] || 'Course');
          }
          return prereq;
        });
      } else {
        this.data.coursePrerequisites = prerequisites;
      }
    } else if (typeof prerequisites === 'string') {
      if (this.sanitizeInputs) {
        this.data.coursePrerequisites = this.sanitizer.sanitizeString(prerequisites);
      } else {
        this.data.coursePrerequisites = prerequisites;
      }
    } else if (prerequisites && typeof prerequisites === 'object') {
      if (this.sanitizeInputs) {
        this.data.coursePrerequisites = this.sanitizer.sanitizeStructuredData(prerequisites, prerequisites['@type'] || 'Course');
      } else {
        this.data.coursePrerequisites = prerequisites;
      }
    }
    return this;
  }

  /**
   * Set educational credential awarded
   * @param {string|Object} credential - Credential information
   * @param {string} [description] - Credential description
   * @param {string} [category] - Credential category
   * @returns {CourseBuilder} This builder for chaining
   */
  educationalCredentialAwarded(credential, description = null, category = null) {
    if (typeof credential === 'string') {
      this.data.educationalCredentialAwarded = {
        "@type": "EducationalOccupationalCredential",
        "name": this.sanitizeInputs ? this.sanitizer.sanitizeString(credential) : credential
      };
      if (description) {
        this.data.educationalCredentialAwarded.description = this.sanitizeInputs ? 
          this.sanitizer.sanitizeString(description) : description;
      }
      if (category) {
        this.data.educationalCredentialAwarded.credentialCategory = this.sanitizeInputs ? 
          this.sanitizer.sanitizeString(category) : category;
      }
    } else if (credential && typeof credential === 'object') {
      if (this.sanitizeInputs) {
        this.data.educationalCredentialAwarded = this.sanitizer.sanitizeStructuredData(
          credential, 
          'EducationalOccupationalCredential'
        );
      } else {
        this.data.educationalCredentialAwarded = credential;
      }
    }
    return this;
  }
}

module.exports = { CourseBuilder };
