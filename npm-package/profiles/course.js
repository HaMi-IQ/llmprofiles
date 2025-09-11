/**
 * Course profile definition
 * CommonJS version
 */

const courseProfile = {
  "type": "Course",
  "category": "content",
  "schemaType": "https://schema.org/Course",
  "profileUrl": "https://llmprofiles.org/profiles/content/course/v1/index.jsonld",
  "description": "An educational course with curriculum, instructor, and enrollment information for learning platforms optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Course"
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "description": "The name of the course"
    },
    "provider": {
      "anyOf": [
        {
          "type": "string",
          "description": "Provider name as string"
        },
        {
          "type": "object",
          "description": "Provider as Organization object"
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
      "description": "Description of the course content"
    },
    "instructor": {
      "anyOf": [
        {
          "type": "string",
          "description": "Instructor name as string"
        },
        {
          "type": "object",
          "description": "Instructor as Person object"
        }
      ]
    },
    "coursePrerequisites": {
      "type": "string",
      "description": "Prerequisites for taking the course"
    },
    "educationalLevel": {
      "type": "string",
      "description": "Educational level (e.g., Beginner, Intermediate, Advanced)"
    },
    "courseMode": {
      "type": "string",
      "description": "Course delivery mode (e.g., Online, In-person, Hybrid)"
    },
    "timeRequired": {
      "type": "string",
      "description": "Time required to complete the course"
    },
    "numberOfCredits": {
      "type": "integer",
      "minimum": 1,
      "description": "Number of credits awarded for the course"
    },
    "offers": {
      "type": "object",
      "description": "Course offers and pricing information"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the course page"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Course image URL"
        },
        {
          "type": "object",
          "description": "Course image as ImageObject"
        }
      ]
    },
    "educationalCredentialAwarded": {
      "type": "string",
      "description": "Credential awarded upon completion"
    },
    "courseCode": {
      "type": "string",
      "description": "Course code or identifier"
    },
    "syllabusSections": {
      "type": "array",
      "description": "Array of syllabus sections"
    },
    "hasCourseInstance": {
      "type": "array",
      "description": "Course instances or sessions"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the course"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the course"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the course was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the course was last modified"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the course content"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the course"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the course"
    },
    "teaches": {
      "type": "string",
      "description": "What the course teaches"
    },
    "courseWorkload": {
      "type": "string",
      "description": "Expected workload for the course"
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the course"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the course"
    }
  },
  "googleRichResults": [
    "name",
    "description",
    "provider",
    "offers",
    "instructor",
    "educationalLevel"
  ],
  "llmOptimized": [
    "name",
    "description",
    "coursePrerequisites",
    "educationalCredentialAwarded",
    "instructor",
    "educationalLevel",
    "courseMode",
    "timeRequired"
  ]
};

module.exports = courseProfile;
