/**
 * ReviewBuilder class for creating Review structured data objects
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

export class ReviewBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Review', 'business', mode, sanitizeInputs);
  }

  /**
   * Set review rating
   * @param {number} ratingValue - Rating value
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {ReviewBuilder} This builder for chaining
   */
  reviewRating(ratingValue, bestRating = 5, worstRating = 1) {
    if (this.sanitizeInputs) {
      ratingValue = this.sanitizer.sanitizeNumber(ratingValue, { min: worstRating, max: bestRating });
    }
    this.data.reviewRating = {
      "@type": "Rating",
      "ratingValue": ratingValue,
      "bestRating": bestRating,
      "worstRating": worstRating
    };
    return this;
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {ReviewBuilder} This builder for chaining
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
   * Set item reviewed
   * @param {string|Object} item - Item name or Thing object
   * @param {string} [url] - Item URL (if item is string)
   * @returns {ReviewBuilder} This builder for chaining
   */
  itemReviewed(item, url = null) {
    if (typeof item === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(item) : item;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.itemReviewed = {
        "@type": "Thing",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.itemReviewed.url = sanitizedUrl;
    } else if (item && typeof item === 'object') {
      if (this.sanitizeInputs) {
        this.data.itemReviewed = this.sanitizer.sanitizeStructuredData(item, 'Thing');
      } else {
        this.data.itemReviewed = item;
      }
    }
    return this;
  }

  /**
   * Set review body
   * @param {string} body - Review body text
   * @returns {ReviewBuilder} This builder for chaining
   */
  reviewBody(body) {
    if (this.sanitizeInputs) {
      this.data.reviewBody = this.sanitizer.sanitizeString(body);
    } else {
      this.data.reviewBody = body;
    }
    return this;
  }

  /**
   * Set review aspect
   * @param {string} aspect - Review aspect (e.g., 'Quality', 'Value', 'Service')
   * @returns {ReviewBuilder} This builder for chaining
   */
  reviewAspect(aspect) {
    if (this.sanitizeInputs) {
      this.data.reviewAspect = this.sanitizer.sanitizeString(aspect);
    } else {
      this.data.reviewAspect = aspect;
    }
    return this;
  }

  /**
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {ReviewBuilder} This builder for chaining
   */
  datePublished(date) {
    if (this.sanitizeInputs) {
      const sanitizedDate = this.sanitizer.sanitizeDate(date);
      // Convert ISO date-time to date format for Review schema
      this.data.datePublished = sanitizedDate ? sanitizedDate.split('T')[0] : null;
    } else {
      if (date instanceof Date) {
        this.data.datePublished = date.toISOString().split('T')[0];
      } else {
        this.data.datePublished = date;
      }
    }
    return this;
  }

  /**
   * Set modification date
   * @param {string|Date} date - Modification date
   * @returns {ReviewBuilder} This builder for chaining
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
   * @returns {ReviewBuilder} This builder for chaining
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
   * Set headline
   * @param {string} headline - Review headline
   * @returns {ReviewBuilder} This builder for chaining
   */
  headline(headline) {
    if (this.sanitizeInputs) {
      this.data.headline = this.sanitizer.sanitizeString(headline);
    } else {
      this.data.headline = headline;
    }
    return this;
  }

  /**
   * Set review title (alias for headline)
   * @param {string} title - Review title
   * @returns {ReviewBuilder} This builder for chaining
   */
  title(title) {
    return this.headline(title);
  }

  /**
   * Set positive notes
   * @param {string} positive - Positive aspects of the review
   * @returns {ReviewBuilder} This builder for chaining
   */
  positiveNotes(positive) {
    if (this.sanitizeInputs) {
      this.data.positiveNotes = this.sanitizer.sanitizeString(positive);
    } else {
      this.data.positiveNotes = positive;
    }
    return this;
  }

  /**
   * Set negative notes
   * @param {string} negative - Negative aspects of the review
   * @returns {ReviewBuilder} This builder for chaining
   */
  negativeNotes(negative) {
    if (this.sanitizeInputs) {
      this.data.negativeNotes = this.sanitizer.sanitizeString(negative);
    } else {
      this.data.negativeNotes = negative;
    }
    return this;
  }

  /**
   * Set review summary
   * @param {string} summary - Review summary
   * @returns {ReviewBuilder} This builder for chaining
   */
  summary(summary) {
    if (this.sanitizeInputs) {
      this.data.summary = this.sanitizer.sanitizeString(summary);
    } else {
      this.data.summary = summary;
    }
    return this;
  }

  /**
   * Set review URL
   * @param {string} url - URL to the full review
   * @returns {ReviewBuilder} This builder for chaining
   */
  reviewUrl(url) {
    if (this.sanitizeInputs) {
      this.data.url = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.url = url;
    }
    return this;
  }

  /**
   * Set word count
   * @param {number} count - Word count of the review
   * @returns {ReviewBuilder} This builder for chaining
   */
  wordCount(count) {
    if (this.sanitizeInputs) {
      this.data.wordCount = this.sanitizer.sanitizeNumber(count, { min: 1 });
    } else {
      this.data.wordCount = count;
    }
    return this;
  }

  /**
   * Set helpful votes
   * @param {number} votes - Number of helpful votes
   * @returns {ReviewBuilder} This builder for chaining
   */
  helpfulVotes(votes) {
    if (this.sanitizeInputs) {
      this.data.helpfulVotes = this.sanitizer.sanitizeNumber(votes, { min: 0 });
    } else {
      this.data.helpfulVotes = votes;
    }
    return this;
  }

  /**
   * Set total votes
   * @param {number} votes - Total number of votes
   * @returns {ReviewBuilder} This builder for chaining
   */
  totalVotes(votes) {
    if (this.sanitizeInputs) {
      this.data.totalVotes = this.sanitizer.sanitizeNumber(votes, { min: 0 });
    } else {
      this.data.totalVotes = votes;
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {number} ratingValue - Average rating value
   * @param {number} ratingCount - Number of ratings
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {ReviewBuilder} This builder for chaining
   */
  aggregateRating(ratingValue, ratingCount, reviewCount, bestRating = 5, worstRating = 1) {
    if (this.sanitizeInputs) {
      ratingValue = this.sanitizer.sanitizeNumber(ratingValue, { min: worstRating, max: bestRating });
      ratingCount = this.sanitizer.sanitizeNumber(ratingCount, { min: 1 });
      reviewCount = this.sanitizer.sanitizeNumber(reviewCount, { min: 1 });
    }
    
    this.data.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "bestRating": bestRating,
      "worstRating": worstRating,
      "ratingCount": ratingCount,
      "reviewCount": reviewCount
    };
    return this;
  }

  /**
   * Set review count
   * @param {number} count - Number of reviews
   * @returns {ReviewBuilder} This builder for chaining
   */
  reviewCount(count) {
    if (this.sanitizeInputs) {
      this.data.reviewCount = this.sanitizer.sanitizeNumber(count, { min: 1 });
    } else {
      this.data.reviewCount = count;
    }
    return this;
  }

  /**
   * Set rating explanation
   * @param {string} explanation - Explanation of the rating
   * @returns {ReviewBuilder} This builder for chaining
   */
  ratingExplanation(explanation) {
    if (this.sanitizeInputs) {
      this.data.ratingExplanation = this.sanitizer.sanitizeString(explanation);
    } else {
      this.data.ratingExplanation = explanation;
    }
    return this;
  }

  /**
   * Set review images
   * @param {string|Array} images - Image URL or array of image URLs
   * @returns {ReviewBuilder} This builder for chaining
   */
  image(images) {
    if (typeof images === 'string') {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeUrl(images);
      } else {
        this.data.image = images;
      }
    } else if (Array.isArray(images)) {
      if (this.sanitizeInputs) {
        this.data.image = images.map(img => this.sanitizer.sanitizeUrl(img));
      } else {
        this.data.image = images;
      }
    }
    return this;
  }

  /**
   * Set keywords
   * @param {Array} keywords - Array of keywords
   * @returns {ReviewBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        this.data.keywords = keywords.map(keyword => this.sanitizer.sanitizeString(keyword));
      } else {
        this.data.keywords = keywords;
      }
    }
    return this;
  }

  /**
   * Set category
   * @param {string} category - Review category
   * @returns {ReviewBuilder} This builder for chaining
   */
  setCategory(category) {
    if (this.sanitizeInputs) {
      this.data.category = this.sanitizer.sanitizeString(category);
    } else {
      this.data.category = category;
    }
    return this;
  }

  /**
   * Set price range
   * @param {string} range - Price range (e.g., "$10-$20")
   * @returns {ReviewBuilder} This builder for chaining
   */
  priceRange(range) {
    if (this.sanitizeInputs) {
      this.data.priceRange = this.sanitizer.sanitizeString(range);
    } else {
      this.data.priceRange = range;
    }
    return this;
  }

  /**
   * Set accessibility features
   * @param {Array} features - Array of accessibility features
   * @returns {ReviewBuilder} This builder for chaining
   */
  accessibilityFeature(features) {
    if (Array.isArray(features)) {
      if (this.sanitizeInputs) {
        this.data.accessibilityFeature = features.map(feature => this.sanitizer.sanitizeString(feature));
      } else {
        this.data.accessibilityFeature = features;
      }
    }
    return this;
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., "en", "en-US")
   * @returns {ReviewBuilder} This builder for chaining
   */
  inLanguage(language) {
    if (this.sanitizeInputs) {
      this.data.inLanguage = this.sanitizer.sanitizeString(language);
    } else {
      this.data.inLanguage = language;
    }
    return this;
  }
}

export default ReviewBuilder;