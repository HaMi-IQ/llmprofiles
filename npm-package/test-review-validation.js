/**
 * Test file for Review schema validation behavior
 * Tests the enhanced Review profile with strict validation requirements
 */

const { ProfileValidator } = require('./lib/validator');
const { ReviewBuilder } = require('./lib/builders/review-builder');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== Review Schema Validation Tests ===\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidReview1 = {
  "@type": "Review"
  // Missing reviewRating, author, itemReviewed, reviewBody, datePublished
};

const result1 = validator.validate(invalidReview1, 'Review');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors.length);
console.log('Warnings:', result1.warnings.length);
console.log('Google Rich Results Coverage:', result1.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result1.llmOptimized?.score || 'N/A');
console.log('');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (should be warnings)');
const invalidReview2 = {
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 4,
    "bestRating": 5,
    "worstRating": 1
  },
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "itemReviewed": {
    "@type": "Product",
    "name": "Test Product"
  },
  "reviewBody": "This is a great product with excellent quality.",
  "datePublished": "2024-01-15"
  // Missing recommended properties like reviewAspect, publisher, etc.
};

const result2 = validator.validate(invalidReview2, 'Review');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors.length);
console.log('Warnings:', result2.warnings.length);
console.log('Google Rich Results Coverage:', result2.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result2.llmOptimized?.score || 'N/A');
console.log('');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const completeReview = {
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 4.5,
    "bestRating": 5,
    "worstRating": 1
  },
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/author/jane-smith"
  },
  "itemReviewed": {
    "@type": "Product",
    "name": "Premium Wireless Headphones",
    "url": "https://example.com/products/headphones",
    "image": "https://example.com/images/headphones.jpg"
  },
  "reviewBody": "These headphones provide excellent sound quality and comfort. The noise cancellation is outstanding and the battery life exceeds expectations.",
  "datePublished": "2024-01-15",
  "reviewAspect": "Sound Quality",
  "dateModified": "2024-01-16",
  "publisher": {
    "@type": "Organization",
    "name": "TechReview.com",
    "url": "https://techreview.com"
  },
  "url": "https://techreview.com/reviews/headphones",
  "name": "Premium Headphones Review",
  "headline": "Outstanding Sound Quality and Comfort",
  "inLanguage": "en-US",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.3,
    "bestRating": 5,
    "worstRating": 1,
    "ratingCount": 150,
    "reviewCount": 75
  },
  "reviewCount": 75,
  "wordCount": 250,
  "helpfulVotes": 45,
  "totalVotes": 60
};

const result3 = validator.validate(completeReview, 'Review');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors.length);
console.log('Warnings:', result3.warnings.length);
console.log('Google Rich Results Coverage:', result3.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result3.llmOptimized?.score || 'N/A');
console.log('');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const optionalReview = {
  "@type": "Review",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5,
    "bestRating": 5,
    "worstRating": 1
  },
  "author": {
    "@type": "Person",
    "name": "Mike Johnson"
  },
  "itemReviewed": {
    "@type": "Service",
    "name": "Professional Cleaning Service"
  },
  "reviewBody": "Exceptional service with attention to detail.",
  "datePublished": "2024-01-20",
  "positiveNotes": "Very thorough, professional staff, reasonable pricing",
  "negativeNotes": "Scheduling could be more flexible",
  "summary": "Highly recommended cleaning service",
  "ratingExplanation": "5 stars for exceptional quality and professionalism",
  "image": [
    "https://example.com/images/cleaning1.jpg",
    "https://example.com/images/cleaning2.jpg"
  ],
  "keywords": ["cleaning", "professional", "reliable", "affordable"],
  "category": "Home Services",
  "priceRange": "$50-$100",
  "accessibilityFeature": ["Wheelchair accessible", "Senior-friendly"]
};

const result4 = validator.validate(optionalReview, 'Review');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors.length);
console.log('Warnings:', result4.warnings.length);
console.log('Google Rich Results Coverage:', result4.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result4.llmOptimized?.score || 'N/A');
console.log('');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructureReview = {
  "@type": "Review",
  "reviewRating": {
    // Missing @type and required properties
    "ratingValue": "invalid" // Should be number
  },
  "author": {
    // Missing @type and name
    "email": "test@example.com"
  },
  "itemReviewed": {
    // Missing @type and name
    "description": "Some product"
  },
  "reviewBody": "", // Empty string should fail minLength
  "datePublished": "invalid-date" // Invalid date format
};

const result5 = validator.validate(invalidStructureReview, 'Review');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors.length);
console.log('Warnings:', result5.warnings.length);
console.log('Google Rich Results Coverage:', result5.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result5.llmOptimized?.score || 'N/A');
console.log('');

// Test 6: Builder pattern test
console.log('Test 6: Builder pattern test');
const builder = new ReviewBuilder();
const builtReview = builder
  .reviewRating(4, 5, 1)
  .author("Sarah Wilson", "https://example.com/sarah")
  .itemReviewed("Smart Watch", "https://example.com/smartwatch")
  .reviewBody("Great smartwatch with excellent battery life and accurate fitness tracking.")
  .datePublished("2024-01-25")
  .reviewAspect("Battery Life")
  .publisher("GadgetReview", "https://gadgetreview.com")
  .headline("Smart Watch Review: Excellent Battery Life")
  .positiveNotes("Long battery life, accurate tracking, comfortable design")
  .negativeNotes("Limited app selection")
  .summary("Highly recommended for fitness enthusiasts")
  .keywords(["smartwatch", "fitness", "battery", "tracking"])
  .setCategory("Wearables")
  .build();

const result6 = validator.validate(builtReview, 'Review');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors.length);
console.log('Warnings:', result6.warnings.length);
console.log('Google Rich Results Coverage:', result6.googleRichResults?.coverage || 'N/A');
console.log('LLM Optimization Score:', result6.llmOptimized?.score || 'N/A');
console.log('');

console.log('=== Test Summary ===');
console.log('Test 1 (Missing required): Should FAIL with multiple errors');
console.log('Test 2 (Missing recommended): Should PASS with warnings');
console.log('Test 3 (Complete): Should PASS with minimal warnings');
console.log('Test 4 (With optional): Should PASS with minimal warnings');
console.log('Test 5 (Invalid structure): Should FAIL with structure errors');
console.log('Test 6 (Builder): Should PASS with minimal warnings');
