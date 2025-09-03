# LocalBusiness Profile

The LocalBusiness profile provides a standardized way to structure business listings and local information for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [LocalBusiness](https://schema.org/LocalBusiness)  
**Profile URL:** https://llmprofiles.org/profiles/business/localbusiness/v1  
**Page Schema:** https://llmprofiles.org/profiles/business/localbusiness/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/profiles/business/localbusiness/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/profiles/business/localbusiness/v1/training.jsonl

## Use Cases

- Business directory pages
- Restaurant and service listings
- Retail store pages
- Professional service pages
- Local business websites
- Review and rating pages

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for localbusiness content:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/profiles/business/localbusiness/v1",
  "rdfs:seeAlso": "https://schema.org/LocalBusiness",
  "skos:prefLabel": "LocalBusiness",
  "skos:definition": "A localbusiness with structured data for LLM processing.",
  "skos:scopeNote": "For local businesses with physical locations and contact information.",
  "skos:example": "Restaurant page with address, hours, menu, and reviews.",
  "x:dos": [
    "Use schema:address and schema:geo.",
    "Include schema:openingHours and schema:telephone.",
    "Add schema:priceRange and schema:servesCuisine.",
    "Use schema:aggregateRating for reviews."
  ],
  "x:donts": [
    "Do not use for online-only businesses without physical location.",
    "Do not mix with general business information.",
    "Do not use for corporate headquarters or administrative offices."
  ]
}
```

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

```json
{
  "$id": "https://llmprofiles.org/profiles/business/localbusiness/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LocalBusiness On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "LocalBusiness" },
    "name": { "type": "string", "minLength": 1 },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["@type", "name"]
}
```

### Output Schema (Extracted Content)

The output schema defines the structure for extracted localbusiness content:

```json
{
  "id": "unique-identifier",
  "name": "The localbusiness name",
  "description": "Detailed description",
  "url": "https://example.com/profiles/business/localbusiness/123",
  "metadata": {
    "created": "2025-08-28T10:00:00Z",
    "updated": "2025-08-28T10:00:00Z"
  }
}
```

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

```jsonl
{"type":"localbusiness","id":"example-1","lang":"en","name":"Example LocalBusiness","description":"This is an example localbusiness...","source_iri":"https://llmprofiles.org/localbusiness#example","topic":["example","demo"],"localbusiness_version":"v1"}
```

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic localbusiness structure for quick implementation
- **Rich Example:** Full-featured localbusiness with metadata and additional properties

## Usage Examples

### Basic LocalBusiness Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>Example LocalBusiness - Page</title>
</head>
<body>
  <h1>Example LocalBusiness</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/profiles/business/localbusiness/v1",
    "@type": "LocalBusiness",
    "name": "Example LocalBusiness",
    "description": "This is an example localbusiness implementation."
  }
  </script>
  
  <div class="content">
    <h2>Example LocalBusiness</h2>
    <p>This is an example localbusiness implementation.</p>
  </div>
</body>
</html>
```

### JavaScript Implementation

```javascript
async function createLocalBusiness() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/profiles/business/localbusiness/v1');
  const profileData = await profile.json();
  
  // Create localbusiness content
  const localbusinessContent = {
    "@context": profileData["@context"],
    "@type": "LocalBusiness",
    "name": "Example LocalBusiness",
    "description": "This is an example localbusiness implementation."
  };
  
  return localbusinessContent;
}
```

### Content Extraction

```javascript
async function extractLocalBusiness(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/profiles/business/localbusiness/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract localbusiness data (simplified example)
  const extractedData = {
    "id": "example-localbusiness",
    "name": "Example LocalBusiness",
    "description": "This is an example localbusiness implementation.",
    "url": "https://example.com/profiles/business/localbusiness/example",
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
npx ajv validate -s localbusiness/v1/output.schema.json -d your-localbusiness-data.json
```

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract localbusiness data from your pages
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

- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
