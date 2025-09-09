/**
 * Article builder class for creating Article structured data
 * ES Module version
 */

import { BaseProfileBuilder } from './base-builder.mjs';

export class ArticleBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('Article', 'content', mode, sanitizeInputs);
  }

  /**
   * Set headline
   * @param {string} headline - Article headline
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set description
   * @param {string} description - Article description
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set author
   * @param {string|Object} author - Author name or Person/Organization object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {ArticleBuilder} This builder for chaining
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
   * Set publisher
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @param {string} [logoUrl] - Publisher logo URL
   * @param {number} [logoWidth] - Logo width
   * @param {number} [logoHeight] - Logo height
   * @returns {ArticleBuilder} This builder for chaining
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

export default ArticleBuilder;
