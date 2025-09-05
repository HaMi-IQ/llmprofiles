/**
 * Dataset profile definition
 * CommonJS version
 */

const datasetProfile = {
  "type": "Dataset",
  "category": "content",
  "schemaType": "https://schema.org/Dataset",
  "profileUrl": "https://llmprofiles.org/profiles/content/dataset/v1/index.jsonld",
  "description": "A structured dataset with metadata, format information, and content description optimized for AI discovery and processing.",
  "required": {
    "@type": {
      "const": "Dataset"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "The name of the dataset"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "A description of the dataset content and purpose"
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
    "creator": {
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
      "format": "date",
      "description": "Date when the dataset was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the dataset was last modified"
    },
    "dateCreated": {
      "type": "string",
      "format": "date",
      "description": "Date when the dataset was created"
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
      ]
    },
    "distribution": {
      "type": "array"
    },
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the dataset"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the dataset content (BCP-47 format)"
    },
    "about": {
      "type": "array"
    },
    "spatialCoverage": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "temporalCoverage": {
      "type": "string",
      "description": "Time period covered by the dataset"
    },
    "variableMeasured": {
      "type": "array"
    },
    "citation": {
      "type": "array"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "description": "Whether the dataset is freely accessible"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/dataset/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/dataset/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/dataset/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/dataset/v1/index.jsonld"
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
    "description",
    "creator",
    "distribution"
  ],
  "llmOptimized": [
    "name",
    "description",
    "variableMeasured",
    "spatialCoverage"
  ]
};

module.exports = datasetProfile;
