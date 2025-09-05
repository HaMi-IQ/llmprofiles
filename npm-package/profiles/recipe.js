/**
 * Recipe profile definition
 * CommonJS version
 */

const recipeProfile = {
  "type": "Recipe",
  "category": "content",
  "schemaType": "https://schema.org/Recipe",
  "profileUrl": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld",
  "description": "A structured recipe with ingredients, instructions, and nutritional information optimized for AI processing and rich search results.",
  "required": {
    "@type": {
      "const": "Recipe"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "The name of the recipe"
    },
    "ingredients": {
      "type": "array"
    },
    "recipeInstructions": {
      "type": "array"
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
      "description": "A description of the recipe"
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
    "datePublished": {
      "type": "string",
      "format": "date"
    },
    "dateModified": {
      "type": "string",
      "format": "date"
    },
    "prepTime": {
      "type": "string",
      "description": "ISO 8601 duration for preparation time"
    },
    "cookTime": {
      "type": "string",
      "description": "ISO 8601 duration for cooking time"
    },
    "totalTime": {
      "type": "string",
      "description": "ISO 8601 duration for total time"
    },
    "recipeYield": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "number"
        }
      ]
    },
    "recipeCategory": {
      "type": "string",
      "description": "Category of the recipe (e.g., 'Dessert', 'Main Course')"
    },
    "recipeCuisine": {
      "type": "string",
      "description": "Cuisine type (e.g., 'Italian', 'Mexican')"
    },
    "nutrition": {
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
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the recipe"
    },
    "suitableForDiet": {
      "type": "array"
    },
    "additionalType": {
      "const": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld"
    },
    "schemaVersion": {
      "const": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld"
    },
    "identifier": {
      "const": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld"
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
          "const": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld"
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
    "image",
    "author",
    "datePublished",
    "description"
  ],
  "llmOptimized": [
    "name",
    "description",
    "recipeIngredient",
    "recipeInstructions",
    "cookTime"
  ]
};

module.exports = recipeProfile;
