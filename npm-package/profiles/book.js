/**
 * Book profile definition
 * CommonJS version
 */

const bookProfile = {
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
          "type": "string",
          "description": "Author name as string"
        },
        {
          "type": "object",
          "description": "Author as Person object"
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
    "@id": {
      "type": "string",
      "format": "uri-reference",
      "description": "Unique identifier for the book"
    },
    "description": {
      "type": "string",
      "description": "A description of the book content"
    },
    "bookFormat": {
      "type": "string",
      "description": "The format of the book (e.g., Hardcover, Paperback, EBook)"
    },
    "isbn": {
      "type": "string",
      "description": "The ISBN of the book (10 or 13 digits)"
    },
    "numberOfPages": {
      "type": "integer",
      "minimum": 1,
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
          "type": "string",
          "description": "Publisher name as string"
        },
        {
          "type": "object",
          "description": "Publisher as Organization object"
        }
      ]
    },
    "genre": {
      "type": "string",
      "description": "Genre of the book"
    },
    "keywords": {
      "anyOf": [
        {
      "type": "string",
      "description": "Comma-separated keywords for the book"
        },
        {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Keywords as array of strings"
        }
      ]
    },
    "about": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of topics the book is about"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the book"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Image URL as string"
        },
        {
          "type": "object",
          "description": "Image as ImageObject"
        }
      ]
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the book"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the book"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL where the book is described"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "Reference page URL (e.g., Wikipedia, Library of Congress)"
    },
    "bookEdition": {
      "type": "string",
      "description": "Edition information (e.g., '2nd Edition')"
    },
    "workExample": {
      "type": "array",
      "description": "Array of book editions"
    },
    "illustrator": {
      "anyOf": [
        {
          "type": "string",
          "description": "Illustrator name as string"
        },
        {
          "type": "object",
          "description": "Illustrator as Person object"
        }
      ]
    },
    "translator": {
      "anyOf": [
        {
          "type": "string",
          "description": "Translator name as string"
        },
        {
          "type": "object",
          "description": "Translator as Person object"
        }
      ]
    },
    "copyrightYear": {
      "type": "integer",
      "minimum": 1000,
      "maximum": 3000,
      "description": "Copyright year"
    },
    "copyrightHolder": {
      "anyOf": [
        {
          "type": "string",
          "description": "Copyright holder name as string"
        },
        {
          "type": "object",
          "description": "Copyright holder as Person or Organization object"
        }
      ]
    },
    "awards": {
      "type": "string",
      "description": "Awards or recognition received by the book"
    },
    "citation": {
      "type": "string",
      "description": "Citation information for the book"
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
  "optional": {
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the book"
    },
    "potentialAction": {
      "type": "object",
      "description": "Potential action for the book (e.g., ReadAction)"
    },
    "license": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri"
        },
        {
          "type": "object"
        }
      ],
      "description": "License information"
    },
    "isAccessibleForFree": {
      "type": "boolean",
      "description": "Whether the book is accessible for free"
    },
    "offers": {
      "type": "object",
      "description": "Offers for purchasing the book"
    }
  },
  "googleRichResults": [
    "name",
    "author",
    "isbn",
    "publisher",
    "datePublished",
    "image",
    "aggregateRating"
  ],
  "llmOptimized": [
    "name",
    "author",
    "description",
    "genre",
    "numberOfPages",
    "about",
    "keywords",
    "isbn"
  ]
};

module.exports = bookProfile;
