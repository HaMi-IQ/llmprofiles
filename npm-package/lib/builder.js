/**
 * Builder classes for creating structured data objects
 */

// Import the enhanced BaseProfileBuilder
const { BaseProfileBuilder } = require('./builders/base-builder');

class ArticleBuilder extends BaseProfileBuilder {
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
        this.data.author = this.sanitizer.sanitizeStructuredData(author, 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set date published
   * @param {string|Date} date - Publication date
   * @returns {ArticleBuilder} This builder for chaining
   */
  datePublished(date) {
    if (date instanceof Date) {
      this.data.datePublished = date.toISOString();
    } else if (typeof date === 'string') {
      this.data.datePublished = date;
    }
    return this;
  }

  /**
   * Set date modified
   * @param {string|Date} date - Modification date
   * @returns {ArticleBuilder} This builder for chaining
   */
  dateModified(date) {
    if (date instanceof Date) {
      this.data.dateModified = date.toISOString();
    } else if (typeof date === 'string') {
      this.data.dateModified = date;
    }
    return this;
  }

  /**
   * Set image
   * @param {string|Object} image - Image URL or ImageObject
   * @param {number} [width] - Image width
   * @param {number} [height] - Image height
   * @param {string} [caption] - Image caption
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
   * @param {string} body - Article content
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
   * @param {string} section - Article section
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
   * @param {string|Array} keywords - Keywords as string or array
   * @returns {ArticleBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      this.data.keywords = keywords.map(k => 
        this.sanitizeInputs ? this.sanitizer.sanitizeString(k) : k
      );
    } else if (typeof keywords === 'string') {
      this.data.keywords = this.sanitizeInputs ? this.sanitizer.sanitizeString(keywords) : keywords;
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
   * Set URL
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
   * @param {string} language - Language code
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
   * Set speakable
   * @param {Array|string} cssSelectors - CSS selectors or XPath
   * @param {Array} [xpaths] - XPath expressions
   * @returns {ArticleBuilder} This builder for chaining
   */
  speakable(cssSelectors, xpaths = null) {
    this.data.speakable = {
      "@type": "SpeakableSpecification"
    };
    
    if (Array.isArray(cssSelectors)) {
      this.data.speakable.cssSelector = cssSelectors;
    } else if (typeof cssSelectors === 'string') {
      this.data.speakable.cssSelector = [cssSelectors];
    }
    
    if (xpaths) {
      this.data.speakable.xpath = Array.isArray(xpaths) ? xpaths : [xpaths];
    }
    
    return this;
  }

  /**
   * Set about
   * @param {string|Object} about - About information
   * @param {string} [description] - Description
   * @returns {ArticleBuilder} This builder for chaining
   */
  about(about, description = null) {
    if (typeof about === 'string') {
      const sanitizedAbout = this.sanitizeInputs ? this.sanitizer.sanitizeString(about) : about;
      const sanitizedDescription = this.sanitizeInputs ? this.sanitizer.sanitizeString(description) : description;
      
      this.data.about = {
        "@type": "Thing",
        "name": sanitizedAbout
      };
      
      if (description) {
        this.data.about.description = sanitizedDescription;
      }
    } else if (about && typeof about === 'object') {
      if (this.sanitizeInputs) {
        this.data.about = this.sanitizer.sanitizeStructuredData(about, 'Thing');
      } else {
        this.data.about = about;
      }
    }
    return this;
  }

  /**
   * Add mention
   * @param {string|Object} mention - Mention information
   * @returns {ArticleBuilder} This builder for chaining
   */
  addMention(mention) {
    if (!this.data.mentions) {
      this.data.mentions = [];
    }
    
    if (typeof mention === 'string') {
      const sanitizedMention = this.sanitizeInputs ? this.sanitizer.sanitizeString(mention) : mention;
      this.data.mentions.push({
        "@type": "Thing",
        "name": sanitizedMention
      });
    } else if (mention && typeof mention === 'object') {
      if (this.sanitizeInputs) {
        this.data.mentions.push(this.sanitizer.sanitizeStructuredData(mention, 'Thing'));
      } else {
        this.data.mentions.push(mention);
      }
    }
    return this;
  }

  /**
   * Set mentions
   * @param {Array} mentions - Array of mentions
   * @returns {ArticleBuilder} This builder for chaining
   */
  mentions(mentions) {
    if (Array.isArray(mentions)) {
      this.data.mentions = mentions.map(mention => {
        if (typeof mention === 'string') {
          const sanitizedMention = this.sanitizeInputs ? this.sanitizer.sanitizeString(mention) : mention;
          return {
            "@type": "Thing",
            "name": sanitizedMention
          };
        } else if (mention && typeof mention === 'object') {
          return this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(mention, 'Thing') : mention;
        }
        return mention;
      });
    }
    return this;
  }

  /**
   * Set is part of
   * @param {string|Object} isPartOf - Part of information
   * @param {string} [name] - Name
   * @returns {ArticleBuilder} This builder for chaining
   */
  isPartOf(isPartOf, name = null) {
    if (typeof isPartOf === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(isPartOf) : isPartOf;
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(name) : name;
      
      this.data.isPartOf = {
        "@type": "WebPage",
        "url": sanitizedUrl
      };
      
      if (name) {
        this.data.isPartOf.name = sanitizedName;
      }
    } else if (isPartOf && typeof isPartOf === 'object') {
      if (this.sanitizeInputs) {
        this.data.isPartOf = this.sanitizer.sanitizeStructuredData(isPartOf, 'WebPage');
      } else {
        this.data.isPartOf = isPartOf;
      }
    }
    return this;
  }

  /**
   * Set ID
   * @param {string} id - Article ID
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

class JobPostingBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('Jobposting', 'business', mode, sanitizeInputs);
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
   * Set description
   * @param {string} description - Job description
   * @returns {JobPostingBuilder} This builder for chaining
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
      
      if (url) {
        this.data.hiringOrganization.url = sanitizedUrl;
      }
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
   * @param {string|Object} location - Job location
   * @returns {JobPostingBuilder} This builder for chaining
   */
  jobLocation(location) {
    if (typeof location === 'string') {
      const sanitizedLocation = this.sanitizeInputs ? this.sanitizer.sanitizeString(location) : location;
      this.data.jobLocation = sanitizedLocation;
    } else if (location && typeof location === 'object') {
      if (this.sanitizeInputs) {
        this.data.jobLocation = this.sanitizer.sanitizeStructuredData(location, 'Place');
      } else {
        this.data.jobLocation = location;
      }
    }
    return this;
  }

  /**
   * Set date posted
   * @param {string|Date} date - Date posted
   * @returns {JobPostingBuilder} This builder for chaining
   */
  datePosted(date) {
    if (date instanceof Date) {
      this.data.datePosted = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      this.data.datePosted = date;
    }
    return this;
  }

  /**
   * Set employment type
   * @param {string} type - Employment type
   * @returns {JobPostingBuilder} This builder for chaining
   */
  employmentType(type) {
    if (this.sanitizeInputs) {
      this.data.employmentType = this.sanitizer.sanitizeString(type);
    } else {
      this.data.employmentType = type;
    }
    return this;
  }

  /**
   * Set salary currency
   * @param {string} currency - Salary currency
   * @returns {JobPostingBuilder} This builder for chaining
   */
  salaryCurrency(currency) {
    if (this.sanitizeInputs) {
      this.data.salaryCurrency = this.sanitizer.sanitizeString(currency);
    } else {
      this.data.salaryCurrency = currency;
    }
    return this;
  }

  /**
   * Set salary range
   * @param {number} minValue - Minimum salary
   * @param {number} maxValue - Maximum salary
   * @param {string} [unit] - Salary unit
   * @returns {JobPostingBuilder} This builder for chaining
   */
  salaryRange(minValue, maxValue, unit = 'YEAR') {
    this.data.baseSalary = {
      "@type": "MonetaryAmount",
      "currency": this.data.salaryCurrency || 'USD',
      "value": {
        "@type": "QuantitativeValue",
        "minValue": minValue,
        "maxValue": maxValue,
        "unitText": unit
      }
    };
    return this;
  }

  /**
   * Set salary minimum value
   * @param {number} value - Minimum salary
   * @returns {JobPostingBuilder} This builder for chaining
   */
  salaryMinValue(value) {
    if (!this.data.baseSalary) {
      this.data.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": this.data.salaryCurrency || 'USD',
        "value": {
          "@type": "QuantitativeValue"
        }
      };
    }
    this.data.baseSalary.value.minValue = value;
    return this;
  }

  /**
   * Set salary maximum value
   * @param {number} value - Maximum salary
   * @returns {JobPostingBuilder} This builder for chaining
   */
  salaryMaxValue(value) {
    if (!this.data.baseSalary) {
      this.data.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": this.data.salaryCurrency || 'USD',
        "value": {
          "@type": "QuantitativeValue"
        }
      };
    }
    this.data.baseSalary.value.maxValue = value;
    return this;
  }

  /**
   * Set qualifications
   * @param {string} qualifications - Job qualifications
   * @returns {JobPostingBuilder} This builder for chaining
   */
  qualifications(qualifications) {
    if (this.sanitizeInputs) {
      this.data.qualifications = this.sanitizer.sanitizeString(qualifications);
    } else {
      this.data.qualifications = qualifications;
    }
    return this;
  }

  /**
   * Set responsibilities
   * @param {string} responsibilities - Job responsibilities
   * @returns {JobPostingBuilder} This builder for chaining
   */
  responsibilities(responsibilities) {
    if (this.sanitizeInputs) {
      this.data.responsibilities = this.sanitizer.sanitizeString(responsibilities);
    } else {
      this.data.responsibilities = responsibilities;
    }
    return this;
  }

  /**
   * Set experience requirements
   * @param {string} requirements - Experience requirements
   * @returns {JobPostingBuilder} This builder for chaining
   */
  experienceRequirements(requirements) {
    if (this.sanitizeInputs) {
      this.data.experienceRequirements = this.sanitizer.sanitizeString(requirements);
    } else {
      this.data.experienceRequirements = requirements;
    }
    return this;
  }

  /**
   * Set education requirements
   * @param {string} requirements - Education requirements
   * @returns {JobPostingBuilder} This builder for chaining
   */
  educationRequirements(requirements) {
    if (this.sanitizeInputs) {
      this.data.educationRequirements = this.sanitizer.sanitizeString(requirements);
    } else {
      this.data.educationRequirements = requirements;
    }
    return this;
  }

  /**
   * Set application contact
   * @param {string|Object} contact - Contact information
   * @returns {JobPostingBuilder} This builder for chaining
   */
  applicationContact(contact) {
    if (typeof contact === 'string') {
      const sanitizedContact = this.sanitizeInputs ? this.sanitizer.sanitizeString(contact) : contact;
      this.data.applicationContact = {
        "@type": "ContactPoint",
        "contactType": "recruiter",
        "name": sanitizedContact
      };
    } else if (contact && typeof contact === 'object') {
      if (this.sanitizeInputs) {
        this.data.applicationContact = this.sanitizer.sanitizeStructuredData(contact, 'ContactPoint');
      } else {
        this.data.applicationContact = contact;
      }
    }
    return this;
  }
}

class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
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
   * Set description
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
   * Set address
   * @param {string|Object} address - Business address
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  address(address) {
    if (typeof address === 'string') {
      const sanitizedAddress = this.sanitizeInputs ? this.sanitizer.sanitizeString(address) : address;
      this.data.address = {
        "@type": "PostalAddress",
        "streetAddress": sanitizedAddress
      };
    } else if (address && typeof address === 'object') {
      if (this.sanitizeInputs) {
        this.data.address = this.sanitizer.sanitizeStructuredData(address, 'PostalAddress');
      } else {
        this.data.address = address;
      }
    }
    return this;
  }

  /**
   * Set telephone
   * @param {string} telephone - Business telephone
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
   * Set email
   * @param {string} email - Business email
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  email(email) {
    if (this.sanitizeInputs) {
      this.data.email = this.sanitizer.sanitizeString(email);
    } else {
      this.data.email = email;
    }
    return this;
  }

  /**
   * Set URL
   * @param {string} url - Business URL
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
   * Set opening hours
   * @param {string} hours - Opening hours
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
   * @param {string} range - Price range
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  priceRange(range) {
    if (this.sanitizeInputs) {
      this.data.priceRange = this.sanitizer.sanitizeString(range);
    } else {
      this.data.priceRange = range;
    }
    return this;
  }

  /**
   * Set payment accepted
   * @param {string} payment - Payment methods
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  paymentAccepted(payment) {
    if (this.sanitizeInputs) {
      this.data.paymentAccepted = this.sanitizer.sanitizeString(payment);
    } else {
      this.data.paymentAccepted = payment;
    }
    return this;
  }

  /**
   * Set currencies accepted
   * @param {string} currencies - Accepted currencies
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  currenciesAccepted(currencies) {
    if (this.sanitizeInputs) {
      this.data.currenciesAccepted = this.sanitizer.sanitizeString(currencies);
    } else {
      this.data.currenciesAccepted = currencies;
    }
    return this;
  }

  /**
   * Set image
   * @param {string|Object} image - Business image
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      this.data.image = {
        "@type": "ImageObject",
        "url": sanitizedUrl
      };
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
   * Set logo
   * @param {string|Object} logo - Business logo
   * @returns {LocalBusinessBuilder} This builder for chaining
   */
  logo(logo) {
    if (typeof logo === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logo) : logo;
      this.data.logo = {
        "@type": "ImageObject",
        "url": sanitizedUrl
      };
    } else if (logo && typeof logo === 'object') {
      if (this.sanitizeInputs) {
        this.data.logo = this.sanitizer.sanitizeStructuredData(logo, 'ImageObject');
      } else {
        this.data.logo = logo;
      }
    }
    return this;
  }
}

class ProductBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('ProductOffer', 'business', mode, sanitizeInputs);
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
   * Set description
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
   * Set brand
   * @param {string|Object} brand - Product brand
   * @returns {ProductBuilder} This builder for chaining
   */
  brand(brand) {
    if (typeof brand === 'string') {
      const sanitizedBrand = this.sanitizeInputs ? this.sanitizer.sanitizeString(brand) : brand;
      this.data.brand = {
        "@type": "Brand",
        "name": sanitizedBrand
      };
    } else if (brand && typeof brand === 'object') {
      if (this.sanitizeInputs) {
        this.data.brand = this.sanitizer.sanitizeStructuredData(brand, 'Brand');
      } else {
        this.data.brand = brand;
      }
    }
    return this;
  }

  /**
   * Set category
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
   * Set SKU
   * @param {string} sku - Product SKU
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
   * Set MPN
   * @param {string} mpn - Manufacturer part number
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
   * Set GTIN
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
   * Set image
   * @param {string|Object} image - Product image
   * @returns {ProductBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      this.data.image = {
        "@type": "ImageObject",
        "url": sanitizedUrl
      };
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
   * Set offers
   * @param {Object} offers - Product offers
   * @returns {ProductBuilder} This builder for chaining
   */
  offers(offers) {
    if (this.sanitizeInputs) {
      this.data.offers = this.sanitizer.sanitizeStructuredData(offers, 'Offer');
    } else {
      this.data.offers = offers;
    }
    return this;
  }

  /**
   * Set aggregate rating
   * @param {Object} rating - Aggregate rating
   * @returns {ProductBuilder} This builder for chaining
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
   * Set reviews
   * @param {Array} reviews - Product reviews
   * @returns {ProductBuilder} This builder for chaining
   */
  reviews(reviews) {
    if (Array.isArray(reviews)) {
      this.data.review = reviews.map(review => {
        if (this.sanitizeInputs) {
          return this.sanitizer.sanitizeStructuredData(review, 'Review');
        }
        return review;
      });
    }
    return this;
  }

  /**
   * Set URL
   * @param {string} url - Product URL
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
}

class EventBuilder extends BaseProfileBuilder {
  constructor(mode = 'strict-seo', sanitizeInputs = true) {
    super('Event', 'interaction', mode, sanitizeInputs);
  }

  /**
   * Set event name
   * @param {string} name - Event name
   * @returns {EventBuilder} This builder for chaining
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
   * Set description
   * @param {string} description - Event description
   * @returns {EventBuilder} This builder for chaining
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
   * Set start date
   * @param {string|Date} date - Start date
   * @returns {EventBuilder} This builder for chaining
   */
  startDate(date) {
    if (date instanceof Date) {
      this.data.startDate = date.toISOString();
    } else if (typeof date === 'string') {
      this.data.startDate = date;
    }
    return this;
  }

  /**
   * Set end date
   * @param {string|Date} date - End date
   * @returns {EventBuilder} This builder for chaining
   */
  endDate(date) {
    if (date instanceof Date) {
      this.data.endDate = date.toISOString();
    } else if (typeof date === 'string') {
      this.data.endDate = date;
    }
    return this;
  }

  /**
   * Set location
   * @param {string|Object} location - Event location
   * @returns {EventBuilder} This builder for chaining
   */
  location(location) {
    if (typeof location === 'string') {
      const sanitizedLocation = this.sanitizeInputs ? this.sanitizer.sanitizeString(location) : location;
      this.data.location = sanitizedLocation;
    } else if (location && typeof location === 'object') {
      if (this.sanitizeInputs) {
        this.data.location = this.sanitizer.sanitizeStructuredData(location, 'Place');
      } else {
        this.data.location = location;
      }
    }
    return this;
  }

  /**
   * Set organizer
   * @param {string|Object} organizer - Event organizer
   * @returns {EventBuilder} This builder for chaining
   */
  organizer(organizer) {
    if (typeof organizer === 'string') {
      const sanitizedOrganizer = this.sanitizeInputs ? this.sanitizer.sanitizeString(organizer) : organizer;
      this.data.organizer = {
        "@type": "Organization",
        "name": sanitizedOrganizer
      };
    } else if (organizer && typeof organizer === 'object') {
      if (this.sanitizeInputs) {
        this.data.organizer = this.sanitizer.sanitizeStructuredData(organizer, 'Organization');
      } else {
        this.data.organizer = organizer;
      }
    }
    return this;
  }

  /**
   * Set performer
   * @param {string|Object|Array} performer - Event performer(s)
   * @returns {EventBuilder} This builder for chaining
   */
  performer(performer) {
    if (Array.isArray(performer)) {
      this.data.performer = performer.map(p => {
        if (typeof p === 'string') {
          const sanitizedPerformer = this.sanitizeInputs ? this.sanitizer.sanitizeString(p) : p;
          return {
            "@type": "Person",
            "name": sanitizedPerformer
          };
        } else if (p && typeof p === 'object') {
          return this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(p, 'Person') : p;
        }
        return p;
      });
    } else if (typeof performer === 'string') {
      const sanitizedPerformer = this.sanitizeInputs ? this.sanitizer.sanitizeString(performer) : performer;
      this.data.performer = {
        "@type": "Person",
        "name": sanitizedPerformer
      };
    } else if (performer && typeof performer === 'object') {
      if (this.sanitizeInputs) {
        this.data.performer = this.sanitizer.sanitizeStructuredData(performer, 'Person');
      } else {
        this.data.performer = performer;
      }
    }
    return this;
  }

  /**
   * Set offers
   * @param {Object} offers - Event offers
   * @returns {EventBuilder} This builder for chaining
   */
  offers(offers) {
    if (this.sanitizeInputs) {
      this.data.offers = this.sanitizer.sanitizeStructuredData(offers, 'Offer');
    } else {
      this.data.offers = offers;
    }
    return this;
  }

  /**
   * Set event status
   * @param {string} status - Event status
   * @returns {EventBuilder} This builder for chaining
   */
  eventStatus(status) {
    if (this.sanitizeInputs) {
      this.data.eventStatus = this.sanitizer.sanitizeString(status);
    } else {
      this.data.eventStatus = status;
    }
    return this;
  }

  /**
   * Set event attendance mode
   * @param {string} mode - Attendance mode
   * @returns {EventBuilder} This builder for chaining
   */
  eventAttendanceMode(mode) {
    if (this.sanitizeInputs) {
      this.data.eventAttendanceMode = this.sanitizer.sanitizeString(mode);
    } else {
      this.data.eventAttendanceMode = mode;
    }
    return this;
  }

  /**
   * Set maximum attendee capacity
   * @param {number} capacity - Maximum capacity
   * @returns {EventBuilder} This builder for chaining
   */
  maximumAttendeeCapacity(capacity) {
    this.data.maximumAttendeeCapacity = capacity;
    return this;
  }

  /**
   * Set URL
   * @param {string} url - Event URL
   * @returns {EventBuilder} This builder for chaining
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
   * Set image
   * @param {string|Object} image - Event image
   * @returns {EventBuilder} This builder for chaining
   */
  image(image) {
    if (typeof image === 'string') {
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(image) : image;
      this.data.image = {
        "@type": "ImageObject",
        "url": sanitizedUrl
      };
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

module.exports = {
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
};