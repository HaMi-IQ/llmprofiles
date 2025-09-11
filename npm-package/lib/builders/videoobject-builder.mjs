/**
 * @fileoverview VideoObjectBuilder class for creating VideoObject structured data objects
 * 
 * This module provides a specialized builder for creating VideoObject structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * video-specific properties like duration, upload date, thumbnail, embed URL,
 * and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic video creation
 * import { VideoObjectBuilder, MODES } from './videoobject-builder.mjs';
 * const video = new VideoObjectBuilder(MODES.STRICT_SEO)
 *   .name('How to Build a Website')
 *   .description('Step-by-step tutorial on building a modern website')
 *   .uploadDate('2024-01-15')
 *   .duration('PT15M30S')
 *   .thumbnailUrl('https://example.com/thumbnail.jpg')
 *   .embedUrl('https://youtube.com/embed/abc123')
 *   .contentUrl('https://youtube.com/watch?v=abc123')
 *   .build();
 * 
 * @example
 * // Video with detailed information
 * const video = new VideoObjectBuilder()
 *   .name('Advanced JavaScript Tutorial')
 *   .description('Learn advanced JavaScript concepts and patterns')
 *   .uploadDate('2024-01-20')
 *   .datePublished('2024-01-20T10:00:00Z')
 *   .duration('PT45M15S')
 *   .thumbnailUrl('https://example.com/js-tutorial-thumb.jpg')
 *   .embedUrl('https://youtube.com/embed/xyz789')
 *   .contentUrl('https://youtube.com/watch?v=xyz789')
 *   .author('Tech Tutorials', 'https://techtutorials.com')
 *   .publisher('Learning Channel', 'https://learningchannel.com')
 *   .keywords(['javascript', 'programming', 'tutorial', 'web development'])
 *   .build();
 * 
 * @example
 * // Video with multiple formats and interactions
 * const video = new VideoObjectBuilder()
 *   .name('Product Demo Video')
 *   .description('Watch our product in action')
 *   .uploadDate('2024-01-10')
 *   .duration('PT8M45S')
 *   .thumbnailUrl('https://example.com/demo-thumb.jpg')
 *   .embedUrl('https://vimeo.com/embed/123456')
 *   .contentUrl('https://vimeo.com/123456')
 *   .interactionStatistic({
 *     "@type": "InteractionCounter",
 *     "interactionType": "https://schema.org/WatchAction",
 *     "userInteractionCount": 1500
 *   })
 *   .aggregateRating(4.7, 200)
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * VideoObjectBuilder class for creating VideoObject structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * VideoObject structured data according to Schema.org specifications. Includes
 * support for video names, descriptions, durations, upload dates, thumbnails,
 * embed URLs, and more.
 * 
 * @class VideoObjectBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a video object builder
 * const videoBuilder = new VideoObjectBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const videoBuilder = new VideoObjectBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete video object
 * const video = new VideoObjectBuilder()
 *   .name('My Video')
 *   .uploadDate('2024-01-01')
 *   .duration('PT5M')
 *   .thumbnailUrl('https://example.com/thumb.jpg')
 *   .build();
 */
export class VideoObjectBuilder extends BaseProfileBuilder {
  /**
   * Create a new VideoObjectBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const videoBuilder = new VideoObjectBuilder();
   * 
   * @example
   * // Custom configuration
   * const videoBuilder = new VideoObjectBuilder(MODES.SPLIT_CHANNELS, false);
   */
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

export default VideoObjectBuilder; 
