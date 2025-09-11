/**
 * Event profile definition
 * CommonJS version
 */

const eventProfile = {
  "type": "Event",
  "category": "interaction",
  "schemaType": "https://schema.org/Event",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/event/v1/index.jsonld",
  "description": "An event with date, time, location, and attendance information for scheduling and discovery optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Event"
    },
    "name": {
      "type": "string",
      "minLength": 3,
      "description": "The name of the event"
    },
    "startDate": {
      "type": "string",
      "format": "date-time",
      "description": "Start date and time of the event"
    },
    "location": {
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
      "description": "Description of the event"
    },
    "endDate": {
      "type": "string",
      "format": "date-time",
      "description": "End date and time of the event"
    },
    "organizer": {
      "anyOf": [
        {
          "type": "string",
          "description": "Organizer name as string"
        },
        {
          "type": "object",
          "description": "Organizer as Person or Organization object"
        }
      ]
    },
    "performer": {
      "anyOf": [
        {
          "type": "string",
          "description": "Performer name as string"
        },
        {
          "type": "object",
          "description": "Performer as Person or Organization object"
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "object"
              }
            ]
          },
          "description": "Array of performers"
        }
      ]
    },
    "offers": {
      "type": "object",
      "description": "Event offers and pricing information"
    },
    "eventStatus": {
      "type": "string",
      "description": "Status of the event (e.g., EventScheduled, EventCancelled)"
    },
    "eventAttendanceMode": {
      "type": "string",
      "description": "Attendance mode (e.g., OfflineEventAttendanceMode, OnlineEventAttendanceMode)"
    },
    "maximumAttendeeCapacity": {
      "type": "integer",
      "minimum": 1,
      "description": "Maximum number of attendees"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the event page"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Event image URL"
        },
        {
          "type": "object",
          "description": "Event image as ImageObject"
        }
      ]
    },
    "eventSchedule": {
      "type": "object",
      "description": "Schedule information for the event"
    },
    "subEvent": {
      "type": "array",
      "description": "Sub-events or sessions"
    },
    "superEvent": {
      "type": "object",
      "description": "Parent event if this is a sub-event"
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
  "optional": {
    "@id": {
      "type": "string",
      "format": "uri",
      "description": "Unique identifier for the event"
    },
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the event"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the event was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the event was last modified"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the event"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the event"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the event"
    },
    "keywords": {
      "type": "string",
      "description": "Keywords for the event"
    },
    "typicalAgeRange": {
      "type": "string",
      "description": "Typical age range for attendees"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "description": "Whether the event is free to attend"
    },
    "doorTime": {
      "type": "string",
      "format": "date-time",
      "description": "Time when doors open"
    },
    "remainingAttendeeCapacity": {
      "type": "integer",
      "description": "Remaining number of available spots"
    }
  },
  "googleRichResults": [
    "name",
    "startDate",
    "location",
    "image",
    "description",
    "organizer",
    "offers"
  ],
  "llmOptimized": [
    "name",
    "description",
    "startDate",
    "endDate",
    "location",
    "organizer",
    "performer",
    "eventStatus"
  ]
};

module.exports = eventProfile;
