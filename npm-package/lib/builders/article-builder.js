/**
 * @fileoverview ArticleBuilder class for creating Article structured data objects
 * 
 * This module provides a specialized builder for creating Article structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * article-specific properties like headline, author, publisher, dates, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic article creation
 * const { ArticleBuilder, MODES } = require('./article-builder');
 * const article = new ArticleBuilder(MODES.STRICT_SEO)
 *   .headline('Breaking News: Important Update')
 *   .author('John Doe', 'https://example.com/author')
 *   .datePublished('2024-01-01T00:00:00Z')
 *   .publisher('News Corp', 'https://example.com', 'https://example.com/logo.png')
 *   .build();
 * 
 * @example
 * // Article with detailed metadata
 * const article = new ArticleBuilder()
 *   .headline('The Future of Web Development')
 *   .description('An in-depth look at emerging web technologies')
 *   .author({
 *     "@type": "Person",
 *     "name": "Jane Smith",
 *     "url": "https://example.com/author",
 *     "sameAs": "https://twitter.com/janesmith"
 *   })
 *   .datePublished('2024-01-15T10:00:00Z')
 *   .dateModified('2024-01-16T14:30:00Z')
 *   .publisher('Tech Blog', 'https://techblog.com', 'https://techblog.com/logo.png')
 *   .articleBody('<p>Web development is evolving rapidly...</p>')
 *   .keywords(['web development', 'technology', 'programming'])
 *   .wordCount(1500)
 *   .url('https://techblog.com/future-web-dev')
 *   .build();
 * 
 * @example
 * // Article with voice search optimization
 * const article = new ArticleBuilder()
 *   .headline('How to Make Perfect Coffee')
 *   .author('Coffee Expert')
 *   .datePublished('2024-01-01')
 *   .speakable(['h1', '.intro', '.steps'])
 *   .about('Coffee brewing techniques')
 *   .addMention('French Press')
 *   .addMention('Espresso Machine')
 *   .build();
 */

const { BaseProfileBuilder } = require('./base-builder');

/**
 * ArticleBuilder class for creating Article structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * Article structured data according to Schema.org specifications. Includes
 * support for headlines, authors, publishers, dates, content, and more.
 * 
 * @class ArticleBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create an article builder
 * const articleBuilder = new ArticleBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const articleBuilder = new ArticleBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete article
 * const article = new ArticleBuilder()
 *   .headline('Breaking News')
 *   .author('John Doe')
 *   .datePublished('2024-01-01')
 *   .build();
 */
class ArticleBuilder extends BaseProfileBuilder {
  /**
   * Create a new ArticleBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const articleBuilder = new ArticleBuilder();
   * 
   * @example
   * // Custom configuration
   * const articleBuilder = new ArticleBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('Article', 'content', mode, sanitizeInputs);
  }

  /**
   * Set the article headline
   * 
   * Sets the main headline or title of the article. This is typically the
   * most prominent text that appears at the top of the article and should
   * be descriptive and engaging.
   * 
   * @param {string} headline - The article headline/title
   * @returns {ArticleBuilder} This builder for chaining
   * 
   * @example
   * // Simple headline
   * articleBuilder.headline('Breaking News: Major Update');
   * 
   * @example
   * // SEO-optimized headline
   * articleBuilder.headline('How to Build a React App in 2024: Complete Guide');
   * 
   * @example
   * // Chained with other methods
   * articleBuilder
   *   .headline('The Future of AI')
   *   .author('Tech Expert')
   *   .datePublished('2024-01-01');
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
   * Set the article description
   * 
   * Sets a brief description or summary of the article content. This is often
   * used in search results, social media previews, and article listings.
   * Should be concise but informative.
   * 
   * @param {string} description - The article description/summary
   * @returns {ArticleBuilder} This builder for chaining
   * 
   * @example
   * // Simple description
   * articleBuilder.description('A comprehensive guide to modern web development');
   * 
   * @example
   * // SEO-optimized description
   * articleBuilder.description('Learn how to build responsive websites using React, Node.js, and modern CSS techniques. Includes practical examples and best practices.');
   * 
   * @example
   * // Chained with other methods
   * articleBuilder
   *   .headline('React Best Practices')
   *   .description('Essential patterns and techniques for React development')
   *   .author('React Expert');
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
   * Set the article author
   * 
   * Sets the author of the article. Can accept either a simple string name
   * or a complete Person/Organization object. If a URL is provided with a
   * string name, it will create a Person object automatically.
   * 
   * @param {string|Object} author - Author name or Person/Organization object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {ArticleBuilder} This builder for chaining
   * 
   * @example
   * // Simple author name
   * articleBuilder.author('John Doe');
   * 
   * @example
   * // Author with URL
   * articleBuilder.author('Jane Smith', 'https://example.com/author');
   * 
   * @example
   * // Complete Person object
   * articleBuilder.author({
   *   "@type": "Person",
   *   "name": "Robert Johnson",
   *   "url": "https://example.com/author",
   *   "sameAs": "https://twitter.com/robertjohnson"
   * });
   * 
   * @example
   * // Organization as author
   * articleBuilder.author({
   *   "@type": "Organization",
   *   "name": "Tech News Corp",
   *   "url": "https://technews.com"
   * });
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
        this.data.author = this.sanitizer.sanitizeStructuredData(author, author['@type'] || 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set the publication date
   * 
   * Sets the date when the article was first published. This is important
   * for SEO and helps search engines understand the freshness of content.
   * 
   * @param {string|Date} date - Publication date (ISO 8601 format or Date object)
   * @returns {ArticleBuilder} This builder for chaining
   * 
   * @example
   * // ISO 8601 string
   * articleBuilder.datePublished('2024-01-15T10:00:00Z');
   * 
   * @example
   * // Date object
   * articleBuilder.datePublished(new Date('2024-01-15'));
   * 
   * @example
   * // Simple date string
   * articleBuilder.datePublished('2024-01-15');
   * 
   * @example
   * // Chained with other methods
   * articleBuilder
   *   .headline('Breaking News')
   *   .datePublished('2024-01-15T10:00:00Z')
   *   .author('News Reporter');
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
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set image
   * @param {string|Object} image - Image URL or ImageObject
   * @param {number} [width] - Image width (if image is string)
   * @param {number} [height] - Image height (if image is string)
   * @param {string} [caption] - Image caption (if image is string)
   * @returns {ArticleBuilder} This builder for chaining
   */
  image(image, width = null, height = null, caption = null) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      const sanitizedCaption = this.sanitizeInputs ? this.sanitizer.sanitizeString(caption) : caption;
      
      this.data.image = {
        "@type": "ImageObject",
        "url": sanitizedUrl
      };
      
      if (width) this.data.image.width = width;
      if (height) this.data.image.height = height;
      if (caption) this.data.image.caption = sanitizedCaption;
    } else if (image && typeof image === 'object') {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeStructuredData(image, 'ImageObject');
      } else {
        this.data.image = image;
      }
    }
    return this;
  }

  /**
   * Set the article publisher
   * 
   * Sets the publisher of the article. Can accept either a simple string name
   * or a complete Organization object. If URLs are provided with a string name,
   * it will create an Organization object automatically.
   * 
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @param {string} [logoUrl] - Publisher logo URL
   * @param {number} [logoWidth] - Logo width in pixels
   * @param {number} [logoHeight] - Logo height in pixels
   * @returns {ArticleBuilder} This builder for chaining
   * 
   * @example
   * // Simple publisher name
   * articleBuilder.publisher('Tech News');
   * 
   * @example
   * // Publisher with URL and logo
   * articleBuilder.publisher('Tech News', 'https://technews.com', 'https://technews.com/logo.png', 200, 100);
   * 
   * @example
   * // Complete Organization object
   * articleBuilder.publisher({
   *   "@type": "Organization",
   *   "name": "Tech News Corp",
   *   "url": "https://technews.com",
   *   "logo": {
   *     "@type": "ImageObject",
   *     "url": "https://technews.com/logo.png",
   *     "width": 200,
   *     "height": 100
   *   }
   * });
   * 
   * @example
   * // Chained with other methods
   * articleBuilder
   *   .headline('Tech Update')
   *   .publisher('Tech News', 'https://technews.com')
   *   .author('Tech Writer');
   */
  publisher(publisher, url = null, logoUrl = null, logoWidth = null, logoHeight = null) {
    if (typeof publisher === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(publisher) : publisher;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      const sanitizedLogoUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logoUrl) : logoUrl;
      
      this.data.publisher = {
        "@type": "Organization",
        "name": sanitizedName
      };
      
      if (url) this.data.publisher.url = sanitizedUrl;
      if (logoUrl) {
        this.data.publisher.logo = {
          "@type": "ImageObject",
          "url": sanitizedLogoUrl
        };
        if (logoWidth) this.data.publisher.logo.width = logoWidth;
        if (logoHeight) this.data.publisher.logo.height = logoHeight;
      }
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
   * Set article body
   * @param {string} body - Article body content
   * @returns {ArticleBuilder} This builder for chaining
   */
  articleBody(body) {
    if (this.sanitizeInputs) {
      this.data.articleBody = this.sanitizer.sanitizeString(body);
    } else {
      this.data.articleBody = body;
    }
    return this;
  }

  /**
   * Set article section
   * @param {string} section - Article section/category
   * @returns {ArticleBuilder} This builder for chaining
   */
  articleSection(section) {
    if (this.sanitizeInputs) {
      this.data.articleSection = this.sanitizer.sanitizeString(section);
    } else {
      this.data.articleSection = section;
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {ArticleBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        this.data.keywords = keywords.map(k => this.sanitizer.sanitizeString(k));
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
   * Set word count
   * @param {number} count - Word count
   * @returns {ArticleBuilder} This builder for chaining
   */
  wordCount(count) {
    this.data.wordCount = count;
    return this;
  }

  /**
   * Set article URL
   * @param {string} url - Article URL
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set main entity of page
   * @param {string} url - Main entity URL
   * @returns {ArticleBuilder} This builder for chaining
   */
  mainEntityOfPage(url) {
    if (this.sanitizeInputs) {
      this.data.mainEntityOfPage = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.mainEntityOfPage = url;
    }
    return this;
  }

  /**
   * Set speakable specification for voice search
   * @param {Array} cssSelectors - CSS selectors for speakable content
   * @param {Array} [xpaths] - XPath expressions for speakable content
   * @returns {ArticleBuilder} This builder for chaining
   */
  speakable(cssSelectors, xpaths = null) {
    this.data.speakable = {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors
    };
    
    if (xpaths) {
      this.data.speakable.xpath = xpaths;
    }
    
    return this;
  }

  /**
   * Set about topic/subject
   * @param {string|Object} about - Topic string or Thing object
   * @param {string} [description] - Description (if about is string)
   * @returns {ArticleBuilder} This builder for chaining
   */
  about(about, description = null) {
    if (typeof about === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(about) : about;
      const sanitizedDescription = this.sanitizeInputs ? this.sanitizer.sanitizeString(description) : description;
      
      this.data.about = {
        "@type": "Thing",
        "name": sanitizedName
      };
      
      if (description) {
        this.data.about.description = sanitizedDescription;
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
   * Add mention
   * @param {string|Object} mention - Mention string or Thing object
   * @returns {ArticleBuilder} This builder for chaining
   */
  addMention(mention) {
    if (!this.data.mentions) {
      this.data.mentions = [];
    }

    if (typeof mention === 'string') {
      const sanitizedMention = this.sanitizeInputs ? this.sanitizer.sanitizeString(mention) : mention;
      this.data.mentions.push(sanitizedMention);
    } else if (mention && typeof mention === 'object') {
      if (this.sanitizeInputs) {
        const sanitizedMention = this.sanitizer.sanitizeStructuredData(mention, mention['@type'] || 'Thing');
        this.data.mentions.push(sanitizedMention);
      } else {
        this.data.mentions.push(mention);
      }
    }
    return this;
  }

  /**
   * Set mentions array
   * @param {Array} mentions - Array of mention strings or objects
   * @returns {ArticleBuilder} This builder for chaining
   */
  mentions(mentions) {
    if (Array.isArray(mentions)) {
      if (this.sanitizeInputs) {
        this.data.mentions = mentions.map(mention => {
          if (typeof mention === 'string') {
            return this.sanitizer.sanitizeString(mention);
          } else if (mention && typeof mention === 'object') {
            return this.sanitizer.sanitizeStructuredData(mention, mention['@type'] || 'Thing');
          }
          return mention;
        });
      } else {
        this.data.mentions = mentions;
      }
    }
    return this;
  }

  /**
   * Set is part of (article series/collection)
   * @param {string|Object} isPartOf - Series URL or CreativeWorkSeries object
   * @param {string} [name] - Series name (if isPartOf is string)
   * @returns {ArticleBuilder} This builder for chaining
   */
  isPartOf(isPartOf, name = null) {
    if (typeof isPartOf === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(isPartOf) : isPartOf;
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(name) : name;
      
      this.data.isPartOf = {
        "@type": "CreativeWorkSeries",
        "url": sanitizedUrl
      };
      
      if (name) {
        this.data.isPartOf.name = sanitizedName;
      }
    } else if (isPartOf && typeof isPartOf === 'object') {
      if (this.sanitizeInputs) {
        this.data.isPartOf = this.sanitizer.sanitizeStructuredData(isPartOf, 'CreativeWorkSeries');
      } else {
        this.data.isPartOf = isPartOf;
      }
    }
    return this;
  }

  /**
   * Set article ID
   * @param {string} id - Article ID/URL
   * @returns {ArticleBuilder} This builder for chaining
   */
  id(id) {
    if (this.sanitizeInputs) {
      this.data['@id'] = this.sanitizer.sanitizeUrl(id);
    } else {
      this.data['@id'] = id;
    }
    return this;
  }
}

module.exports = { ArticleBuilder };
