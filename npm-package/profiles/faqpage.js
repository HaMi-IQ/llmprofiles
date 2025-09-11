/**
 * Faqpage profile definition
 * CommonJS version
 */

const faqpageProfile = {
  "type": "Faqpage",
  "category": "interaction",
  "schemaType": "https://schema.org/FAQPage",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld",
  "description": "A page listing multiple user-relevant questions with their accepted answers optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "FAQPage"
    },
    "mainEntity": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "@type": {
            "const": "Question"
          },
          "name": {
            "type": "string"
          },
          "acceptedAnswer": {
            "type": "object",
            "properties": {
              "@type": {
                "const": "Answer"
              },
              "text": {
                "type": "string"
              }
            },
            "required": ["@type", "text"]
          }
        },
        "required": ["@type", "name", "acceptedAnswer"]
      },
      "description": "Array of Question objects with accepted answers"
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
    "name": {
      "type": "string",
      "description": "Name of the FAQ page"
    },
    "description": {
      "type": "string",
      "description": "Description of the FAQ page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the FAQ content"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the FAQ page"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the FAQ page was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the FAQ page was last modified"
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
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld"
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
      "description": "Unique identifier for the FAQ page"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the FAQ page"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the FAQ page"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the FAQ page"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the FAQ page"
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
      "description": "Image associated with the FAQ page"
    },
    "breadcrumb": {
      "type": "object",
      "description": "Breadcrumb navigation for the FAQ page"
    },
    "mainEntityOfPage": {
      "type": "string",
      "format": "uri",
      "description": "URL of the main page containing the FAQ"
    }
  },
  "googleRichResults": [
    "mainEntity",
    "name",
    "description"
  ],
  "llmOptimized": [
    "mainEntity",
    "name",
    "description",
    "inLanguage",
    "author"
  ]
};

module.exports = faqpageProfile;
