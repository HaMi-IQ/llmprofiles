/**
 * Builder classes for creating structured data objects
 * ES Module version
 */

import { ModeConfig, MODES } from './modes.js';
import { defaultSanitizer } from './sanitizer.js';

export class BaseProfileBuilder {
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
   * Build the final structured data object
   * @param {string} [mode] - Override the mode for this build
   * @returns {Object} The structured data object
   */
  build(mode) {
    if (mode && mode !== this.modeConfig.mode) {
      // Rebuild with new mode
      const newBuilder = new this.constructor(this.profileType, this.category, mode, this.sanitizeInputs);
      // Copy all properties except the mode-specific ones
      Object.keys(this.data).forEach(key => {
        if (!['additionalType', 'schemaVersion', 'identifier', 'additionalProperty'].includes(key)) {
          newBuilder.data[key] = this.data[key];
        }
      });
      return newBuilder.build();
    }

    if (this.modeConfig.separatesLLMBlock()) {
      return this.buildSplitChannels();
    }

    return { ...this.data };
  }

  /**
   * Build split channels output
   * @private
   */
  buildSplitChannels() {
    const seoData = { ...this.data };
    const llmData = { ...this.data };

    // Add LLM-specific metadata
    if (this.modeConfig.includesProfileMetadata()) {
      llmData['@context'] = [
        "https://schema.org",
        {
          "llmprofiles": "https://llmprofiles.org/vocab#",
          "profile": {
            "@id": `https://llmprofiles.org/profiles/${this.category}/${this.profileType.toLowerCase()}/v1`,
            "version": "1.0.0",
            "category": this.category,
            "optimizedFor": ["google-rich-results", "llm-processing"]
          }
        }
      ];
    }

    return {
      seo: seoData,
      llm: llmData
    };
  }

  /**
   * Add a property to the data object
   * @param {string} property - Property name
   * @param {*} value - Property value
   * @returns {BaseProfileBuilder} This builder instance
   */
  addProperty(property, value) {
    if (this.sanitizeInputs && typeof value === 'string') {
      value = this.sanitizer.sanitizeString(value);
    }
    this.data[property] = value;
    return this;
  }

  /**
   * Set the URL property
   * @param {string} url - URL value
   * @returns {BaseProfileBuilder} This builder instance
   */
  url(url) {
    if (this.sanitizeInputs) {
      url = this.sanitizer.sanitizeUrl(url);
    }
    this.data.url = url;
    return this;
  }

  /**
   * Set the name property
   * @param {string} name - Name value
   * @returns {BaseProfileBuilder} This builder instance
   */
  name(name) {
    if (this.sanitizeInputs) {
      name = this.sanitizer.sanitizeString(name);
    }
    this.data.name = name;
    return this;
  }

  /**
   * Set the description property
   * @param {string} description - Description value
   * @returns {BaseProfileBuilder} This builder instance
   */
  description(description) {
    if (this.sanitizeInputs) {
      description = this.sanitizer.sanitizeString(description);
    }
    this.data.description = description;
    return this;
  }

  /**
   * Set the image property
   * @param {string|Object} image - Image URL or object
   * @returns {BaseProfileBuilder} This builder instance
   */
  image(image) {
    if (typeof image === 'string') {
      if (this.sanitizeInputs) {
        image = this.sanitizer.sanitizeUrl(image);
      }
      this.data.image = image;
    } else if (typeof image === 'object' && image !== null) {
      this.data.image = image;
    }
    return this;
  }

  /**
   * Get the rel profile value for HTML
   * @returns {string|null} The rel profile value
   */
  getRelProfile() {
    return this.modeConfig.getRelProfileValue();
  }

  /**
   * Get the link header value for HTTP
   * @returns {string|null} The link header value
   */
  getLinkHeader() {
    return this.modeConfig.getLinkHeaderValue();
  }
}

export class ArticleBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Article', 'content', mode, sanitizeInputs);
  }

  /**
   * Set the headline property
   * @param {string} headline - Headline value
   * @returns {ArticleBuilder} This builder instance
   */
  headline(headline) {
    if (this.sanitizeInputs) {
      headline = this.sanitizer.sanitizeString(headline);
    }
    this.data.headline = headline;
    return this;
  }

  /**
   * Set the author property
   * @param {string|Object} author - Author name or object
   * @param {string} [url] - Author URL
   * @returns {ArticleBuilder} This builder instance
   */
  author(author, url) {
    if (typeof author === 'string') {
      if (this.sanitizeInputs) {
        author = this.sanitizer.sanitizeString(author);
      }
      this.data.author = {
        "@type": "Person",
        "name": author
      };
      if (url) {
        if (this.sanitizeInputs) {
          url = this.sanitizer.sanitizeUrl(url);
        }
        this.data.author.url = url;
      }
    } else if (typeof author === 'object' && author !== null) {
      this.data.author = author;
    }
    return this;
  }

  /**
   * Set the date published property
   * @param {string|Date} date - Publication date
   * @returns {ArticleBuilder} This builder instance
   */
  datePublished(date) {
    if (this.sanitizeInputs) {
      date = this.sanitizer.sanitizeDate(date);
    }
    this.data.datePublished = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set the date modified property
   * @param {string|Date} date - Modification date
   * @returns {ArticleBuilder} This builder instance
   */
  dateModified(date) {
    if (this.sanitizeInputs) {
      date = this.sanitizer.sanitizeDate(date);
    }
    this.data.dateModified = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set the publisher property
   * @param {string|Object} publisher - Publisher name or object
   * @param {string} [url] - Publisher URL
   * @param {string} [logoUrl] - Publisher logo URL
   * @returns {ArticleBuilder} This builder instance
   */
  publisher(publisher, url, logoUrl) {
    if (typeof publisher === 'string') {
      if (this.sanitizeInputs) {
        publisher = this.sanitizer.sanitizeString(publisher);
      }
      this.data.publisher = {
        "@type": "Organization",
        "name": publisher
      };
      if (url) {
        if (this.sanitizeInputs) {
          url = this.sanitizer.sanitizeUrl(url);
        }
        this.data.publisher.url = url;
      }
      if (logoUrl) {
        if (this.sanitizeInputs) {
          logoUrl = this.sanitizer.sanitizeUrl(logoUrl);
        }
        this.data.publisher.logo = {
          "@type": "ImageObject",
          "url": logoUrl
        };
      }
    } else if (typeof publisher === 'object' && publisher !== null) {
      this.data.publisher = publisher;
    }
    return this;
  }

  /**
   * Set the article body property
   * @param {string} body - Article body text
   * @returns {ArticleBuilder} This builder instance
   */
  articleBody(body) {
    if (this.sanitizeInputs) {
      body = this.sanitizer.sanitizeString(body);
    }
    this.data.articleBody = body;
    return this;
  }

  /**
   * Set the keywords property
   * @param {string|string[]} keywords - Keywords
   * @returns {ArticleBuilder} This builder instance
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        keywords = keywords.map(k => this.sanitizer.sanitizeString(k));
      }
      this.data.keywords = keywords.join(', ');
    } else if (typeof keywords === 'string') {
      if (this.sanitizeInputs) {
        keywords = this.sanitizer.sanitizeString(keywords);
      }
      this.data.keywords = keywords;
    }
    return this;
  }

  /**
   * Set the word count property
   * @param {number} count - Word count
   * @returns {ArticleBuilder} This builder instance
   */
  wordCount(count) {
    if (this.sanitizeInputs) {
      count = this.sanitizer.sanitizeNumber(count, { min: 1 });
    }
    this.data.wordCount = count;
    return this;
  }
}

export class JobPostingBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('JobPosting', 'business', mode, sanitizeInputs);
  }

  /**
   * Set the title property
   * @param {string} title - Job title
   * @returns {JobPostingBuilder} This builder instance
   */
  title(title) {
    if (this.sanitizeInputs) {
      title = this.sanitizer.sanitizeString(title);
    }
    this.data.title = title;
    return this;
  }

  /**
   * Set the hiring organization property
   * @param {string|Object} organization - Organization name or object
   * @param {string} [url] - Organization URL
   * @returns {JobPostingBuilder} This builder instance
   */
  hiringOrganization(organization, url) {
    if (typeof organization === 'string') {
      if (this.sanitizeInputs) {
        organization = this.sanitizer.sanitizeString(organization);
      }
      this.data.hiringOrganization = {
        "@type": "Organization",
        "name": organization
      };
      if (url) {
        if (this.sanitizeInputs) {
          url = this.sanitizer.sanitizeUrl(url);
        }
        this.data.hiringOrganization.url = url;
      }
    } else if (typeof organization === 'object' && organization !== null) {
      this.data.hiringOrganization = organization;
    }
    return this;
  }

  /**
   * Set the job location property
   * @param {string|Object} location - Job location
   * @returns {JobPostingBuilder} This builder instance
   */
  jobLocation(location) {
    if (typeof location === 'string') {
      if (this.sanitizeInputs) {
        location = this.sanitizer.sanitizeString(location);
      }
      this.data.jobLocation = location;
    } else if (typeof location === 'object' && location !== null) {
      this.data.jobLocation = location;
    }
    return this;
  }

  /**
   * Set the date posted property
   * @param {string|Date} date - Date posted
   * @returns {JobPostingBuilder} This builder instance
   */
  datePosted(date) {
    if (this.sanitizeInputs) {
      date = this.sanitizer.sanitizeDate(date);
    }
    this.data.datePosted = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set the employment type property
   * @param {string} type - Employment type
   * @returns {JobPostingBuilder} This builder instance
   */
  employmentType(type) {
    if (this.sanitizeInputs) {
      type = this.sanitizer.sanitizeString(type);
    }
    this.data.employmentType = type;
    return this;
  }

  /**
   * Set the base salary property
   * @param {string|number|Object} salary - Salary information
   * @param {string} [currency] - Currency code
   * @returns {JobPostingBuilder} This builder instance
   */
  baseSalary(salary, currency) {
    if (typeof salary === 'number' || typeof salary === 'string') {
      this.data.baseSalary = {
        "@type": "MonetaryAmount",
        "value": salary
      };
      if (currency) {
        if (this.sanitizeInputs) {
          currency = this.sanitizer.sanitizeString(currency);
        }
        this.data.baseSalary.currency = currency;
      }
    } else if (typeof salary === 'object' && salary !== null) {
      this.data.baseSalary = salary;
    }
    return this;
  }
}

export class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('LocalBusiness', 'business', mode, sanitizeInputs);
  }

  /**
   * Set the address property
   * @param {string|Object} address - Business address
   * @returns {LocalBusinessBuilder} This builder instance
   */
  address(address) {
    if (typeof address === 'string') {
      if (this.sanitizeInputs) {
        address = this.sanitizer.sanitizeString(address);
      }
      this.data.address = address;
    } else if (typeof address === 'object' && address !== null) {
      this.data.address = address;
    }
    return this;
  }

  /**
   * Set the telephone property
   * @param {string} telephone - Phone number
   * @returns {LocalBusinessBuilder} This builder instance
   */
  telephone(telephone) {
    if (this.sanitizeInputs) {
      telephone = this.sanitizer.sanitizePhone(telephone);
    }
    this.data.telephone = telephone;
    return this;
  }

  /**
   * Set the opening hours property
   * @param {string|string[]} hours - Opening hours
   * @returns {LocalBusinessBuilder} This builder instance
   */
  openingHours(hours) {
    if (Array.isArray(hours)) {
      if (this.sanitizeInputs) {
        hours = hours.map(h => this.sanitizer.sanitizeString(h));
      }
      this.data.openingHours = hours;
    } else if (typeof hours === 'string') {
      if (this.sanitizeInputs) {
        hours = this.sanitizer.sanitizeString(hours);
      }
      this.data.openingHours = hours;
    }
    return this;
  }

  /**
   * Set the geo coordinates property
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {LocalBusinessBuilder} This builder instance
   */
  geo(latitude, longitude) {
    if (this.sanitizeInputs) {
      latitude = this.sanitizer.sanitizeNumber(latitude, { min: -90, max: 90 });
      longitude = this.sanitizer.sanitizeNumber(longitude, { min: -180, max: 180 });
    }
    this.data.geo = {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    };
    return this;
  }

  /**
   * Set the price range property
   * @param {string} priceRange - Price range
   * @returns {LocalBusinessBuilder} This builder instance
   */
  priceRange(priceRange) {
    if (this.sanitizeInputs) {
      priceRange = this.sanitizer.sanitizeString(priceRange);
    }
    this.data.priceRange = priceRange;
    return this;
  }
}

export class ProductBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Product', 'business', mode, sanitizeInputs);
  }

  /**
   * Set the brand property
   * @param {string|Object} brand - Brand name or object
   * @returns {ProductBuilder} This builder instance
   */
  brand(brand) {
    if (typeof brand === 'string') {
      if (this.sanitizeInputs) {
        brand = this.sanitizer.sanitizeString(brand);
      }
      this.data.brand = {
        "@type": "Brand",
        "name": brand
      };
    } else if (typeof brand === 'object' && brand !== null) {
      this.data.brand = brand;
    }
    return this;
  }

  /**
   * Set the offers property
   * @param {number|Object} price - Price or offer object
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability status
   * @returns {ProductBuilder} This builder instance
   */
  offers(price, currency, availability) {
    if (typeof price === 'number') {
      this.data.offers = {
        "@type": "Offer",
        "price": price
      };
      if (currency) {
        if (this.sanitizeInputs) {
          currency = this.sanitizer.sanitizeString(currency);
        }
        this.data.offers.priceCurrency = currency;
      }
      if (availability) {
        if (this.sanitizeInputs) {
          availability = this.sanitizer.sanitizeString(availability);
        }
        this.data.offers.availability = availability;
      }
    } else if (typeof price === 'object' && price !== null) {
      this.data.offers = price;
    }
    return this;
  }

  /**
   * Set the SKU property
   * @param {string} sku - Product SKU
   * @returns {ProductBuilder} This builder instance
   */
  sku(sku) {
    if (this.sanitizeInputs) {
      sku = this.sanitizer.sanitizeString(sku);
    }
    this.data.sku = sku;
    return this;
  }

  /**
   * Set the aggregate rating property
   * @param {number} ratingValue - Rating value
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {ProductBuilder} This builder instance
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
}

export class EventBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Event', 'interaction', mode, sanitizeInputs);
  }

  /**
   * Set the start date property
   * @param {string|Date} date - Start date
   * @returns {EventBuilder} This builder instance
   */
  startDate(date) {
    if (this.sanitizeInputs) {
      date = this.sanitizer.sanitizeDate(date);
    }
    this.data.startDate = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set the end date property
   * @param {string|Date} date - End date
   * @returns {EventBuilder} This builder instance
   */
  endDate(date) {
    if (this.sanitizeInputs) {
      date = this.sanitizer.sanitizeDate(date);
    }
    this.data.endDate = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /**
   * Set the location property
   * @param {string|Object} location - Event location
   * @returns {EventBuilder} This builder instance
   */
  location(location) {
    if (typeof location === 'string') {
      if (this.sanitizeInputs) {
        location = this.sanitizer.sanitizeString(location);
      }
      this.data.location = location;
    } else if (typeof location === 'object' && location !== null) {
      this.data.location = location;
    }
    return this;
  }

  /**
   * Set the organizer property
   * @param {string|Object} organizer - Event organizer
   * @returns {EventBuilder} This builder instance
   */
  organizer(organizer) {
    if (typeof organizer === 'string') {
      if (this.sanitizeInputs) {
        organizer = this.sanitizer.sanitizeString(organizer);
      }
      this.data.organizer = {
        "@type": "Organization",
        "name": organizer
      };
    } else if (typeof organizer === 'object' && organizer !== null) {
      this.data.organizer = organizer;
    }
    return this;
  }

  /**
   * Set the offers property
   * @param {number|Object} price - Price or offer object
   * @param {string} [currency] - Currency code
   * @param {string} [url] - Offer URL
   * @returns {EventBuilder} This builder instance
   */
  offers(price, currency, url) {
    if (typeof price === 'number') {
      this.data.offers = {
        "@type": "Offer",
        "price": price
      };
      if (currency) {
        if (this.sanitizeInputs) {
          currency = this.sanitizer.sanitizeString(currency);
        }
        this.data.offers.priceCurrency = currency;
      }
      if (url) {
        if (this.sanitizeInputs) {
          url = this.sanitizer.sanitizeUrl(url);
        }
        this.data.offers.url = url;
      }
    } else if (typeof price === 'object' && price !== null) {
      this.data.offers = price;
    }
    return this;
  }
}

// Default export for CommonJS compatibility
export default {
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
};
