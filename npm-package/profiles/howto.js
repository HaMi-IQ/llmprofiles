/**
 * Howto profile definition
 * CommonJS version
 */

const howtoProfile = {
  "type": "Howto",
  "category": "content",
  "schemaType": "https://schema.org/HowTo",
  "profileUrl": "https://llmprofiles.org/profiles/content/howto/v1/index.jsonld",
  "description": "A structured guide for completing tasks or learning skills with step-by-step instructions optimized for AI processing and search.",
  "required": {
    "@type": {
      "const": "HowTo"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "The name of the how-to guide"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "A description of what the how-to guide teaches"
    },
    "step": {
      "type": "array"
    }
  },
  "recommended": {
    "@context": {
      "const": "https://schema.org"
    },
    "@id": {
      "type": "string",
      "format": "uri-reference"
    },
    "author": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "datePublished": {
      "type": "string",
      "format": "date"
    },
    "dateModified": {
      "type": "string",
      "format": "date"
    },
    "totalTime": {
      "type": "string",
      "description": "ISO 8601 duration for total time to complete"
    },
    "estimatedCost": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "difficulty": {
      "type": "string",
      "description": "Difficulty level of the task"
    },
    "prerequisites": {
      "type": "array"
    },
    "tool": {
      "type": "array"
    },
    "supply": {
      "type": "array"
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
      ]
    },
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the how-to guide"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/howto/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/howto/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/howto/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/howto/v1/index.jsonld"
        }
      },
      "required": [
        "@type",
        "name",
        "value"
      ]
    }
  },
  "optional": {},
  "googleRichResults": [
    "name",
    "step",
    "totalTime",
    "tool"
  ],
  "llmOptimized": [
    "name",
    "description",
    "step",
    "tool",
    "supply"
  ]
};

module.exports = howtoProfile;
