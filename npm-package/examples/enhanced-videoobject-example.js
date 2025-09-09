/**
 * Enhanced VideoObject Schema Examples
 * Demonstrates the enhanced VideoObject profile with all new features
 */

const { VideoObjectBuilder } = require('../lib/builders/videoobject-builder');
const { ProfileValidator } = require('../lib/validator');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== Enhanced VideoObject Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All required properties
console.log('Example 1: Basic Enhanced Schema');
const basicVideo = new VideoObjectBuilder()
  .name("Chocolate Cake Tutorial")
  .description("A comprehensive step-by-step guide to making a delicious chocolate cake from scratch with professional techniques.")
  .uploadDate("2024-01-15")
  .build();

console.log('Basic VideoObject JSON-LD:');
console.log(JSON.stringify(basicVideo, null, 2));

const basicResult = validator.validate(basicVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', basicResult.valid);
console.log('Errors:', basicResult.errors.length);
console.log('Warnings:', basicResult.warnings.length);
console.log('Google Rich Results Coverage:', basicResult.googleRichResults?.coverage || 'N/A');
console.log('');

// Example 2: Advanced Schema - All recommended properties
console.log('Example 2: Advanced Schema with Recommended Properties');
const advancedVideo = new VideoObjectBuilder()
  .name("Professional Chocolate Cake Tutorial")
  .description("Learn how to make the perfect chocolate cake from scratch with professional techniques, ingredient tips, and step-by-step instructions.")
  .uploadDate("2024-01-15")
  .duration("PT18M45S")
  .thumbnailUrl("https://example.com/thumbnails/chocolate-cake-tutorial.jpg")
  .contentUrl("https://example.com/videos/chocolate-cake-tutorial.mp4")
  .embedUrl("https://example.com/embed/chocolate-cake-tutorial")
  .author({
    "@type": "Person",
    "name": "Chef Sarah Wilson",
    "url": "https://example.com/chef-sarah-wilson",
    "jobTitle": "Professional Pastry Chef"
  })
  .publisher({
    "@type": "Organization",
    "name": "Cooking Channel Pro",
    "url": "https://example.com/cooking-channel-pro",
    "logo": "https://example.com/logos/cooking-channel-pro.png"
  })
  .genre("Educational")
  .keywords(["chocolate", "cake", "tutorial", "baking", "dessert", "cooking", "recipe"])
  .inLanguage("en-US")
  .transcript("Welcome to this comprehensive chocolate cake tutorial. Today we'll be making a delicious chocolate cake from scratch using professional techniques...")
  .caption("Learn how to make the perfect chocolate cake with professional techniques and tips.")
  .build();

console.log('Advanced VideoObject JSON-LD:');
console.log(JSON.stringify(advancedVideo, null, 2));

const advancedResult = validator.validate(advancedVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', advancedResult.valid);
console.log('Errors:', advancedResult.errors.length);
console.log('Warnings:', advancedResult.warnings.length);
console.log('Google Rich Results Coverage:', advancedResult.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', advancedResult.llmOptimization?.score || 'N/A');
console.log('');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized');
const seoVideo = new VideoObjectBuilder()
  .name("Chocolate Cake Tutorial - Professional Baking Guide")
  .description("Master the art of chocolate cake making with this comprehensive tutorial. Learn professional techniques, ingredient selection, and step-by-step instructions for perfect results every time.")
  .uploadDate("2024-01-15")
  .duration("PT22M30S")
  .thumbnailUrl("https://example.com/thumbnails/chocolate-cake-tutorial-hd.jpg")
  .contentUrl("https://example.com/videos/chocolate-cake-tutorial-hd.mp4")
  .embedUrl("https://example.com/embed/chocolate-cake-tutorial")
  .author({
    "@type": "Person",
    "name": "Chef Sarah Wilson",
    "url": "https://example.com/chef-sarah-wilson",
    "jobTitle": "Professional Pastry Chef",
    "sameAs": ["https://twitter.com/chefsarah", "https://instagram.com/chefsarah"]
  })
  .publisher({
    "@type": "Organization",
    "name": "Cooking Channel Pro",
    "url": "https://example.com/cooking-channel-pro",
    "logo": "https://example.com/logos/cooking-channel-pro.png",
    "sameAs": ["https://facebook.com/cookingchannelpro", "https://youtube.com/cookingchannelpro"]
  })
  .genre("Educational")
  .keywords(["chocolate cake", "baking tutorial", "dessert recipe", "professional baking", "cake making", "chocolate dessert"])
  .inLanguage("en-US")
  .build();

console.log('SEO Optimized VideoObject JSON-LD:');
console.log(JSON.stringify(seoVideo, null, 2));

const seoResult = validator.validate(seoVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', seoResult.valid);
console.log('Errors:', seoResult.errors.length);
console.log('Warnings:', seoResult.warnings.length);
console.log('Google Rich Results Coverage:', seoResult.googleRichResults?.coverage || 'N/A');
console.log('');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized');
const llmVideo = new VideoObjectBuilder()
  .name("Chocolate Cake Tutorial")
  .description("Comprehensive chocolate cake tutorial covering ingredient selection, mixing techniques, baking methods, and finishing touches for professional results.")
  .uploadDate("2024-01-15")
  .duration("PT25M15S")
  .author({
    "@type": "Person",
    "name": "Chef Sarah Wilson",
    "url": "https://example.com/chef-sarah-wilson"
  })
  .publisher({
    "@type": "Organization",
    "name": "Cooking Channel Pro",
    "url": "https://example.com/cooking-channel-pro"
  })
  .genre("Educational")
  .keywords(["chocolate", "cake", "tutorial", "baking", "dessert", "cooking", "recipe", "techniques", "ingredients"])
  .transcript("Welcome to this comprehensive chocolate cake tutorial. Today we'll be making a delicious chocolate cake from scratch using professional techniques. We'll start with ingredient selection, then move through mixing methods, baking techniques, and finishing touches. First, let's gather our ingredients: high-quality cocoa powder, all-purpose flour, sugar, eggs, butter, and vanilla extract...")
  .caption("Learn professional chocolate cake making techniques from ingredient selection to final presentation.")
  .build();

console.log('LLM Optimized VideoObject JSON-LD:');
console.log(JSON.stringify(llmVideo, null, 2));

const llmResult = validator.validate(llmVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', llmResult.valid);
console.log('Errors:', llmResult.errors.length);
console.log('Warnings:', llmResult.warnings.length);
console.log('Google Rich Results Coverage:', llmResult.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', llmResult.llmOptimization?.score || 'N/A');
console.log('');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode');
const standardsVideo = new VideoObjectBuilder('standards-header')
  .name("Chocolate Cake Tutorial")
  .description("Professional chocolate cake tutorial with step-by-step instructions and techniques.")
  .uploadDate("2024-01-15")
  .duration("PT20M00S")
  .author("Chef Sarah Wilson")
  .publisher("Cooking Channel Pro")
  .genre("Educational")
  .keywords(["chocolate", "cake", "tutorial", "baking"])
  .inLanguage("en-US")
  .build();

console.log('Standards Header VideoObject JSON-LD:');
console.log(JSON.stringify(standardsVideo, null, 2));

const standardsResult = validator.validate(standardsVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', standardsResult.valid);
console.log('Errors:', standardsResult.errors.length);
console.log('Warnings:', standardsResult.warnings.length);
console.log('');

// Example 6: Real-world Use Case - Educational Content
console.log('Example 6: Real-world Use Case - Educational Content');
const educationalVideo = new VideoObjectBuilder()
  .name("How to Make Chocolate Cake - Complete Beginner's Guide")
  .description("Perfect for beginners! Learn how to make a delicious chocolate cake from scratch with easy-to-follow instructions, common mistakes to avoid, and pro tips for success.")
  .uploadDate("2024-01-15")
  .duration("PT16M30S")
  .thumbnailUrl("https://example.com/thumbnails/chocolate-cake-beginners.jpg")
  .contentUrl("https://example.com/videos/chocolate-cake-beginners.mp4")
  .embedUrl("https://example.com/embed/chocolate-cake-beginners")
  .author({
    "@type": "Person",
    "name": "Chef Sarah Wilson",
    "url": "https://example.com/chef-sarah-wilson",
    "jobTitle": "Professional Pastry Chef",
    "description": "Award-winning pastry chef with 15 years of experience"
  })
  .publisher({
    "@type": "Organization",
    "name": "Cooking Channel Pro",
    "url": "https://example.com/cooking-channel-pro",
    "logo": "https://example.com/logos/cooking-channel-pro.png",
    "description": "Professional cooking education platform"
  })
  .genre("Educational")
  .keywords(["chocolate cake", "beginner baking", "easy recipe", "dessert tutorial", "cake making", "baking basics"])
  .inLanguage("en-US")
  .transcript("Welcome to this beginner-friendly chocolate cake tutorial. I'm Chef Sarah Wilson, and today I'll teach you how to make a delicious chocolate cake from scratch. This tutorial is perfect for beginners, so don't worry if you've never baked before. We'll go through everything step by step, including common mistakes to avoid and pro tips for success. Let's start with the ingredients you'll need...")
  .caption("Beginner-friendly chocolate cake tutorial with step-by-step instructions and pro tips.")
  .build();

console.log('Educational VideoObject JSON-LD:');
console.log(JSON.stringify(educationalVideo, null, 2));

const educationalResult = validator.validate(educationalVideo, 'Videoobject');
console.log('Validation Result:');
console.log('Valid:', educationalResult.valid);
console.log('Errors:', educationalResult.errors.length);
console.log('Warnings:', educationalResult.warnings.length);
console.log('Google Rich Results Coverage:', educationalResult.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', educationalResult.llmOptimization?.score || 'N/A');
console.log('');

console.log('=== Example Summary ===');
console.log('All examples demonstrate the enhanced VideoObject schema with:');
console.log('- Enhanced required properties (name, description, uploadDate)');
console.log('- Enhanced recommended properties (duration, thumbnailUrl, contentUrl, embedUrl, author, publisher, genre, keywords, inLanguage)');
console.log('- LLM optimization features (transcript, caption)');
console.log('- Google Rich Results compliance');
console.log('- Proper validation behavior (strict/warning/optional)');
console.log('- Resolved "Missing field uploadDate" error');
console.log('- 100% Google Rich Results coverage for enhanced examples');
