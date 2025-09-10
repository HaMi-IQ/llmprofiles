/**
 * LocalBusinessBuilder class for creating LocalBusiness structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Localbusiness', 'business', mode, sanitizeInputs);
  }

  /**
   * Set business name
   * @param {string} name - Business name
   * @returns {LocalBusinessBuilder} This builder for chaining
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
   * Set business description
   * @param {string} description - Business description
   * @returns {LocalBusinessBuilder} This builder for chaining
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
   * Set business address
   * @param {Object|string} address - Address object or string
   * @param {string} [streetAddress] - Street address (if address is string)
   * @param {string} [locality] - City/locality (if address is string)
   * @param {string} [region] - State/region (if address is string)
   * @param {string} [postalCode] - Postal code (if address is string)
   * @param {string} [country] - Country (if address is string)
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  address(address, streetAddress = null, locality = null, region = null, postalCode = null, country = null) {
    if (typeof address === 'string' && streetAddress) {
      // Handle string address with individual components
      this.data.address = {
        "@type": "PostalAddress",
        "streetAddress": this.sanitizeInputs ? this.sanitizer.sanitizeString(streetAddress) : streetAddress,
        "addressLocality": this.sanitizeInputs ? this.sanitizer.sanitizeString(locality) : locality,
        "addressRegion": this.sanitizeInputs ? this.sanitizer.sanitizeString(region) : region,
        "postalCode": this.sanitizeInputs ? this.sanitizer.sanitizeString(postalCode) : postalCode,
        "addressCountry": this.sanitizeInputs ? this.sanitizer.sanitizeString(country) : country
      };
    } else if (address && typeof address === 'object') {
      // Handle complete address object
      if (this.sanitizeInputs) {
        this.data.address = this.sanitizer.sanitizeStructuredData(address, 'PostalAddress');
      } else {
        this.data.address = address;
      }
    }
    return this;
  }

  /**
   * Set business telephone
   * @param {string} telephone - Phone number
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  telephone(telephone) {
    if (this.sanitizeInputs) {
      this.data.telephone = this.sanitizer.sanitizeString(telephone);
    } else {
      this.data.telephone = telephone;
    }
    return this;
  }

  /**
   * Set business email
   * @param {string} email - Email address
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  email(email) {
    if (this.sanitizeInputs) {
      this.data.email = this.sanitizer.sanitizeEmail(email);
    } else {
      this.data.email = email;
    }
    return this;
  }

  /**
   * Set business website URL
   * @param {string} url - Website URL
   * @returns {LocalBusinessBuilder} This builder for chaining
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
   * Set geographical coordinates
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
   * Set opening hours specification
   * @param {Array} hours - Array of OpeningHoursSpecification objects
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  openingHoursSpecification(hours) {
    if (Array.isArray(hours)) {
      if (this.sanitizeInputs) {
        this.data.openingHoursSpecification = hours.map(h => this.sanitizer.sanitizeStructuredData(h, 'OpeningHoursSpecification'));
      } else {
        this.data.openingHoursSpecification = hours;
      }
    }
    return this;
  }

  /**
   * Add opening hours for specific days
   * @param {string|Array} days - Day(s) of week
   * @param {string} opens - Opening time (HH:MM format)
   * @param {string} closes - Closing time (HH:MM format)
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  addOpeningHours(days, opens, closes) {
    if (!this.data.openingHoursSpecification) {
      this.data.openingHoursSpecification = [];
    }

    const hoursObj = {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": Array.isArray(days) ? days : [days],
      "opens": opens,
      "closes": closes
    };

    if (this.sanitizeInputs) {
      hoursObj.dayOfWeek = hoursObj.dayOfWeek.map(d => this.sanitizer.sanitizeString(d));
      hoursObj.opens = this.sanitizer.sanitizeString(opens);
      hoursObj.closes = this.sanitizer.sanitizeString(closes);
    }

    this.data.openingHoursSpecification.push(hoursObj);
    return this;
  }

  /**
   * Set simple opening hours string
   * @param {string} hours - Opening hours description
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  openingHours(hours) {
    if (this.sanitizeInputs) {
      this.data.openingHours = this.sanitizer.sanitizeString(hours);
    } else {
      this.data.openingHours = hours;
    }
    return this;
  }

  /**
   * Set price range
   * @param {string} priceRange - Price range (e.g., "$$", "$$$")
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  priceRange(priceRange) {
    if (this.sanitizeInputs) {
      this.data.priceRange = this.sanitizer.sanitizeString(priceRange);
    } else {
      this.data.priceRange = priceRange;
    }
    return this;
  }

  /**
   * Set payment methods accepted
   * @param {string|Array} paymentMethods - Payment methods
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  paymentAccepted(paymentMethods) {
    if (Array.isArray(paymentMethods)) {
      if (this.sanitizeInputs) {
        this.data.paymentAccepted = paymentMethods.map(p => this.sanitizer.sanitizeString(p));
      } else {
        this.data.paymentAccepted = paymentMethods;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.paymentAccepted = this.sanitizer.sanitizeString(paymentMethods);
      } else {
        this.data.paymentAccepted = paymentMethods;
      }
    }
    return this;
  }

  /**
   * Set currencies accepted
   * @param {string|Array} currencies - Currencies accepted
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  currenciesAccepted(currencies) {
    if (Array.isArray(currencies)) {
      if (this.sanitizeInputs) {
        this.data.currenciesAccepted = currencies.map(c => this.sanitizer.sanitizeString(c));
      } else {
        this.data.currenciesAccepted = currencies;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.currenciesAccepted = this.sanitizer.sanitizeString(currencies);
      } else {
        this.data.currenciesAccepted = currencies;
      }
    }
    return this;
  }

  /**
   * Set area served
   * @param {string|Object|Array} area - Area served
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  areaServed(area) {
    if (this.sanitizeInputs) {
      if (typeof area === 'string') {
        this.data.areaServed = this.sanitizer.sanitizeString(area);
      } else if (Array.isArray(area)) {
        this.data.areaServed = area.map(a => 
          typeof a === 'string' ? this.sanitizer.sanitizeString(a) : this.sanitizer.sanitizeStructuredData(a, 'GeoCircle')
        );
      } else {
        this.data.areaServed = this.sanitizer.sanitizeStructuredData(area, 'GeoCircle');
      }
    } else {
      this.data.areaServed = area;
    }
    return this;
  }

  /**
   * Set social media and authoritative profile links
   * @param {string|Array} sameAs - URLs to social media profiles
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  sameAs(sameAs) {
    if (Array.isArray(sameAs)) {
      if (this.sanitizeInputs) {
        this.data.sameAs = sameAs.map(url => this.sanitizer.sanitizeUrl(url));
      } else {
        this.data.sameAs = sameAs;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.sameAs = this.sanitizer.sanitizeUrl(sameAs);
      } else {
        this.data.sameAs = sameAs;
      }
    }
    return this;
  }

  /**
   * Set business image
   * @param {string|Object|Array} image - Image URL, object, or array
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeUrl(image);
      } else {
        this.data.image = image;
      }
    } else if (Array.isArray(image)) {
      if (this.sanitizeInputs) {
        this.data.image = image.map(img => 
          typeof img === 'string' ? this.sanitizer.sanitizeUrl(img) : this.sanitizer.sanitizeStructuredData(img, 'ImageObject')
        );
      } else {
        this.data.image = image;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.image = this.sanitizer.sanitizeStructuredData(image, 'ImageObject');
      } else {
        this.data.image = image;
      }
    }
    return this;
  }

  /**
   * Set business logo
   * @param {string|Object} logo - Logo URL or ImageObject
   * @param {number} [width] - Logo width (if logo is URL)
   * @param {number} [height] - Logo height (if logo is URL)
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  logo(logo, width = null, height = null) {
    if (typeof logo === 'string') {
      this.data.logo = {
        "@type": "ImageObject",
        "url": this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logo) : logo
      };
      if (width) this.data.logo.width = width;
      if (height) this.data.logo.height = height;
    } else if (logo && typeof logo === 'object') {
      if (this.sanitizeInputs) {
        this.data.logo = this.sanitizer.sanitizeStructuredData(logo, 'ImageObject');
      } else {
        this.data.logo = logo;
      }
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {Object} rating - AggregateRating object
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  aggregateRating(rating) {
    if (this.sanitizeInputs) {
      this.data.aggregateRating = this.sanitizer.sanitizeStructuredData(rating, 'AggregateRating');
    } else {
      this.data.aggregateRating = rating;
    }
    return this;
  }

  /**
   * Add aggregate rating with simple values
   * @param {number} ratingValue - Rating value (1-5)
   * @param {number} reviewCount - Number of reviews
   * @param {number} [bestRating] - Best possible rating
   * @param {number} [worstRating] - Worst possible rating
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  addAggregateRating(ratingValue, reviewCount, bestRating = 5, worstRating = 1) {
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
   * @param {Array} reviews - Array of Review objects
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  review(reviews) {
    if (Array.isArray(reviews)) {
      if (this.sanitizeInputs) {
        this.data.review = reviews.map(r => this.sanitizer.sanitizeStructuredData(r, 'Review'));
      } else {
        this.data.review = reviews;
      }
    }
    return this;
  }

  /**
   * Add a single review
   * @param {string} author - Review author name
   * @param {number} rating - Rating value (1-5)
   * @param {string} reviewBody - Review text
   * @param {string} [datePublished] - Review date
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  addReview(author, rating, reviewBody, datePublished = null) {
    if (!this.data.review) {
      this.data.review = [];
    }

    const reviewObj = {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": rating
      },
      "author": {
        "@type": "Person",
        "name": author
      },
      "reviewBody": reviewBody
    };

    if (datePublished) reviewObj.datePublished = datePublished;

    if (this.sanitizeInputs) {
      reviewObj.author.name = this.sanitizer.sanitizeString(reviewObj.author.name);
      reviewObj.reviewBody = this.sanitizer.sanitizeString(reviewObj.reviewBody);
      if (reviewObj.datePublished) reviewObj.datePublished = this.sanitizer.sanitizeString(reviewObj.datePublished);
    }

    this.data.review.push(reviewObj);
    return this;
  }

  /**
   * Set business founding date
   * @param {string} date - Founding date (YYYY-MM-DD format)
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  foundingDate(date) {
    if (this.sanitizeInputs) {
      this.data.foundingDate = this.sanitizer.sanitizeString(date);
    } else {
      this.data.foundingDate = date;
    }
    return this;
  }

  /**
   * Set business slogan
   * @param {string} slogan - Business slogan
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  slogan(slogan) {
    if (this.sanitizeInputs) {
      this.data.slogan = this.sanitizer.sanitizeString(slogan);
    } else {
      this.data.slogan = slogan;
    }
    return this;
  }

  /**
   * Set topics the business knows about
   * @param {string|Array} topics - Topics or services
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  knowsAbout(topics) {
    if (Array.isArray(topics)) {
      if (this.sanitizeInputs) {
        this.data.knowsAbout = topics.map(t => this.sanitizer.sanitizeString(t));
      } else {
        this.data.knowsAbout = topics;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.knowsAbout = this.sanitizer.sanitizeString(topics);
      } else {
        this.data.knowsAbout = topics;
      }
    }
    return this;
  }

  /**
   * Set offer catalog
   * @param {Object} catalog - OfferCatalog object
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  hasOfferCatalog(catalog) {
    if (this.sanitizeInputs) {
      this.data.hasOfferCatalog = this.sanitizer.sanitizeStructuredData(catalog, 'OfferCatalog');
    } else {
      this.data.hasOfferCatalog = catalog;
    }
    return this;
  }

  /**
   * Set offers made by the business
   * @param {Array} offers - Array of Offer objects
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  makesOffer(offers) {
    if (Array.isArray(offers)) {
      if (this.sanitizeInputs) {
        this.data.makesOffer = offers.map(o => this.sanitizer.sanitizeStructuredData(o, 'Offer'));
      } else {
        this.data.makesOffer = offers;
      }
    }
    return this;
  }

  /**
   * Add a single offer
   * @param {string} itemOffered - Item or service offered
   * @param {string} [price] - Price
   * @param {string} [currency] - Currency code
   * @param {string} [availability] - Availability status
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  addOffer(itemOffered, price = null, currency = null, availability = null) {
    if (!this.data.makesOffer) {
      this.data.makesOffer = [];
    }

    const offerObj = {
      "@type": "Offer",
      "itemOffered": itemOffered
    };

    if (price) offerObj.price = price;
    if (currency) offerObj.priceCurrency = currency;
    if (availability) offerObj.availability = availability;

    if (this.sanitizeInputs) {
      offerObj.itemOffered = typeof itemOffered === 'string' ? 
        this.sanitizer.sanitizeString(itemOffered) : 
        this.sanitizer.sanitizeStructuredData(itemOffered, 'Product');
      if (offerObj.price) offerObj.price = this.sanitizer.sanitizeString(offerObj.price);
      if (offerObj.priceCurrency) offerObj.priceCurrency = this.sanitizer.sanitizeString(offerObj.priceCurrency);
      if (offerObj.availability) offerObj.availability = this.sanitizer.sanitizeString(offerObj.availability);
    }

    this.data.makesOffer.push(offerObj);
    return this;
  }

  /**
   * Set contact points
   * @param {Array} contactPoints - Array of ContactPoint objects
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  contactPoint(contactPoints) {
    if (Array.isArray(contactPoints)) {
      if (this.sanitizeInputs) {
        this.data.contactPoint = contactPoints.map(cp => this.sanitizer.sanitizeStructuredData(cp, 'ContactPoint'));
      } else {
        this.data.contactPoint = contactPoints;
      }
    }
    return this;
  }

  /**
   * Add a contact point
   * @param {string} telephone - Phone number
   * @param {string} contactType - Type of contact (e.g., "customer service", "sales")
   * @param {string} [email] - Email address
   * @param {string|Array} [languages] - Available languages
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  addContactPoint(telephone, contactType, email = null, languages = null) {
    if (!this.data.contactPoint) {
      this.data.contactPoint = [];
    }

    const contactObj = {
      "@type": "ContactPoint",
      "telephone": telephone,
      "contactType": contactType
    };

    if (email) contactObj.email = email;
    if (languages) contactObj.availableLanguage = Array.isArray(languages) ? languages : [languages];

    if (this.sanitizeInputs) {
      contactObj.telephone = this.sanitizer.sanitizeString(contactObj.telephone);
      contactObj.contactType = this.sanitizer.sanitizeString(contactObj.contactType);
      if (contactObj.email) contactObj.email = this.sanitizer.sanitizeEmail(contactObj.email);
      if (contactObj.availableLanguage) {
        contactObj.availableLanguage = contactObj.availableLanguage.map(l => this.sanitizer.sanitizeString(l));
      }
    }

    this.data.contactPoint.push(contactObj);
    return this;
  }

  /**
   * Set business identification numbers
   * @param {Object} identifiers - Object with identification numbers
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  setIdentifiers(identifiers) {
    if (identifiers.isicV4) this.data.isicV4 = identifiers.isicV4;
    if (identifiers.naics) this.data.naics = identifiers.naics;
    if (identifiers.vatID) this.data.vatID = identifiers.vatID;
    if (identifiers.taxID) this.data.taxID = identifiers.taxID;
    if (identifiers.duns) this.data.duns = identifiers.duns;
    if (identifiers.leiCode) this.data.leiCode = identifiers.leiCode;
    return this;
  }
}

module.exports = { LocalBusinessBuilder, MODES };
