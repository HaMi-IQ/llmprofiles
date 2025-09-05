/**
 * Course profile definition
 * CommonJS version
 */

const courseProfile = {
  "type": "Course",
  "category": "content",
  "schemaType": "https://schema.org/Course",
  "profileUrl": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld",
  "description": "An educational course with curriculum, instructor, and enrollment information for learning platforms.",
  "required": {
    "@type": {
      "const": "Course"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "provider": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld"
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
    "instructor": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "coursePrerequisites": {
      "type": "string"
    },
    "educationalLevel": {
      "type": "string"
    },
    "courseMode": {
      "type": "string"
    },
    "timeRequired": {
      "type": "string"
    },
    "numberOfCredits": {
      "type": "integer",
      "minimum": 1
    },
    "offers": {
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
    "description",
    "provider",
    "offers"
  ],
  "llmOptimized": [
    "name",
    "description",
    "coursePrerequisites",
    "educationalCredentialAwarded"
  ]
};

module.exports = courseProfile;
