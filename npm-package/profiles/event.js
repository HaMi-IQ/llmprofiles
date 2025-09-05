/**
 * Event profile definition
 * CommonJS version
 */

const eventProfile = {
  "type": "Event",
  "category": "interaction",
  "schemaType": "https://schema.org/Event",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld",
  "description": "An event with date, time, location, and attendance information for scheduling and discovery.",
  "required": {
    "@type": {
      "const": "Event"
    },
    "name": {
      "type": "string",
      "minLength": 3
    },
    "startDate": {
      "type": "string",
      "format": "date-time"
    },
    "location": {
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
      "const": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld"
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
    "endDate": {
      "type": "string",
      "format": "date-time"
    },
    "organizer": {
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
    "performer": {
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
    "eventStatus": {
      "type": "string"
    },
    "eventAttendanceMode": {
      "type": "string"
    },
    "maximumAttendeeCapacity": {
      "type": "integer",
      "minimum": 1
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
    "startDate",
    "location",
    "image",
    "description"
  ],
  "llmOptimized": [
    "name",
    "description",
    "startDate",
    "endDate",
    "location",
    "organizer"
  ]
};

module.exports = eventProfile;
