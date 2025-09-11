/**
 * Jobposting profile definition
 * CommonJS version
 */

const jobpostingProfile = {
  "type": "Jobposting",
  "category": "business",
  "schemaType": "https://schema.org/JobPosting",
  "profileUrl": "https://llmprofiles.org/profiles/business/jobposting/v1/index.jsonld",
  "description": "A job advertisement with position details, requirements, and application information for recruitment optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "JobPosting"
    },
    "title": {
      "type": "string",
      "minLength": 3,
      "description": "The title of the job position"
    },
    "hiringOrganization": {
      "anyOf": [
        {
          "type": "string",
          "description": "Organization name as string"
        },
        {
          "type": "object",
          "description": "Organization as Organization object"
        }
      ]
    },
    "jobLocation": {
      "anyOf": [
        {
          "type": "string",
          "description": "Location as string"
        },
        {
          "type": "object",
          "description": "Location as Place object"
        }
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
      "minLength": 1,
      "description": "Detailed description of the job position"
    },
    "employmentType": {
      "type": "string",
      "description": "Type of employment (e.g., FULL_TIME, PART_TIME, CONTRACTOR)"
    },
    "datePosted": {
      "type": "string",
      "format": "date",
      "description": "Date when the job was posted"
    },
    "validThrough": {
      "type": "string",
      "format": "date",
      "description": "Date when the job posting expires"
    },
    "baseSalary": {
      "type": "object",
      "description": "Base salary information as MonetaryAmount"
    },
    "jobLocationType": {
      "type": "string",
      "description": "Location type (e.g., TELECOMMUTE for remote positions)"
    },
    "qualifications": {
      "type": "string",
      "description": "Job qualifications and requirements"
    },
    "responsibilities": {
      "type": "string",
      "description": "Job responsibilities and duties"
    },
    "experienceRequirements": {
      "type": "string",
      "description": "Experience requirements for the position"
    },
    "educationRequirements": {
      "type": "string",
      "description": "Education requirements for the position"
    },
    "skills": {
      "anyOf": [
        {
          "type": "string",
          "description": "Skills as string"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Skills as array of strings"
        }
      ]
    },
    "applicationContact": {
      "anyOf": [
        {
          "type": "string",
          "description": "Contact email as string"
        },
        {
          "type": "object",
          "description": "Contact as ContactPoint object"
        }
      ]
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the job posting"
    },
    "industry": {
      "type": "string",
      "description": "Industry type for the job"
    },
    "occupationalCategory": {
      "type": "string",
      "description": "Occupational category for the job"
    },
    "jobStartDate": {
      "type": "string",
      "format": "date",
      "description": "Expected start date for the job"
    },
    "jobImmediateStart": {
      "type": "boolean",
      "description": "Whether immediate start is available"
    },
    "workHours": {
      "type": "string",
      "description": "Work hours description"
    },
    "benefits": {
      "type": "string",
      "description": "Job benefits description"
    },
    "directApply": {
      "type": "boolean",
      "description": "Whether direct application is available"
    },
    "applicantLocationRequirements": {
      "anyOf": [
        {
          "type": "string",
          "description": "Country name as string"
        },
        {
          "type": "object",
          "description": "Location requirements as Country object"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the job posting"
    },
    "name": {
      "type": "string",
      "description": "Alternative name for the job posting"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the job posting"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
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
      "description": "Image associated with the job posting"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the job posting was last modified"
    },
    "incentiveCompensation": {
      "type": "string",
      "description": "Incentive compensation information"
    },
    "jobBenefits": {
      "type": "string",
      "description": "Job benefits information"
    },
    "specialCommitments": {
      "type": "string",
      "description": "Special commitments for the job"
    },
    "securityClearanceRequirement": {
      "type": "string",
      "description": "Security clearance requirements"
    },
    "employmentUnit": {
      "type": "object",
      "description": "Employment unit information"
    },
    "hiringOrganization": {
      "type": "object",
      "description": "Additional hiring organization details"
    }
  },
  "googleRichResults": [
    "title",
    "hiringOrganization",
    "jobLocation",
    "datePosted",
    "description",
    "employmentType",
    "baseSalary",
    "validThrough"
  ],
  "llmOptimized": [
    "title",
    "description",
    "hiringOrganization",
    "jobLocation",
    "qualifications",
    "responsibilities",
    "skills",
    "experienceRequirements",
    "educationRequirements"
  ]
};

module.exports = jobpostingProfile;
