/**
 * Localbusiness profile definition
 * CommonJS version
 */

const localbusinessProfile = {
  "type": "Localbusiness",
  "category": "business",
  "schemaType": "https://schema.org/LocalBusiness",
  "profileUrl": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld",
  "description": "A local business with address, contact information, and services for local search and discovery optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "LocalBusiness"
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "description": "The name of the local business"
    },
    "address": {
      "type": "object",
      "description": "Business address as PostalAddress object"
    },
    "telephone": {
      "type": "string",
      "description": "Business telephone number"
    }
  },
  "recommended": {
    "@context": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "array"
        }
      ]
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "Description of the business"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Business email address"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "Business website URL"
    },
    "geo": {
      "type": "object",
      "description": "Geographic coordinates of the business"
    },
    "openingHours": {
      "type": "string",
      "description": "Business opening hours"
    },
    "openingHoursSpecification": {
      "type": "array",
      "description": "Detailed opening hours specification"
    },
    "priceRange": {
      "type": "string",
      "description": "Price range of the business (e.g., $, $$, $$$)"
    },
    "paymentAccepted": {
      "type": "string",
      "description": "Payment methods accepted"
    },
    "currenciesAccepted": {
      "type": "string",
      "description": "Currencies accepted"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Business image URL"
        },
        {
          "type": "object",
          "description": "Business image as ImageObject"
        }
      ]
    },
    "logo": {
      "type": "object",
      "description": "Business logo as ImageObject"
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the business"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the business"
    },
    "hasOfferCatalog": {
      "type": "object",
      "description": "Catalog of offers from the business"
    },
    "makesOffer": {
      "type": "array",
      "description": "Offers made by the business"
    },
    "areaServed": {
      "type": "object",
      "description": "Geographic area served by the business"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld"
    },
    "additionalProperty": {
      "type": "object",
      "properties": {
        "@type": {
          "const": "PropertyValue"
        },
        "name": {
          "const": "profile"
        },
        "value": {
          "const": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld"
        }
      },
      "required": [
        "@type",
        "name",
        "value"
      ]
    }
  },
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the business"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the business"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the business information"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the business"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the business"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the business"
    },
    "foundingDate": {
      "type": "string",
      "format": "date",
      "description": "Date when the business was founded"
    },
    "founder": {
      "type": "object",
      "description": "Founder of the business"
    },
    "employee": {
      "type": "array",
      "description": "Employees of the business"
    },
    "numberOfEmployees": {
      "type": "integer",
      "description": "Number of employees"
    },
    "slogan": {
      "type": "string",
      "description": "Business slogan"
    },
    "knowsAbout": {
      "type": "array",
      "description": "Topics the business knows about"
    },
    "serviceArea": {
      "type": "object",
      "description": "Service area of the business"
    },
    "hasMap": {
      "type": "string",
      "format": "uri",
      "description": "URL to a map of the business location"
    }
  },
  "googleRichResults": [
    "name",
    "address",
    "telephone",
    "openingHours",
    "image",
    "aggregateRating",
    "priceRange"
  ],
  "llmOptimized": [
    "name",
    "description",
    "address",
    "telephone",
    "openingHours",
    "geo",
    "priceRange",
    "paymentAccepted"
  ]
};

module.exports = localbusinessProfile;
