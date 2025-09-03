# Review Profile

The Review profile provides a standardized way to structure product reviews and ratings for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [Review](https://schema.org/Review)  
**Profile URL:** https://llmprofiles.org/review/v1  
**Page Schema:** https://llmprofiles.org/review/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/review/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/review/v1/training.jsonl

## Use Cases

- Product review pages
- Service review pages
- Restaurant review pages
- Book and media reviews
- Hotel and travel reviews
- Professional service reviews

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for review content:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/review/v1",
  "rdfs:seeAlso": "https://schema.org/Review",
  "skos:prefLabel": "Review",
  "skos:definition": "A review with structured data for LLM processing.",
  "skos:scopeNote": "For reviews with ratings and detailed feedback.",
  "skos:example": "Product review page with rating, pros/cons, and detailed analysis.",
  "x:dos": [
    "Use schema:reviewRating and schema:reviewBody.",
    "Include schema:author and schema:datePublished.",
    "Add schema:itemReviewed with product information.",
    "Use schema:reviewAspect for specific criteria."
  ],
  "x:donts": [
    "Do not use for general product information without review content.",
    "Do not mix with promotional content or advertisements.",
    "Do not use for user-generated content without moderation."
  ]
}
```

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

```json
{
  "$id": "https://llmprofiles.org/review/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Review On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "Review" },
    "name": { "type": "string", "minLength": 1 },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["@type", "name"]
}
```

### Output Schema (Extracted Content)

The output schema defines the structure for extracted review content:

```json
{
  "id": "unique-identifier",
  "name": "The review name",
  "description": "Detailed description",
  "url": "https://example.com/review/123",
  "metadata": {
    "created": "2025-08-28T10:00:00Z",
    "updated": "2025-08-28T10:00:00Z"
  }
}
```

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

```jsonl
{"type":"review","id":"example-1","lang":"en","name":"Example Review","description":"This is an example review...","source_iri":"https://llmprofiles.org/review#example","topic":["example","demo"],"review_version":"v1"}
```

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic review structure for quick implementation
- **Rich Example:** Full-featured review with metadata and additional properties

## Usage Examples

### Basic Review Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>Example Review - Page</title>
</head>
<body>
  <h1>Example Review</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/review/v1",
    "@type": "Review",
    "name": "Example Review",
    "description": "This is an example review implementation."
  }
  </script>
  
  <div class="content">
    <h2>Example Review</h2>
    <p>This is an example review implementation.</p>
  </div>
</body>
</html>
```

### JavaScript Implementation

```javascript
async function createReview() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/review/v1');
  const profileData = await profile.json();
  
  // Create review content
  const reviewContent = {
    "@context": profileData["@context"],
    "@type": "Review",
    "name": "Example Review",
    "description": "This is an example review implementation."
  };
  
  return reviewContent;
}
```

### Content Extraction

```javascript
async function extractReview(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/review/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract review data (simplified example)
  const extractedData = {
    "id": "example-review",
    "name": "Example Review",
    "description": "This is an example review implementation.",
    "url": "https://example.com/review/example",
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
```

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

```bash
# Validate against output schema
npx ajv validate -s review/v1/output.schema.json -d your-review-data.json
```

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract review data from your pages
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

- [Schema.org Review](https://schema.org/Review)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
