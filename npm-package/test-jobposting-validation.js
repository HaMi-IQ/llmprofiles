/**
 * JobPosting Validation Test Cases
 * Following the strict methodology from SCHEMA_ENHANCEMENT_IMPLEMENTATION_GUIDE.md
 */

const { ProfileValidator } = require('./lib/validator');
const { JobPostingBuilder } = require('./lib/builders/jobposting-builder');

// Initialize validator
const validator = new ProfileValidator();

console.log('=== JobPosting Schema Validation Tests ===\n');

// Test 1: Missing critical required properties
console.log('Test 1: Missing critical required properties');
const invalidJobPosting1 = {
  "@type": "JobPosting",
  "title": "Software Engineer"
  // Missing: description, datePosted, hiringOrganization, jobLocation
};

const result1 = validator.validate(invalidJobPosting1, 'Jobposting');
console.log('Valid:', result1.valid);
console.log('Errors:', result1.errors);
console.log('Warnings:', result1.warnings);
console.log('Google Rich Results Coverage:', result1.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result1.llmOptimizationScore + '%');
console.log('---\n');

// Test 2: Missing recommended properties (should be warnings)
console.log('Test 2: Missing recommended properties (should be warnings)');
const invalidJobPosting2 = {
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "We are looking for a skilled software engineer to join our team.",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Corp"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  }
  // Missing recommended: employmentType, validThrough, baseSalary, etc.
};

const result2 = validator.validate(invalidJobPosting2, 'Jobposting');
console.log('Valid:', result2.valid);
console.log('Errors:', result2.errors);
console.log('Warnings:', result2.warnings);
console.log('Google Rich Results Coverage:', result2.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result2.llmOptimizationScore + '%');
console.log('---\n');

// Test 3: Complete schema with all required and recommended properties
console.log('Test 3: Complete schema with all required and recommended properties');
const completeJobPosting = {
  "@type": "JobPosting",
  "title": "Senior Software Engineer",
  "description": "<p>We are seeking a Senior Software Engineer to join our dynamic team. You will be responsible for developing and maintaining our core platform.</p>",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Innovations Inc.",
    "url": "https://www.techinnovations.com",
    "logo": "https://www.techinnovations.com/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Innovation Drive",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    }
  },
  "employmentType": "FULL_TIME",
  "validThrough": "2025-02-15",
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 120000,
      "maxValue": 150000,
      "unitText": "YEAR"
    }
  },
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "qualifications": "Bachelor's degree in Computer Science or related field",
  "responsibilities": "Develop and maintain web applications, collaborate with cross-functional teams",
  "experienceRequirements": "5+ years of software development experience",
  "educationRequirements": "Bachelor's degree in Computer Science or equivalent",
  "benefits": "Health insurance, 401k, flexible work hours",
  "workHours": "40 hours per week",
  "applicationContact": {
    "@type": "ContactPoint",
    "email": "careers@techinnovations.com",
    "contactType": "recruiter"
  },
  "url": "https://www.techinnovations.com/careers/senior-software-engineer"
};

const result3 = validator.validate(completeJobPosting, 'Jobposting');
console.log('Valid:', result3.valid);
console.log('Errors:', result3.errors);
console.log('Warnings:', result3.warnings);
console.log('Google Rich Results Coverage:', result3.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result3.llmOptimizationScore + '%');
console.log('---\n');

// Test 4: Schema with optional properties
console.log('Test 4: Schema with optional properties');
const optionalJobPosting = {
  ...completeJobPosting,
  "industry": "Technology",
  "occupationalCategory": "Software Developer",
  "jobBenefits": "Comprehensive health coverage, dental, vision",
  "jobImmediateStart": false,
  "jobStartDate": "2025-03-01",
  "securityClearanceRequirement": "None required",
  "employmentUnit": "Engineering",
  "jobTitle": "Senior Software Engineer",
  "alternativeHeadline": "Full-Stack Developer Position"
};

const result4 = validator.validate(optionalJobPosting, 'Jobposting');
console.log('Valid:', result4.valid);
console.log('Errors:', result4.errors);
console.log('Warnings:', result4.warnings);
console.log('Google Rich Results Coverage:', result4.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result4.llmOptimizationScore + '%');
console.log('---\n');

// Test 5: Invalid structure validation
console.log('Test 5: Invalid structure validation');
const invalidStructureJobPosting = {
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "Job description",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    // Missing @type and name
    "url": "https://example.com"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      // Missing @type
      "addressLocality": "San Francisco"
    }
  }
};

const result5 = validator.validate(invalidStructureJobPosting, 'Jobposting');
console.log('Valid:', result5.valid);
console.log('Errors:', result5.errors);
console.log('Warnings:', result5.warnings);
console.log('Google Rich Results Coverage:', result5.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result5.llmOptimizationScore + '%');
console.log('---\n');

// Test 6: Remote job posting
console.log('Test 6: Remote job posting');
const remoteJobPosting = {
  "@type": "JobPosting",
  "title": "Remote Frontend Developer",
  "description": "<p>Join our remote team as a Frontend Developer. Work from anywhere in the world.</p>",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Remote Tech Co.",
    "url": "https://www.remotetech.com"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "United States"
  },
  "employmentType": "FULL_TIME",
  "validThrough": "2025-02-15",
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "value": 100000,
      "unitText": "YEAR"
    }
  },
  "directApply": true,
  "skills": ["React", "TypeScript", "CSS", "HTML"],
  "qualifications": "3+ years of frontend development experience",
  "applicationContact": {
    "@type": "ContactPoint",
    "email": "jobs@remotetech.com",
    "contactType": "recruiter"
  }
};

const result6 = validator.validate(remoteJobPosting, 'Jobposting');
console.log('Valid:', result6.valid);
console.log('Errors:', result6.errors);
console.log('Warnings:', result6.warnings);
console.log('Google Rich Results Coverage:', result6.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result6.llmOptimizationScore + '%');
console.log('---\n');

// Test 7: Builder pattern validation
console.log('Test 7: Builder pattern validation');
const builderJobPosting = new JobPostingBuilder()
  .title("Data Scientist")
  .description("<p>We are looking for a Data Scientist to join our analytics team.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("Data Corp", "https://www.datacorp.com", "https://www.datacorp.com/logo.png")
  .jobLocation("456 Data Street", "New York", "NY", "US")
  .employmentType("FULL_TIME")
  .validThrough("2025-02-15")
  .baseSalary(130000, "USD", "YEAR", 120000, 140000)
  .skills(["Python", "Machine Learning", "SQL", "Statistics"])
  .qualifications("Master's degree in Data Science or related field")
  .responsibilities("Analyze data, build ML models, create reports")
  .experienceRequirements("3+ years of data science experience")
  .educationRequirements("Master's degree in Data Science")
  .benefits("Health insurance, stock options, learning budget")
  .workHours("40 hours per week")
  .applicationContact("careers@datacorp.com", "recruiter")
  .url("https://www.datacorp.com/careers/data-scientist")
  .industry("Technology")
  .occupationalCategory("Data Scientist")
  .build();

const result7 = validator.validate(builderJobPosting, 'Jobposting');
console.log('Valid:', result7.valid);
console.log('Errors:', result7.errors);
console.log('Warnings:', result7.warnings);
console.log('Google Rich Results Coverage:', result7.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result7.llmOptimizationScore + '%');
console.log('---\n');

// Test 8: Invalid date format
console.log('Test 8: Invalid date format');
const invalidDateJobPosting = {
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "Job description",
  "datePosted": "15-01-2025", // Invalid date format
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Corp"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressCountry": "US"
    }
  }
};

const result8 = validator.validate(invalidDateJobPosting, 'Jobposting');
console.log('Valid:', result8.valid);
console.log('Errors:', result8.errors);
console.log('Warnings:', result8.warnings);
console.log('Google Rich Results Coverage:', result8.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result8.llmOptimizationScore + '%');
console.log('---\n');

// Test 9: Invalid employment type
console.log('Test 9: Invalid employment type');
const invalidEmploymentTypeJobPosting = {
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "Job description",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Corp"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressCountry": "US"
    }
  },
  "employmentType": "INVALID_TYPE" // Invalid employment type
};

const result9 = validator.validate(invalidEmploymentTypeJobPosting, 'Jobposting');
console.log('Valid:', result9.valid);
console.log('Errors:', result9.errors);
console.log('Warnings:', result9.warnings);
console.log('Google Rich Results Coverage:', result9.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result9.llmOptimizationScore + '%');
console.log('---\n');

// Test 10: Invalid salary structure
console.log('Test 10: Invalid salary structure');
const invalidSalaryJobPosting = {
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "Job description",
  "datePosted": "2025-01-15",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Tech Corp"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressCountry": "US"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INVALID", // Invalid currency code
    "value": {
      "@type": "QuantitativeValue",
      "value": 100000,
      "unitText": "INVALID_UNIT" // Invalid unit
    }
  }
};

const result10 = validator.validate(invalidSalaryJobPosting, 'Jobposting');
console.log('Valid:', result10.valid);
console.log('Errors:', result10.errors);
console.log('Warnings:', result10.warnings);
console.log('Google Rich Results Coverage:', result10.googleRichResultsCoverage + '%');
console.log('LLM Optimization Score:', result10.llmOptimizationScore + '%');
console.log('---\n');

console.log('=== Validation Test Summary ===');
console.log('Expected Results:');
console.log('- Test 1: valid: false, multiple errors, warnings');
console.log('- Test 2: valid: false, errors for missing required, warnings for recommended');
console.log('- Test 3: valid: true, 0 errors, minimal warnings');
console.log('- Test 4: valid: true, 0 errors, minimal warnings');
console.log('- Test 5: valid: false, structure validation errors');
console.log('- Test 6: valid: true, 0 errors, minimal warnings (remote job)');
console.log('- Test 7: valid: true, 0 errors, minimal warnings (builder pattern)');
console.log('- Test 8: valid: false, date format errors');
console.log('- Test 9: valid: false, employment type validation errors');
console.log('- Test 10: valid: false, salary structure validation errors');
