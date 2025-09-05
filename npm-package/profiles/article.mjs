/**
 * Article profile definition
 * ES Module version
 */

export const articleProfile = {
  "type": "Article",
  "category": "content",
  "schemaType": "https://schema.org/Article",
  "profileUrl": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld",
  "description": "A written article, blog post, news story, or other published content with structured metadata.",
  "required": {
    "@type": {
      "const": "Article"
    },
    "headline": {
      "type": "string",
      "minLength": 3
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
    "datePublished": {
      "type": "string",
      "format": "date-time"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld"
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
    "dateModified": {
      "type": "string",
      "format": "date-time"
    },
    "publisher": {
      "type": "object"
    },
    "articleBody": {
      "type": "string",
      "minLength": 1
    },
    "articleSection": {
      "type": "string"
    },
    "keywords": {
      "type": "string"
    },
    "wordCount": {
      "type": "integer",
      "minimum": 1
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
    "url": {
      "type": "string"
    },
    "inLanguage": {
      "type": "string"
    },
    "mainEntityOfPage": {
      "type": "string"
    }
  },
  "optional": {},
  "googleRichResults": [
    "headline",
    "image",
    "author",
    "datePublished",
    "publisher"
  ],
  "llmOptimized": [
    "headline",
    "description",
    "author",
    "articleBody",
    "keywords",
    "datePublished"
  ]
};

export default articleProfile;
