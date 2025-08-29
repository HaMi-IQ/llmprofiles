# FAQPage Profile

The FAQPage profile provides a standardized way to structure FAQ (Frequently Asked Questions) content for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [FAQPage](https://schema.org/FAQPage)  
**Profile URL:** https://llmprofiles.org/faqpage/v1  
**Page Schema:** https://llmprofiles.org/faqpage/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/faqpage/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/faqpage/v1/training.jsonl

## Use Cases

- Support/help pages with Q&A content
- Product documentation FAQs
- Service information pages
- Knowledge base articles
- Customer service resources

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for FAQ content:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/faqpage/v1",
  "rdfs:seeAlso": "https://schema.org/FAQPage",
  "skos:prefLabel": "FAQ Page",
  "skos:definition": "A page listing multiple user-relevant questions with their accepted answers.",
  "skos:scopeNote": "Not a single question thread (use schema:QAPage). Avoid pricing tables, docs indexes, or changelogs.",
  "skos:example": "Support /help/faq page with 10 concise Q/A items and anchors.",
  "x:dos": [
    "Use schema:Question with schema:acceptedAnswer.",
    "Keep each Q/A self-contained and non-duplicative.",
    "Link each question to a stable anchor (#question-id)."
  ],
  "x:donts": [
    "Do not use for forum threads or comment discussions.",
    "Do not mix product offers or terms of service content into FAQ.",
    "Do not mark every header as a Question if no direct answer follows."
  ]
}
```

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

```json
{
  "$id": "https://llmprofiles.org/faqpage/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "FAQPage On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "FAQPage" },
    "inLanguage": { "type": "string" },
    "mainEntity": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "@type": { "const": "Question" },
          "name": { "type": "string", "minLength": 3 },
          "acceptedAnswer": {
            "type": "object",
            "properties": {
              "@type": { "const": "Answer" },
              "text": { "type": "string", "minLength": 1 }
            },
            "required": ["@type", "text"]
          }
        },
        "required": ["@type", "name", "acceptedAnswer"]
      }
    }
  },
  "required": ["@type", "mainEntity"]
}
```

### Output Schema (Extracted Content)

The output schema defines the structure for extracted FAQ content:

```json
{
  "faqs": [
    {
      "id": "optional-unique-id",
      "question": "What is the question?",
      "answer": "The answer text",
      "url": "https://example.com/faq#question-id",
      "tags": ["tag1", "tag2"],
      "lastUpdated": "2025-08-28T10:00:00Z"
    }
  ]
}
```

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

```jsonl
{"type":"faq","id":"llmp-what","lang":"en","question":"What is LLM Profiles?","answer":"LLM Profiles is a public registry...","source_iri":"https://llmprofiles.org/faq#what","topic":["llmprofiles","AEO"],"faqpage_version":"v1"}
```

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic FAQ structure for quick implementation
- **Rich Example:** Full-featured FAQ with metadata, positioning, and publisher information

## Usage Examples

### Basic FAQ Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>FAQ - Product Support</title>
</head>
<body>
  <h1>Frequently Asked Questions</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/faqpage/v1",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I reset my password?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers."
        }
      }
    ]
  }
  </script>
  
  <div class="faq-item" id="password-reset">
    <h3>How do I reset my password?</h3>
    <p>Go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox.</p>
  </div>
  
  <div class="faq-item" id="payment-methods">
    <h3>What payment methods do you accept?</h3>
    <p>We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.</p>
  </div>
</body>
</html>
```

### JavaScript Implementation

```javascript
async function createFAQPage() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/faqpage/v1');
  const profileData = await profile.json();
  
  // Create FAQ content
  const faqContent = {
    "@context": profileData["@context"],
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is llmprofiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "llmprofiles is a registry of LLM-friendly structured data profiles that help AI systems better understand and process web content."
        }
      }
    ]
  };
  
  return faqContent;
}
```

### Content Extraction

```javascript
async function extractFAQs(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/faqpage/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract FAQ data (simplified example)
  const extractedData = {
    "faqs": [
      {
        "id": "what-is-llmprofiles",
        "question": "What is llmprofiles?",
        "answer": "llmprofiles is a registry of LLM-friendly structured data profiles.",
        "url": "https://example.com/faq#what-is-llmprofiles",
        "tags": ["introduction", "overview"],
        "lastUpdated": new Date().toISOString()
      }
    ]
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

1. **Keep questions concise and specific**
   - Good: "How do I reset my password?"
   - Avoid: "What are all the things I can do with my account?"

2. **Provide clear, actionable answers**
   - Include step-by-step instructions when applicable
   - Use simple, jargon-free language
   - Keep answers focused and relevant

3. **Organize content logically**
   - Group related questions together
   - Use consistent formatting
   - Include anchor links for easy navigation

### Technical Guidelines

1. **Use proper JSON-LD structure**
   - Include the profile context
   - Use correct Schema.org types
   - Ensure all required properties are present

2. **Implement stable URLs**
   - Use consistent anchor naming
   - Avoid changing URLs after publication
   - Include proper URL structure in output schema

3. **Validate your content**
   - Test against the output schema
   - Use the provided validation tools
   - Check for common errors

### SEO and Accessibility

1. **Use semantic HTML**
   - Proper heading hierarchy
   - Descriptive anchor text
   - Accessible markup

2. **Include structured data**
   - Add JSON-LD to your pages
   - Test with Google's Rich Results Test
   - Monitor search console for issues

## Validation

### Schema Validation

```bash
# Validate against output schema
npx ajv validate -s faqpage/v1/output.schema.json -d your-faq-data.json
```

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract FAQ data from your pages
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

1. **Duplicate questions**
   - Review content for similar questions
   - Consolidate or differentiate as needed
   - Use unique IDs for each FAQ

2. **Incomplete answers**
   - Ensure answers are comprehensive
   - Include necessary context
   - Provide actionable information

3. **Poor organization**
   - Group related questions
   - Use logical ordering
   - Include clear navigation

## Related Resources

- [Schema.org FAQPage](https://schema.org/FAQPage)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data/faqpage)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
