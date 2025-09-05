/**
 * ProductOffer profile definition
 * ES Module version
 */

export const productofferProfile = {
  "type": "ProductOffer",
  "category": "business",
  "schemaType": "https://schema.org/Product",
  "profileUrl": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld",
  "description": "A product listing with pricing, availability, and purchase information for e-commerce applications.",
  "required": {
    "@type": {
      "const": "Product"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "offers": {
      "type": "object"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld"
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
    "brand": {
      "type": "object"
    },
    "category": {
      "type": "string"
    },
    "sku": {
      "type": "string"
    },
    "mpn": {
      "type": "string"
    },
    "gtin": {
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
    "aggregateRating": {
      "type": "object"
    },
    "review": {
      "type": "array"
    },
    "url": {
      "type": "string"
    }
  },
  "optional": {},
  "googleRichResults": [
    "name",
    "image",
    "offers",
    "aggregateRating",
    "brand"
  ],
  "llmOptimized": [
    "name",
    "description",
    "brand",
    "offers",
    "sku",
    "aggregateRating"
  ]
};

export default productofferProfile;
