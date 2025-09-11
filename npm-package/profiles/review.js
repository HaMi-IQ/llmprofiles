/**
 * Review profile definition
 * CommonJS version
 */

const reviewProfile = {
  "type": "Review",
  "category": "business",
  "schemaType": "https://schema.org/Review",
  "profileUrl": "https://llmprofiles.org/profiles/business/review/v1/index.jsonld",
  "description": "A product or service review with rating, feedback, and author information for consumer guidance optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Review"
    },
    "reviewRating": {
      "type": "object",
      "description": "Rating information for the review"
    },
    "author": {
      "anyOf": [
        {
          "type": "string",
          "description": "Author name as string"
        },
        {
          "type": "object",
          "description": "Author as Person object"
        }
      ]
    },
    "itemReviewed": {
      "anyOf": [
        {
          "type": "string",
          "description": "Item name as string"
        },
        {
          "type": "object",
          "description": "Item as Product, Service, or other object"
        }
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
      "minLength": 1,
      "description": "The main content of the review"
    },
    "reviewAspect": {
      "type": "string",
      "description": "Aspect of the item being reviewed"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the review was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the review was last modified"
    },
    "publisher": {
      "anyOf": [
        {
          "type": "string",
          "description": "Publisher name as string"
        },
        {
          "type": "object",
          "description": "Publisher as Organization object"
        }
      ]
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the review"
    },
    "name": {
      "type": "string",
      "description": "Name of the review"
    },
    "headline": {
      "type": "string",
      "description": "Headline of the review"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the review"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the review"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the review"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the review"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the review"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the review"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "object"
        }
      ],
      "description": "Image associated with the review"
    },
    "video": {
      "type": "object",
      "description": "Video associated with the review"
    },
    "positiveNotes": {
      "type": "string",
      "description": "Positive aspects of the review"
    },
    "negativeNotes": {
      "type": "string",
      "description": "Negative aspects of the review"
    },
    "bestRating": {
      "type": "number",
      "description": "Best possible rating"
    },
    "worstRating": {
      "type": "number",
      "description": "Worst possible rating"
    }
  },
  "googleRichResults": [
    "itemReviewed",
    "author",
    "reviewRating",
    "reviewBody",
    "datePublished",
    "publisher"
  ],
  "llmOptimized": [
    "itemReviewed",
    "author",
    "reviewRating",
    "reviewBody",
    "datePublished",
    "reviewAspect",
    "headline"
  ]
};

module.exports = reviewProfile;
