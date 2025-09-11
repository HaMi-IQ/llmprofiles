/**
 * Article profile definition
 * CommonJS version
 */

const articleProfile = {
  "type": "Article",
  "category": "content",
  "schemaType": "https://schema.org/Article",
  "profileUrl": "https://llmprofiles.org/profiles/content/article/v1/index.jsonld",
  "description": "A written article, blog post, news story, or other published content with structured metadata optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Article"
    },
    "headline": {
      "type": "string",
      "minLength": 3,
      "description": "The main headline or title of the article"
    },
    "author": {
      "anyOf": [
        {
          "type": "string",
          "description": "Author name as string"
        },
        {
          "type": "object",
          "description": "Author as Person or Organization object"
        }
      ]
    },
    "datePublished": {
      "type": "string",
      "format": "date-time",
      "description": "Date when the article was first published"
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
      "description": "Brief description or summary of the article"
    },
    "dateModified": {
      "type": "string",
      "format": "date-time",
      "description": "Date when the article was last modified"
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
    "articleBody": {
      "type": "string",
      "minLength": 1,
      "description": "The main content of the article"
    },
    "articleSection": {
      "type": "string",
      "description": "The section or category of the article"
    },
    "keywords": {
      "anyOf": [
        {
          "type": "string",
          "description": "Keywords as comma-separated string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Keywords as array of strings"
        }
      ]
    },
    "wordCount": {
      "type": "integer",
      "minimum": 1,
      "description": "Number of words in the article"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Image URL as string"
        },
        {
          "type": "object",
          "description": "Image as ImageObject"
        }
      ]
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the article"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the article content (BCP-47 format)"
    },
    "mainEntityOfPage": {
      "type": "string",
      "format": "uri",
      "description": "URL of the main page containing the article"
    },
    "speakable": {
      "type": "object",
      "description": "Speakable specification for voice search optimization"
    },
    "about": {
      "anyOf": [
        {
          "type": "string",
          "description": "Topic as string"
        },
        {
          "type": "object",
          "description": "Topic as Thing object"
        }
      ]
    },
    "mentions": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "object"
          }
        ]
      },
      "description": "Array of entities mentioned in the article"
    },
    "isPartOf": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Series URL as string"
        },
        {
          "type": "object",
          "description": "Series as CreativeWorkSeries object"
        }
      ]
    },
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the article"
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
  "optional": {
    "name": {
      "type": "string",
      "description": "Alternative name for the article"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the article"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page (e.g., Wikipedia)"
    },
    "citation": {
      "type": "string",
      "description": "Citation information for the article"
    },
    "copyrightYear": {
      "type": "integer",
      "description": "Copyright year"
    },
    "copyrightHolder": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ],
      "description": "Copyright holder"
    },
    "license": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "object"
        }
      ],
      "description": "License information"
    },
    "genre": {
      "type": "string",
      "description": "Genre or category of the article"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the article"
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the article"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the article"
    }
  },
  "googleRichResults": [
    "headline",
    "image",
    "author",
    "datePublished",
    "publisher",
    "description",
    "articleBody"
  ],
  "llmOptimized": [
    "headline",
    "description",
    "author",
    "articleBody",
    "keywords",
    "datePublished",
    "about",
    "mentions",
    "articleSection"
  ]
};

module.exports = articleProfile;
