# SoftwareApplication Profile

The SoftwareApplication profile provides a standardized way to structure software products and applications for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [SoftwareApplication](https://schema.org/SoftwareApplication)  
**Profile URL:** https://llmprofiles.org/softwareapplication/v1  
**Page Schema:** https://llmprofiles.org/softwareapplication/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/softwareapplication/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/softwareapplication/v1/training.jsonl

## Use Cases

- Software product pages
- Mobile app listings
- Web application pages
- Plugin and extension pages
- Software download pages
- Development tool pages

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for softwareapplication content:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/softwareapplication/v1",
  "rdfs:seeAlso": "https://schema.org/SoftwareApplication",
  "skos:prefLabel": "SoftwareApplication",
  "skos:definition": "A softwareapplication with structured data for LLM processing.",
  "skos:scopeNote": "For software products with specific features and requirements.",
  "skos:example": "Software product page with features, system requirements, and download links.",
  "x:dos": [
    "Use schema:applicationCategory and schema:operatingSystem.",
    "Include schema:downloadUrl and schema:installUrl.",
    "Add schema:softwareVersion and schema:releaseNotes.",
    "Use schema:aggregateRating for user reviews."
  ],
  "x:donts": [
    "Do not use for general software reviews or comparisons.",
    "Do not mix with promotional content or marketing materials.",
    "Do not use for deprecated or discontinued software."
  ]
}
```

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

```json
{
  "$id": "https://llmprofiles.org/softwareapplication/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "SoftwareApplication On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "SoftwareApplication" },
    "name": { "type": "string", "minLength": 1 },
    "description": { "type": "string", "minLength": 1 }
  },
  "required": ["@type", "name"]
}
```

### Output Schema (Extracted Content)

The output schema defines the structure for extracted softwareapplication content:

```json
{
  "id": "unique-identifier",
  "name": "The softwareapplication name",
  "description": "Detailed description",
  "url": "https://example.com/softwareapplication/123",
  "metadata": {
    "created": "2025-08-28T10:00:00Z",
    "updated": "2025-08-28T10:00:00Z"
  }
}
```

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

```jsonl
{"type":"softwareapplication","id":"example-1","lang":"en","name":"Example SoftwareApplication","description":"This is an example softwareapplication...","source_iri":"https://llmprofiles.org/softwareapplication#example","topic":["example","demo"],"softwareapplication_version":"v1"}
```

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic softwareapplication structure for quick implementation
- **Rich Example:** Full-featured softwareapplication with metadata and additional properties

## Usage Examples

### Basic SoftwareApplication Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>Example SoftwareApplication - Page</title>
</head>
<body>
  <h1>Example SoftwareApplication</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/softwareapplication/v1",
    "@type": "SoftwareApplication",
    "name": "Example SoftwareApplication",
    "description": "This is an example softwareapplication implementation."
  }
  </script>
  
  <div class="content">
    <h2>Example SoftwareApplication</h2>
    <p>This is an example softwareapplication implementation.</p>
  </div>
</body>
</html>
```

### JavaScript Implementation

```javascript
async function createSoftwareApplication() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/softwareapplication/v1');
  const profileData = await profile.json();
  
  // Create softwareapplication content
  const softwareapplicationContent = {
    "@context": profileData["@context"],
    "@type": "SoftwareApplication",
    "name": "Example SoftwareApplication",
    "description": "This is an example softwareapplication implementation."
  };
  
  return softwareapplicationContent;
}
```

### Content Extraction

```javascript
async function extractSoftwareApplication(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/softwareapplication/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract softwareapplication data (simplified example)
  const extractedData = {
    "id": "example-softwareapplication",
    "name": "Example SoftwareApplication",
    "description": "This is an example softwareapplication implementation.",
    "url": "https://example.com/softwareapplication/example",
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
npx ajv validate -s softwareapplication/v1/output.schema.json -d your-softwareapplication-data.json
```

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract softwareapplication data from your pages
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

- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
