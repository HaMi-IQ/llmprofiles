/**
 * Book Schema Validation Tests
 * Tests the enhanced Book schema implementation for Google Rich Results compliance
 */

const { ProfileValidator } = require('./lib/validator');
const { BookBuilder } = require('./lib/builders/book-builder');
const { MODES } = require('./lib/builders/base-builder');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== Book Schema Validation Tests ===\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidBook1 = {
  "@type": "Book",
  "name": "Test Book"
  // Missing @id, author, url, workExample
};

const result1 = validator.validate(invalidBook1, 'Book');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors.length);
console.log('Warnings:', result1.warnings.length);
console.log('Google Rich Results Coverage:', result1.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result1.llmOptimizationScore + '%');
console.log('');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (should be warnings)');
const invalidBook2 = {
  "@type": "Book",
  "@id": "https://example.com/book/test-book",
  "name": "Test Book",
  "author": {
    "@type": "Person",
    "name": "Test Author"
  },
  "url": "https://example.com/book/test-book",
  "workExample": [
    {
      "@type": "Book",
      "@id": "https://example.com/book/test-book/hardcover",
      "bookFormat": "https://schema.org/Hardcover",
      "inLanguage": "en",
      "isbn": "978-0-1234-5678-9",
      "potentialAction": {
        "@type": "ReadAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://example.com/book/test-book/hardcover"
        }
      }
    }
  ],
  "additionalType": "https://llmprofiles.org/profiles/content/book/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/content/book/v1",
  "identifier": "https://llmprofiles.org/profiles/content/book/v1"
  // Missing recommended properties like description, publisher, etc.
};

const result2 = validator.validate(invalidBook2, 'Book');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors.length);
console.log('Warnings:', result2.warnings.length);
console.log('Google Rich Results Coverage:', result2.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result2.llmOptimizationScore + '%');
console.log('');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const completeBook = {
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "https://example.com/book/complete-book",
  "name": "Complete Test Book",
  "author": {
    "@type": "Person",
    "name": "Complete Author",
    "url": "https://example.com/author/complete-author"
  },
  "url": "https://example.com/book/complete-book",
  "workExample": [
    {
      "@type": "Book",
      "@id": "https://example.com/book/complete-book/hardcover",
      "bookFormat": "https://schema.org/Hardcover",
      "inLanguage": "en",
      "isbn": "978-0-1234-5678-9",
      "potentialAction": {
        "@type": "ReadAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://example.com/book/complete-book/hardcover"
        }
      },
      "name": "Complete Test Book - Hardcover Edition",
      "datePublished": "2024-01-01",
      "url": "https://example.com/book/complete-book/hardcover"
    }
  ],
  "description": "A comprehensive test book with all required and recommended properties",
  "publisher": {
    "@type": "Organization",
    "name": "Test Publisher",
    "url": "https://example.com/publisher/test-publisher"
  },
  "datePublished": "2024-01-01",
  "inLanguage": "en",
  "numberOfPages": 300,
  "genre": "Fiction",
  "keywords": "test, book, validation, schema",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/images/complete-book.jpg",
    "width": 400,
    "height": 600
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 100,
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Review Author"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5,
        "worstRating": 1
      },
      "reviewBody": "This is an excellent test book with comprehensive validation."
    }
  ],
  "sameAs": "https://en.wikipedia.org/wiki/Test_Book",
  "bookEdition": "1st Edition",
  "additionalType": "https://llmprofiles.org/profiles/content/book/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/content/book/v1",
  "identifier": "https://llmprofiles.org/profiles/content/book/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/content/book/v1"
  }
};

const result3 = validator.validate(completeBook, 'Book');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors.length);
console.log('Warnings:', result3.warnings.length);
console.log('Google Rich Results Coverage:', result3.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result3.llmOptimizationScore + '%');
console.log('');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const bookWithOptional = {
  ...completeBook,
  "illustrator": {
    "@type": "Person",
    "name": "Test Illustrator"
  },
  "translator": {
    "@type": "Person",
    "name": "Test Translator"
  },
  "copyrightYear": 2024,
  "copyrightHolder": {
    "@type": "Organization",
    "name": "Test Copyright Holder"
  },
  "awards": "Best Test Book Award 2024",
  "citation": "Test Book Citation Information"
};

const result4 = validator.validate(bookWithOptional, 'Book');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors.length);
console.log('Warnings:', result4.warnings.length);
console.log('Google Rich Results Coverage:', result4.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result4.llmOptimizationScore + '%');
console.log('');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructureBook = {
  "@type": "Book",
  "@id": "https://example.com/book/invalid-structure",
  "name": "Invalid Structure Book",
  "author": "Invalid Author", // Should be object or string, but missing required structure
  "url": "https://example.com/book/invalid-structure",
  "workExample": [
    {
      "@type": "Book",
      "@id": "https://example.com/book/invalid-structure/hardcover",
      "bookFormat": "InvalidFormat", // Invalid format
      "inLanguage": "invalid-language", // Invalid language code
      "isbn": "invalid-isbn", // Invalid ISBN format
      "potentialAction": {
        "@type": "InvalidAction", // Invalid action type
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://example.com/book/invalid-structure/hardcover"
        }
      }
    }
  ],
  "additionalType": "https://llmprofiles.org/profiles/content/book/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/content/book/v1",
  "identifier": "https://llmprofiles.org/profiles/content/book/v1"
};

const result5 = validator.validate(invalidStructureBook, 'Book');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors.length);
console.log('Warnings:', result5.warnings.length);
console.log('Google Rich Results Coverage:', result5.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result5.llmOptimizationScore + '%');
console.log('');

// Test 6: Builder pattern test
console.log('Test 6: Builder pattern test');
const builder = new BookBuilder(MODES.STRICT_SEO, true);
const builtBook = builder
  .id('https://example.com/book/builder-test')
  .name('Builder Test Book')
  .author('Builder Author', 'https://example.com/author/builder-author')
  .url('https://example.com/book/builder-test')
  .description('A book created using the builder pattern')
  .publisher('Builder Publisher', 'https://example.com/publisher/builder-publisher')
  .datePublished('2024-01-01')
  .inLanguage('en')
  .numberOfPages(250)
  .genre('Technical')
  .keywords(['builder', 'test', 'pattern'])
  .image('https://example.com/images/builder-book.jpg', 400, 600)
  .sameAs('https://en.wikipedia.org/wiki/Builder_Test_Book')
  .bookEdition('1st Edition')
  .illustrator('Builder Illustrator')
  .copyrightYear(2024)
  .awards('Builder Excellence Award')
  .addWorkExample({
    id: 'https://example.com/book/builder-test/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5678-9',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/builder-test/hardcover'
      }
    },
    name: 'Builder Test Book - Hardcover',
    datePublished: '2024-01-01',
    url: 'https://example.com/book/builder-test/hardcover'
  })
  .build();

const result6 = validator.validate(builtBook, 'Book');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors.length);
console.log('Warnings:', result6.warnings.length);
console.log('Google Rich Results Coverage:', result6.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result6.llmOptimizationScore + '%');
console.log('');

console.log('=== Test Summary ===');
console.log('Test 1 (Missing required):', result1.valid ? 'PASS' : 'FAIL');
console.log('Test 2 (Missing recommended):', result2.valid ? 'PASS' : 'FAIL');
console.log('Test 3 (Complete schema):', result3.valid ? 'PASS' : 'FAIL');
console.log('Test 4 (With optional):', result4.valid ? 'PASS' : 'FAIL');
console.log('Test 5 (Invalid structure):', result5.valid ? 'PASS' : 'FAIL');
console.log('Test 6 (Builder pattern):', result6.valid ? 'PASS' : 'FAIL');
console.log('');

console.log('Expected Results:');
console.log('- Test 1: Should FAIL (missing required properties)');
console.log('- Test 2: Should PASS (has all required, warnings for missing recommended)');
console.log('- Test 3: Should PASS (complete schema)');
console.log('- Test 4: Should PASS (with optional properties)');
console.log('- Test 5: Should FAIL (invalid structure)');
console.log('- Test 6: Should PASS (builder pattern)');
