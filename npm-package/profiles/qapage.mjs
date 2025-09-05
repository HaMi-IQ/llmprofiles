/**
 * Qapage profile definition
 * ES Module version
 */

export const qapageProfile = {
  "type": "Qapage",
  "category": "interaction",
  "schemaType": "https://schema.org/QAPage",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/qapage/v1/index.jsonld",
  "description": "A page focused on a single question with multiple answers, comments, or discussions.",
  "required": {
    "@type": {
      "const": "QAPage"
    },
    "mainEntity": {
      "type": "object"
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
    "url": {
      "type": "string"
    },
    "inLanguage": {
      "type": "string"
    }
  },
  "optional": {},
  "googleRichResults": [
    "mainEntity"
  ],
  "llmOptimized": [
    "mainEntity",
    "name",
    "description"
  ]
};

export default qapageProfile;
