/**
 * QAPage Schema Validation Tests
 * Tests the enhanced QAPage schema validation behavior
 */

const { ProfileValidator } = require('./lib/validator');
const { QAPageBuilder } = require('./lib/builders/qapage-builder');
const { MODES } = require('./lib/builders/base-builder');

// Create validator instance
const validator = new ProfileValidator();

console.log('🧪 QAPage Schema Validation Tests\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidQAPage1 = {
  "@type": "QAPage"
  // Missing all required properties
};

const result1 = validator.validate(invalidQAPage1, 'Qapage');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors.length);
console.log('Warnings:', result1.warnings.length);
console.log('Expected: valid=false, multiple errors\n');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (should be warnings)');
const invalidQAPage2 = {
  "@type": "QAPage",
  "name": "How to implement QAPage schema?",
  "description": "A comprehensive guide to implementing QAPage structured data",
  "mainEntity": {
    "@type": "Question",
    "name": "How to implement QAPage schema?",
    "text": "What are the best practices for implementing QAPage structured data?",
    "answerCount": 1,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Use the enhanced QAPage builder with proper validation.",
      "dateCreated": "2025-01-15T10:00:00Z",
      "upvoteCount": 5,
      "url": "https://example.com/qa#accepted-answer"
    }
  },
  "additionalType": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "identifier": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/interaction/qapage/v1"
  }
  // Missing recommended properties: @context, url, inLanguage, dateCreated, dateModified, author, publisher
};

const result2 = validator.validate(invalidQAPage2, 'Qapage');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors.length);
console.log('Warnings:', result2.warnings.length);
console.log('Expected: valid=true, 0 errors, multiple warnings\n');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const completeQAPage = {
  "@context": "https://schema.org",
  "@type": "QAPage",
  "name": "How to implement QAPage schema?",
  "description": "A comprehensive guide to implementing QAPage structured data",
  "url": "https://example.com/qa/how-to-implement-qapage-schema",
  "inLanguage": "en",
  "dateCreated": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T15:30:00Z",
  "author": {
    "@type": "Person",
    "name": "John Doe",
    "url": "https://example.com/author/john-doe"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Corp",
    "url": "https://example.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntity": {
    "@type": "Question",
    "name": "How to implement QAPage schema?",
    "text": "What are the best practices for implementing QAPage structured data?",
    "answerCount": 2,
    "author": {
      "@type": "Person",
      "name": "Jane Smith",
      "url": "https://example.com/author/jane-smith"
    },
    "dateCreated": "2025-01-15T09:00:00Z",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Use the enhanced QAPage builder with proper validation and follow Google's guidelines.",
      "dateCreated": "2025-01-15T10:00:00Z",
      "upvoteCount": 15,
      "url": "https://example.com/qa/how-to-implement-qapage-schema#accepted-answer",
      "author": {
        "@type": "Person",
        "name": "Expert User",
        "url": "https://example.com/user/expert"
      }
    },
    "suggestedAnswer": [
      {
        "@type": "Answer",
        "text": "Make sure to include all required properties for Google Rich Results.",
        "dateCreated": "2025-01-15T11:00:00Z",
        "upvoteCount": 8,
        "url": "https://example.com/qa/how-to-implement-qapage-schema#suggested-answer-1",
        "author": {
          "@type": "Person",
          "name": "Another User",
          "url": "https://example.com/user/another"
        }
      }
    ]
  },
  "additionalType": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "identifier": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/interaction/qapage/v1"
  }
};

const result3 = validator.validate(completeQAPage, 'Qapage');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors.length);
console.log('Warnings:', result3.warnings.length);
console.log('Expected: valid=true, 0 errors, minimal warnings\n');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const optionalQAPage = {
  ...completeQAPage,
  "keywords": ["QAPage", "structured data", "schema.org", "Google Rich Results"],
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".question", ".accepted-answer", ".suggested-answers"]
  },
  "interactionStatistic": [
    {
      "@type": "InteractionCounter",
      "interactionType": {
        "@type": "Action",
        "name": "ViewAction"
      },
      "userInteractionCount": 1250
    },
    {
      "@type": "InteractionCounter",
      "interactionType": {
        "@type": "Action",
        "name": "LikeAction"
      },
      "userInteractionCount": 89
    }
  ],
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "cssSelector": ".main-content"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Q&A",
        "item": "https://example.com/qa"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Schema Implementation",
        "item": "https://example.com/qa/schema-implementation"
      }
    ]
  },
  "isAccessibleForFree": true,
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "contentRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const result4 = validator.validate(optionalQAPage, 'Qapage');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors.length);
console.log('Warnings:', result4.warnings.length);
console.log('Expected: valid=true, 0 errors, minimal warnings\n');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructureQAPage = {
  "@type": "QAPage",
  "name": "Invalid Structure Test",
  "description": "Testing invalid structure",
  "mainEntity": {
    "@type": "Question",
    "name": "Invalid Question",
    "text": "This question has invalid structure",
    "answerCount": 1,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "This answer is missing required properties"
      // Missing: dateCreated, upvoteCount, url
    }
  },
  "additionalType": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "identifier": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/interaction/qapage/v1"
  }
};

const result5 = validator.validate(invalidStructureQAPage, 'Qapage');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors.length);
console.log('Warnings:', result5.warnings.length);
console.log('Expected: valid=false, structure validation errors\n');

// Test 6: Builder pattern validation
console.log('Test 6: Builder pattern validation');
const builder = new QAPageBuilder(MODES.STRICT_SEO, true);
const builtQAPage = builder
  .name("Builder Pattern Test")
  .description("Testing the enhanced QAPage builder")
  .url("https://example.com/qa/builder-test")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .author("Builder Test Author", "https://example.com/author/builder-test")
  .publisher("Test Publisher", "https://example.com", "https://example.com/logo.png")
  .keywords(["builder", "test", "validation"])
  .setQuestionWithMetadata(
    "How does the QAPage builder work?",
    "QAPage Builder Question",
    "https://example.com/qa/builder-test#question",
    "Question Author",
    "2025-01-15T09:00:00Z",
    2
  )
  .addAnswerWithMetadata(
    "The QAPage builder provides a fluent interface for creating structured data.",
    "Answer Author",
    "2025-01-15T10:00:00Z",
    10,
    "https://example.com/qa/builder-test#answer-1",
    true
  )
  .addAnswerWithMetadata(
    "It includes validation and sanitization features.",
    "Another Author",
    "2025-01-15T11:00:00Z",
    5,
    "https://example.com/qa/builder-test#answer-2",
    false
  )
  .build();

const result6 = validator.validate(builtQAPage, 'Qapage');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors.length);
console.log('Warnings:', result6.warnings.length);
console.log('Expected: valid=true, 0 errors, minimal warnings\n');

// Test 7: Google Rich Results compliance
console.log('Test 7: Google Rich Results compliance');
const googleCompliantQAPage = {
  "@context": "https://schema.org",
  "@type": "QAPage",
  "name": "Google Rich Results Compliant QAPage",
  "description": "A QAPage that meets all Google Rich Results requirements",
  "url": "https://example.com/qa/google-compliant",
  "dateCreated": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T15:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Google Expert",
    "url": "https://example.com/author/google-expert"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SEO Experts Inc",
    "url": "https://example.com"
  },
  "mainEntity": {
    "@type": "Question",
    "name": "What are Google Rich Results requirements for QAPage?",
    "text": "I need to understand the specific requirements for QAPage to appear in Google Rich Results.",
    "answerCount": 1,
    "author": {
      "@type": "Person",
      "name": "Question Asker",
      "url": "https://example.com/user/question-asker"
    },
    "dateCreated": "2025-01-15T09:00:00Z",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Google requires QAPage to have a single Question with either acceptedAnswer or suggestedAnswer, proper author attribution, timestamps, and upvote counts.",
      "dateCreated": "2025-01-15T10:00:00Z",
      "upvoteCount": 25,
      "url": "https://example.com/qa/google-compliant#accepted-answer",
      "author": {
        "@type": "Person",
        "name": "SEO Expert",
        "url": "https://example.com/user/seo-expert"
      }
    }
  },
  "additionalType": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "identifier": "https://llmprofiles.org/profiles/interaction/qapage/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/interaction/qapage/v1"
  }
};

const result7 = validator.validate(googleCompliantQAPage, 'Qapage');
console.log('Valid:', result7.valid);
console.log('Errors:', result7.errors.length);
console.log('Warnings:', result7.warnings.length);
console.log('Expected: valid=true, 0 errors, minimal warnings\n');

// Summary
console.log('📊 Test Summary:');
console.log('Test 1 (Missing required):', result1.valid ? '❌ FAIL' : '✅ PASS');
console.log('Test 2 (Missing recommended):', result2.valid && result2.warnings.length > 0 ? '✅ PASS' : '❌ FAIL');
console.log('Test 3 (Complete schema):', result3.valid && result3.errors.length === 0 ? '✅ PASS' : '❌ FAIL');
console.log('Test 4 (With optional):', result4.valid && result4.errors.length === 0 ? '✅ PASS' : '❌ FAIL');
console.log('Test 5 (Invalid structure):', !result5.valid ? '✅ PASS' : '❌ FAIL');
console.log('Test 6 (Builder pattern):', result6.valid && result6.errors.length === 0 ? '✅ PASS' : '❌ FAIL');
console.log('Test 7 (Google compliant):', result7.valid && result7.errors.length === 0 ? '✅ PASS' : '❌ FAIL');

console.log('\n🎯 QAPage Schema Validation Tests Complete!');
