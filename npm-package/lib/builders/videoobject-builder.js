/**
 * VideoObjectBuilder class for creating VideoObject structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class VideoObjectBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('VideoObject', 'content', mode, sanitizeInputs);
  }

  /**
   * Set upload date
   * @param {string|Date} date - Upload date
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  uploadDate(date) {
    if (this.sanitizeInputs) {
      const sanitizedDate = this.sanitizer.sanitizeDate(date);
      // For VideoObject, we need date format (YYYY-MM-DD), not date-time
      this.data.uploadDate = sanitizedDate.split('T')[0];
    } else {
      this.data.uploadDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    }
    return this;
  }

  /**
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * Set duration
   * @param {string} duration - ISO 8601 duration (e.g., 'PT5M30S' for 5 minutes 30 seconds)
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  duration(duration) {
    if (this.sanitizeInputs) {
      this.data.duration = this.sanitizer.sanitizeString(duration);
    } else {
      this.data.duration = duration;
    }
    return this;
  }

  /**
   * Set thumbnail URL
   * @param {string} url - Thumbnail image URL
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  thumbnailUrl(url) {
    if (this.sanitizeInputs) {
      this.data.thumbnailUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.thumbnailUrl = url;
    }
    return this;
  }

  /**
   * Set content URL
   * @param {string} url - Video file URL
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  contentUrl(url) {
    if (this.sanitizeInputs) {
      this.data.contentUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.contentUrl = url;
    }
    return this;
  }

  /**
   * Set embed URL
   * @param {string} url - Embed URL for the video
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  embedUrl(url) {
    if (this.sanitizeInputs) {
      this.data.embedUrl = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.embedUrl = url;
    }
    return this;
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * Set creator
   * @param {string|Object} creator - Creator name or Person object
   * @param {string} [url] - Creator URL (if creator is string)
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  creator(creator, url = null) {
    if (typeof creator === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(creator) : creator;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.creator = {
        "@type": "Person",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.creator.url = sanitizedUrl;
    } else if (creator && typeof creator === 'object') {
      if (this.sanitizeInputs) {
        this.data.creator = this.sanitizer.sanitizeStructuredData(creator, 'Person');
      } else {
        this.data.creator = creator;
      }
    }
    return this;
  }

  /**
   * Set publisher
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * @param {string} genre - Video genre
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {VideoObjectBuilder} This builder for chaining
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
   * Set caption
   * @param {string} caption - Caption or subtitle text
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  caption(caption) {
    if (this.sanitizeInputs) {
      this.data.caption = this.sanitizer.sanitizeString(caption);
    } else {
      this.data.caption = caption;
    }
    return this;
  }

  /**
   * Set transcript
   * @param {string} transcript - Full transcript of the video
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  transcript(transcript) {
    if (this.sanitizeInputs) {
      this.data.transcript = this.sanitizer.sanitizeString(transcript);
    } else {
      this.data.transcript = transcript;
    }
    return this;
  }

  /**
   * Set video width
   * @param {number} width - Width in pixels
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  width(width) {
    if (this.sanitizeInputs) {
      this.data.width = this.sanitizer.sanitizeNumber(width, { min: 1 });
    } else {
      this.data.width = width;
    }
    return this;
  }

  /**
   * Set video height
   * @param {number} height - Height in pixels
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  height(height) {
    if (this.sanitizeInputs) {
      this.data.height = this.sanitizer.sanitizeNumber(height, { min: 1 });
    } else {
      this.data.height = height;
    }
    return this;
  }

  /**
   * Set bitrate
   * @param {string} bitrate - Video bitrate
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  bitrate(bitrate) {
    if (this.sanitizeInputs) {
      this.data.bitrate = this.sanitizer.sanitizeString(bitrate);
    } else {
      this.data.bitrate = bitrate;
    }
    return this;
  }

  /**
   * Set encoding format
   * @param {string} format - Video encoding format (e.g., 'MP4', 'WebM')
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  encodingFormat(format) {
    if (this.sanitizeInputs) {
      this.data.encodingFormat = this.sanitizer.sanitizeString(format);
    } else {
      this.data.encodingFormat = format;
    }
    return this;
  }

  /**
   * Set interaction statistics
   * @param {Array} statistics - Array of InteractionCounter objects
   * @returns {VideoObjectBuilder} This builder for chaining
   */
  interactionStatistic(statistics) {
    if (Array.isArray(statistics)) {
      if (this.sanitizeInputs) {
        this.data.interactionStatistic = statistics.map(stat => this.sanitizer.sanitizeStructuredData(stat, 'InteractionCounter'));
      } else {
        this.data.interactionStatistic = statistics;
      }
    }
    return this;
  }
}

module.exports = { VideoObjectBuilder };
