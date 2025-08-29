# QAPage Profile

The QAPage profile provides a standardized way to structure single question and answer content for LLM-friendly processing and semantic understanding.

## Overview

**Profile Version:** v1.0.0  
**Schema.org Type:** [QAPage](https://schema.org/QAPage)  
**Profile URL:** https://llmprofiles.org/qapage/v1  
**Page Schema:** https://llmprofiles.org/qapage/v1/page.schema.json  
**Output Schema:** https://llmprofiles.org/qapage/v1/output.schema.json  
**Training Data:** https://llmprofiles.org/qapage/v1/training.jsonl

## Use Cases

- Single question discussion threads
- Forum question pages
- Stack Overflow-style Q&A pages
- Reddit question posts
- Community discussion threads
- Expert Q&A sessions

## Structure

### JSON-LD Profile Definition

The profile defines the structure and constraints for single Q&A content:

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/qapage/v1",
  "rdfs:seeAlso": "https://schema.org/QAPage",
  "skos:prefLabel": "QA Page",
  "skos:definition": "A page containing a single question and its answers.",
  "skos:scopeNote": "For single question threads, not FAQ pages with multiple questions.",
  "skos:example": "Stack Overflow question page with one question and multiple answers.",
  "x:dos": [
    "Use schema:Question with schema:suggestedAnswer for multiple answers.",
    "Include schema:upvoteCount for answer ranking.",
    "Mark the best answer with schema:acceptedAnswer."
  ],
  "x:donts": [
    "Do not use for FAQ pages with multiple questions.",
    "Do not mix product offers or unrelated content.",
    "Do not use for general discussion without a clear question."
  ]
}
```

### Page Schema (On-Page JSON-LD)

The page schema validates the actual Schema.org markup on web pages:

```json
{
  "$id": "https://llmprofiles.org/qapage/v1/page.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "QAPage On-Page JSON-LD",
  "type": "object",
  "properties": {
    "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
    "@type": { "const": "QAPage" },
    "inLanguage": { "type": "string" },
    "mainEntity": {
      "type": "object",
      "properties": {
        "@type": { "const": "Question" },
        "name": { "type": "string", "minLength": 3 },
        "text": { "type": "string", "minLength": 1 },
        "dateCreated": { "type": "string", "format": "date-time" },
        "author": {
          "type": "object",
          "properties": {
            "@type": { "const": "Person" },
            "name": { "type": "string" }
          },
          "required": ["@type", "name"]
        },
        "answerCount": { "type": "integer", "minimum": 0 },
        "acceptedAnswer": {
          "type": "object",
          "properties": {
            "@type": { "const": "Answer" },
            "text": { "type": "string", "minLength": 1 },
            "dateCreated": { "type": "string", "format": "date-time" },
            "upvoteCount": { "type": "integer", "minimum": 0 },
            "author": {
              "type": "object",
              "properties": {
                "@type": { "const": "Person" },
                "name": { "type": "string" }
              },
              "required": ["@type", "name"]
            }
          },
          "required": ["@type", "text"]
        },
        "suggestedAnswer": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "@type": { "const": "Answer" },
              "text": { "type": "string", "minLength": 1 },
              "dateCreated": { "type": "string", "format": "date-time" },
              "upvoteCount": { "type": "integer", "minimum": 0 },
              "author": {
                "type": "object",
                "properties": {
                  "@type": { "const": "Person" },
                  "name": { "type": "string" }
                },
                "required": ["@type", "name"]
              }
            },
            "required": ["@type", "text"]
          }
        }
      },
      "required": ["@type", "name", "text"]
    }
  },
  "required": ["@type", "mainEntity"]
}
```

### Output Schema (Extracted Content)

The output schema defines the structure for extracted Q&A content:

```json
{
  "question": {
    "id": "question-id",
    "title": "What is the question title?",
    "text": "The full question text",
    "author": "Author Name",
    "dateCreated": "2025-08-28T10:00:00Z",
    "tags": ["tag1", "tag2"],
    "url": "https://example.com/question/123"
  },
  "answers": [
    {
      "id": "answer-id",
      "text": "The answer text",
      "author": "Author Name",
      "dateCreated": "2025-08-28T10:30:00Z",
      "upvoteCount": 42,
      "isAccepted": true,
      "url": "https://example.com/question/123#answer-456"
    }
  ]
}
```

### Training Data

The profile includes training data in JSONL format for LLM fine-tuning:

```jsonl
{"type":"qa","id":"llmp-how-to","lang":"en","question":"How do I implement LLM Profiles?","answer":"To implement LLM Profiles, first fetch the profile definition...","source_iri":"https://llmprofiles.org/qa#how-to","topic":["implementation","tutorial"],"qapage_version":"v1"}
```

### Implementation Examples

The profile provides both minimal and rich implementation examples:

- **Minimal Example:** Basic Q&A structure for quick implementation
- **Rich Example:** Full-featured Q&A with metadata, voting, and user information

## Usage Examples

### Basic Q&A Page

```html
<!DOCTYPE html>
<html>
<head>
  <title>How to implement LLM Profiles? - Q&A</title>
</head>
<body>
  <h1>How to implement LLM Profiles?</h1>
  
  <script type="application/ld+json">
  {
    "@context": "https://llmprofiles.org/qapage/v1",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": "How to implement LLM Profiles?",
      "text": "I'm building a web application and want to use LLM Profiles for structured data. What's the best way to get started?",
      "dateCreated": "2025-08-28T10:00:00Z",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "answerCount": 2,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start by fetching the profile definition from the registry, then implement the JSON-LD markup according to the schema.",
        "dateCreated": "2025-08-28T10:30:00Z",
        "upvoteCount": 15,
        "author": {
          "@type": "Person",
          "name": "Jane Smith"
        }
      }
    }
  }
  </script>
  
  <div class="question">
    <h2>How to implement LLM Profiles?</h2>
    <p>I'm building a web application and want to use LLM Profiles for structured data. What's the best way to get started?</p>
    <div class="meta">
      <span class="author">John Doe</span>
      <span class="date">August 28, 2025</span>
    </div>
  </div>
  
  <div class="answers">
    <div class="answer accepted">
      <p>Start by fetching the profile definition from the registry, then implement the JSON-LD markup according to the schema.</p>
      <div class="meta">
        <span class="author">Jane Smith</span>
        <span class="votes">15 votes</span>
        <span class="date">August 28, 2025</span>
      </div>
    </div>
  </div>
</body>
</html>
```

### JavaScript Implementation

```javascript
async function createQAPage() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/qapage/v1');
  const profileData = await profile.json();
  
  // Create Q&A content
  const qaContent = {
    "@context": profileData["@context"],
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": "What is the best way to validate JSON-LD?",
      "text": "I'm implementing structured data and want to ensure it's valid. What tools should I use?",
      "dateCreated": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "Developer"
      },
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use Google's Rich Results Test and Schema.org validator to check your JSON-LD markup.",
        "dateCreated": new Date().toISOString(),
        "upvoteCount": 10,
        "author": {
          "@type": "Person",
          "name": "Expert"
        }
      }
    }
  };
  
  return qaContent;
}
```

### Content Extraction

```javascript
async function extractQA(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/qapage/v1/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract Q&A data (simplified example)
  const extractedData = {
    "question": {
      "id": "how-to-validate",
      "title": "What is the best way to validate JSON-LD?",
      "text": "I'm implementing structured data and want to ensure it's valid.",
      "author": "Developer",
      "dateCreated": "2025-08-28T10:00:00Z",
      "tags": ["validation", "json-ld"],
      "url": "https://example.com/qa/how-to-validate"
    },
    "answers": [
      {
        "id": "answer-1",
        "text": "Use Google's Rich Results Test and Schema.org validator.",
        "author": "Expert",
        "dateCreated": "2025-08-28T10:30:00Z",
        "upvoteCount": 10,
        "isAccepted": true,
        "url": "https://example.com/qa/how-to-validate#answer-1"
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

1. **Write clear, specific questions**
   - Good: "How do I implement JSON-LD validation?"
   - Avoid: "Help with my website"

2. **Provide comprehensive answers**
   - Include step-by-step instructions
   - Use code examples when relevant
   - Explain the reasoning behind solutions

3. **Use proper question structure**
   - One main question per page
   - Clear question title and description
   - Relevant tags and categories

### Technical Guidelines

1. **Implement proper JSON-LD structure**
   - Include the profile context
   - Use correct Schema.org types
   - Include all required properties

2. **Handle multiple answers**
   - Use `suggestedAnswer` for additional answers
   - Mark the best answer with `acceptedAnswer`
   - Include voting/ranking information

3. **Include metadata**
   - Author information
   - Creation dates
   - Vote counts and rankings
   - Tags and categories

### SEO and Accessibility

1. **Use semantic HTML**
   - Proper heading hierarchy
   - Clear question and answer structure
   - Accessible markup for screen readers

2. **Include structured data**
   - Add JSON-LD to your pages
   - Test with Google's Rich Results Test
   - Monitor search console for issues

## Validation

### Schema Validation

```bash
# Validate against output schema
npx ajv validate -s qapage/v1/output.schema.json -d your-qa-data.json
```

### Manual Testing

1. **Check JSON-LD syntax**
   - Use online JSON-LD validators
   - Verify context resolution
   - Test with Schema.org validators

2. **Test content extraction**
   - Extract Q&A data from your pages
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

1. **Multiple questions on one page**
   - Use FAQPage for multiple questions
   - Keep QAPage for single questions
   - Separate questions into different pages

2. **Incomplete answers**
   - Ensure answers are comprehensive
   - Include necessary context
   - Provide actionable information

3. **Poor question structure**
   - Write clear, specific questions
   - Include relevant context
   - Use appropriate tags

## Related Resources

- [Schema.org QAPage](https://schema.org/QAPage)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data/qa)
- [JSON-LD Specification](https://json-ld.org/)
- [JSON Schema Documentation](https://json-schema.org/)

## Support

For questions about this profile:

- **Documentation:** [Project README](../../README.md)
- **Examples:** [Usage Examples](../../docs/examples.md)
- **API Reference:** [API Documentation](../../docs/api.md)
- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
