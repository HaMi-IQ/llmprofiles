/**
 * Book profile definition
 * ES Module version
 */

export const bookProfile = {
  "type": "Book",
  "category": "content",
  "schemaType": "https://schema.org/Book",
  "profileUrl": "https://llmprofiles.org/profiles/content/book/v1/index.jsonld",
  "description": "A structured book with metadata, content information, and knowledge organization optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Book"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "The title of the book"
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
    "description": {
      "type": "string",
      "description": "A description of the book content"
    },
    "bookFormat": {
      "type": "string",
      "description": "The format of the book"
    },
    "isbn": {
      "type": "string",
      "description": "The ISBN of the book"
    },
    "numberOfPages": {
      "type": "integer",
      "description": "Number of pages in the book"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the book content (BCP-47 format)"
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the book was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the book was last modified"
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
      "description": "Genre of the book"
    },
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the book"
    },
    "about": {
      "type": "array"
    },
    "audience": {
      "type": "object"
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
      ]
    },
    "aggregateRating": {
      "type": "object"
    },
    "review": {
      "type": "array"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/book/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/book/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/book/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/book/v1/index.jsonld"
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
    "author",
    "isbn",
    "publisher"
  ],
  "llmOptimized": [
    "name",
    "author",
    "description",
    "genre",
    "numberOfPages"
  ]
};

export default bookProfile;
