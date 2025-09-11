/**
 * @fileoverview Input sanitization utilities for secure data handling
 * 
 * This module provides comprehensive input sanitization functionality to ensure
 * that structured data is safe and properly formatted. It includes validation
 * and sanitization for various data types including strings, URLs, emails,
 * phone numbers, dates, and complex structured data objects.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic sanitization
 * const { InputSanitizer, defaultSanitizer } = require('./sanitizer');
 * const sanitizer = new InputSanitizer();
 * const cleanString = sanitizer.sanitizeString('<script>alert("xss")</script>');
 * 
 * @example
 * // Sanitize structured data
 * const sanitized = defaultSanitizer.sanitizeStructuredData(myData, 'Article');
 * 
 * @example
 * // Custom sanitization configuration
 * const customSanitizer = new InputSanitizer({
 *   MAX_STRING_LENGTH: 5000,
 *   ALLOWED_URL_PROTOCOLS: ['https:']
 * });
 */

/**
 * Default sanitization configuration options
 * 
 * @constant {Object} SANITIZATION_CONFIG
 * @property {number} MAX_STRING_LENGTH - Maximum length for string inputs
 * @property {number} MAX_URL_LENGTH - Maximum length for URL inputs
 * @property {number} MAX_EMAIL_LENGTH - Maximum length for email inputs
 * @property {number} MAX_PHONE_LENGTH - Maximum length for phone number inputs
 * @property {number} MAX_SKU_LENGTH - Maximum length for SKU inputs
 * @property {number} MAX_LANGUAGE_CODE_LENGTH - Maximum length for language code inputs
 * @property {string[]} ALLOWED_URL_PROTOCOLS - Allowed URL protocols
 * @property {RegExp} ALLOWED_LANGUAGE_PATTERN - Pattern for valid language codes
 * @property {RegExp} ALLOWED_PHONE_PATTERN - Pattern for valid phone numbers
 * @property {RegExp} ALLOWED_SKU_PATTERN - Pattern for valid SKUs
 * @property {RegExp} HTML_TAG_PATTERN - Pattern for HTML tags
 * @property {RegExp} SCRIPT_TAG_PATTERN - Pattern for script tags
 * @property {RegExp} JAVASCRIPT_PROTOCOL_PATTERN - Pattern for JavaScript protocols
 * @property {RegExp} DATA_URI_PATTERN - Pattern for data URIs
 * @property {Object} DANGEROUS_CHARS - Mapping of dangerous characters to HTML entities
 */
const SANITIZATION_CONFIG = {
  // Maximum string lengths
  MAX_STRING_LENGTH: 10000,
  MAX_URL_LENGTH: 2048,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 50,
  MAX_SKU_LENGTH: 100,
  MAX_LANGUAGE_CODE_LENGTH: 10,
  
  // Allowed characters for different field types
  ALLOWED_URL_PROTOCOLS: ['http:', 'https:', 'mailto:', 'tel:'],
  ALLOWED_LANGUAGE_PATTERN: /^[a-z]{2}(-[A-Z]{2})?$/,
  ALLOWED_PHONE_PATTERN: /^[\+]?[0-9\s\-\(\)\.]+$/,
  ALLOWED_SKU_PATTERN: /^[a-zA-Z0-9\-_]+$/,
  
  // HTML/script tag patterns to remove
  HTML_TAG_PATTERN: /<[^>]*>/g,
  SCRIPT_TAG_PATTERN: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  JAVASCRIPT_PROTOCOL_PATTERN: /javascript:/gi,
  DATA_URI_PATTERN: /^data:/i,
  
  // Dangerous characters to escape
  DANGEROUS_CHARS: {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '&': '&amp;'
  }
};

/**
 * Input sanitization class for secure data handling
 * 
 * Provides comprehensive sanitization functionality for various data types
 * to ensure structured data is safe, properly formatted, and free from
 * potentially malicious content.
 * 
 * @class InputSanitizer
 * @example
 * // Create sanitizer with default configuration
 * const sanitizer = new InputSanitizer();
 * 
 * @example
 * // Create sanitizer with custom configuration
 * const sanitizer = new InputSanitizer({
 *   MAX_STRING_LENGTH: 5000,
 *   ALLOWED_URL_PROTOCOLS: ['https:']
 * });
 * 
 * @example
 * // Sanitize various data types
 * const cleanString = sanitizer.sanitizeString('<script>alert("xss")</script>');
 * const cleanUrl = sanitizer.sanitizeUrl('https://example.com');
 * const cleanEmail = sanitizer.sanitizeEmail('user@example.com');
 */
class InputSanitizer {
  /**
   * Create a new InputSanitizer instance
   * 
   * @param {Object} [config={}] - Custom configuration options to override defaults
   * @param {number} [config.MAX_STRING_LENGTH] - Maximum length for string inputs
   * @param {number} [config.MAX_URL_LENGTH] - Maximum length for URL inputs
   * @param {number} [config.MAX_EMAIL_LENGTH] - Maximum length for email inputs
   * @param {number} [config.MAX_PHONE_LENGTH] - Maximum length for phone number inputs
   * @param {number} [config.MAX_SKU_LENGTH] - Maximum length for SKU inputs
   * @param {number} [config.MAX_LANGUAGE_CODE_LENGTH] - Maximum length for language code inputs
   * @param {string[]} [config.ALLOWED_URL_PROTOCOLS] - Allowed URL protocols
   * @param {RegExp} [config.ALLOWED_LANGUAGE_PATTERN] - Pattern for valid language codes
   * @param {RegExp} [config.ALLOWED_PHONE_PATTERN] - Pattern for valid phone numbers
   * @param {RegExp} [config.ALLOWED_SKU_PATTERN] - Pattern for valid SKUs
   * @param {RegExp} [config.HTML_TAG_PATTERN] - Pattern for HTML tags
   * @param {RegExp} [config.SCRIPT_TAG_PATTERN] - Pattern for script tags
   * @param {RegExp} [config.JAVASCRIPT_PROTOCOL_PATTERN] - Pattern for JavaScript protocols
   * @param {RegExp} [config.DATA_URI_PATTERN] - Pattern for data URIs
   * @param {Object} [config.DANGEROUS_CHARS] - Mapping of dangerous characters to HTML entities
   */
  constructor(config = {}) {
    this.config = { ...SANITIZATION_CONFIG, ...config };
  }

  /**
   * Sanitize a string input
   * @param {string} input - Input string to sanitize
   * @param {Object} options - Sanitization options
   * @returns {string} Sanitized string
   */
  sanitizeString(input, options = {}) {
    if (input === null || input === undefined) {
      return '';
    }

    // Convert to string
    let sanitized = String(input);

    // Trim whitespace
    sanitized = sanitized.trim();

    // Check maximum length
    const maxLength = options.maxLength || this.config.MAX_STRING_LENGTH;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    // Remove HTML tags if not allowed
    if (!options.allowHtml) {
      sanitized = this.removeHtmlTags(sanitized);
    }

    // Remove script tags and javascript protocols
    sanitized = this.removeScriptTags(sanitized);
    sanitized = this.removeJavaScriptProtocols(sanitized);

    // Escape dangerous characters if not allowing HTML
    if (!options.allowHtml) {
      sanitized = this.escapeHtml(sanitized);
    }

    // Normalize whitespace
    if (options.normalizeWhitespace !== false) {
      sanitized = sanitized.replace(/\s+/g, ' ');
    }

    return sanitized;
  }

  /**
   * Sanitize a URL input
   * @param {string} url - URL to sanitize
   * @returns {string|null} Sanitized URL or null if invalid
   */
  sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const sanitized = this.sanitizeString(url, { 
      maxLength: this.config.MAX_URL_LENGTH,
      allowHtml: false 
    });

    if (!sanitized) {
      return null;
    }

    try {
      const urlObj = new URL(sanitized);
      
      // Check protocol
      if (!this.config.ALLOWED_URL_PROTOCOLS.includes(urlObj.protocol)) {
        return null;
      }

      // Remove javascript: and data: protocols
      if (this.config.JAVASCRIPT_PROTOCOL_PATTERN.test(urlObj.href) ||
          this.config.DATA_URI_PATTERN.test(urlObj.href)) {
        return null;
      }

      return urlObj.href;
    } catch (error) {
      // Invalid URL
      return null;
    }
  }

  /**
   * Sanitize an email address
   * @param {string} email - Email to sanitize
   * @returns {string|null} Sanitized email or null if invalid
   */
  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') {
      return null;
    }

    const sanitized = this.sanitizeString(email, { 
      maxLength: this.config.MAX_EMAIL_LENGTH,
      allowHtml: false 
    });

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitized)) {
      return null;
    }

    return sanitized.toLowerCase();
  }

  /**
   * Sanitize a phone number
   * @param {string} phone - Phone number to sanitize
   * @returns {string|null} Sanitized phone or null if invalid
   */
  sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return null;
    }

    const sanitized = this.sanitizeString(phone, { 
      maxLength: this.config.MAX_PHONE_LENGTH,
      allowHtml: false 
    });

    if (!this.config.ALLOWED_PHONE_PATTERN.test(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a language code
   * @param {string} language - Language code to sanitize
   * @returns {string|null} Sanitized language code or null if invalid
   */
  sanitizeLanguageCode(language) {
    if (!language || typeof language !== 'string') {
      return null;
    }

    const sanitized = this.sanitizeString(language, { 
      maxLength: this.config.MAX_LANGUAGE_CODE_LENGTH,
      allowHtml: false 
    });

    if (!this.config.ALLOWED_LANGUAGE_PATTERN.test(sanitized)) {
      return null;
    }

    return sanitized.toLowerCase();
  }

  /**
   * Sanitize a SKU
   * @param {string} sku - SKU to sanitize
   * @returns {string|null} Sanitized SKU or null if invalid
   */
  sanitizeSku(sku) {
    if (!sku || typeof sku !== 'string') {
      return null;
    }

    const sanitized = this.sanitizeString(sku, { 
      maxLength: this.config.MAX_SKU_LENGTH,
      allowHtml: false 
    });

    if (!this.config.ALLOWED_SKU_PATTERN.test(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a number input
   * @param {*} input - Input to sanitize
   * @param {Object} options - Options for number validation
   * @returns {number|null} Sanitized number or null if invalid
   */
  sanitizeNumber(input, options = {}) {
    if (input === null || input === undefined) {
      return null;
    }

    const num = Number(input);
    
    if (isNaN(num) || !isFinite(num)) {
      return null;
    }

    // Check bounds
    if (options.min !== undefined && num < options.min) {
      return null;
    }
    if (options.max !== undefined && num > options.max) {
      return null;
    }

    // Round if specified
    if (options.decimals !== undefined) {
      return Math.round(num * Math.pow(10, options.decimals)) / Math.pow(10, options.decimals);
    }

    return num;
  }

  /**
   * Sanitize a date input
   * @param {*} input - Date input to sanitize
   * @returns {string|null} ISO date string or null if invalid
   */
  sanitizeDate(input) {
    if (!input) {
      return null;
    }

    let date;
    
    if (input instanceof Date) {
      date = input;
    } else if (typeof input === 'string') {
      // Sanitize string first
      const sanitized = this.sanitizeString(input, { allowHtml: false });
      date = new Date(sanitized);
    } else {
      return null;
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    // Check if date is reasonable (not too far in past/future)
    const now = new Date();
    const minDate = new Date(1900, 0, 1);
    const maxDate = new Date(now.getFullYear() + 100, 11, 31);

    if (date < minDate || date > maxDate) {
      return null;
    }

    return date.toISOString();
  }

  /**
   * Sanitize an array of strings
   * @param {Array} input - Array to sanitize
   * @param {Object} options - Sanitization options
   * @returns {Array} Sanitized array
   */
  sanitizeStringArray(input, options = {}) {
    if (!Array.isArray(input)) {
      return [];
    }

    const maxItems = options.maxItems || 100;
    const sanitized = input
      .slice(0, maxItems)
      .map(item => this.sanitizeString(item, options))
      .filter(item => item.length > 0);

    return sanitized;
  }

  /**
   * Remove HTML tags from string
   * @private
   */
  removeHtmlTags(str) {
    return str.replace(this.config.HTML_TAG_PATTERN, '');
  }

  /**
   * Remove script tags from string
   * @private
   */
  removeScriptTags(str) {
    return str.replace(this.config.SCRIPT_TAG_PATTERN, '');
  }

  /**
   * Remove javascript protocols from string
   * @private
   */
  removeJavaScriptProtocols(str) {
    return str.replace(this.config.JAVASCRIPT_PROTOCOL_PATTERN, '');
  }

  /**
   * Escape HTML characters
   * @private
   */
  escapeHtml(str) {
    return str.replace(/[<>&"']/g, char => this.config.DANGEROUS_CHARS[char] || char);
  }

  /**
   * Validate and sanitize structured data object
   * @param {Object} data - Data object to sanitize
   * @param {string} profileType - Profile type for context
   * @returns {Object} Sanitized data object
   */
  sanitizeStructuredData(data, profileType) {
    if (!data || typeof data !== 'object') {
      return {};
    }

    const sanitized = { ...data };

    // Sanitize common string fields
    const stringFields = [
      'name', 'title', 'headline', 'description', 'articleBody', 
      'keywords', 'articleSection', 'employmentType', 'priceRange',
      'telephone', 'streetAddress', 'addressLocality', 'addressRegion',
      'addressCountry', 'postalCode', 'brand', 'sku'
    ];

    stringFields.forEach(field => {
      if (sanitized[field] && typeof sanitized[field] === 'string') {
        sanitized[field] = this.sanitizeString(sanitized[field]);
      }
    });

    // Sanitize URL fields
    const urlFields = ['url', 'mainEntityOfPage'];
    urlFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = this.sanitizeUrl(sanitized[field]);
      }
    });

    // Sanitize language code
    if (sanitized.inLanguage) {
      sanitized.inLanguage = this.sanitizeLanguageCode(sanitized.inLanguage);
    }

    // Sanitize phone number
    if (sanitized.telephone) {
      sanitized.telephone = this.sanitizePhone(sanitized.telephone);
    }

    // Sanitize SKU
    if (sanitized.sku) {
      sanitized.sku = this.sanitizeSku(sanitized.sku);
    }

    // Sanitize dates
    const dateFields = ['datePublished', 'dateModified', 'datePosted', 'startDate', 'endDate'];
    dateFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = this.sanitizeDate(sanitized[field]);
      }
    });

    // Sanitize numbers
    if (sanitized.wordCount) {
      sanitized.wordCount = this.sanitizeNumber(sanitized.wordCount, { min: 0, max: 1000000 });
    }

    if (sanitized.price) {
      sanitized.price = this.sanitizeNumber(sanitized.price, { min: 0, decimals: 2 });
    }

    // Sanitize nested objects
    if (sanitized.author && typeof sanitized.author === 'object') {
      sanitized.author = this.sanitizeStructuredData(sanitized.author, 'Person');
    }

    if (sanitized.publisher && typeof sanitized.publisher === 'object') {
      sanitized.publisher = this.sanitizeStructuredData(sanitized.publisher, 'Organization');
    }

    if (sanitized.hiringOrganization && typeof sanitized.hiringOrganization === 'object') {
      sanitized.hiringOrganization = this.sanitizeStructuredData(sanitized.hiringOrganization, 'Organization');
    }

    if (sanitized.brand && typeof sanitized.brand === 'object') {
      sanitized.brand = this.sanitizeStructuredData(sanitized.brand, 'Brand');
    }

    if (sanitized.address && typeof sanitized.address === 'object') {
      sanitized.address = this.sanitizeStructuredData(sanitized.address, 'PostalAddress');
    }

    if (sanitized.location && typeof sanitized.location === 'object') {
      sanitized.location = this.sanitizeStructuredData(sanitized.location, 'Place');
    }

    if (sanitized.organizer && typeof sanitized.organizer === 'object') {
      sanitized.organizer = this.sanitizeStructuredData(sanitized.organizer, 'Organization');
    }

    if (sanitized.image && typeof sanitized.image === 'object') {
      sanitized.image = this.sanitizeStructuredData(sanitized.image, 'ImageObject');
    }

    if (sanitized.offers && typeof sanitized.offers === 'object') {
      sanitized.offers = this.sanitizeStructuredData(sanitized.offers, 'Offer');
    }

    if (sanitized.baseSalary && typeof sanitized.baseSalary === 'object') {
      sanitized.baseSalary = this.sanitizeStructuredData(sanitized.baseSalary, 'MonetaryAmount');
    }

    if (sanitized.aggregateRating && typeof sanitized.aggregateRating === 'object') {
      sanitized.aggregateRating = this.sanitizeStructuredData(sanitized.aggregateRating, 'AggregateRating');
    }

    if (sanitized.geo && typeof sanitized.geo === 'object') {
      sanitized.geo = this.sanitizeStructuredData(sanitized.geo, 'GeoCoordinates');
    }

    // Sanitize arrays
    if (Array.isArray(sanitized.openingHours)) {
      sanitized.openingHours = this.sanitizeStringArray(sanitized.openingHours);
    }

    if (Array.isArray(sanitized.keywords)) {
      sanitized.keywords = this.sanitizeStringArray(sanitized.keywords);
    }

    return sanitized;
  }
}

// Create default instance
const defaultSanitizer = new InputSanitizer();

module.exports = {
  InputSanitizer,
  defaultSanitizer,
  SANITIZATION_CONFIG
};
