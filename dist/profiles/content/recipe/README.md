# Recipe Profile v1.0.0

A structured data profile for cooking recipes, optimized for both SEO rich snippets and AI/LLM processing.

## 🎯 Strategic Value

The Recipe profile solves critical problems in the current recipe content landscape:

- **Content Fragmentation**: Recipe content is scattered across blogs, websites, and apps with inconsistent structure
- **AI Processing Gaps**: Recipe instructions and ingredients are difficult for AI systems to parse and understand
- **SEO Rich Snippet Potential**: Recipes have high potential for enhanced search results with cooking times, ratings, and nutritional info
- **RAG Pipeline Relevance**: Recipe content is frequently queried in conversational AI and cooking assistance systems

## 🚀 Use Cases

- **Food blogs and recipe websites**
- **Cooking apps and meal planning platforms**
- **Culinary education content**
- **Restaurant recipe sharing**
- **Nutrition and dietary content**

## 📋 Profile Features

### Required Fields
- `name`: Recipe title
- `ingredients`: List of ingredients with quantities
- `recipeInstructions`: Step-by-step cooking instructions

### Recommended Fields
- `prepTime`, `cookTime`, `totalTime`: ISO 8601 duration format
- `recipeYield`: Number of servings
- `recipeCategory` & `recipeCuisine`: Classification
- `nutrition`: Nutritional information
- `suitableForDiet`: Dietary restrictions

### AI-Optimized Features
- Structured ingredient lists with quantities and units
- Numbered step-by-step instructions
- Nutritional data for dietary queries
- Cooking time information for meal planning
- Dietary restriction flags for filtering

## 🔧 Implementation

### Basic Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Chocolate Chip Cookies",
  "ingredients": ["2 cups flour", "1 cup sugar"],
  "recipeInstructions": ["Mix ingredients", "Bake at 350°F"],
  "conformsTo": "https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld"
}
```

### Advanced Implementation
See `examples/rich.jsonld` for a complete implementation with all features.

## 📊 Validation

### Page Schema
Use `page.schema.json` to validate your JSON-LD before deployment:
```bash
node scripts/validate-ajv.js recipe/v1/page.schema.json your-recipe-markup.json
```

### Output Schema
Use `output.schema.json` to validate extracted content for RAG/AI applications.

## 🎓 Training Data

The profile includes `training.jsonl` format for LLM fine-tuning and RAG systems. Publishers can create their own training data that mirrors their on-page semantics.

## 🔗 Related Profiles

- **HowTo Profile**: For general instructional content
- **Article Profile**: For recipe blog posts and articles
- **Review Profile**: For recipe ratings and reviews

## 📈 SEO Benefits

- **Rich Snippets**: Cooking times, ratings, and nutritional info in search results
- **Enhanced CTR**: Visual recipe cards in search results
- **Voice Search**: Optimized for "How do I make..." queries
- **Local SEO**: Cuisine-specific search optimization

## 🤖 AI Benefits

- **Structured Data**: Consistent format for AI content understanding
- **Training Data**: Normalized format for LLM fine-tuning
- **RAG Systems**: Optimized for recipe-related queries
- **Conversational AI**: Better cooking assistance and meal planning

## 📝 Profile Version History

- **v1.0.0** (2025-01-15): Initial release with core recipe functionality

## 🔍 Discovery

This profile is discoverable via:
- `/.well-known/llmprofiles.json`
- `https://llmprofiles.org/api/discovery.json`
- Direct profile URL: `https://llmprofiles.org/profiles/content/recipe/v1/index.jsonld`
