/**
 * @fileoverview JobPostingBuilder class for creating JobPosting structured data objects
 * 
 * This module provides a specialized builder for creating JobPosting structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * job-specific properties like title, description, hiring organization, location,
 * salary, requirements, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic job posting creation
 * const { JobPostingBuilder, MODES } = require('./jobposting-builder');
 * const job = new JobPostingBuilder(MODES.STRICT_SEO)
 *   .title('Senior Software Engineer')
 *   .description('We are looking for an experienced software engineer...')
 *   .hiringOrganization('Tech Corp', 'https://techcorp.com')
 *   .jobLocation('San Francisco, CA')
 *   .datePosted('2024-01-01')
 *   .build();
 * 
 * @example
 * // Job posting with detailed information
 * const job = new JobPostingBuilder()
 *   .title('Frontend Developer')
 *   .description('<p>Join our team as a Frontend Developer...</p>')
 *   .hiringOrganization({
 *     "@type": "Organization",
 *     "name": "Innovation Labs",
 *     "url": "https://innovationlabs.com",
 *     "logo": "https://innovationlabs.com/logo.png"
 *   })
 *   .jobLocation({
 *     "@type": "Place",
 *     "address": {
 *       "@type": "PostalAddress",
 *       "addressLocality": "New York",
 *       "addressRegion": "NY",
 *       "addressCountry": "US"
 *     }
 *   })
 *   .employmentType('FULL_TIME')
 *   .baseSalary(80000, 'USD', 'YEAR')
 *   .datePosted('2024-01-15')
 *   .validThrough('2024-02-15')
 *   .build();
 * 
 * @example
 * // Remote job posting
 * const job = new JobPostingBuilder()
 *   .title('Remote Product Manager')
 *   .description('Lead product development for our remote team...')
 *   .hiringOrganization('Remote Corp')
 *   .jobLocation('Remote')
 *   .employmentType('FULL_TIME')
 *   .workHours('40 hours per week')
 *   .datePosted('2024-01-01')
 *   .build();
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

/**
 * JobPostingBuilder class for creating JobPosting structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * JobPosting structured data according to Schema.org specifications. Includes
 * support for job titles, descriptions, organizations, locations, salaries,
 * requirements, and more.
 * 
 * @class JobPostingBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a job posting builder
 * const jobBuilder = new JobPostingBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const jobBuilder = new JobPostingBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete job posting
 * const job = new JobPostingBuilder()
 *   .title('Software Engineer')
 *   .hiringOrganization('Tech Corp')
 *   .jobLocation('San Francisco, CA')
 *   .datePosted('2024-01-01')
 *   .build();
 */
class JobPostingBuilder extends BaseProfileBuilder {
  /**
   * Create a new JobPostingBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const jobBuilder = new JobPostingBuilder();
   * 
   * @example
   * // Custom configuration
   * const jobBuilder = new JobPostingBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Jobposting', 'business', mode, sanitizeInputs);
  }

  /**
   * Set the job title
   * 
   * Sets the title of the job position. This should be clear, descriptive,
   * and match what candidates would expect to see in job listings.
   * 
   * @param {string} title - The job title/position name
   * @returns {JobPostingBuilder} This builder for chaining
   * 
   * @example
   * // Simple job title
   * jobBuilder.title('Software Engineer');
   * 
   * @example
   * // Senior position
   * jobBuilder.title('Senior Frontend Developer');
   * 
   * @example
   * // Specialized role
   * jobBuilder.title('DevOps Engineer - Cloud Infrastructure');
   * 
   * @example
   * // Chained with other methods
   * jobBuilder
   *   .title('Product Manager')
   *   .hiringOrganization('Tech Corp')
   *   .jobLocation('San Francisco, CA');
   */
  title(title) {
    if (this.sanitizeInputs) {
      this.data.title = this.sanitizer.sanitizeString(title);
    } else {
      this.data.title = title;
    }
    return this;
  }

  /**
   * Set the job description
   * 
   * Sets a detailed description of the job position, including responsibilities,
   * requirements, and what the role entails. HTML format is recommended for
   * better formatting and readability.
   * 
   * @param {string} description - The job description (HTML format recommended)
   * @returns {JobPostingBuilder} This builder for chaining
   * 
   * @example
   * // Simple text description
   * jobBuilder.description('We are looking for a skilled software engineer to join our team.');
   * 
   * @example
   * // HTML formatted description
   * jobBuilder.description('<p>Join our innovative team as a <strong>Senior Developer</strong>!</p><ul><li>Build scalable web applications</li><li>Collaborate with cross-functional teams</li><li>Mentor junior developers</li></ul>');
   * 
   * @example
   * // Detailed description with requirements
   * jobBuilder.description(`
   *   <h3>About the Role</h3>
   *   <p>We're seeking a passionate Frontend Developer to join our growing team.</p>
   *   <h3>Responsibilities</h3>
   *   <ul>
   *     <li>Develop responsive web applications using React</li>
   *     <li>Collaborate with designers and backend developers</li>
   *     <li>Write clean, maintainable code</li>
   *   </ul>
   *   <h3>Requirements</h3>
   *   <ul>
   *     <li>3+ years of React experience</li>
   *     <li>Strong JavaScript skills</li>
   *     <li>Experience with modern build tools</li>
   *   </ul>
   * `);
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
   * Set date posted
   * @param {string|Date} date - Date posted (ISO 8601 format)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  datePosted(date) {
    if (date instanceof Date) {
      this.data.datePosted = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } else {
      this.data.datePosted = date;
    }
    return this;
  }

  /**
   * Set the hiring organization
   * 
   * Sets the organization that is hiring for this position. Can accept either
   * a simple string name or a complete Organization object. If URLs are provided
   * with a string name, it will create an Organization object automatically.
   * 
   * @param {string|Object} organization - Organization name or Organization object
   * @param {string} [url] - Organization URL (if organization is string)
   * @param {string} [logo] - Organization logo URL (if organization is string)
   * @returns {JobPostingBuilder} This builder for chaining
   * 
   * @example
   * // Simple organization name
   * jobBuilder.hiringOrganization('Tech Corp');
   * 
   * @example
   * // Organization with URL and logo
   * jobBuilder.hiringOrganization('Innovation Labs', 'https://innovationlabs.com', 'https://innovationlabs.com/logo.png');
   * 
   * @example
   * // Complete Organization object
   * jobBuilder.hiringOrganization({
   *   "@type": "Organization",
   *   "name": "Tech Solutions Inc",
   *   "url": "https://techsolutions.com",
   *   "logo": "https://techsolutions.com/logo.png",
   *   "sameAs": "https://linkedin.com/company/techsolutions"
   * });
   * 
   * @example
   * // Chained with other methods
   * jobBuilder
   *   .title('Software Engineer')
   *   .hiringOrganization('Tech Corp', 'https://techcorp.com')
   *   .jobLocation('San Francisco, CA');
   */
  hiringOrganization(organization, url = null, logo = null) {
    if (typeof organization === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(organization) : organization;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      const sanitizedLogo = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logo) : logo;
      
      this.data.hiringOrganization = {
        "@type": "Organization",
        "name": sanitizedName
      };
      
      if (sanitizedUrl) this.data.hiringOrganization.url = sanitizedUrl;
      if (sanitizedLogo) this.data.hiringOrganization.logo = sanitizedLogo;
    } else if (organization && typeof organization === 'object') {
      if (this.sanitizeInputs) {
        this.data.hiringOrganization = this.sanitizer.sanitizeStructuredData(organization, 'Organization');
      } else {
        this.data.hiringOrganization = organization;
      }
    }
    return this;
  }

  /**
   * Set job location
   * @param {string|Object} location - Location string or Place object
   * @param {string} [locality] - City/locality (if location is string)
   * @param {string} [region] - State/region (if location is string)
   * @param {string} [country] - Country (if location is string)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobLocation(location, locality = null, region = null, country = null) {
    if (typeof location === 'string') {
      const sanitizedLocation = this.sanitizeInputs ? this.sanitizer.sanitizeString(location) : location;
      const sanitizedLocality = this.sanitizeInputs ? this.sanitizer.sanitizeString(locality) : locality;
      const sanitizedRegion = this.sanitizeInputs ? this.sanitizer.sanitizeString(region) : region;
      const sanitizedCountry = this.sanitizeInputs ? this.sanitizer.sanitizeString(country) : country;
      
      this.data.jobLocation = {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": sanitizedLocation
        }
      };
      
      if (sanitizedLocality) this.data.jobLocation.address.addressLocality = sanitizedLocality;
      if (sanitizedRegion) this.data.jobLocation.address.addressRegion = sanitizedRegion;
      if (sanitizedCountry) this.data.jobLocation.address.addressCountry = sanitizedCountry;
    } else if (location && typeof location === 'object') {
      if (this.sanitizeInputs) {
        this.data.jobLocation = this.sanitizer.sanitizeStructuredData(location, 'Place');
      } else {
        this.data.jobLocation = location;
      }
    }
    return this;
  }

  /**
   * Set job location type for remote positions
   * @param {string} locationType - Location type (e.g., "TELECOMMUTE")
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobLocationType(locationType) {
    if (this.sanitizeInputs) {
      this.data.jobLocationType = this.sanitizer.sanitizeString(locationType);
    } else {
      this.data.jobLocationType = locationType;
    }
    return this;
  }

  /**
   * Set employment type
   * @param {string} type - Employment type (FULL_TIME, PART_TIME, etc.)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  employmentType(type) {
    if (this.sanitizeInputs) {
      this.data.employmentType = this.sanitizer.sanitizeString(type);
    } else {
      this.data.employmentType = type;
    }
    return this;
  }

  /**
   * Set valid through date
   * @param {string|Date} date - Expiration date (ISO 8601 format)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  validThrough(date) {
    if (date instanceof Date) {
      this.data.validThrough = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } else {
      this.data.validThrough = date;
    }
    return this;
  }

  /**
   * Set base salary
   * @param {string|number|Object} salary - Salary amount or MonetaryAmount object
   * @param {string} [currency] - Currency code (if salary is number/string)
   * @param {string} [unit] - Unit text (HOUR, DAY, WEEK, MONTH, YEAR)
   * @param {number} [minValue] - Minimum salary value
   * @param {number} [maxValue] - Maximum salary value
   * @returns {JobPostingBuilder} This builder for chaining
   */
  baseSalary(salary, currency = 'USD', unit = 'YEAR', minValue = null, maxValue = null) {
    if (typeof salary === 'number' || typeof salary === 'string') {
      const sanitizedCurrency = this.sanitizeInputs ? this.sanitizer.sanitizeString(currency) : currency;
      const sanitizedUnit = this.sanitizeInputs ? this.sanitizer.sanitizeString(unit) : unit;
      
      this.data.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": sanitizedCurrency,
        "value": {
          "@type": "QuantitativeValue",
          "value": typeof salary === 'string' ? parseFloat(salary) : salary,
          "unitText": sanitizedUnit
        }
      };
      
      if (minValue !== null) this.data.baseSalary.value.minValue = minValue;
      if (maxValue !== null) this.data.baseSalary.value.maxValue = maxValue;
    } else if (salary && typeof salary === 'object') {
      if (this.sanitizeInputs) {
        this.data.baseSalary = this.sanitizer.sanitizeStructuredData(salary, 'MonetaryAmount');
      } else {
        this.data.baseSalary = salary;
      }
    }
    return this;
  }

  /**
   * Set applicant location requirements
   * @param {string|Object} requirements - Country name or Country object
   * @returns {JobPostingBuilder} This builder for chaining
   */
  applicantLocationRequirements(requirements) {
    if (typeof requirements === 'string') {
      const sanitizedRequirements = this.sanitizeInputs ? this.sanitizer.sanitizeString(requirements) : requirements;
      this.data.applicantLocationRequirements = {
        "@type": "Country",
        "name": sanitizedRequirements
      };
    } else if (requirements && typeof requirements === 'object') {
      if (this.sanitizeInputs) {
        this.data.applicantLocationRequirements = this.sanitizer.sanitizeStructuredData(requirements, 'Country');
      } else {
        this.data.applicantLocationRequirements = requirements;
      }
    }
    return this;
  }

  /**
   * Set direct apply capability
   * @param {boolean} directApply - Whether direct application is available
   * @returns {JobPostingBuilder} This builder for chaining
   */
  directApply(directApply) {
    this.data.directApply = Boolean(directApply);
    return this;
  }

  /**
   * Set work hours
   * @param {string} hours - Work hours description
   * @returns {JobPostingBuilder} This builder for chaining
   */
  workHours(hours) {
    if (this.sanitizeInputs) {
      this.data.workHours = this.sanitizer.sanitizeString(hours);
    } else {
      this.data.workHours = hours;
    }
    return this;
  }

  /**
   * Set job benefits
   * @param {string} benefits - Job benefits description
   * @returns {JobPostingBuilder} This builder for chaining
   */
  benefits(benefits) {
    if (this.sanitizeInputs) {
      this.data.benefits = this.sanitizer.sanitizeString(benefits);
    } else {
      this.data.benefits = benefits;
    }
    return this;
  }

  /**
   * Set required skills
   * @param {string|Array} skills - Skills as string or array of strings
   * @returns {JobPostingBuilder} This builder for chaining
   */
  skills(skills) {
    if (typeof skills === 'string') {
      const sanitizedSkills = this.sanitizeInputs ? this.sanitizer.sanitizeString(skills) : skills;
      this.data.skills = [sanitizedSkills];
    } else if (Array.isArray(skills)) {
      if (this.sanitizeInputs) {
        this.data.skills = skills.map(skill => this.sanitizer.sanitizeString(skill));
      } else {
        this.data.skills = skills;
      }
    }
    return this;
  }

  /**
   * Add a skill to the skills array
   * @param {string} skill - Skill to add
   * @returns {JobPostingBuilder} This builder for chaining
   */
  addSkill(skill) {
    if (!this.data.skills) {
      this.data.skills = [];
    }
    
    const sanitizedSkill = this.sanitizeInputs ? this.sanitizer.sanitizeString(skill) : skill;
    this.data.skills.push(sanitizedSkill);
    return this;
  }

  /**
   * Set qualifications
   * @param {string} qualifications - Job qualifications
   * @returns {JobPostingBuilder} This builder for chaining
   */
  qualifications(qualifications) {
    if (this.sanitizeInputs) {
      this.data.qualifications = this.sanitizer.sanitizeString(qualifications);
    } else {
      this.data.qualifications = qualifications;
    }
    return this;
  }

  /**
   * Set responsibilities
   * @param {string} responsibilities - Job responsibilities
   * @returns {JobPostingBuilder} This builder for chaining
   */
  responsibilities(responsibilities) {
    if (this.sanitizeInputs) {
      this.data.responsibilities = this.sanitizer.sanitizeString(responsibilities);
    } else {
      this.data.responsibilities = responsibilities;
    }
    return this;
  }

  /**
   * Set experience requirements
   * @param {string} requirements - Experience requirements
   * @returns {JobPostingBuilder} This builder for chaining
   */
  experienceRequirements(requirements) {
    if (this.sanitizeInputs) {
      this.data.experienceRequirements = this.sanitizer.sanitizeString(requirements);
    } else {
      this.data.experienceRequirements = requirements;
    }
    return this;
  }

  /**
   * Set education requirements
   * @param {string} requirements - Education requirements
   * @returns {JobPostingBuilder} This builder for chaining
   */
  educationRequirements(requirements) {
    if (this.sanitizeInputs) {
      this.data.educationRequirements = this.sanitizer.sanitizeString(requirements);
    } else {
      this.data.educationRequirements = requirements;
    }
    return this;
  }

  /**
   * Set application contact
   * @param {string|Object} contact - Contact email or ContactPoint object
   * @param {string} [contactType] - Contact type (if contact is email)
   * @param {string} [telephone] - Telephone number (if contact is email)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  applicationContact(contact, contactType = 'recruiter', telephone = null) {
    if (typeof contact === 'string') {
      const sanitizedEmail = this.sanitizeInputs ? this.sanitizer.sanitizeString(contact) : contact;
      const sanitizedContactType = this.sanitizeInputs ? this.sanitizer.sanitizeString(contactType) : contactType;
      const sanitizedTelephone = this.sanitizeInputs ? this.sanitizer.sanitizeString(telephone) : telephone;
      
      this.data.applicationContact = {
        "@type": "ContactPoint",
        "email": sanitizedEmail,
        "contactType": sanitizedContactType
      };
      
      if (sanitizedTelephone) this.data.applicationContact.telephone = sanitizedTelephone;
    } else if (contact && typeof contact === 'object') {
      if (this.sanitizeInputs) {
        this.data.applicationContact = this.sanitizer.sanitizeStructuredData(contact, 'ContactPoint');
      } else {
        this.data.applicationContact = contact;
      }
    }
    return this;
  }

  /**
   * Set job URL
   * @param {string} url - Job posting URL
   * @returns {JobPostingBuilder} This builder for chaining
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
   * Set industry
   * @param {string} industry - Industry type
   * @returns {JobPostingBuilder} This builder for chaining
   */
  industry(industry) {
    if (this.sanitizeInputs) {
      this.data.industry = this.sanitizer.sanitizeString(industry);
    } else {
      this.data.industry = industry;
    }
    return this;
  }

  /**
   * Set occupational category
   * @param {string} category - Occupational category
   * @returns {JobPostingBuilder} This builder for chaining
   */
  occupationalCategory(category) {
    if (this.sanitizeInputs) {
      this.data.occupationalCategory = this.sanitizer.sanitizeString(category);
    } else {
      this.data.occupationalCategory = category;
    }
    return this;
  }

  /**
   * Set job start date
   * @param {string|Date} date - Job start date (ISO 8601 format)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobStartDate(date) {
    if (date instanceof Date) {
      this.data.jobStartDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } else {
      this.data.jobStartDate = date;
    }
    return this;
  }

  /**
   * Set immediate start availability
   * @param {boolean} immediateStart - Whether immediate start is available
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobImmediateStart(immediateStart) {
    this.data.jobImmediateStart = Boolean(immediateStart);
    return this;
  }
}

module.exports = { JobPostingBuilder };
