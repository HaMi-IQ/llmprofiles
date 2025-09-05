/**
 * Faqpage profile definition
 * ES Module version
 */

export const faqpageProfile = {
  "type": "Faqpage",
  "category": "interaction",
  "schemaType": "https://schema.org/FAQPage",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld",
  "description": "A page listing multiple user-relevant questions with their accepted answers.",
  "required": {
    "@type": {
      "const": "FAQPage"
    },
    "mainEntity": {
      "type": "array"
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

export default faqpageProfile;
