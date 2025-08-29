#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Profile definitions with their specific information
const profiles = {
  'article': {
    name: 'Article',
    schemaType: 'Article',
    description: 'The Article profile provides a standardized way to structure blog posts, articles, and written content for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Blog posts and articles',
      'News articles and reports',
      'Technical documentation',
      'Research papers',
      'Opinion pieces',
      'Tutorial content'
    ],
    scopeNote: 'For written content with a clear author and publication date.',
    example: 'Blog post about implementing JSON-LD with author, date, and content.',
    dos: [
      'Use schema:author with schema:Person or schema:Organization.',
      'Include schema:datePublished and schema:dateModified.',
      'Add schema:headline and schema:description.',
      'Use schema:articleBody for the main content.'
    ],
    donts: [
      'Do not use for product pages or landing pages.',
      'Do not mix with e-commerce or promotional content.',
      'Do not use for user-generated content without clear authorship.'
    ]
  },
  'product-offer': {
    name: 'ProductOffer',
    schemaType: 'ProductOffer',
    description: 'The ProductOffer profile provides a standardized way to structure product listings and e-commerce content for LLM-friendly processing and semantic understanding.',
    useCases: [
      'E-commerce product pages',
      'Product catalogs',
      'Price comparison pages',
      'Marketplace listings',
      'Product reviews with offers',
      'Deal and discount pages'
    ],
    scopeNote: 'For product listings with pricing and availability information.',
    example: 'E-commerce product page with price, availability, and seller information.',
    dos: [
      'Use schema:price and schema:priceCurrency.',
      'Include schema:availability and schema:itemCondition.',
      'Add schema:seller with business information.',
      'Use schema:url for the product page.'
    ],
    donts: [
      'Do not use for general product information without pricing.',
      'Do not mix with editorial content or reviews.',
      'Do not use for services or intangible products.'
    ]
  },
  'event': {
    name: 'Event',
    schemaType: 'Event',
    description: 'The Event profile provides a standardized way to structure event information and scheduling for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Event listings and calendars',
      'Conference and workshop pages',
      'Concert and performance pages',
      'Sports event pages',
      'Webinar and online event pages',
      'Exhibition and trade show pages'
    ],
    scopeNote: 'For events with specific dates, times, and locations.',
    example: 'Conference page with schedule, speakers, and registration information.',
    dos: [
      'Use schema:startDate and schema:endDate.',
      'Include schema:location with schema:Place.',
      'Add schema:organizer and schema:performer.',
      'Use schema:offers for ticket information.'
    ],
    donts: [
      'Do not use for recurring events without specific dates.',
      'Do not mix with general venue or location pages.',
      'Do not use for past events without clear historical context.'
    ]
  },
  'course': {
    name: 'Course',
    schemaType: 'Course',
    description: 'The Course profile provides a standardized way to structure educational courses and learning content for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Online course pages',
      'Educational program listings',
      'Training course pages',
      'University course catalogs',
      'Skill development programs',
      'Certification courses'
    ],
    scopeNote: 'For educational content with structured learning objectives.',
    example: 'Online course page with curriculum, instructor, and enrollment information.',
    dos: [
      'Use schema:coursePrerequisites and schema:educationalCredentialAwarded.',
      'Include schema:provider and schema:instructor.',
      'Add schema:courseMode and schema:timeRequired.',
      'Use schema:offers for enrollment information.'
    ],
    donts: [
      'Do not use for general educational content without structure.',
      'Do not mix with promotional or marketing content.',
      'Do not use for informal learning resources.'
    ]
  },
  'jobposting': {
    name: 'JobPosting',
    schemaType: 'JobPosting',
    description: 'The JobPosting profile provides a standardized way to structure job advertisements and career opportunities for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Job board listings',
      'Company career pages',
      'Recruitment agency pages',
      'Freelance job postings',
      'Internship opportunities',
      'Executive search listings'
    ],
    scopeNote: 'For job opportunities with specific requirements and compensation.',
    example: 'Job posting page with requirements, salary, and application process.',
    dos: [
      'Use schema:title and schema:description.',
      'Include schema:salaryRange and schema:employmentType.',
      'Add schema:hiringOrganization and schema:jobLocation.',
      'Use schema:datePosted and schema:validThrough.'
    ],
    donts: [
      'Do not use for general career advice or company information.',
      'Do not mix with promotional content or company news.',
      'Do not use for expired or filled positions.'
    ]
  },
  'localbusiness': {
    name: 'LocalBusiness',
    schemaType: 'LocalBusiness',
    description: 'The LocalBusiness profile provides a standardized way to structure business listings and local information for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Business directory pages',
      'Restaurant and service listings',
      'Retail store pages',
      'Professional service pages',
      'Local business websites',
      'Review and rating pages'
    ],
    scopeNote: 'For local businesses with physical locations and contact information.',
    example: 'Restaurant page with address, hours, menu, and reviews.',
    dos: [
      'Use schema:address and schema:geo.',
      'Include schema:openingHours and schema:telephone.',
      'Add schema:priceRange and schema:servesCuisine.',
      'Use schema:aggregateRating for reviews.'
    ],
    donts: [
      'Do not use for online-only businesses without physical location.',
      'Do not mix with general business information.',
      'Do not use for corporate headquarters or administrative offices.'
    ]
  },
  'softwareapplication': {
    name: 'SoftwareApplication',
    schemaType: 'SoftwareApplication',
    description: 'The SoftwareApplication profile provides a standardized way to structure software products and applications for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Software product pages',
      'Mobile app listings',
      'Web application pages',
      'Plugin and extension pages',
      'Software download pages',
      'Development tool pages'
    ],
    scopeNote: 'For software products with specific features and requirements.',
    example: 'Software product page with features, system requirements, and download links.',
    dos: [
      'Use schema:applicationCategory and schema:operatingSystem.',
      'Include schema:downloadUrl and schema:installUrl.',
      'Add schema:softwareVersion and schema:releaseNotes.',
      'Use schema:aggregateRating for user reviews.'
    ],
    donts: [
      'Do not use for general software reviews or comparisons.',
      'Do not mix with promotional content or marketing materials.',
      'Do not use for deprecated or discontinued software.'
    ]
  },
  'review': {
    name: 'Review',
    schemaType: 'Review',
    description: 'The Review profile provides a standardized way to structure product reviews and ratings for LLM-friendly processing and semantic understanding.',
    useCases: [
      'Product review pages',
      'Service review pages',
      'Restaurant review pages',
      'Book and media reviews',
      'Hotel and travel reviews',
      'Professional service reviews'
    ],
    scopeNote: 'For reviews with ratings and detailed feedback.',
    example: 'Product review page with rating, pros/cons, and detailed analysis.',
    dos: [
      'Use schema:reviewRating and schema:reviewBody.',
      'Include schema:author and schema:datePublished.',
      'Add schema:itemReviewed with product information.',
      'Use schema:reviewAspect for specific criteria.'
    ],
    donts: [
      'Do not use for general product information without review content.',
      'Do not mix with promotional content or advertisements.',
      'Do not use for user-generated content without moderation.'
    ]
  }
};

// Template for README content
function generateREADME(profileKey, profileData) {
  return `# ${profileData.name} Profile

The ${profileData.name} profile provides a standardized way to structure ${profileData.description.toLowerCase().replace(/^the \w+ profile provides a standardized way to structure /, '').replace(/ for llm-friendly processing and semantic understanding\./, '')} for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [${profileData.name}](https://schema.org/${profileData.name})  
**Profile URL:** https://llmprofiles.org/${profileKey}/v1  
**Page Schema:** https://llmprofiles.org/${profileKey}/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/${profileKey}/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/${profileKey}/v1/training.jsonl

## Use Cases

${profileData.useCases.map(useCase => `- ${useCase}`).join('\n')}

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for ${profileData.name.toLowerCase()} content:

\`\`\`json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/${profileKey}/v1",
  "rdfs:seeAlso": "https://schema.org/${profileData.name}",
  "skos:prefLabel": "${profileData.name}",
  "skos:definition": "A ${profileData.name.toLowerCase()} with structured data for LLM processing.",
  "skos:scopeNote": "${profileData.scopeNote}",
  "skos:example": "${profileData.example}",
  "x:dos": [
${profileData.dos.map(doItem => `    "${doItem}"`).join(',\n')}
  ],
  "x:donts": [
${profileData.donts.map(dontItem => `    "${dontItem}"`).join(',\n')}
  ]
}
\`\`\`

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

\`\`\`json
{
  "$id": "https://llmprofiles.org/${profileKey}/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "${profileData.name} On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "${profileData.name}" },
    "name": { "type": "string", "minLength": 1 },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["@type", "name"]
}
\`\`\`

### Output Schema (Extracted Content)

The output schema defines the structure for extracted ${profileData.name.toLowerCase()} content:

\`\`\`json
{
  "id": "unique-identifier",
  "name": "The ${profileData.name.toLowerCase()} name",
  "description": "Detailed description",
  "url": "https://example.com/${profileKey}/123",
  "metadata": {
    "created": "2025-08-28T10:00:00Z",
    "updated": "2025-08-28T10:00:00Z"
  }
}
\`\`\`

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

\`\`\`jsonl
{"type":"${profileKey}","id":"example-1","lang":"en","name":"Example ${profileData.name}","description":"This is an example ${profileData.name.toLowerCase()}...","source_iri":"https://llmprofiles.org/${profileKey}#example","topic":["example","demo"],"${profileKey}_version":"v1"}
\`\`\`

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic ${profileData.name.toLowerCase()} structure for quick implementation
- **Rich Example:** Full-featured ${profileData.name.toLowerCase()} with metadata and additional properties

## Usage Examples

### Basic ${profileData.name} Page

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Example ${profileData.name} - Page</title>
</head>
<body>
  <h1>Example ${profileData.name}</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/${profileKey}/v1",
    "@type": "${profileData.name}",
    "name": "Example ${profileData.name}",
    "description": "This is an example ${profileData.name.toLowerCase()} implementation."
  }
  </script>
  
  <div class="content">
    <h2>Example ${profileData.name}</h2>
    <p>This is an example ${profileData.name.toLowerCase()} implementation.</p>
  </div>
</body>
</html>
\`\`\`

### JavaScript Implementation

\`\`\`javascript
async function create${profileData.name}() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/${profileKey}/v1');
  const profileData = await profile.json();
  
  // Create ${profileData.name.toLowerCase()} content
  const ${profileKey}Content = {
    "@context": profileData["@context"],
    "@type": "${profileData.name}",
    "name": "Example ${profileData.name}",
    "description": "This is an example ${profileData.name.toLowerCase()} implementation."
  };
  
  return ${profileKey}Content;
}
\`\`\`

### Content Extraction

\`\`\`javascript
async function extract${profileData.name}(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/${profileKey}/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract ${profileData.name.toLowerCase()} data (simplified example)
  const extractedData = {
    "id": "example-${profileKey}",
    "name": "Example ${profileData.name}",
    "description": "This is an example ${profileData.name.toLowerCase()} implementation.",
    "url": "https://example.com/${profileKey}/example",
    "metadata": {
      "created": new Date().toISOString(),
      "updated": new Date().toISOString()
    }
  };
  
  // Validate against schema
  const Ajv = require('ajv');
  const addFormats = require('ajv-formats');
  const ajv = new Ajv({strict: false, allErrors: true});
  addFormats(ajv);
  
  const validate = ajv.compile(schema);
  const isValid = validate(extractedData);
  
  if (!isValid) {
    console.error('Validation errors:', validate.errors);
    return null;
  }
  
  return extractedData;
}
\`\`\`

## Best Practices

### Content Guidelines

1. **Provide clear, accurate information**
   - Use descriptive names and titles
   - Include comprehensive descriptions
   - Ensure information is up-to-date

2. **Follow schema.org guidelines**
   - Use appropriate properties for your content type
   - Include required fields
   - Validate your markup

3. **Optimize for search engines**
   - Use relevant keywords naturally
   - Include structured data
   - Ensure mobile-friendly design

### Technical Guidelines

1. **Implement proper JSON-LD structure**
   - Include the profile context
   - Use correct Schema.org types
   - Include all required properties

2. **Validate your content**
   - Test against the output schema
   - Use the provided validation tools
   - Check for common errors

3. **Include metadata**
   - Creation and update dates
   - Author or organization information
   - Relevant tags and categories

### SEO and Accessibility

1. **Use semantic HTML**
   - Proper heading hierarchy
   - Descriptive content structure
   - Accessible markup for screen readers

2. **Include structured data**
   - Add JSON-LD to your pages
   - Test with Google's Rich Results Test
   - Monitor search console for issues

## Validation

### Schema Validation

\`\`\`bash
# Validate against output schema
npx ajv validate -s ${profileKey}/v1/output.schema.json -d your-${profileKey}-data.json
\`\`\`

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract ${profileData.name.toLowerCase()} data from your pages
   - Validate against output schema
   - Check for missing or invalid data

3. **Verify accessibility**
   - Test with screen readers
   - Check keyboard navigation
   - Validate HTML structure

## Common Issues

### Validation Errors

1. **Missing required properties**
   - Ensure all required fields are present
   - Check property names and types
   - Verify data format requirements

2. **Invalid data types**
   - Use correct data types for each property
   - Check date format (ISO 8601)
   - Validate URL format

3. **Schema compliance**
   - Follow the defined schema structure
   - Avoid additional properties unless allowed
   - Use consistent property naming

### Content Issues

1. **Incomplete information**
   - Ensure all necessary details are included
   - Provide comprehensive descriptions
   - Include relevant metadata

2. **Poor organization**
   - Structure content logically
   - Use consistent formatting
   - Include clear navigation

3. **Outdated information**
   - Keep content current
   - Update dates and timestamps
   - Remove obsolete information

## Related Resources

- [Schema.org ${profileData.name}](https://schema.org/${profileData.name})
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
`;
}

// Create READMEs for all profiles
Object.entries(profiles).forEach(([profileKey, profileData]) => {
  const profileDir = path.join(__dirname, '..', profileKey);
  const readmePath = path.join(profileDir, 'README.md');
  
  // Check if profile directory exists
  if (fs.existsSync(profileDir)) {
    const readmeContent = generateREADME(profileKey, profileData);
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✅ Created README for ${profileData.name} profile`);
  } else {
    console.log(`⚠️  Profile directory not found: ${profileKey}`);
  }
});

console.log('\n🎉 Profile README generation complete!');
