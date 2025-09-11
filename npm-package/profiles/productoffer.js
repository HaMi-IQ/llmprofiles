/**
 * ProductOffer profile definition
 * CommonJS version
 */

const productofferProfile = {
  "type": "ProductOffer",
  "category": "business",
  "schemaType": "https://schema.org/Product",
  "profileUrl": "https://llmprofiles.org/profiles/business/product-offer/v1/index.jsonld",
  "description": "A product listing with pricing, availability, and purchase information for e-commerce applications optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Product"
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "description": "The name of the product"
    },
    "offers": {
      "type": "object",
      "description": "Product offers and pricing information"
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
      "description": "Description of the product"
    },
    "brand": {
      "anyOf": [
        {
          "type": "string",
          "description": "Brand name as string"
        },
        {
          "type": "object",
          "description": "Brand as Organization object"
        }
      ]
    },
    "category": {
      "type": "string",
      "description": "Product category"
    },
    "sku": {
      "type": "string",
      "description": "Stock Keeping Unit identifier"
    },
    "mpn": {
      "type": "string",
      "description": "Manufacturer Part Number"
    },
    "gtin": {
      "type": "string",
      "description": "Global Trade Item Number"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Product image URL"
        },
        {
          "type": "object",
          "description": "Product image as ImageObject"
        }
      ]
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the product"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the product"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the product page"
    },
    "additionalProperty": {
      "type": "array",
      "description": "Additional product properties"
    },
    "productID": {
      "type": "string",
      "description": "Product identifier"
    },
    "model": {
      "type": "string",
      "description": "Product model"
    },
    "color": {
      "type": "string",
      "description": "Product color"
    },
    "size": {
      "type": "string",
      "description": "Product size"
    },
    "weight": {
      "type": "object",
      "description": "Product weight"
    },
    "height": {
      "type": "object",
      "description": "Product height"
    },
    "width": {
      "type": "object",
      "description": "Product width"
    },
    "depth": {
      "type": "object",
      "description": "Product depth"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the product"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the product"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the product was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the product was last modified"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the product information"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the product"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the product"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the product"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "description": "Whether the product is free"
    },
    "material": {
      "type": "string",
      "description": "Product material"
    },
    "pattern": {
      "type": "string",
      "description": "Product pattern"
    },
    "productionDate": {
      "type": "string",
      "format": "date",
      "description": "Production date"
    },
    "purchaseDate": {
      "type": "string",
      "format": "date",
      "description": "Purchase date"
    }
  },
  "googleRichResults": [
    "name",
    "image",
    "offers",
    "aggregateRating",
    "brand",
    "description",
    "sku",
    "gtin"
  ],
  "llmOptimized": [
    "name",
    "description",
    "brand",
    "offers",
    "sku",
    "aggregateRating",
    "category",
    "model"
  ]
};

module.exports = productofferProfile;
