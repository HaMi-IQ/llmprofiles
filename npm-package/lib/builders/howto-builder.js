/**
 * HowToBuilder class for creating HowTo structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class HowToBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('HowTo', 'content', mode, sanitizeInputs);
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {HowToBuilder} This builder for chaining
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
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {HowToBuilder} This builder for chaining
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
   * @returns {HowToBuilder} This builder for chaining
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
   * Set total time required
   * @param {string} time - ISO 8601 duration (e.g., 'PT30M' for 30 minutes)
   * @returns {HowToBuilder} This builder for chaining
   */
  totalTime(time) {
    if (this.sanitizeInputs) {
      this.data.totalTime = this.sanitizer.sanitizeString(time);
    } else {
      this.data.totalTime = time;
    }
    return this;
  }

  /**
   * Set estimated cost
   * @param {string|Object} cost - Cost string or MonetaryAmount object
   * @param {string} [currency] - Currency code (if cost is string)
   * @returns {HowToBuilder} This builder for chaining
   */
  estimatedCost(cost, currency = 'USD') {
    if (typeof cost === 'string') {
      this.data.estimatedCost = {
        "@type": "MonetaryAmount",
        "currency": currency,
        "value": cost
      };
    } else if (cost && typeof cost === 'object') {
      if (this.sanitizeInputs) {
        this.data.estimatedCost = this.sanitizer.sanitizeStructuredData(cost, 'MonetaryAmount');
      } else {
        this.data.estimatedCost = cost;
      }
    }
    return this;
  }

  /**
   * Set difficulty level
   * @param {string} difficulty - Difficulty level (e.g., 'Easy', 'Medium', 'Hard')
   * @returns {HowToBuilder} This builder for chaining
   */
  difficulty(difficulty) {
    if (this.sanitizeInputs) {
      this.data.difficulty = this.sanitizer.sanitizeString(difficulty);
    } else {
      this.data.difficulty = difficulty;
    }
    return this;
  }

  /**
   * Set prerequisites
   * @param {Array} prerequisites - Array of prerequisite items
   * @returns {HowToBuilder} This builder for chaining
   */
  prerequisites(prerequisites) {
    if (Array.isArray(prerequisites)) {
      if (this.sanitizeInputs) {
        this.data.prerequisites = prerequisites.map(p => this.sanitizer.sanitizeString(p));
      } else {
        this.data.prerequisites = prerequisites;
      }
    }
    return this;
  }

  /**
   * Set tools required
   * @param {Array} tools - Array of tools required
   * @returns {HowToBuilder} This builder for chaining
   */
  tool(tools) {
    if (Array.isArray(tools)) {
      if (this.sanitizeInputs) {
        this.data.tool = tools.map(t => this.sanitizer.sanitizeString(t));
      } else {
        this.data.tool = tools;
      }
    }
    return this;
  }

  /**
   * Set supplies required
   * @param {Array} supplies - Array of supplies required
   * @returns {HowToBuilder} This builder for chaining
   */
  supply(supplies) {
    if (Array.isArray(supplies)) {
      if (this.sanitizeInputs) {
        this.data.supply = supplies.map(s => this.sanitizer.sanitizeString(s));
      } else {
        this.data.supply = supplies;
      }
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {HowToBuilder} This builder for chaining
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
   * Set steps
   * @param {Array} steps - Array of HowToStep objects
   * @returns {HowToBuilder} This builder for chaining
   */
  step(steps) {
    if (Array.isArray(steps)) {
      if (this.sanitizeInputs) {
        this.data.step = steps.map(step => this.sanitizer.sanitizeStructuredData(step, 'HowToStep'));
      } else {
        this.data.step = steps;
      }
    }
    return this;
  }

  /**
   * Add a single step
   * @param {string|Object} step - Step text or HowToStep object
   * @param {string} [name] - Step name (if step is string)
   * @param {string} [url] - Step URL (if step is string)
   * @param {string} [image] - Step image URL (if step is string)
   * @param {number} [position] - Step position (if step is string)
   * @returns {HowToBuilder} This builder for chaining
   */
  addStep(step, name = null, url = null, image = null, position = null) {
    if (!this.data.step) {
      this.data.step = [];
    }

    if (typeof step === 'string') {
      const stepObj = {
        "@type": "HowToStep",
        "text": step
      };
      if (name) stepObj.name = name;
      if (url) stepObj.url = url;
      if (image) stepObj.image = image;
      if (position) stepObj.position = position;
      
      if (this.sanitizeInputs) {
        stepObj.text = this.sanitizer.sanitizeString(stepObj.text);
        if (stepObj.name) stepObj.name = this.sanitizer.sanitizeString(stepObj.name);
        if (stepObj.url) stepObj.url = this.sanitizer.sanitizeUrl(stepObj.url);
        if (stepObj.image) stepObj.image = this.sanitizer.sanitizeUrl(stepObj.image);
      }
      
      this.data.step.push(stepObj);
    } else if (step && typeof step === 'object') {
      if (this.sanitizeInputs) {
        this.data.step.push(this.sanitizer.sanitizeStructuredData(step, 'HowToStep'));
      } else {
        this.data.step.push(step);
      }
    }
    return this;
  }

  /**
   * Set video
   * @param {string|Object} video - Video URL or VideoObject
   * @param {string} [name] - Video name (if video is string)
   * @param {string} [description] - Video description (if video is string)
   * @param {string} [thumbnailUrl] - Video thumbnail URL (if video is string)
   * @returns {HowToBuilder} This builder for chaining
   */
  video(video, name = null, description = null, thumbnailUrl = null) {
    if (typeof video === 'string') {
      const videoObj = {
        "@type": "VideoObject",
        "contentUrl": video
      };
      if (name) videoObj.name = name;
      if (description) videoObj.description = description;
      if (thumbnailUrl) videoObj.thumbnailUrl = thumbnailUrl;
      
      if (this.sanitizeInputs) {
        videoObj.contentUrl = this.sanitizer.sanitizeUrl(videoObj.contentUrl);
        if (videoObj.name) videoObj.name = this.sanitizer.sanitizeString(videoObj.name);
        if (videoObj.description) videoObj.description = this.sanitizer.sanitizeString(videoObj.description);
        if (videoObj.thumbnailUrl) videoObj.thumbnailUrl = this.sanitizer.sanitizeUrl(videoObj.thumbnailUrl);
      }
      
      this.data.video = videoObj;
    } else if (video && typeof video === 'object') {
      if (this.sanitizeInputs) {
        this.data.video = this.sanitizer.sanitizeStructuredData(video, 'VideoObject');
      } else {
        this.data.video = video;
      }
    }
    return this;
  }

  /**
   * Set yield/expected result
   * @param {string} expectedResult - Expected result or output
   * @returns {HowToBuilder} This builder for chaining
   */
  setYield(expectedResult) {
    if (this.sanitizeInputs) {
      this.data.yield = this.sanitizer.sanitizeString(expectedResult);
    } else {
      this.data.yield = expectedResult;
    }
    return this;
  }

  /**
   * Set category
   * @param {string} categoryType - Category or type of the how-to guide
   * @returns {HowToBuilder} This builder for chaining
   */
  setCategory(categoryType) {
    if (this.sanitizeInputs) {
      this.data.category = this.sanitizer.sanitizeString(categoryType);
    } else {
      this.data.category = categoryType;
    }
    return this;
  }

  /**
   * Set language
   * @param {string} language - Language of the content
   * @returns {HowToBuilder} This builder for chaining
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
   * Set main entity
   * @param {Object} mainEntity - Main entity object
   * @returns {HowToBuilder} This builder for chaining
   */
  mainEntity(mainEntity) {
    if (mainEntity && typeof mainEntity === 'object') {
      if (this.sanitizeInputs) {
        this.data.mainEntity = this.sanitizer.sanitizeStructuredData(mainEntity, 'HowTo');
      } else {
        this.data.mainEntity = mainEntity;
      }
    }
    return this;
  }
}

module.exports = { HowToBuilder, MODES };
