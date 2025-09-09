/**
 * Product schema validation test
 * Tests the enhanced Product schema validation behavior
 */

const { ProductBuilder } = require('./lib/builders/product-builder');
const { ProfileValidator } = require('./lib/validator');

// Create validator instance
const validator = new ProfileValidator(true);

console.log('=== Product Schema Validation Tests ===\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidProduct1 = {
  "@type": "Product",
  "name": "Test Product",
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
  // Missing offers (required)
};

const result1 = validator.validate(invalidProduct1, 'Product');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors?.length || 0);
console.log('Warnings:', result1.warnings?.length || 0);
if (result1.errors?.length > 0) {
  console.log('Error details:', result1.errors.slice(0, 3));
}
console.log('---\n');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (should be warnings)');
const invalidProduct2 = {
  "@type": "Product",
  "name": "Test Product",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "29.99",
    "availability": "https://schema.org/InStock"
  },
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
  // Missing description, image, brand (recommended)
};

const result2 = validator.validate(invalidProduct2, 'Product');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors?.length || 0);
console.log('Warnings:', result2.warnings?.length || 0);
if (result2.warnings?.length > 0) {
  console.log('Warning details:', result2.warnings.slice(0, 3));
}
console.log('---\n');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const validProduct = {
  "@type": "Product",
  "name": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/headphones.jpg",
    "width": 500,
    "height": 500
  },
  "brand": {
    "@type": "Brand",
    "name": "TechBrand",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.jpg"
    }
  },
  "sku": "TB-WH-001",
  "gtin": "1234567890123",
  "mpn": "WH-2024-PRO",
  "category": "Electronics > Audio > Headphones",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "199.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "TechStore"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 127,
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5
      },
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "reviewBody": "Excellent sound quality and comfortable fit. Highly recommended!",
      "datePublished": "2024-01-15"
    }
  ],
  "url": "https://example.com/products/wireless-headphones",
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
};

const result3 = validator.validate(validProduct, 'Product');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors?.length || 0);
console.log('Warnings:', result3.warnings?.length || 0);
console.log('---\n');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const enhancedProduct = {
  ...validProduct,
  "weight": {
    "@type": "QuantitativeValue",
    "value": 0.3,
    "unitText": "kg"
  },
  "height": {
    "@type": "QuantitativeValue",
    "value": 20,
    "unitText": "cm"
  },
  "width": {
    "@type": "QuantitativeValue",
    "value": 18,
    "unitText": "cm"
  },
  "depth": {
    "@type": "QuantitativeValue",
    "value": 8,
    "unitText": "cm"
  },
  "color": "Black",
  "material": "Plastic, Metal",
  "size": "One Size",
  "model": "WH-2024-PRO",
  "version": "2.1",
  "keywords": ["wireless", "headphones", "noise cancellation", "bluetooth"],
  "sameAs": [
    "https://facebook.com/techbrand",
    "https://twitter.com/techbrand"
  ],
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
};

const result4 = validator.validate(enhancedProduct, 'Product');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors?.length || 0);
console.log('Warnings:', result4.warnings?.length || 0);
console.log('---\n');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructure = {
  "@type": "Product",
  "name": "Test Product",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INVALID", // Invalid currency code
    "price": "", // Empty price
    "availability": "InvalidAvailability" // Invalid availability
  },
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
};

const result5 = validator.validate(invalidStructure, 'Product');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors?.length || 0);
console.log('Warnings:', result5.warnings?.length || 0);
if (result5.errors?.length > 0) {
  console.log('Structure validation errors:', result5.errors.slice(0, 3));
}
console.log('---\n');

// Test 6: Builder pattern test
console.log('Test 6: Builder pattern test');
const builder = new ProductBuilder('strict-seo', true);
const builtProduct = builder
  .name('Smart Watch')
  .description('Advanced smartwatch with health monitoring and GPS')
  .image('https://example.com/smartwatch.jpg', 400, 400, 'Smart Watch Product Image')
  .brand('WatchBrand', 'https://example.com/watchbrand-logo.jpg', 'https://watchbrand.com')
  .offers(null, '299.99', 'USD', 'https://schema.org/InStock')
  .sku('WB-SW-001')
  .gtin('9876543210987')
  .url('https://example.com/products/smart-watch')
  .aggregateRating(null, 4.2, 89, 5, 1)
  .addReview(null, 5, 'Jane Smith', 'Great watch with excellent battery life!', '2024-01-20')
  .weight(0.05, 'kg')
  .dimensions(4.5, 3.8, 1.2, 'cm')
  .color('Silver')
  .material('Aluminum, Glass')
  .keywords(['smartwatch', 'fitness', 'GPS', 'health monitoring'])
  .build();

const result6 = validator.validate(builtProduct, 'Product');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors?.length || 0);
console.log('Warnings:', result6.warnings?.length || 0);
console.log('---\n');

console.log('=== Validation Test Summary ===');
console.log('Test 1 (Missing required):', result1.valid ? 'PASS' : 'FAIL - Should fail');
console.log('Test 2 (Missing recommended):', result2.valid ? 'PASS' : 'FAIL - Should pass with warnings');
console.log('Test 3 (Complete required):', result3.valid ? 'PASS' : 'FAIL - Should pass');
console.log('Test 4 (With optional):', result4.valid ? 'PASS' : 'FAIL - Should pass');
console.log('Test 5 (Invalid structure):', result5.valid ? 'FAIL - Should fail' : 'PASS');
console.log('Test 6 (Builder pattern):', result6.valid ? 'PASS' : 'FAIL - Should pass');
