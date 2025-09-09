/**
 * BookBuilder class for creating Book structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class BookBuilder extends BaseProfileBuilder {
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

  /**
   * Set unique ID for the book
   * @param {string} id - Unique ID in URL format
   * @returns {BookBuilder} This builder for chaining
   */
  id(id) {
    if (this.sanitizeInputs) {
      this.data['@id'] = this.sanitizer.sanitizeUrl(id);
    } else {
      this.data['@id'] = id;
    }
    return this;
  }

  /**
   * Set book URL
   * @param {string} url - URL where the book is described
   * @returns {BookBuilder} This builder for chaining
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
   * Set sameAs reference URL
   * @param {string} url - Reference page URL (e.g., Wikipedia, Library of Congress)
   * @returns {BookBuilder} This builder for chaining
   */
  sameAs(url) {
    if (this.sanitizeInputs) {
      this.data.sameAs = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.sameAs = url;
    }
    return this;
  }

  /**
   * Set book edition
   * @param {string} edition - Edition information (e.g., '2nd Edition')
   * @returns {BookBuilder} This builder for chaining
   */
  bookEdition(edition) {
    if (this.sanitizeInputs) {
      this.data.bookEdition = this.sanitizer.sanitizeString(edition);
    } else {
      this.data.bookEdition = edition;
    }
    return this;
  }

  /**
   * Add work example (book edition)
   * @param {Object} edition - Edition object with required properties
   * @returns {BookBuilder} This builder for chaining
   */
  addWorkExample(edition) {
    if (!this.data.workExample) {
      this.data.workExample = [];
    }

    const editionObj = {
      "@type": "Book",
      "@id": edition.id || `${this.data['@id'] || 'book'}-edition-${this.data.workExample.length + 1}`,
      "bookFormat": edition.bookFormat,
      "inLanguage": edition.inLanguage,
      "isbn": edition.isbn,
      "potentialAction": edition.potentialAction
    };

    // Add optional properties
    if (edition.name) editionObj.name = edition.name;
    if (edition.author) editionObj.author = edition.author;
    if (edition.bookEdition) editionObj.bookEdition = edition.bookEdition;
    if (edition.datePublished) editionObj.datePublished = edition.datePublished;
    if (edition.identifier) editionObj.identifier = edition.identifier;
    if (edition.sameAs) editionObj.sameAs = edition.sameAs;
    if (edition.url) editionObj.url = edition.url;

    if (this.sanitizeInputs) {
      this.data.workExample.push(this.sanitizer.sanitizeStructuredData(editionObj, 'Book'));
    } else {
      this.data.workExample.push(editionObj);
    }
    return this;
  }

  /**
   * Set illustrator
   * @param {string|Object} illustrator - Illustrator name or Person object
   * @param {string} [url] - Illustrator URL (if illustrator is string)
   * @returns {BookBuilder} This builder for chaining
   */
  illustrator(illustrator, url = null) {
    if (typeof illustrator === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(illustrator) : illustrator;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.illustrator = url ? {
        "@type": "Person",
        "name": sanitizedName,
        "url": sanitizedUrl
      } : sanitizedName;
    } else if (illustrator && typeof illustrator === 'object') {
      if (this.sanitizeInputs) {
        this.data.illustrator = this.sanitizer.sanitizeStructuredData(illustrator, 'Person');
      } else {
        this.data.illustrator = illustrator;
      }
    }
    return this;
  }

  /**
   * Set translator
   * @param {string|Object} translator - Translator name or Person object
   * @param {string} [url] - Translator URL (if translator is string)
   * @returns {BookBuilder} This builder for chaining
   */
  translator(translator, url = null) {
    if (typeof translator === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(translator) : translator;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.translator = url ? {
        "@type": "Person",
        "name": sanitizedName,
        "url": sanitizedUrl
      } : sanitizedName;
    } else if (translator && typeof translator === 'object') {
      if (this.sanitizeInputs) {
        this.data.translator = this.sanitizer.sanitizeStructuredData(translator, 'Person');
      } else {
        this.data.translator = translator;
      }
    }
    return this;
  }

  /**
   * Set copyright year
   * @param {number} year - Copyright year
   * @returns {BookBuilder} This builder for chaining
   */
  copyrightYear(year) {
    if (this.sanitizeInputs) {
      this.data.copyrightYear = this.sanitizer.sanitizeNumber(year, { min: 1000, max: 3000 });
    } else {
      this.data.copyrightYear = year;
    }
    return this;
  }

  /**
   * Set copyright holder
   * @param {string|Object} holder - Copyright holder name or Person/Organization object
   * @param {string} [url] - Holder URL (if holder is string)
   * @param {string} [type] - Holder type: 'Person' or 'Organization' (default: 'Organization')
   * @returns {BookBuilder} This builder for chaining
   */
  copyrightHolder(holder, url = null, type = 'Organization') {
    if (typeof holder === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(holder) : holder;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.copyrightHolder = url ? {
        "@type": type,
        "name": sanitizedName,
        "url": sanitizedUrl
      } : sanitizedName;
    } else if (holder && typeof holder === 'object') {
      if (this.sanitizeInputs) {
        this.data.copyrightHolder = this.sanitizer.sanitizeStructuredData(holder, holder['@type'] || 'Organization');
      } else {
        this.data.copyrightHolder = holder;
      }
    }
    return this;
  }

  /**
   * Set awards
   * @param {string} awards - Awards or recognition received by the book
   * @returns {BookBuilder} This builder for chaining
   */
  awards(awards) {
    if (this.sanitizeInputs) {
      this.data.awards = this.sanitizer.sanitizeString(awards);
    } else {
      this.data.awards = awards;
    }
    return this;
  }

  /**
   * Set citation
   * @param {string} citation - Citation information for the book
   * @returns {BookBuilder} This builder for chaining
   */
  citation(citation) {
    if (this.sanitizeInputs) {
      this.data.citation = this.sanitizer.sanitizeString(citation);
    } else {
      this.data.citation = citation;
    }
    return this;
  }
}

module.exports = { BookBuilder };
