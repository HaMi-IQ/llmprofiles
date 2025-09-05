/**
 * Input sanitization utilities for secure data handling
 * ES Module version
 */

/**
 * Sanitization configuration options
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
 * Input sanitization class
 */
export class InputSanitizer {
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

    let sanitized = url.trim();

    // Check maximum length
    if (sanitized.length > this.config.MAX_URL_LENGTH) {
      return null;
    }

    // Remove javascript protocols
    sanitized = this.removeJavaScriptProtocols(sanitized);

    // Check for data URIs (potentially dangerous)
    if (this.config.DATA_URI_PATTERN.test(sanitized)) {
      return null;
    }

    try {
      const urlObj = new URL(sanitized);
      
      // Check if protocol is allowed
      if (!this.config.ALLOWED_URL_PROTOCOLS.includes(urlObj.protocol)) {
        return null;
      }

      return sanitized;
    } catch (error) {
      // Invalid URL
      return null;
    }
  }

  /**
   * Sanitize an email input
   * @param {string} email - Email to sanitize
   * @returns {string|null} Sanitized email or null if invalid
   */
  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') {
      return null;
    }

    let sanitized = email.trim().toLowerCase();

    // Check maximum length
    if (sanitized.length > this.config.MAX_EMAIL_LENGTH) {
      return null;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a phone number input
   * @param {string} phone - Phone number to sanitize
   * @returns {string|null} Sanitized phone or null if invalid
   */
  sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return null;
    }

    let sanitized = phone.trim();

    // Check maximum length
    if (sanitized.length > this.config.MAX_PHONE_LENGTH) {
      return null;
    }

    // Check if phone matches allowed pattern
    if (!this.config.ALLOWED_PHONE_PATTERN.test(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a date input
   * @param {string|Date} date - Date to sanitize
   * @returns {string|null} Sanitized date or null if invalid
   */
  sanitizeDate(date) {
    if (!date) {
      return null;
    }

    try {
      let dateObj;
      
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        return null;
      }

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return null;
      }

      // Check if date is within reasonable range (1900-2100)
      const year = dateObj.getFullYear();
      if (year < 1900 || year > 2100) {
        return null;
      }

      return dateObj.toISOString();
    } catch (error) {
      return null;
    }
  }

  /**
   * Sanitize a number input
   * @param {number|string} number - Number to sanitize
   * @param {Object} options - Sanitization options
   * @returns {number|null} Sanitized number or null if invalid
   */
  sanitizeNumber(number, options = {}) {
    if (number === null || number === undefined) {
      return null;
    }

    let sanitized;

    if (typeof number === 'number') {
      sanitized = number;
    } else if (typeof number === 'string') {
      sanitized = parseFloat(number);
      if (isNaN(sanitized)) {
        return null;
      }
    } else {
      return null;
    }

    // Check min/max bounds
    if (options.min !== undefined && sanitized < options.min) {
      return null;
    }
    if (options.max !== undefined && sanitized > options.max) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a language code input
   * @param {string} languageCode - Language code to sanitize
   * @returns {string|null} Sanitized language code or null if invalid
   */
  sanitizeLanguageCode(languageCode) {
    if (!languageCode || typeof languageCode !== 'string') {
      return null;
    }

    let sanitized = languageCode.trim().toLowerCase();

    // Check maximum length
    if (sanitized.length > this.config.MAX_LANGUAGE_CODE_LENGTH) {
      return null;
    }

    // Check if language code matches allowed pattern
    if (!this.config.ALLOWED_LANGUAGE_PATTERN.test(sanitized)) {
      return null;
    }

    return sanitized;
  }

  /**
   * Sanitize a SKU input
   * @param {string} sku - SKU to sanitize
   * @returns {string|null} Sanitized SKU or null if invalid
   */
  sanitizeSku(sku) {
    if (!sku || typeof sku !== 'string') {
      return null;
    }

    let sanitized = sku.trim();

    // Check maximum length
    if (sanitized.length > this.config.MAX_SKU_LENGTH) {
      return null;
    }

    // Check if SKU matches allowed pattern
    if (!this.config.ALLOWED_SKU_PATTERN.test(sanitized)) {
      return null;
    }

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
    return str.replace(/[<>&"']/g, (char) => this.config.DANGEROUS_CHARS[char] || char);
  }
}

// Create default sanitizer instance
export const defaultSanitizer = new InputSanitizer();

// Default export for CommonJS compatibility
export default {
  InputSanitizer,
  defaultSanitizer
};
