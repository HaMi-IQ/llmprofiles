/**
 * Localbusiness profile definition
 * ES Module version
 */

export const localbusinessProfile = {
  "type": "Localbusiness",
  "category": "business",
  "schemaType": "https://schema.org/LocalBusiness",
  "profileUrl": "https://llmprofiles.org/profiles/business/localbusiness/v1/index.jsonld",
  "description": "A local business with address, contact information, and services for local search and discovery.",
  "required": {
    "@type": {
      "const": "LocalBusiness"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "address": {
      "type": "object"
    },
    "telephone": {
      "type": "string"
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
      "minLength": 1
    },
    "email": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "geo": {
      "type": "object"
    },
    "openingHours": {
      "type": "string"
    },
    "openingHoursSpecification": {
      "type": "array"
    },
    "priceRange": {
      "type": "string"
    },
    "paymentAccepted": {
      "type": "string"
    },
    "currenciesAccepted": {
      "type": "string"
    },
    "image": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "logo": {
      "type": "object"
    }
  },
  "optional": {},
  "googleRichResults": [
    "name",
    "address",
    "telephone",
    "openingHours",
    "image"
  ],
  "llmOptimized": [
    "name",
    "description",
    "address",
    "telephone",
    "openingHours",
    "geo"
  ]
};

export default localbusinessProfile;
