/**
 * @fileoverview EventBuilder class for creating Event structured data objects
 * 
 * This module provides a specialized builder for creating Event structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * event-specific properties like name, description, dates, location, organizer,
 * and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic event creation
 * import { EventBuilder, MODES } from './event-builder.mjs';
 * const event = new EventBuilder(MODES.STRICT_SEO)
 *   .name('Tech Conference 2024')
 *   .description('Annual technology conference featuring the latest innovations')
 *   .startDate('2024-06-15T09:00:00Z')
 *   .endDate('2024-06-17T18:00:00Z')
 *   .location('Convention Center', 'San Francisco, CA')
 *   .organizer('Tech Events Inc', 'https://techevents.com')
 *   .build();
 * 
 * @example
 * // Event with detailed information
 * const event = new EventBuilder()
 *   .name('Web Development Workshop')
 *   .description('Hands-on workshop covering modern web development techniques')
 *   .startDate('2024-03-15T10:00:00Z')
 *   .endDate('2024-03-15T16:00:00Z')
 *   .location({
 *     "@type": "Place",
 *     "name": "Tech Hub",
 *     "address": {
 *       "@type": "PostalAddress",
 *       "streetAddress": "123 Tech Street",
 *       "addressLocality": "San Francisco",
 *       "addressRegion": "CA",
 *       "postalCode": "94105",
 *       "addressCountry": "US"
 *     }
 *   })
 *   .organizer({
 *     "@type": "Organization",
 *     "name": "Web Dev Academy",
 *     "url": "https://webdevacademy.com"
 *   })
 *   .offers({
 *     "@type": "Offer",
 *     "price": "99.00",
 *     "priceCurrency": "USD",
 *     "availability": "https://schema.org/InStock"
 *   })
 *   .build();
 * 
 * @example
 * // Virtual event
 * const event = new EventBuilder()
 *   .name('Online JavaScript Meetup')
 *   .description('Monthly JavaScript meetup with guest speakers')
 *   .startDate('2024-02-20T19:00:00Z')
 *   .endDate('2024-02-20T21:00:00Z')
 *   .location('Online')
 *   .organizer('JS Community')
 *   .eventStatus('https://schema.org/EventScheduled')
 *   .eventAttendanceMode('https://schema.org/OnlineEventAttendanceMode')
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * EventBuilder class for creating Event structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * Event structured data according to Schema.org specifications. Includes
 * support for event names, descriptions, dates, locations, organizers,
 * offers, and more.
 * 
 * @class EventBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create an event builder
 * const eventBuilder = new EventBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const eventBuilder = new EventBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete event
 * const event = new EventBuilder()
 *   .name('My Event')
 *   .startDate('2024-01-01T10:00:00Z')
 *   .endDate('2024-01-01T18:00:00Z')
 *   .location('Event Venue')
 *   .build();
 */
export class EventBuilder extends BaseProfileBuilder {
  /**
   * Create a new EventBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const eventBuilder = new EventBuilder();
   * 
   * @example
   * // Custom configuration
   * const eventBuilder = new EventBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
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
   * Set event description
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
   * @param {string|Date} date - Start date (ISO 8601 format)
   * @returns {EventBuilder} This builder for chaining
   */
  startDate(date) {
    if (this.sanitizeInputs) {
      this.data.startDate = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.startDate = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set end date
   * @param {string|Date} date - End date (ISO 8601 format)
   * @returns {EventBuilder} This builder for chaining
   */
  endDate(date) {
    if (this.sanitizeInputs) {
      this.data.endDate = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.endDate = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set event location
   * @param {string|Object} location - Location string or Place object
   * @param {string} [address] - Address (if location is string)
   * @param {number} [latitude] - Latitude (if location is string)
   * @param {number} [longitude] - Longitude (if location is string)
   * @returns {EventBuilder} This builder for chaining
   */
  location(location, address = null, latitude = null, longitude = null) {
    if (typeof location === 'string') {
      const sanitizedLocation = this.sanitizeInputs ? this.sanitizer.sanitizeString(location) : location;
      const sanitizedAddress = this.sanitizeInputs ? this.sanitizer.sanitizeString(address) : address;
      
      this.data.location = {
        "@type": "Place",
        "name": sanitizedLocation
      };
      
      if (address) {
        this.data.location.address = {
          "@type": "PostalAddress",
          "streetAddress": sanitizedAddress
        };
      }
      
      if (latitude && longitude) {
        this.data.location.geo = {
          "@type": "GeoCoordinates",
          "latitude": latitude,
          "longitude": longitude
        };
      }
    } else if (location && typeof location === 'object') {
      if (this.sanitizeInputs) {
        this.data.location = this.sanitizer.sanitizeStructuredData(location, location['@type'] || 'Place');
      } else {
        this.data.location = location;
      }
    }
    return this;
  }

  /**
   * Set virtual location for online events
   * @param {string} url - Virtual event URL
   * @param {string} [name] - Virtual location name
   * @returns {EventBuilder} This builder for chaining
   */
  virtualLocation(url, name = null) {
    const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
    const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(name) : name;
    
    this.data.location = {
      "@type": "VirtualLocation",
      "url": sanitizedUrl
    };
    
    if (name) {
      this.data.location.name = sanitizedName;
    }
    
    return this;
  }

  /**
   * Set event organizer
   * @param {string|Object} organizer - Organizer name or Organization/Person object
   * @param {string} [url] - Organizer URL (if organizer is string)
   * @param {string} [email] - Organizer email (if organizer is string)
   * @returns {EventBuilder} This builder for chaining
   */
  organizer(organizer, url = null, email = null) {
    if (typeof organizer === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(organizer) : organizer;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      const sanitizedEmail = this.sanitizeInputs ? this.sanitizer.sanitizeEmail(email) : email;
      
      this.data.organizer = {
        "@type": "Organization",
        "name": sanitizedName
      };
      
      if (url) this.data.organizer.url = sanitizedUrl;
      if (email) this.data.organizer.email = sanitizedEmail;
    } else if (organizer && typeof organizer === 'object') {
      if (this.sanitizeInputs) {
        this.data.organizer = this.sanitizer.sanitizeStructuredData(organizer, organizer['@type'] || 'Organization');
      } else {
        this.data.organizer = organizer;
      }
    }
    return this;
  }

  /**
   * Set event performer
   * @param {string|Object} performer - Performer name or Person/PerformingGroup object
   * @param {string} [url] - Performer URL (if performer is string)
   * @param {string} [type] - Performer type (Person or PerformingGroup)
   * @returns {EventBuilder} This builder for chaining
   */
  performer(performer, url = null, type = 'Person') {
    if (typeof performer === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(performer) : performer;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      
      this.data.performer = {
        "@type": type,
        "name": sanitizedName
      };
      
      if (url) this.data.performer.url = sanitizedUrl;
    } else if (performer && typeof performer === 'object') {
      if (this.sanitizeInputs) {
        this.data.performer = this.sanitizer.sanitizeStructuredData(performer, performer['@type'] || 'Person');
      } else {
        this.data.performer = performer;
      }
    }
    return this;
  }

  /**
   * Add multiple performers
   * @param {Array} performers - Array of performer objects or strings
   * @returns {EventBuilder} This builder for chaining
   */
  performers(performers) {
    if (Array.isArray(performers)) {
      this.data.performer = performers.map(performer => {
        if (typeof performer === 'string') {
          return {
            "@type": "Person",
            "name": this.sanitizeInputs ? this.sanitizer.sanitizeString(performer) : performer
          };
        } else if (performer && typeof performer === 'object') {
          return this.sanitizeInputs ? this.sanitizer.sanitizeStructuredData(performer, performer['@type'] || 'Person') : performer;
        }
        return performer;
      });
    }
    return this;
  }

  /**
   * Set event offers (tickets, pricing)
   * @param {string|Object} offers - Offer object or price string
   * @param {string} [currency] - Currency code (if offers is string)
   * @param {string} [availability] - Availability status (if offers is string)
   * @param {string} [url] - Offer URL (if offers is string)
   * @returns {EventBuilder} This builder for chaining
   */
  offers(offers, currency = 'USD', availability = 'InStock', url = null) {
    if (typeof offers === 'string') {
      const sanitizedPrice = this.sanitizeInputs ? this.sanitizer.sanitizeString(offers) : offers;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      
      this.data.offers = {
        "@type": "Offer",
        "price": sanitizedPrice,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      };
      
      if (url) this.data.offers.url = sanitizedUrl;
    } else if (offers && typeof offers === 'object') {
      if (this.sanitizeInputs) {
        this.data.offers = this.sanitizer.sanitizeStructuredData(offers, 'Offer');
      } else {
        this.data.offers = offers;
      }
    }
    return this;
  }

  /**
   * Set event status
   * @param {string} status - Event status (EventScheduled, EventCancelled, EventPostponed, EventRescheduled)
   * @returns {EventBuilder} This builder for chaining
   */
  eventStatus(status) {
    const validStatuses = ['EventScheduled', 'EventCancelled', 'EventPostponed', 'EventRescheduled'];
    if (validStatuses.includes(status)) {
      this.data.eventStatus = `https://schema.org/${status}`;
    } else {
      this.data.eventStatus = status;
    }
    return this;
  }

  /**
   * Set event attendance mode
   * @param {string} mode - Attendance mode (OfflineEventAttendanceMode, OnlineEventAttendanceMode, MixedEventAttendanceMode)
   * @returns {EventBuilder} This builder for chaining
   */
  eventAttendanceMode(mode) {
    const validModes = ['OfflineEventAttendanceMode', 'OnlineEventAttendanceMode', 'MixedEventAttendanceMode'];
    if (validModes.includes(mode)) {
      this.data.eventAttendanceMode = `https://schema.org/${mode}`;
    } else {
      this.data.eventAttendanceMode = mode;
    }
    return this;
  }

  /**
   * Set maximum attendee capacity
   * @param {number} capacity - Maximum number of attendees
   * @returns {EventBuilder} This builder for chaining
   */
  maximumAttendeeCapacity(capacity) {
    if (typeof capacity === 'number' && capacity > 0) {
      this.data.maximumAttendeeCapacity = capacity;
    }
    return this;
  }

  /**
   * Set event image
   * @param {string|Object} image - Image URL or ImageObject
   * @param {number} [width] - Image width (if image is string)
   * @param {number} [height] - Image height (if image is string)
   * @param {string} [caption] - Image caption (if image is string)
   * @returns {EventBuilder} This builder for chaining
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
   * Set event URL
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
   * Set event duration
   * @param {string} duration - Duration in ISO 8601 format (e.g., "PT2H30M")
   * @returns {EventBuilder} This builder for chaining
   */
  duration(duration) {
    this.data.duration = duration;
    return this;
  }

  /**
   * Set event category
   * @param {string} category - Event category
   * @returns {EventBuilder} This builder for chaining
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
   * Set event keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {EventBuilder} This builder for chaining
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
   * Set event ID
   * @param {string} id - Event ID/URL
   * @returns {EventBuilder} This builder for chaining
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
