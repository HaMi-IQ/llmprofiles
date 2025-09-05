/**
 * Review profile definition
 * CommonJS version
 */

const reviewProfile = {
  "type": "Review",
  "category": "business",
  "schemaType": "https://schema.org/Review",
  "profileUrl": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld",
  "description": "A product or service review with rating, feedback, and author information for consumer guidance.",
  "required": {
    "@type": {
      "const": "Review"
    },
    "reviewRating": {
      "type": "object"
    },
    "author": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        },
        {
          "type": "object"
        }
      ]
    },
    "itemReviewed": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        },
        {
          "type": "object"
        },
        {
          "type": "object"
        }
      ]
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld"
        }
      },
      "required": [
        "@type",
        "name",
        "value"
      ]
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
    "reviewBody": {
      "type": "string",
      "minLength": 1
    },
    "reviewAspect": {
      "type": "string"
    },
    "datePublished": {
      "type": "string",
      "format": "date"
    },
    "dateModified": {
      "type": "string",
      "format": "date"
    },
    "publisher": {
      "type": "object"
    },
    "url": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "headline": {
      "type": "string"
    }
  },
  "optional": {},
  "googleRichResults": [
    "itemReviewed",
    "author",
    "reviewRating",
    "reviewBody"
  ],
  "llmOptimized": [
    "itemReviewed",
    "author",
    "reviewRating",
    "reviewBody",
    "datePublished"
  ]
};

module.exports = reviewProfile;
