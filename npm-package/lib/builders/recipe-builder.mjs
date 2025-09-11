/**
 * @fileoverview RecipeBuilder class for creating Recipe structured data objects
 * 
 * This module provides a specialized builder for creating Recipe structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * recipe-specific properties like ingredients, instructions, cooking time,
 * nutrition information, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic recipe creation
 * import { RecipeBuilder, MODES } from './recipe-builder.mjs';
 * const recipe = new RecipeBuilder(MODES.STRICT_SEO)
 *   .name('Chocolate Chip Cookies')
 *   .description('Classic homemade chocolate chip cookies')
 *   .author('Baking Expert', 'https://bakingexpert.com')
 *   .datePublished('2024-01-01')
 *   .prepTime('PT15M')
 *   .cookTime('PT12M')
 *   .totalTime('PT27M')
 *   .recipeYield('24 cookies')
 *   .addIngredient('2 cups all-purpose flour')
 *   .addIngredient('1 cup butter, softened')
 *   .addIngredient('1 cup chocolate chips')
 *   .addInstruction('Preheat oven to 375°F')
 *   .addInstruction('Mix ingredients in a large bowl')
 *   .addInstruction('Bake for 12 minutes until golden')
 *   .build();
 * 
 * @example
 * // Recipe with detailed nutrition information
 * const recipe = new RecipeBuilder()
 *   .name('Healthy Quinoa Salad')
 *   .description('Nutritious quinoa salad with fresh vegetables')
 *   .author('Healthy Chef')
 *   .datePublished('2024-01-15')
 *   .prepTime('PT20M')
 *   .cookTime('PT15M')
 *   .totalTime('PT35M')
 *   .recipeYield('4 servings')
 *   .recipeCategory('Salad')
 *   .recipeCuisine('Mediterranean')
 *   .addIngredient({
 *     "@type": "Ingredient",
 *     "name": "quinoa",
 *     "amount": "1 cup"
 *   })
 *   .addIngredient({
 *     "@type": "Ingredient",
 *     "name": "cherry tomatoes",
 *     "amount": "1 cup"
 *   })
 *   .nutrition({
 *     "@type": "NutritionInformation",
 *     "calories": "250",
 *     "fatContent": "8g",
 *     "proteinContent": "10g",
 *     "carbohydrateContent": "35g"
 *   })
 *   .build();
 * 
 * @example
 * // Recipe with video and ratings
 * const recipe = new RecipeBuilder()
 *   .name('Perfect Pancakes')
 *   .description('Fluffy pancakes that are perfect every time')
 *   .author('Breakfast Master')
 *   .datePublished('2024-01-10')
 *   .prepTime('PT10M')
 *   .cookTime('PT15M')
 *   .totalTime('PT25M')
 *   .recipeYield('8 pancakes')
 *   .recipeCategory('Breakfast')
 *   .video({
 *     "@type": "VideoObject",
 *     "name": "How to Make Perfect Pancakes",
 *     "description": "Step-by-step video tutorial",
 *     "contentUrl": "https://example.com/pancake-video.mp4",
 *     "thumbnailUrl": "https://example.com/pancake-thumb.jpg"
 *   })
 *   .aggregateRating(4.8, 150)
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * RecipeBuilder class for creating Recipe structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * Recipe structured data according to Schema.org specifications. Includes
 * support for ingredients, instructions, cooking times, nutrition information,
 * ratings, and more.
 * 
 * @class RecipeBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a recipe builder
 * const recipeBuilder = new RecipeBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const recipeBuilder = new RecipeBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete recipe
 * const recipe = new RecipeBuilder()
 *   .name('Chocolate Cake')
 *   .author('Baking Expert')
 *   .addIngredient('2 cups flour')
 *   .addInstruction('Mix ingredients')
 *   .build();
 */
export class RecipeBuilder extends BaseProfileBuilder {
  /**
   * Create a new RecipeBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const recipeBuilder = new RecipeBuilder();
   * 
   * @example
   * // Custom configuration
   * const recipeBuilder = new RecipeBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Recipe', 'content', mode, sanitizeInputs);
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {RecipeBuilder} This builder for chaining
   */
  author(author, url = null) {
    if (typeof author === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(author) : author;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.author = {
        "@type": "Person",
        "name": sanitizedName
      };
      if (sanitizedUrl) this.data.author.url = sanitizedUrl;
    } else if (author && typeof author === 'object') {
      if (this.sanitizeInputs) {
        this.data.author = this.sanitizer.sanitizeStructuredData(author, 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set publication date
   * @param {string|Date} date - Publication date
   * @returns {RecipeBuilder} This builder for chaining
   */
  datePublished(date) {
    if (this.sanitizeInputs) {
      this.data.datePublished = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.datePublished = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set modification date
   * @param {string|Date} date - Modification date
   * @returns {RecipeBuilder} This builder for chaining
   */
  dateModified(date) {
    if (this.sanitizeInputs) {
      this.data.dateModified = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateModified = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set preparation time
   * @param {string} time - ISO 8601 duration (e.g., 'PT15M' for 15 minutes)
   * @returns {RecipeBuilder} This builder for chaining
   */
  prepTime(time) {
    if (this.sanitizeInputs) {
      this.data.prepTime = this.sanitizer.sanitizeString(time);
    } else {
      this.data.prepTime = time;
    }
    return this;
  }

  /**
   * Set cooking time
   * @param {string} time - ISO 8601 duration (e.g., 'PT30M' for 30 minutes)
   * @returns {RecipeBuilder} This builder for chaining
   */
  cookTime(time) {
    if (this.sanitizeInputs) {
      this.data.cookTime = this.sanitizer.sanitizeString(time);
    } else {
      this.data.cookTime = time;
    }
    return this;
  }

  /**
   * Set total time
   * @param {string} time - ISO 8601 duration (e.g., 'PT45M' for 45 minutes)
   * @returns {RecipeBuilder} This builder for chaining
   */
  totalTime(time) {
    if (this.sanitizeInputs) {
      this.data.totalTime = this.sanitizer.sanitizeString(time);
    } else {
      this.data.totalTime = time;
    }
    return this;
  }

  /**
   * Set recipe yield
   * @param {string|number} yield - Number of servings or yield description
   * @returns {RecipeBuilder} This builder for chaining
   */
  recipeYield(recipeYield) {
    if (this.sanitizeInputs && typeof recipeYield === 'string') {
      this.data.recipeYield = this.sanitizer.sanitizeString(recipeYield);
    } else {
      this.data.recipeYield = recipeYield;
    }
    return this;
  }

  /**
   * Set recipe category
   * @param {string} category - Recipe category (e.g., 'Dessert', 'Main Course')
   * @returns {RecipeBuilder} This builder for chaining
   */
  recipeCategory(category) {
    if (this.sanitizeInputs) {
      this.data.recipeCategory = this.sanitizer.sanitizeString(category);
    } else {
      this.data.recipeCategory = category;
    }
    return this;
  }

  /**
   * Set recipe cuisine
   * @param {string} cuisine - Cuisine type (e.g., 'Italian', 'Mexican')
   * @returns {RecipeBuilder} This builder for chaining
   */
  recipeCuisine(cuisine) {
    if (this.sanitizeInputs) {
      this.data.recipeCuisine = this.sanitizer.sanitizeString(cuisine);
    } else {
      this.data.recipeCuisine = cuisine;
    }
    return this;
  }

  /**
   * Set nutrition information
   * @param {Object} nutrition - Nutrition object
   * @returns {RecipeBuilder} This builder for chaining
   */
  nutrition(nutrition) {
    if (this.sanitizeInputs) {
      this.data.nutrition = this.sanitizer.sanitizeStructuredData(nutrition, 'NutritionInformation');
    } else {
      this.data.nutrition = nutrition;
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {RecipeBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        keywords = keywords.map(k => this.sanitizer.sanitizeString(k));
      }
      this.data.keywords = keywords.join(', ');
    } else if (typeof keywords === 'string') {
      if (this.sanitizeInputs) {
        this.data.keywords = this.sanitizer.sanitizeString(keywords);
      } else {
        this.data.keywords = keywords;
      }
    }
    return this;
  }

  /**
   * Set suitable for diet
   * @param {Array} diets - Array of diet types (e.g., 'Vegetarian', 'Vegan')
   * @returns {RecipeBuilder} This builder for chaining
   */
  suitableForDiet(diets) {
    if (Array.isArray(diets)) {
      if (this.sanitizeInputs) {
        this.data.suitableForDiet = diets.map(d => this.sanitizer.sanitizeString(d));
      } else {
        this.data.suitableForDiet = diets;
      }
    }
    return this;
  }

  /**
   * Set ingredients
   * @param {Array} ingredients - Array of ingredient strings
   * @returns {RecipeBuilder} This builder for chaining
   */
  ingredients(ingredients) {
    if (Array.isArray(ingredients)) {
      if (this.sanitizeInputs) {
        this.data.ingredients = ingredients.map(ingredient => this.sanitizer.sanitizeString(ingredient));
      } else {
        this.data.ingredients = ingredients;
      }
    }
    return this;
  }

  /**
   * Set recipe instructions
   * @param {Array} instructions - Array of instruction objects or strings
   * @returns {RecipeBuilder} This builder for chaining
   */
  recipeInstructions(instructions) {
    if (Array.isArray(instructions)) {
      if (this.sanitizeInputs) {
        this.data.recipeInstructions = instructions.map(instruction => {
          if (typeof instruction === 'string') {
            return {
              "@type": "HowToStep",
              "text": this.sanitizer.sanitizeString(instruction)
            };
          } else {
            return this.sanitizer.sanitizeStructuredData(instruction, 'HowToStep');
          }
        });
      } else {
        this.data.recipeInstructions = instructions;
      }
    }
    return this;
  }

  /**
   * Add a single ingredient
   * @param {string} ingredient - Ingredient name
   * @returns {RecipeBuilder} This builder for chaining
   */
  addIngredient(ingredient) {
    if (!this.data.ingredients) {
      this.data.ingredients = [];
    }
    
    const sanitizedIngredient = this.sanitizeInputs ? this.sanitizer.sanitizeString(ingredient) : ingredient;
    this.data.ingredients.push(sanitizedIngredient);
    return this;
  }

  /**
   * Add a single instruction
   * @param {string|Object} instruction - Instruction text or HowToStep object
   * @param {string} [name] - Step name (if instruction is string)
   * @returns {RecipeBuilder} This builder for chaining
   */
  addInstruction(instruction, name = null) {
    if (!this.data.recipeInstructions) {
      this.data.recipeInstructions = [];
    }

    if (typeof instruction === 'string') {
      const stepObj = {
        "@type": "HowToStep",
        "text": instruction
      };
      
      if (name) stepObj.name = name;
      
      if (this.sanitizeInputs) {
        stepObj.text = this.sanitizer.sanitizeString(stepObj.text);
        if (stepObj.name) stepObj.name = this.sanitizer.sanitizeString(stepObj.name);
      }
      
      this.data.recipeInstructions.push(stepObj);
    } else if (instruction && typeof instruction === 'object') {
      if (this.sanitizeInputs) {
        this.data.recipeInstructions.push(this.sanitizer.sanitizeStructuredData(instruction, 'HowToStep'));
      } else {
        this.data.recipeInstructions.push(instruction);
      }
    }
    return this;
  }
}

export default RecipeBuilder; 
