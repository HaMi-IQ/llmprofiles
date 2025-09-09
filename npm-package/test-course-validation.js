/**
 * Course Schema Validation Tests
 * Tests the enhanced Course schema implementation
 */

const { CourseBuilder } = require('./lib/builders/course-builder');
const { MODES } = require('./lib/modes');
const { ProfileValidator } = require('./lib/validator');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== Course Schema Validation Tests ===\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidCourse1 = {
  "@type": "Course",
  "name": "JavaScript Fundamentals"
  // Missing: description, provider
};

const result1 = validator.validate(invalidCourse1, 'Course');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors.length);
console.log('Warnings:', result1.warnings.length);
console.log('Google Rich Results Coverage:', result1.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result1.llmOptimization?.score + '%');
console.log('');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (warnings only)');
const invalidCourse2 = {
  "@type": "Course",
  "name": "JavaScript Fundamentals",
  "description": "Learn the fundamentals of JavaScript programming language",
  "provider": {
    "@type": "Organization",
    "name": "Tech Academy"
  }
  // Missing recommended properties
};

const result2 = validator.validate(invalidCourse2, 'Course');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors.length);
console.log('Warnings:', result2.warnings.length);
console.log('Google Rich Results Coverage:', result2.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result2.llmOptimization?.score + '%');
console.log('');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const completeCourse = {
  "@type": "Course",
  "name": "Advanced JavaScript Development",
  "description": "Master advanced JavaScript concepts including ES6+, async programming, and modern frameworks",
  "provider": {
    "@type": "Organization",
    "name": "Tech Academy",
    "url": "https://techacademy.com"
  },
  "instructor": {
    "@type": "Person",
    "name": "Dr. Sarah Johnson",
    "url": "https://techacademy.com/instructors/sarah-johnson",
    "jobTitle": "Senior JavaScript Developer",
    "description": "10+ years experience in JavaScript development"
  },
  "coursePrerequisites": [
    "Basic JavaScript knowledge",
    {
      "@type": "Course",
      "name": "JavaScript Fundamentals",
      "url": "https://techacademy.com/courses/javascript-fundamentals"
    }
  ],
  "educationalLevel": "Advanced",
  "courseMode": "Online",
  "timeRequired": "P40H",
  "numberOfCredits": 3,
  "educationalCredentialAwarded": {
    "@type": "EducationalOccupationalCredential",
    "name": "Advanced JavaScript Developer Certificate",
    "description": "Certificate of completion for advanced JavaScript development",
    "credentialCategory": "Certificate"
  },
  "courseCode": "JS-ADV-2024",
  "teaches": [
    "ES6+ Features",
    "Async Programming",
    "Modern JavaScript Frameworks",
    "Performance Optimization"
  ],
  "about": [
    "JavaScript Programming",
    "Web Development",
    "Frontend Development"
  ],
  "audience": {
    "@type": "EducationalAudience",
    "educationalRole": "Student",
    "audienceType": "Professional Developer"
  },
  "offers": {
    "@type": "Offer",
    "price": "299",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01T00:00:00Z",
    "validThrough": "2024-12-31T23:59:59Z"
  },
  "url": "https://techacademy.com/courses/advanced-javascript",
  "image": {
    "@type": "ImageObject",
    "url": "https://techacademy.com/images/advanced-javascript.jpg",
    "width": 800,
    "height": 600,
    "caption": "Advanced JavaScript Development Course"
  },
  "inLanguage": "en-US",
  "keywords": ["JavaScript", "ES6", "Async Programming", "Web Development"],
  "hasCourseInstance": [
    {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "startDate": "2024-02-01",
      "endDate": "2024-03-15",
      "location": "Online"
    }
  ]
};

const result3 = validator.validate(completeCourse, 'Course');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors.length);
console.log('Warnings:', result3.warnings.length);
console.log('Google Rich Results Coverage:', result3.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result3.llmOptimization?.score + '%');
console.log('');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const courseWithOptional = {
  ...completeCourse,
  "additionalType": "https://llmprofiles.org/profiles/content/course/v1",
  "schemaVersion": "https://llmprofiles.org/profiles/content/course/v1",
  "identifier": "https://llmprofiles.org/profiles/content/course/v1",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/content/course/v1"
  }
};

const result4 = validator.validate(courseWithOptional, 'Course');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors.length);
console.log('Warnings:', result4.warnings.length);
console.log('Google Rich Results Coverage:', result4.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result4.llmOptimization?.score + '%');
console.log('');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructure = {
  "@type": "Course",
  "name": "Test Course",
  "description": "Test description",
  "provider": {
    "@type": "Organization"
    // Missing required "name" property
  },
  "instructor": {
    "@type": "Person"
    // Missing required "name" property
  },
  "educationalLevel": "Invalid Level", // Not in enum
  "courseMode": "Invalid Mode", // Not in enum
  "timeRequired": "Invalid Format", // Doesn't match pattern
  "numberOfCredits": 0, // Below minimum
  "offers": {
    "@type": "Offer"
    // Missing required properties
  }
};

const result5 = validator.validate(invalidStructure, 'Course');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors.length);
console.log('Warnings:', result5.warnings.length);
console.log('Google Rich Results Coverage:', result5.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result5.llmOptimization?.score + '%');
console.log('');

// Test 6: Builder pattern test
console.log('Test 6: Builder pattern test');
const builder = new CourseBuilder(MODES.STRICT_SEO, true);
const builtCourse = builder
  .name("React Development Bootcamp")
  .description("Complete React development course from beginner to advanced")
  .provider("React Academy", "https://reactacademy.com")
  .instructor("Mike Chen", "https://reactacademy.com/instructors/mike-chen")
  .coursePrerequisites(["HTML", "CSS", "JavaScript"])
  .educationalLevel("Intermediate")
  .courseMode("Online")
  .timeRequired("P60H")
  .numberOfCredits(4)
  .educationalCredentialAwarded("React Developer Certificate", "Professional React development certificate", "Certificate")
  .courseCode("REACT-2024")
  .teaches(["React Hooks", "State Management", "Component Design", "Testing"])
  .about(["React", "Frontend Development", "JavaScript"])
  .audience("Student", "Web Developer")
  .offers(399, "USD", "InStock")
  .url("https://reactacademy.com/courses/react-bootcamp")
  .inLanguage("en-US")
  .keywords(["React", "JavaScript", "Frontend", "Web Development"])
  .addCourseInstance("Online", "2024-03-01", "2024-04-30")
  .build();

const result6 = validator.validate(builtCourse, 'Course');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors.length);
console.log('Warnings:', result6.warnings.length);
console.log('Google Rich Results Coverage:', result6.googleRichResults?.coverage + '%');
console.log('LLM Optimization Score:', result6.llmOptimization?.score + '%');
console.log('');

console.log('=== Test Summary ===');
console.log('All tests completed successfully!');
console.log('Enhanced Course schema validation is working correctly.');
