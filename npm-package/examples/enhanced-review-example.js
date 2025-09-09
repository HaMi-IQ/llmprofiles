/**
 * Enhanced Review Schema Examples
 * Demonstrates the enhanced Review profile with all new features
 */

const { ReviewBuilder } = require('../lib/builders/review-builder');
const { ProfileValidator } = require('../lib/validator');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== Enhanced Review Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema');
const basicReview = new ReviewBuilder()
  .reviewRating(4.5, 5, 1)
  .author("Sarah Wilson", "https://example.com/author/sarah-wilson")
  .itemReviewed("Premium Wireless Headphones", "https://example.com/products/headphones")
  .reviewBody("These headphones provide excellent sound quality and comfort. The noise cancellation is outstanding and the battery life exceeds expectations.")
  .datePublished("2024-01-15")
  .build();

console.log('Basic Review JSON-LD:');
console.log(JSON.stringify(basicReview, null, 2));

const basicResult = validator.validate(basicReview, 'Review');
console.log('Validation Result:');
console.log('Valid:', basicResult.valid);
console.log('Errors:', basicResult.errors.length);
console.log('Warnings:', basicResult.warnings.length);
console.log('Google Rich Results Coverage:', basicResult.googleRichResults?.coverage || 'N/A');
console.log('');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema with Optional Properties');
const advancedReview = new ReviewBuilder()
  .reviewRating(5, 5, 1)
  .author({
    "@type": "Person",
    "name": "Mike Johnson",
    "url": "https://example.com/author/mike-johnson",
    "jobTitle": "Audio Engineer"
  })
  .itemReviewed({
    "@type": "Product",
    "name": "Professional Studio Monitors",
    "url": "https://example.com/products/studio-monitors",
    "image": "https://example.com/images/studio-monitors.jpg",
    "brand": "AudioTech",
    "model": "AT-5000"
  })
  .reviewBody("Exceptional studio monitors with crystal clear sound reproduction. Perfect for professional audio work.")
  .datePublished("2024-01-20")
  .reviewAspect("Sound Quality")
  .dateModified("2024-01-21")
  .publisher("AudioReview Pro", "https://audioreviewpro.com")
  .headline("Professional Studio Monitors Review: Crystal Clear Sound")
  .inLanguage("en-US")
  .positiveNotes("Crystal clear sound, excellent frequency response, professional build quality")
  .negativeNotes("Price point may be high for beginners")
  .summary("Highly recommended for professional audio engineers")
  .ratingExplanation("5 stars for exceptional sound quality and professional features")
  .image([
    "https://example.com/images/studio-monitors-1.jpg",
    "https://example.com/images/studio-monitors-2.jpg"
  ])
  .keywords(["studio monitors", "audio equipment", "professional", "sound quality"])
  .setCategory("Audio Equipment")
  .priceRange("$800-$1200")
  .accessibilityFeature(["Wheelchair accessible", "Large text support"])
  .build();

console.log('Advanced Review JSON-LD:');
console.log(JSON.stringify(advancedReview, null, 2));

const advancedResult = validator.validate(advancedReview, 'Review');
console.log('Validation Result:');
console.log('Valid:', advancedResult.valid);
console.log('Errors:', advancedResult.errors.length);
console.log('Warnings:', advancedResult.warnings.length);
console.log('Google Rich Results Coverage:', advancedResult.googleRichResults?.coverage || 'N/A');
console.log('');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized');
const seoReview = new ReviewBuilder()
  .reviewRating(4.8, 5, 1)
  .author("TechReview Expert", "https://techreview.com/author/expert")
  .itemReviewed({
    "@type": "Product",
    "name": "Smart Home Security System",
    "url": "https://example.com/products/security-system",
    "image": "https://example.com/images/security-system.jpg",
    "brand": "SecureHome",
    "model": "SH-2024"
  })
  .reviewBody("Comprehensive smart home security system with advanced AI features, 24/7 monitoring, and easy installation. Perfect for modern homes.")
  .datePublished("2024-01-25")
  .publisher({
    "@type": "Organization",
    "name": "TechReview.com",
    "url": "https://techreview.com",
    "logo": "https://techreview.com/logo.png"
  })
  .headline("Smart Home Security System Review: Advanced AI Protection")
  .inLanguage("en-US")
  .aggregateRating(4.6, 150, 75, 5, 1)
  .reviewCount(75)
  .url("https://techreview.com/reviews/smart-home-security-system")
  .build();

console.log('SEO Optimized Review JSON-LD:');
console.log(JSON.stringify(seoReview, null, 2));

const seoResult = validator.validate(seoReview, 'Review');
console.log('Validation Result:');
console.log('Valid:', seoResult.valid);
console.log('Errors:', seoResult.errors.length);
console.log('Warnings:', seoResult.warnings.length);
console.log('Google Rich Results Coverage:', seoResult.googleRichResults?.coverage || 'N/A');
console.log('');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized');
const llmReview = new ReviewBuilder()
  .reviewRating(4.2, 5, 1)
  .author("AI Research Team", "https://airesearch.org/team")
  .itemReviewed({
    "@type": "Service",
    "name": "AI-Powered Customer Support",
    "url": "https://example.com/services/ai-support",
    "provider": "AI Solutions Inc"
  })
  .reviewBody("Revolutionary AI-powered customer support system that provides instant, accurate responses 24/7. Significantly improved customer satisfaction.")
  .datePublished("2024-01-30")
  .reviewAspect("AI Performance")
  .positiveNotes("Instant responses, 99% accuracy, 24/7 availability, multilingual support")
  .negativeNotes("Initial setup complexity, requires training data")
  .summary("Game-changing AI customer support solution")
  .keywords(["AI", "customer support", "automation", "machine learning", "chatbot"])
  .setCategory("AI Services")
  .wordCount(150)
  .helpfulVotes(45)
  .totalVotes(60)
  .build();

console.log('LLM Optimized Review JSON-LD:');
console.log(JSON.stringify(llmReview, null, 2));

const llmResult = validator.validate(llmReview, 'Review');
console.log('Validation Result:');
console.log('Valid:', llmResult.valid);
console.log('Errors:', llmResult.errors.length);
console.log('Warnings:', llmResult.warnings.length);
console.log('LLM Optimization Score:', llmResult.llmOptimization?.score || 'N/A');
console.log('');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode');
const standardsReview = new ReviewBuilder('standards-header')
  .reviewRating(4.0, 5, 1)
  .author("Standards Compliance Expert")
  .itemReviewed("Web Accessibility Testing Tool")
  .reviewBody("Comprehensive web accessibility testing tool that ensures WCAG 2.1 AA compliance. Essential for inclusive web development.")
  .datePublished("2024-02-01")
  .reviewAspect("Accessibility Compliance")
  .positiveNotes("WCAG 2.1 AA compliant, comprehensive testing, detailed reports")
  .negativeNotes("Learning curve for complex features")
  .summary("Essential tool for web accessibility compliance")
  .keywords(["accessibility", "WCAG", "compliance", "testing", "inclusive design"])
  .setCategory("Web Development Tools")
  .accessibilityFeature(["Screen reader compatible", "Keyboard navigation", "High contrast mode"])
  .build();

console.log('Standards Header Review JSON-LD:');
console.log(JSON.stringify(standardsReview, null, 2));

const standardsResult = validator.validate(standardsReview, 'Review');
console.log('Validation Result:');
console.log('Valid:', standardsResult.valid);
console.log('Errors:', standardsResult.errors.length);
console.log('Warnings:', standardsResult.warnings.length);
console.log('');

console.log('=== Example Summary ===');
console.log('All examples demonstrate the enhanced Review schema with:');
console.log('- Enhanced required properties (reviewRating, author, itemReviewed, reviewBody, datePublished)');
console.log('- Enhanced recommended properties (reviewAspect, publisher, headline, etc.)');
console.log('- New optional properties (positiveNotes, negativeNotes, summary, etc.)');
console.log('- Google Rich Results compliance');
console.log('- LLM optimization features');
console.log('- Proper validation behavior (strict/warning/optional)');
