/**
 * Softwareapplication profile definition
 * CommonJS version
 */

const softwareapplicationProfile = {
  "type": "Softwareapplication",
  "category": "technology",
  "schemaType": "https://schema.org/SoftwareApplication",
  "profileUrl": "https://llmprofiles.org/profiles/technology/softwareapplication/v1/index.jsonld",
  "description": "A software application with features, requirements, and download information for software discovery optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "SoftwareApplication"
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "description": "The name of the software application"
    },
    "applicationCategory": {
      "type": "string",
      "description": "Category of the application (e.g., Game, BusinessApplication)"
    },
    "operatingSystem": {
      "type": "string",
      "description": "Operating system requirements"
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
      "description": "Description of the software application"
    },
    "softwareVersion": {
      "type": "string",
      "description": "Version of the software"
    },
    "softwareRequirements": {
      "type": "string",
      "description": "Software requirements"
    },
    "memoryRequirements": {
      "type": "string",
      "description": "Memory requirements"
    },
    "storageRequirements": {
      "type": "string",
      "description": "Storage requirements"
    },
    "processorRequirements": {
      "type": "string",
      "description": "Processor requirements"
    },
    "featureList": {
      "type": "string",
      "description": "List of features"
    },
    "screenshot": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Screenshot URL"
        },
        {
          "type": "object",
          "description": "Screenshot as ImageObject"
        }
      ]
    },
    "downloadUrl": {
      "type": "string",
      "format": "uri",
      "description": "Download URL for the application"
    },
    "installUrl": {
      "type": "string",
      "format": "uri",
      "description": "Installation URL"
    },
    "updateUrl": {
      "type": "string",
      "format": "uri",
      "description": "Update URL"
    },
    "fileSize": {
      "type": "string",
      "description": "File size of the application"
    },
    "releaseNotes": {
      "type": "string",
      "description": "Release notes for the application"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the application was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the application was last modified"
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
    "offers": {
      "type": "object",
      "description": "Application offers and pricing information"
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the application"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the application page"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Application image URL"
        },
        {
          "type": "object",
          "description": "Application image as ImageObject"
        }
      ]
    },
    "applicationSubCategory": {
      "type": "string",
      "description": "Sub-category of the application"
    },
    "browserRequirements": {
      "type": "string",
      "description": "Browser requirements for web applications"
    },
    "permissions": {
      "type": "string",
      "description": "Permissions required by the application"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the application"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the application"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the application"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the application"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the application"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the application"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "description": "Whether the application is free"
    },
    "license": {
      "type": "string",
      "description": "License information"
    },
    "copyrightYear": {
      "type": "integer",
      "description": "Copyright year"
    },
    "copyrightHolder": {
      "type": "object",
      "description": "Copyright holder"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the application"
    }
  },
  "googleRichResults": [
    "name",
    "operatingSystem",
    "applicationCategory",
    "aggregateRating",
    "offers",
    "description",
    "softwareVersion"
  ],
  "llmOptimized": [
    "name",
    "description",
    "applicationCategory",
    "operatingSystem",
    "offers",
    "softwareVersion",
    "featureList",
    "softwareRequirements"
  ]
};

module.exports = softwareapplicationProfile;
