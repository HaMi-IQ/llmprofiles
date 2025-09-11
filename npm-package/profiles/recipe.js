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
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of ingredient strings"
    },
    "recipeInstructions": {
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
      "description": "Array of recipe instructions"
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
      "description": "Unique identifier for the recipe"
    },
    "description": {
      "type": "string",
      "description": "A description of the recipe"
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
    },
    "datePublished": {
      "type": "string",
      "format": "date",
      "description": "Date when the recipe was published"
    },
    "dateModified": {
      "type": "string",
      "format": "date",
      "description": "Date when the recipe was last modified"
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
          "type": "string",
          "description": "Yield as string (e.g., '4 servings')"
        },
        {
          "type": "number",
          "description": "Yield as number"
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
      "type": "object",
      "description": "Nutritional information"
    },
    "image": {
      "anyOf": [
        {
          "type": "string",
          "format": "uri",
          "description": "Recipe image URL"
        },
        {
          "type": "object",
          "description": "Recipe image as ImageObject"
        }
      ]
    },
    "keywords": {
      "type": "string",
      "description": "Comma-separated keywords for the recipe"
    },
    "suitableForDiet": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of suitable diets (e.g., 'VegetarianDiet', 'GlutenFreeDiet')"
    },
    "recipeIngredient": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Array of recipe ingredients"
    },
    "recipeInstructions": {
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
      "description": "Array of recipe instructions"
    },
    "aggregateRating": {
      "type": "object",
      "description": "Aggregate rating for the recipe"
    },
    "review": {
      "type": "array",
      "description": "Reviews of the recipe"
    },
    "url": {
      "type": "string",
      "format": "uri",
      "description": "URL of the recipe page"
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
  "optional": {
    "alternateName": {
      "type": "string",
      "description": "Alternative name for the recipe"
    },
    "sameAs": {
      "type": "string",
      "format": "uri",
      "description": "URL of a reference page"
    },
    "inLanguage": {
      "type": "string",
      "description": "Language of the recipe"
    },
    "audience": {
      "type": "object",
      "description": "Target audience for the recipe"
    },
    "about": {
      "type": "object",
      "description": "Subject matter of the recipe"
    },
    "recipeServings": {
      "type": "number",
      "description": "Number of servings"
    },
    "recipeDifficulty": {
      "type": "string",
      "description": "Difficulty level of the recipe"
    },
    "cookingMethod": {
      "type": "string",
      "description": "Cooking method used"
    },
    "recipeCookingMethod": {
      "type": "string",
      "description": "Cooking method for the recipe"
    },
    "tool": {
      "type": "array",
      "description": "Tools needed for the recipe"
    },
    "supply": {
      "type": "array",
      "description": "Supplies needed for the recipe"
    },
    "video": {
      "type": "object",
      "description": "Video of the recipe being made"
    }
  },
  "googleRichResults": [
    "name",
    "image",
    "author",
    "datePublished",
    "description",
    "prepTime",
    "cookTime",
    "recipeYield",
    "recipeCategory",
    "recipeCuisine"
  ],
  "llmOptimized": [
    "name",
    "description",
    "recipeIngredient",
    "recipeInstructions",
    "cookTime",
    "prepTime",
    "totalTime",
    "recipeCategory",
    "recipeCuisine",
    "suitableForDiet"
  ]
};

module.exports = recipeProfile;
