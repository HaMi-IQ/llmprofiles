/**
 * @fileoverview BookBuilder class for creating Book structured data objects
 * 
 * This module provides a specialized builder for creating Book structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * book-specific properties like author, ISBN, publisher, genre, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic book creation
 * import { BookBuilder, MODES } from './book-builder.mjs';
 * const book = new BookBuilder(MODES.STRICT_SEO)
 *   .name('The Great Gatsby')
 *   .author('F. Scott Fitzgerald')
 *   .isbn('978-0-7432-7356-5')
 *   .publisher('Scribner')
 *   .datePublished('1925-04-10')
 *   .build();
 * 
 * @example
 * // Book with detailed metadata
 * const book = new BookBuilder()
 *   .name('JavaScript: The Good Parts')
 *   .author('Douglas Crockford', 'https://example.com/author')
 *   .isbn('978-0-596-51774-8')
 *   .bookFormat('Paperback')
 *   .numberOfPages(176)
 *   .inLanguage('en')
 *   .publisher('O\'Reilly Media', 'https://oreilly.com')
 *   .genre('Programming')
 *   .keywords(['JavaScript', 'Programming', 'Web Development'])
 *   .aggregateRating(4.5, 120)
 *   .build();
 * 
 * @example
 * // Book with multiple editions
 * const book = new BookBuilder()
 *   .name('Clean Code')
 *   .author('Robert C. Martin')
 *   .addWorkExample({
 *     bookFormat: 'Hardcover',
 *     isbn: '978-0-13-235088-4',
 *     datePublished: '2008-08-01'
 *   })
 *   .addWorkExample({
 *     bookFormat: 'EBook',
 *     isbn: '978-0-13-235088-4',
 *     datePublished: '2008-08-01'
 *   })
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * BookBuilder class for creating Book structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * Book structured data according to Schema.org specifications. Includes
 * support for authors, ISBN, publisher, genre, ratings, and more.
 * 
 * @class BookBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a book builder
 * const bookBuilder = new BookBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const bookBuilder = new BookBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete book
 * const book = new BookBuilder()
 *   .name('The Great Gatsby')
 *   .author('F. Scott Fitzgerald')
 *   .isbn('978-0-7432-7356-5')
 *   .build();
 */
export class BookBuilder extends BaseProfileBuilder {
  /**
   * Create a new BookBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const bookBuilder = new BookBuilder();
   * 
   * @example
   * // Custom configuration
   * const bookBuilder = new BookBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Book', 'content', mode, sanitizeInputs);
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {BookBuilder} This builder for chaining
   */
  author(author, url = null) {
    if (typeof author === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(author) : author;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.author = url ? {
        "@type": "Person",
        "name": sanitizedName,
        "url": sanitizedUrl
      } : sanitizedName;
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
   * Set book format
   * @param {string} format - Book format (e.g., 'Hardcover', 'Paperback', 'EBook')
   * @returns {BookBuilder} This builder for chaining
   */
  bookFormat(format) {
    if (this.sanitizeInputs) {
      this.data.bookFormat = this.sanitizer.sanitizeString(format);
    } else {
      this.data.bookFormat = format;
    }
    return this;
  }

  /**
   * Set ISBN
   * @param {string} isbn - ISBN number
   * @returns {BookBuilder} This builder for chaining
   */
  isbn(isbn) {
    if (this.sanitizeInputs) {
      this.data.isbn = this.sanitizer.sanitizeString(isbn);
    } else {
      this.data.isbn = isbn;
    }
    return this;
  }

  /**
   * Set number of pages
   * @param {number} pages - Number of pages
   * @returns {BookBuilder} This builder for chaining
   */
  numberOfPages(pages) {
    if (this.sanitizeInputs) {
      this.data.numberOfPages = this.sanitizer.sanitizeNumber(pages, { min: 1 });
    } else {
      this.data.numberOfPages = pages;
    }
    return this;
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {BookBuilder} This builder for chaining
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
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {BookBuilder} This builder for chaining
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
   * @returns {BookBuilder} This builder for chaining
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
   * Set publisher
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @returns {BookBuilder} This builder for chaining
   */
  publisher(publisher, url = null) {
    if (typeof publisher === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(publisher) : publisher;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.publisher = {
        "@type": "Organization",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.publisher.url = sanitizedUrl;
    } else if (publisher && typeof publisher === 'object') {
      if (this.sanitizeInputs) {
        this.data.publisher = this.sanitizer.sanitizeStructuredData(publisher, 'Organization');
      } else {
        this.data.publisher = publisher;
      }
    }
    return this;
  }

  /**
   * Set genre
   * @param {string} genre - Book genre
   * @returns {BookBuilder} This builder for chaining
   */
  genre(genre) {
    if (this.sanitizeInputs) {
      this.data.genre = this.sanitizer.sanitizeString(genre);
    } else {
      this.data.genre = genre;
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {BookBuilder} This builder for chaining
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
   * Set about topics
   * @param {Array} topics - Array of topics the book is about
   * @returns {BookBuilder} This builder for chaining
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
   * Set target audience
   * @param {Object} audience - Audience object
   * @returns {BookBuilder} This builder for chaining
   */
  audience(audience) {
    if (this.sanitizeInputs) {
      this.data.audience = this.sanitizer.sanitizeStructuredData(audience, 'Audience');
    } else {
      this.data.audience = audience;
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {number} ratingValue - Rating value
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {BookBuilder} This builder for chaining
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
   * Set reviews
   * @param {Array} reviews - Array of review objects
   * @returns {BookBuilder} This builder for chaining
   */
  review(reviews) {
    if (Array.isArray(reviews)) {
      if (this.sanitizeInputs) {
        this.data.review = reviews.map(review => this.sanitizer.sanitizeStructuredData(review, 'Review'));
      } else {
        this.data.review = reviews;
      }
    }
    return this;
  }
}
