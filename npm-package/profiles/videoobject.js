/**
 * Videoobject profile definition
 * CommonJS version
 */

const videoobjectProfile = {
  "type": "Videoobject",
  "category": "content",
  "schemaType": "https://schema.org/VideoObject",
  "profileUrl": "https://llmprofiles.org/profiles/content/videoobject/v1/index.jsonld",
  "description": "A structured video with metadata, transcripts, and content information optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "VideoObject"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "The title of the video"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "A description of the video content"
    },
    "uploadDate": {
      "type": "string",
      "format": "date",
      "description": "Date when the video was uploaded"
    }
  },
  "recommended": {
    "@context": {
      "const": "https://schema.org"
    },
    "@id": {
      "type": "string",
      "format": "uri-reference"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the video was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the video was last modified"
    },
    "duration": {
      "type": "string",
      "description": "ISO 8601 duration of the video"
    },
    "thumbnailUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL to the video thumbnail image"
    },
    "contentUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL to the video file"
    },
    "embedUrl": {
      "type": "string",
      "format": "uri",
      "description": "URL for embedding the video"
    },
    "author": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "creator": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "publisher": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "object"
        }
      ]
    },
    "genre": {
      "type": "string",
      "description": "Genre of the video content"
    },
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the video"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the video content (BCP-47 format)"
    },
    "caption": {
      "type": "string",
      "description": "Caption or subtitle text for the video"
    },
    "transcript": {
      "type": "string",
      "description": "Full transcript of the video content"
    },
    "video": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "object"
        }
      ]
    },
    "width": {
      "type": "integer",
      "description": "Width of the video in pixels"
    },
    "height": {
      "type": "integer",
      "description": "Height of the video in pixels"
    },
    "bitrate": {
      "type": "string",
      "description": "Bitrate of the video"
    },
    "encodingFormat": {
      "type": "string",
      "description": "Video encoding format (e.g., MP4, WebM)"
    },
    "interactionStatistic": {
      "type": "array"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/videoobject/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/videoobject/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/videoobject/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/videoobject/v1/index.jsonld"
        }
      },
      "required": [
        "@type",
        "name",
        "value"
      ]
    }
  },
  "optional": {},
  "googleRichResults": [
    "name",
    "description",
    "thumbnailUrl",
    "uploadDate"
  ],
  "llmOptimized": [
    "name",
    "description",
    "duration",
    "transcript"
  ]
};

module.exports = videoobjectProfile;
