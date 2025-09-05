/**
 * Jobposting profile definition
 * ES Module version
 */

export const jobpostingProfile = {
  "type": "Jobposting",
  "category": "business",
  "schemaType": "https://schema.org/JobPosting",
  "profileUrl": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld",
  "description": "A job advertisement with position details, requirements, and application information for recruitment.",
  "required": {
    "@type": {
      "const": "JobPosting"
    },
    "title": {
      "type": "string",
      "minLength": 3
    },
    "hiringOrganization": {
      "type": "object"
    },
    "jobLocation": {
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
      "const": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld"
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
    "employmentType": {
      "type": "string"
    },
    "datePosted": {
      "type": "string",
      "format": "date"
    },
    "validThrough": {
      "type": "string",
      "format": "date"
    },
    "salaryCurrency": {
      "type": "string"
    },
    "salaryMinValue": {
      "type": "number"
    },
    "salaryMaxValue": {
      "type": "number"
    },
    "salaryUnit": {
      "type": "string"
    },
    "qualifications": {
      "type": "string"
    },
    "responsibilities": {
      "type": "string"
    },
    "experienceRequirements": {
      "type": "string"
    },
    "educationRequirements": {
      "type": "string"
    },
    "applicationContact": {
      "type": "object"
    },
    "url": {
      "type": "string"
    }
  },
  "optional": {},
  "googleRichResults": [
    "title",
    "hiringOrganization",
    "jobLocation",
    "datePosted",
    "description"
  ],
  "llmOptimized": [
    "title",
    "description",
    "hiringOrganization",
    "jobLocation",
    "requirements",
    "skills"
  ]
};

export default jobpostingProfile;
