/**
 * Builder classes for creating structured data objects
 */

const { ModeConfig, MODES } = require('./modes');
const { defaultSanitizer } = require('./sanitizer');

class BaseProfileBuilder {
  constructor(profileType, category, mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    this.data = {
      "@context": "https://schema.org",
      "@type": profileType
    };
    this.profileType = profileType;
    this.category = category;
    this.modeConfig = new ModeConfig(mode);
    this.sanitizeInputs = sanitizeInputs;
    this.sanitizer = defaultSanitizer;
    
    // Add mode-specific properties
    this.applyModeProperties();
  }

  /**
   * Apply mode-specific properties
   * @private
   */
  applyModeProperties() {
    if (this.category && this.profileType) {
      const profileUrl = `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`;
      
      if (this.modeConfig.usesAdditionalType()) {
        this.data.additionalType = profileUrl;
      }
      
      if (this.modeConfig.usesSchemaVersion()) {
        this.data.schemaVersion = profileUrl;
      }
      
      if (this.modeConfig.usesIdentifier()) {
        this.data.identifier = profileUrl;
      }
      
      if (this.modeConfig.usesAdditionalProperty()) {
        this.data.additionalProperty = {
          "@type": "PropertyValue",
          "name": "profile",
          "value": profileUrl
        };
      }
    }
  }

  /**
   * Build the final JSON-LD object
   * @param {string} [mode] - Override the mode for this build
   * @returns {Object|Object[]} The structured data object(s) based on mode
   */
  build(mode = null) {
    if (mode) {
      const tempModeConfig = new ModeConfig(mode);
      return this.buildWithMode(tempModeConfig);
    }
    return this.buildWithMode(this.modeConfig);
  }

  /**
   * Build with specific mode configuration
   * @private
   */
  buildWithMode(modeConfig) {
    if (modeConfig.separatesLLMBlock()) {
      return this.buildSplitChannels();
    }
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Build split channels output (SEO + LLM blocks)
   * @private
   */
  buildSplitChannels() {
    const seoBlock = JSON.parse(JSON.stringify(this.data));
    const llmBlock = this.buildLLMBlock();
    
    return {
      seo: seoBlock,
      llm: llmBlock
    };
  }

  /**
   * Build LLM-specific block with profile metadata
   * @private
   */
  buildLLMBlock() {
    const profileUrl = `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`;
    const llmData = {
      "@context": [
        "https://schema.org",
        "https://llmprofiles.org/contexts/llm.jsonld"
      ],
      "@type": this.profileType,
      "additionalType": profileUrl,
      "schemaVersion": profileUrl,
      "identifier": profileUrl,
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "profile",
        "value": profileUrl
      }
    };

    // Copy all data except mode-specific properties
    Object.keys(this.data).forEach(key => {
      if (!['additionalType', 'schemaVersion', 'identifier', 'additionalProperty'].includes(key)) {
        llmData[key] = this.data[key];
      }
    });

    return llmData;
  }

  /**
   * Get HTML rel profile attribute for Standards Header mode
   * @returns {string|null} rel profile value or null if not applicable
   */
  getRelProfile() {
    return this.modeConfig.getRelProfileValue();
  }

  /**
   * Get HTTP Link header for Standards Header mode
   * @returns {string|null} Link header value or null if not applicable
   */
  getLinkHeader() {
    return this.modeConfig.getLinkHeaderValue();
  }

  /**
   * Add any custom property
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  addProperty(property, value) {
    if (this.sanitizeInputs && typeof value === 'string') {
      this.data[property] = this.sanitizer.sanitizeString(value);
    } else {
      this.data[property] = value;
    }
    return this;
  }

  /**
   * Add URL
   * @param {string} url - URL
   * @returns {BaseProfileBuilder} This builder for chaining
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
   * Add name
   * @param {string} name - Name
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  name(name) {
    if (this.sanitizeInputs) {
      this.data.name = this.sanitizer.sanitizeString(name);
    } else {
      this.data.name = name;
    }
    return this;
  }

  /**
   * Add description
   * @param {string} description - Description
   * @returns {BaseProfileBuilder} This builder for chaining
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
   * Add image
   * @param {string|Object} image - Image URL or ImageObject
   * @returns {BaseProfileBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      if (sanitizedUrl) {
        this.data.image = {
          "@type": "ImageObject",
          "url": sanitizedUrl
        };
      }
    } else if (image && typeof image === 'object') {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeStructuredData(image, 'ImageObject');
      } else {
        this.data.image = image;
      }
    }
    return this;
  }
}

class ArticleBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
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
   * Set author
   * @param {string|Object} author - Author name or Person object
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
    this.data.dateModified = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set publisher
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @param {string} [logoUrl] - Publisher logo URL
   * @returns {ArticleBuilder} This builder for chaining
   */
  publisher(publisher, url = null, logoUrl = null) {
    if (typeof publisher === 'string') {
      this.data.publisher = {
        "@type": "Organization",
        "name": publisher
      };
      if (url) this.data.publisher.url = url;
      if (logoUrl) {
        this.data.publisher.logo = {
          "@type": "ImageObject",
          "url": logoUrl
        };
      }
    } else {
      this.data.publisher = publisher;
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
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {ArticleBuilder} This builder for chaining
   */
  keywords(keywords) {
    this.data.keywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
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
   * Set article ID
   * @param {string} id - Article ID/URL
   * @returns {ArticleBuilder} This builder for chaining
   */
  id(id) {
    this.data['@id'] = id;
    return this;
  }

  /**
   * Set main entity of page
   * @param {string} url - Main entity URL
   * @returns {ArticleBuilder} This builder for chaining
   */
  mainEntityOfPage(url) {
    this.data.mainEntityOfPage = url;
    return this;
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {ArticleBuilder} This builder for chaining
   */
  inLanguage(language) {
    this.data.inLanguage = language;
    return this;
  }

  /**
   * Set article section
   * @param {string} section - Article section/category
   * @returns {ArticleBuilder} This builder for chaining
   */
  articleSection(section) {
    this.data.articleSection = section;
    return this;
  }
}

class JobPostingBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('JobPosting', 'business', mode, sanitizeInputs);
  }

  /**
   * Set job title
   * @param {string} title - Job title
   * @returns {JobPostingBuilder} This builder for chaining
   */
  title(title) {
    if (this.sanitizeInputs) {
      this.data.title = this.sanitizer.sanitizeString(title);
    } else {
      this.data.title = title;
    }
    return this;
  }

  /**
   * Set hiring organization
   * @param {string|Object} organization - Organization name or object
   * @param {string} [url] - Organization URL
   * @returns {JobPostingBuilder} This builder for chaining
   */
  hiringOrganization(organization, url = null) {
    if (typeof organization === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(organization) : organization;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.hiringOrganization = {
        "@type": "Organization",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.hiringOrganization.url = sanitizedUrl;
    } else if (organization && typeof organization === 'object') {
      if (this.sanitizeInputs) {
        this.data.hiringOrganization = this.sanitizer.sanitizeStructuredData(organization, 'Organization');
      } else {
        this.data.hiringOrganization = organization;
      }
    }
    return this;
  }

  /**
   * Set job location
   * @param {string|Object} location - Location string or Place object
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobLocation(location) {
    if (typeof location === 'string') {
      this.data.jobLocation = {
        "@type": "Place",
        "address": location
      };
    } else {
      this.data.jobLocation = location;
    }
    return this;
  }

  /**
   * Set date posted
   * @param {string|Date} date - Date posted
   * @returns {JobPostingBuilder} This builder for chaining
   */
  datePosted(date) {
    this.data.datePosted = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set employment type
   * @param {string} type - Employment type (FULL_TIME, PART_TIME, etc.)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  employmentType(type) {
    this.data.employmentType = type;
    return this;
  }

  /**
   * Set base salary
   * @param {string|number|Object} salary - Salary amount or MonetaryAmount object
   * @param {string} [currency] - Currency code (if salary is number)
   * @returns {JobPostingBuilder} This builder for chaining
   */
  baseSalary(salary, currency = 'USD') {
    if (typeof salary === 'number' || typeof salary === 'string') {
      this.data.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": currency,
        "value": {
          "@type": "QuantitativeValue",
          "value": salary,
          "unitText": "YEAR"
        }
      };
    } else {
      this.data.baseSalary = salary;
    }
    return this;
  }
}

class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('LocalBusiness', 'business', mode, sanitizeInputs);
  }

  /**
   * Set address
   * @param {string|Object} address - Address string or PostalAddress object
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  address(address) {
    if (typeof address === 'string') {
      this.data.address = {
        "@type": "PostalAddress",
        "streetAddress": address
      };
    } else {
      this.data.address = address;
    }
    return this;
  }

  /**
   * Set telephone
   * @param {string} telephone - Phone number
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  telephone(telephone) {
    if (this.sanitizeInputs) {
      this.data.telephone = this.sanitizer.sanitizePhone(telephone);
    } else {
      this.data.telephone = telephone;
    }
    return this;
  }

  /**
   * Set opening hours
   * @param {string|Array} hours - Opening hours
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  openingHours(hours) {
    this.data.openingHours = Array.isArray(hours) ? hours : [hours];
    return this;
  }

  /**
   * Set geo coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  geo(latitude, longitude) {
    this.data.geo = {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    };
    return this;
  }

  /**
   * Set price range
   * @param {string} priceRange - Price range (e.g., "$", "$$", "$$$")
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  priceRange(priceRange) {
    this.data.priceRange = priceRange;
    return this;
  }
}

class ProductBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Product', 'business', mode, sanitizeInputs);
  }

  /**
   * Set brand
   * @param {string|Object} brand - Brand name or Brand object
   * @returns {ProductBuilder} This builder for chaining
   */
  brand(brand) {
    if (typeof brand === 'string') {
      this.data.brand = {
        "@type": "Brand",
        "name": brand
      };
    } else {
      this.data.brand = brand;
    }
    return this;
  }

  /**
   * Set offers
   * @param {number|Object} price - Price or Offer object
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability
   * @returns {ProductBuilder} This builder for chaining
   */
  offers(price, currency = 'USD', availability = 'InStock') {
    if (typeof price === 'number' || typeof price === 'string') {
      this.data.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      };
    } else {
      this.data.offers = price;
    }
    return this;
  }

  /**
   * Set SKU
   * @param {string} sku - SKU
   * @returns {ProductBuilder} This builder for chaining
   */
  sku(sku) {
    if (this.sanitizeInputs) {
      this.data.sku = this.sanitizer.sanitizeSku(sku);
    } else {
      this.data.sku = sku;
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {number} ratingValue - Rating value
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {ProductBuilder} This builder for chaining
   */
  aggregateRating(ratingValue, reviewCount, bestRating = 5, worstRating = 1) {
    this.data.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": bestRating,
      "worstRating": worstRating
    };
    return this;
  }
}

class EventBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Event', 'interaction', mode, sanitizeInputs);
  }

  /**
   * Set start date
   * @param {string|Date} date - Start date
   * @returns {EventBuilder} This builder for chaining
   */
  startDate(date) {
    this.data.startDate = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set end date
   * @param {string|Date} date - End date
   * @returns {EventBuilder} This builder for chaining
   */
  endDate(date) {
    this.data.endDate = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set location
   * @param {string|Object} location - Location string or Place object
   * @returns {EventBuilder} This builder for chaining
   */
  location(location) {
    if (typeof location === 'string') {
      this.data.location = {
        "@type": "Place",
        "name": location
      };
    } else {
      this.data.location = location;
    }
    return this;
  }

  /**
   * Set organizer
   * @param {string|Object} organizer - Organizer name or Organization object
   * @returns {EventBuilder} This builder for chaining
   */
  organizer(organizer) {
    if (typeof organizer === 'string') {
      this.data.organizer = {
        "@type": "Organization",
        "name": organizer
      };
    } else {
      this.data.organizer = organizer;
    }
    return this;
  }

  /**
   * Set offers
   * @param {number|Object} price - Ticket price or Offer object
   * @param {string} [currency] - Currency code
   * @param {string} [url] - Ticket URL
   * @returns {EventBuilder} This builder for chaining
   */
  offers(price, currency = 'USD', url = null) {
    if (typeof price === 'number' || typeof price === 'string') {
      this.data.offers = {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency
      };
      if (url) this.data.offers.url = url;
    } else {
      this.data.offers = price;
    }
    return this;
  }
}

module.exports = {
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
};
