/**
 * Product builder class for creating Product structured data
 * CommonJS version
 */

const { BaseProfileBuilder } = require('./base-builder');

class ProductBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('Product', 'business', mode, sanitizeInputs);
  }

  /**
   * Set product name
   * @param {string} name - Product name
   * @returns {ProductBuilder} This builder for chaining
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
   * Set product description
   * @param {string} description - Product description
   * @returns {ProductBuilder} This builder for chaining
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
   * Set product image
   * @param {string|Object|Array} image - Image URL, ImageObject, or array of images
   * @param {number} [width] - Image width (if image is string)
   * @param {number} [height] - Image height (if image is string)
   * @param {string} [caption] - Image caption (if image is string)
   * @returns {ProductBuilder} This builder for chaining
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
    } else if (Array.isArray(image)) {
      this.data.image = image.map(img => {
        if (typeof img === 'string') {
          return {
            "@type": "ImageObject",
            "url": this.sanitizeInputs ? this.sanitizer.sanitizeUrl(img) : img
          };
        } else if (img && typeof img === 'object') {
          return this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(img, 'ImageObject') : img;
        }
        return img;
      });
    } else if (image && typeof image === 'object') {
      this.data.image = this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(image, 'ImageObject') : image;
    }
    return this;
  }

  /**
   * Set product brand
   * @param {string|Object} brand - Brand name or Brand object
   * @param {string} [logoUrl] - Brand logo URL (if brand is string)
   * @param {string} [brandUrl] - Brand website URL (if brand is string)
   * @returns {ProductBuilder} This builder for chaining
   */
  brand(brand, logoUrl = null, brandUrl = null) {
    if (typeof brand === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(brand) : brand;
      const sanitizedLogoUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logoUrl) : logoUrl;
      const sanitizedBrandUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(brandUrl) : brandUrl;
      
      this.data.brand = {
        "@type": "Brand",
        "name": sanitizedName
      };
      
      if (logoUrl) {
        this.data.brand.logo = {
          "@type": "ImageObject",
          "url": sanitizedLogoUrl
        };
      }
      if (brandUrl) this.data.brand.url = sanitizedBrandUrl;
    } else if (brand && typeof brand === 'object') {
      this.data.brand = this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(brand, 'Brand') : brand;
    }
    return this;
  }

  /**
   * Set product offers
   * @param {Object} offer - Offer object with price, currency, and availability
   * @param {string} [price] - Product price (if offer is not provided)
   * @param {string} [currency] - Price currency (if offer is not provided)
   * @param {string} [availability] - Product availability (if offer is not provided)
   * @returns {ProductBuilder} This builder for chaining
   */
  offers(offer, price = null, currency = null, availability = null) {
    if (offer && typeof offer === 'object') {
      this.data.offers = this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(offer, 'Offer') : offer;
    } else if (price && currency && availability) {
      const sanitizedPrice = this.sanitizeInputs ? this.sanitizer.sanitizeString(price) : price;
      const sanitizedCurrency = this.sanitizeInputs ? this.sanitizer.sanitizeString(currency) : currency;
      const sanitizedAvailability = this.sanitizeInputs ? this.sanitizer.sanitizeString(availability) : availability;
      
      this.data.offers = {
        "@type": "Offer",
        "price": sanitizedPrice,
        "priceCurrency": sanitizedCurrency,
        "availability": sanitizedAvailability
      };
    }
    return this;
  }

  /**
   * Set product SKU
   * @param {string} sku - Stock Keeping Unit
   * @returns {ProductBuilder} This builder for chaining
   */
  sku(sku) {
    if (this.sanitizeInputs) {
      this.data.sku = this.sanitizer.sanitizeString(sku);
    } else {
      this.data.sku = sku;
    }
    return this;
  }

  /**
   * Set product GTIN
   * @param {string} gtin - Global Trade Item Number
   * @returns {ProductBuilder} This builder for chaining
   */
  gtin(gtin) {
    if (this.sanitizeInputs) {
      this.data.gtin = this.sanitizer.sanitizeString(gtin);
    } else {
      this.data.gtin = gtin;
    }
    return this;
  }

  /**
   * Set product MPN
   * @param {string} mpn - Manufacturer Part Number
   * @returns {ProductBuilder} This builder for chaining
   */
  mpn(mpn) {
    if (this.sanitizeInputs) {
      this.data.mpn = this.sanitizer.sanitizeString(mpn);
    } else {
      this.data.mpn = mpn;
    }
    return this;
  }

  /**
   * Set product category
   * @param {string} category - Product category
   * @returns {ProductBuilder} This builder for chaining
   */
  category(category) {
    if (this.sanitizeInputs) {
      this.data.category = this.sanitizer.sanitizeString(category);
    } else {
      this.data.category = category;
    }
    return this;
  }

  /**
   * Set product URL
   * @param {string} url - Product page URL
   * @returns {ProductBuilder} This builder for chaining
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
   * Set aggregate rating
   * @param {Object} rating - AggregateRating object
   * @param {number} [ratingValue] - Rating value (if rating is not provided)
   * @param {number} [reviewCount] - Number of reviews (if rating is not provided)
   * @param {number} [bestRating] - Best possible rating (if rating is not provided)
   * @param {number} [worstRating] - Worst possible rating (if rating is not provided)
   * @returns {ProductBuilder} This builder for chaining
   */
  aggregateRating(rating, ratingValue = null, reviewCount = null, bestRating = null, worstRating = null) {
    if (rating && typeof rating === 'object') {
      this.data.aggregateRating = this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(rating, 'AggregateRating') : rating;
    } else if (ratingValue && reviewCount) {
      this.data.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": reviewCount
      };
      
      if (bestRating) this.data.aggregateRating.bestRating = bestRating;
      if (worstRating) this.data.aggregateRating.worstRating = worstRating;
    }
    return this;
  }

  /**
   * Add product review
   * @param {Object} review - Review object
   * @param {number} [rating] - Review rating (if review is not provided)
   * @param {string} [author] - Review author (if review is not provided)
   * @param {string} [reviewBody] - Review text (if review is not provided)
   * @param {string} [datePublished] - Review date (if review is not provided)
   * @returns {ProductBuilder} This builder for chaining
   */
  addReview(review, rating = null, author = null, reviewBody = null, datePublished = null) {
    if (!this.data.review) {
      this.data.review = [];
    }

    if (review && typeof review === 'object') {
      const sanitizedReview = this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(review, 'Review') : review;
      this.data.review.push(sanitizedReview);
    } else if (rating && author && reviewBody) {
      const sanitizedAuthor = this.sanitizeInputs ? this.sanitizer.sanitizeString(author) : author;
      const sanitizedReviewBody = this.sanitizeInputs ? this.sanitizer.sanitizeString(reviewBody) : reviewBody;
      const sanitizedDate = this.sanitizeInputs ? this.sanitizer.sanitizeString(datePublished) : datePublished;
      
      const reviewObj = {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rating
        },
        "author": {
          "@type": "Person",
          "name": sanitizedAuthor
        },
        "reviewBody": sanitizedReviewBody
      };
      
      if (datePublished) reviewObj.datePublished = sanitizedDate;
      
      this.data.review.push(reviewObj);
    }
    return this;
  }

  /**
   * Set product weight
   * @param {number} value - Weight value
   * @param {string} [unit] - Weight unit
   * @returns {ProductBuilder} This builder for chaining
   */
  weight(value, unit = null) {
    const sanitizedUnit = this.sanitizeInputs ? this.sanitizer.sanitizeString(unit) : unit;
    
    this.data.weight = {
      "@type": "QuantitativeValue",
      "value": value
    };
    
    if (unit) {
      this.data.weight.unitText = sanitizedUnit;
    }
    
    return this;
  }

  /**
   * Set product dimensions
   * @param {number} [height] - Product height
   * @param {number} [width] - Product width
   * @param {number} [depth] - Product depth
   * @param {string} [unit] - Dimension unit
   * @returns {ProductBuilder} This builder for chaining
   */
  dimensions(height = null, width = null, depth = null, unit = null) {
    const sanitizedUnit = this.sanitizeInputs ? this.sanitizer.sanitizeString(unit) : unit;
    
    if (height !== null) {
      this.data.height = {
        "@type": "QuantitativeValue",
        "value": height
      };
      if (unit) this.data.height.unitText = sanitizedUnit;
    }
    
    if (width !== null) {
      this.data.width = {
        "@type": "QuantitativeValue",
        "value": width
      };
      if (unit) this.data.width.unitText = sanitizedUnit;
    }
    
    if (depth !== null) {
      this.data.depth = {
        "@type": "QuantitativeValue",
        "value": depth
      };
      if (unit) this.data.depth.unitText = sanitizedUnit;
    }
    
    return this;
  }

  /**
   * Set product color
   * @param {string} color - Product color
   * @returns {ProductBuilder} This builder for chaining
   */
  color(color) {
    if (this.sanitizeInputs) {
      this.data.color = this.sanitizer.sanitizeString(color);
    } else {
      this.data.color = color;
    }
    return this;
  }

  /**
   * Set product material
   * @param {string} material - Product material
   * @returns {ProductBuilder} This builder for chaining
   */
  material(material) {
    if (this.sanitizeInputs) {
      this.data.material = this.sanitizer.sanitizeString(material);
    } else {
      this.data.material = material;
    }
    return this;
  }

  /**
   * Set product size
   * @param {string} size - Product size
   * @returns {ProductBuilder} This builder for chaining
   */
  size(size) {
    if (this.sanitizeInputs) {
      this.data.size = this.sanitizer.sanitizeString(size);
    } else {
      this.data.size = size;
    }
    return this;
  }

  /**
   * Set product model
   * @param {string} model - Product model
   * @returns {ProductBuilder} This builder for chaining
   */
  model(model) {
    if (this.sanitizeInputs) {
      this.data.model = this.sanitizer.sanitizeString(model);
    } else {
      this.data.model = model;
    }
    return this;
  }

  /**
   * Set product version
   * @param {string} version - Product version
   * @returns {ProductBuilder} This builder for chaining
   */
  version(version) {
    if (this.sanitizeInputs) {
      this.data.version = this.sanitizer.sanitizeString(version);
    } else {
      this.data.version = version;
    }
    return this;
  }

  /**
   * Set product keywords
   * @param {string|Array} keywords - Product keywords
   * @returns {ProductBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      this.data.keywords = keywords.map(keyword => 
        this.sanitizeInputs ? this.sanitizer.sanitizeString(keyword) : keyword
      );
    } else if (typeof keywords === 'string') {
      this.data.keywords = this.sanitizeInputs ? this.sanitizer.sanitizeString(keywords) : keywords;
    }
    return this;
  }

  /**
   * Set product ISBN (for books)
   * @param {string} isbn - Product ISBN
   * @returns {ProductBuilder} This builder for chaining
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
   * Set product ID
   * @param {string} productID - Product ID
   * @returns {ProductBuilder} This builder for chaining
   */
  productID(productID) {
    if (this.sanitizeInputs) {
      this.data.productID = this.sanitizer.sanitizeString(productID);
    } else {
      this.data.productID = productID;
    }
    return this;
  }

  /**
   * Set sameAs URLs
   * @param {string|Array} sameAs - SameAs URLs
   * @returns {ProductBuilder} This builder for chaining
   */
  sameAs(sameAs) {
    if (Array.isArray(sameAs)) {
      this.data.sameAs = sameAs.map(url => 
        this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url
      );
    } else if (typeof sameAs === 'string') {
      this.data.sameAs = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(sameAs) : sameAs;
    }
    return this;
  }

  /**
   * Add additional property
   * @param {string} name - Property name
   * @param {string|number|boolean} value - Property value
   * @returns {ProductBuilder} This builder for chaining
   */
  addAdditionalProperty(name, value) {
    if (!this.data.additionalProperty) {
      this.data.additionalProperty = [];
    }

    const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(name) : name;
    let sanitizedValue = value;
    
    if (typeof value === 'string' && this.sanitizeInputs) {
      sanitizedValue = this.sanitizer.sanitizeString(value);
    }

    this.data.additionalProperty.push({
      "@type": "PropertyValue",
      "name": sanitizedName,
      "value": sanitizedValue
    });
    
    return this;
  }
}

module.exports = { ProductBuilder };
