/**
 * Qapage profile definition
 * CommonJS version
 */

const qapageProfile = {
  "type": "Qapage",
  "category": "interaction",
  "schemaType": "https://schema.org/QAPage",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld",
  "description": "A page focused on a single question with multiple answers, comments, or discussions optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "QAPage"
    },
    "mainEntity": {
      "type": "object",
      "properties": {
        "@type": {
          "const": "Question"
        },
        "name": {
          "type": "string"
        },
        "answerCount": {
          "type": "integer"
        },
        "acceptedAnswer": {
          "type": "object",
          "properties": {
            "@type": {
              "const": "Answer"
            },
            "text": {
              "type": "string"
            },
            "author": {
              "type": "object"
            },
            "dateCreated": {
              "type": "string",
              "format": "date-time"
            },
            "upvoteCount": {
              "type": "integer"
            }
          },
          "required": ["@type", "text"]
        },
        "suggestedAnswer": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "@type": {
                "const": "Answer"
              },
              "text": {
                "type": "string"
              },
              "author": {
                "type": "object"
              },
              "dateCreated": {
                "type": "string",
                "format": "date-time"
              },
              "upvoteCount": {
                "type": "integer"
              }
            },
            "required": ["@type", "text"]
          }
        }
      },
      "required": ["@type", "name"],
      "description": "Main question entity with answers"
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
      "description": "Name of the Q&A page"
    },
    "description": {
      "type": "string",
      "description": "Description of the Q&A page"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the Q&A page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the Q&A content"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the Q&A page was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the Q&A page was last modified"
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
      "const": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld"
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
      "description": "Unique identifier for the Q&A page"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the Q&A page"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the Q&A page"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the Q&A page"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the Q&A page"
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
      "description": "Image associated with the Q&A page"
    },
    "breadcrumb": {
      "type": "object",
      "description": "Breadcrumb navigation for the Q&A page"
    },
    "mainEntityOfPage": {
      "type": "string",
      "format": "uri",
      "description": "URL of the main page containing the Q&A"
    },
    "isPartOf": {
      "type": "object",
      "description": "Part of a larger work or collection"
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

module.exports = qapageProfile;
