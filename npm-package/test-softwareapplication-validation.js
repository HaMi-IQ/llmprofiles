const { ProfileValidator } = require('./lib/validator');
const validator = new ProfileValidator();

// Test 1: Missing critical required properties
const invalidSoftwareApplication1 = {
  "@type": "SoftwareApplication"
};
console.log('Test 1');
console.log(validator.validate(invalidSoftwareApplication1, 'Softwareapplication'));

// Test 2: Missing recommended properties (should be warnings)
const invalidSoftwareApplication2 = {
  "@type": "SoftwareApplication",
  "name": "My App",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "macOS"
};
console.log('Test 2');
console.log(validator.validate(invalidSoftwareApplication2, 'Softwareapplication'));

// Test 3: Complete schema with all required and recommended properties
const validSoftwareApplicationComplete = {
  "@type": "SoftwareApplication",
  "name": "My App",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "macOS",
  "description": "A great app",
  "softwareVersion": "1.0.0",
  "softwareRequirements": "macOS 12+",
  "memoryRequirements": "4GB RAM",
  "storageRequirements": "500MB",
  "processorRequirements": "Intel i5+",
  "featureList": "Feature A, Feature B",
  "screenshot": {
    "@type": "ImageObject",
    "url": "https://example.com/shot.png"
  },
  "downloadUrl": "https://example.com/download",
  "installUrl": "https://example.com/install",
  "updateUrl": "https://example.com/update",
  "fileSize": "50MB",
  "releaseNotes": "Initial release",
  "datePublished": "2024-01-01",
  "dateModified": "2024-02-01",
  "author": {
    "@type": "Person",
    "name": "Jane Doe",
    "url": "https://example.com/jane"
  },
  "offers": {
    "@type": "Offer",
    "price": 9.99,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.6,
    "bestRating": 5,
    "worstRating": 1,
    "reviewCount": 120
  },
  "url": "https://example.com/app",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/app.png"
  },
  "applicationSubCategory": "Utilities",
  "applicationSuite": "Suite X",
  "permissions": "Camera, Files",
  "inLanguage": "en-US",
  "keywords": ["app", "business"]
};
console.log('Test 3');
console.log(validator.validate(validSoftwareApplicationComplete, 'Softwareapplication'));

// Test 4: Schema with optional properties only
const validSoftwareApplicationOptional = {
  "@type": "SoftwareApplication",
  "name": "My App",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "macOS",
  "applicationSubCategory": "Utilities",
  "applicationSuite": "Suite X",
  "permissions": "Camera"
};
console.log('Test 4');
console.log(validator.validate(validSoftwareApplicationOptional, 'Softwareapplication'));

// Test 5: Invalid structure validation (bad author)
const invalidSoftwareApplication5 = {
  "@type": "SoftwareApplication",
  "name": "My App",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "macOS",
  "author": { "@type": "Person" }
};
console.log('Test 5');
console.log(validator.validate(invalidSoftwareApplication5, 'Softwareapplication'));
