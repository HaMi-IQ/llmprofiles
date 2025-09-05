/**
 * Softwareapplication profile definition
 * ES Module version
 */

export const softwareapplicationProfile = {
  "type": "Softwareapplication",
  "category": "technology",
  "schemaType": "https://schema.org/SoftwareApplication",
  "profileUrl": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld",
  "description": "A software application with features, requirements, and download information for software discovery.",
  "required": {
    "@type": {
      "const": "SoftwareApplication"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "applicationCategory": {
      "type": "string"
    },
    "operatingSystem": {
      "type": "string"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld"
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
    "softwareVersion": {
      "type": "string"
    },
    "softwareRequirements": {
      "type": "string"
    },
    "memoryRequirements": {
      "type": "string"
    },
    "storageRequirements": {
      "type": "string"
    },
    "processorRequirements": {
      "type": "string"
    },
    "featureList": {
      "type": "string"
    },
    "screenshot": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "downloadUrl": {
      "type": "string"
    },
    "installUrl": {
      "type": "string"
    },
    "updateUrl": {
      "type": "string"
    },
    "fileSize": {
      "type": "string"
    },
    "releaseNotes": {
      "type": "string"
    },
    "datePublished": {
      "type": "string",
      "format": "date"
    },
    "dateModified": {
      "type": "string",
      "format": "date"
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
    "offers": {
      "type": "object"
    },
    "aggregateRating": {
      "type": "object"
    },
    "url": {
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
    }
  },
  "optional": {},
  "googleRichResults": [
    "name",
    "operatingSystem",
    "applicationCategory",
    "aggregateRating",
    "offers"
  ],
  "llmOptimized": [
    "name",
    "description",
    "applicationCategory",
    "operatingSystem",
    "offers"
  ]
};

export default softwareapplicationProfile;
