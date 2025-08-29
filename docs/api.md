# llmprofiles API Documentation

## Overview

The llmprofiles API provides access to LLM-friendly structured data profiles and their associated schemas. All endpoints return JSON-LD or JSON Schema documents that can be used for content validation and extraction.

**Base URL:** `https://llmprofiles.org`

## Authentication

Currently, all endpoints are publicly accessible and do not require authentication.

## Rate Limiting

- **Rate Limit:** 100 requests per minute per IP
- **Headers:** Rate limit information is included in response headers

## Endpoints

### 1. Registry Endpoint

**GET** `/index.json`

Returns the complete profile registry with all available profiles and their versions.

#### Response

```json
{
  "profiles": {
    "FAQPage": {
      "profile": "https://llmprofiles.org/faqpage/v1/index.jsonld",
      "pageSchema": "https://llmprofiles.org/faqpage/v1/index.jsonld/page.schema.json",
      "outputSchema": "https://llmprofiles.org/faqpage/v1/index.jsonld/output.schema.json",
      "training": "https://llmprofiles.org/faqpage/v1/index.jsonld/training.jsonl",
      "examples": {
        "minimal": "https://llmprofiles.org/faqpage/v1/index.jsonld/examples/minimal.jsonld",
        "rich": "https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld"
      }
    },
    "QAPage": "https://llmprofiles.org/qapage/v1",
    "Article": "https://llmprofiles.org/article/v1",
    "ProductOffer": "https://llmprofiles.org/product-offer/v1",
    "Event": "https://llmprofiles.org/event/v1",
    "Course": "https://llmprofiles.org/course/v1",
    "JobPosting": "https://llmprofiles.org/jobposting/v1",
    "LocalBusiness": "https://llmprofiles.org/localbusiness/v1",
    "SoftwareApplication": "https://llmprofiles.org/softwareapplication/v1",
    "Review": "https://llmprofiles.org/review/v1"
  }
}
```

#### Example

```bash
curl https://llmprofiles.org/index.json
```

### 2. Profile Definition Endpoint

**GET** `/{profile}/{version}`

Returns the JSON-LD profile definition with context, constraints, and metadata.

#### Parameters

- `profile` (string, required): Profile name (e.g., `faqpage`, `article`)
- `version` (string, required): Version number (e.g., `v1`, `v2`)

#### Response Format

```json
{
  "@context": {
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "sh": "http://www.w3.org/ns/shacl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "x": "https://llmprofiles.org/vocab#"
  },
  "@id": "https://llmprofiles.org/{profile}/{version}",
  "rdfs:seeAlso": "https://schema.org/{SchemaType}",
  "skos:prefLabel": "Profile Name",
  "skos:definition": "Profile description",
  "skos:scopeNote": "Usage scope and limitations",
  "skos:example": "Example usage",
  "x:dos": ["Best practices"],
  "x:donts": ["Anti-patterns"],
  "sh:shapesGraph": {
    "@type": "sh:NodeShape",
    "sh:targetClass": "schema:{SchemaType}",
    "sh:property": []
  },
  "x:outputSchema": "https://llmprofiles.org/{profile}/{version}/output.schema.json",
  "x:profileVersion": "1.0.0",
  "x:created": "2025-08-28"
}
```

#### Example

```bash
curl https://llmprofiles.org/faqpage/v1/index.jsonld
```

### 3. Output Schema Endpoint

**GET** `/{profile}/{version}/output.schema.json`

Returns the JSON Schema for validating extracted content from the profile.

#### Parameters

- `profile` (string, required): Profile name
- `version` (string, required): Version number

#### Response Format

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://llmprofiles.org/{profile}/{version}/output.schema.json",
  "title": "Profile Extracted Content",
  "type": "object",
  "properties": {
    // Profile-specific properties
  },
  "required": [],
  "additionalProperties": false
}
```

#### Example

```bash
curl https://llmprofiles.org/faqpage/v1/index.jsonld/output.schema.json
```

### 4. Page Schema Endpoint (Enhanced Profiles)

**GET** `/{profile}/{version}/page.schema.json`

Returns the JSON Schema for validating on-page JSON-LD markup (available for enhanced profiles).

#### Parameters

- `profile` (string, required): Profile name
- `version` (string, required): Version number

#### Response Format

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://llmprofiles.org/{profile}/{version}/page.schema.json",
  "title": "Profile On-Page JSON-LD",
  "type": "object",
  "properties": {
    // Schema.org markup validation rules
  },
  "required": [],
  "additionalProperties": true
}
```

#### Example

```bash
curl https://llmprofiles.org/faqpage/v1/index.jsonld/page.schema.json
```

### 5. Training Data Endpoint (Enhanced Profiles)

**GET** `/{profile}/{version}/training.jsonl`

Returns training data in JSONL format for LLM fine-tuning (available for enhanced profiles).

#### Parameters

- `profile` (string, required): Profile name
- `version` (string, required): Version number

#### Response Format

```jsonl
{"type":"faq","id":"example-1","lang":"en","question":"Example question?","answer":"Example answer.","source_iri":"https://example.com/faq#1","topic":["topic1","topic2"],"faqpage_version":"v1"}
{"type":"faq","id":"example-2","lang":"en","question":"Another question?","answer":"Another answer.","source_iri":"https://example.com/faq#2","topic":["topic3"],"faqpage_version":"v1"}
```

#### Example

```bash
curl https://llmprofiles.org/faqpage/v1/index.jsonld/training.jsonl
```

### 6. Examples Endpoint (Enhanced Profiles)

**GET** `/{profile}/{version}/examples/{type}.jsonld`

Returns implementation examples for the profile (available for enhanced profiles).

#### Parameters

- `profile` (string, required): Profile name
- `version` (string, required): Version number
- `type` (string, required): Example type (e.g., "minimal", "rich")

#### Example

```bash
curl https://llmprofiles.org/faqpage/v1/index.jsonld/examples/minimal.jsonld
curl https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld
```

## Profile-Specific Documentation

### FAQPage Profile (Enhanced)

**Endpoint:** `/faqpage/v1`

#### Enhanced Features

The FAQPage profile is enhanced with additional resources:

- **Page Schema:** Validates on-page JSON-LD markup
- **Training Data:** JSONL format for LLM fine-tuning
- **Examples:** Minimal and rich implementation examples

#### Usage Example

```javascript
// Fetch profile definition
const profile = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld');
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
        "text": "A registry of LLM-friendly structured data profiles."
      }
    }
  ]
};

// Validate against page schema (on-page markup)
const pageSchema = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/page.schema.json');
const pageSchemaData = await pageSchema.json();

// Validate against output schema (extracted content)
const outputSchema = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/output.schema.json');
const outputSchemaData = await outputSchema.json();

// Get training data for LLM fine-tuning
const trainingData = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/training.jsonl');
const trainingText = await trainingData.text();

// Get implementation examples
const minimalExample = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/examples/minimal.jsonld');
const richExample = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld');
```

#### Page Schema (On-Page JSON-LD)

The FAQPage page schema validates Schema.org markup:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "en",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The answer text"
      }
    }
  ]
}
```

#### Output Schema (Extracted Content)

The FAQPage output schema expects:

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

#### Training Data Format

The training data is provided in JSONL format:

```jsonl
{"type":"faq","id":"llmp-what","lang":"en","question":"What is LLM Profiles?","answer":"LLM Profiles is a public registry...","source_iri":"https://llmprofiles.org/faq#what","topic":["llmprofiles","AEO"],"faqpage_version":"v1"}
```

## Error Responses

### 404 Not Found

```json
{
  "error": "Profile not found",
  "message": "The requested profile 'invalid-profile' was not found",
  "available_profiles": ["faqpage", "article", "event"]
}
```

### 400 Bad Request

```json
{
  "error": "Invalid version format",
  "message": "Version must be in format 'v{number}' (e.g., 'v1', 'v2')"
}
```

### 429 Too Many Requests

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 60 seconds.",
  "retry_after": 60
}
```

## HTTP Status Codes

- `200 OK`: Successful response
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Profile or version not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Response Headers

```
Content-Type: application/ld+json
Cache-Control: public, max-age=3600
ETag: "abc123"
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Caching

All responses include appropriate cache headers. Clients should cache responses for at least 1 hour.

## Content Negotiation

The API supports content negotiation for different formats:

- `Accept: application/ld+json` (default)
- `Accept: application/json`
- `Accept: application/schema+json` (for schema endpoints)

## SDKs and Libraries

### JavaScript/Node.js

```javascript
class LLMProfilesClient {
  constructor(baseUrl = 'https://llmprofiles.org') {
    this.baseUrl = baseUrl;
  }

  async getRegistry() {
    const response = await fetch(`${this.baseUrl}/index.json`);
    return response.json();
  }

  async getProfile(profile, version = 'v1') {
    const response = await fetch(`${this.baseUrl}/${profile}/${version}`);
    return response.json();
  }

  async getSchema(profile, version = 'v1') {
    const response = await fetch(`${this.baseUrl}/${profile}/${version}/output.schema.json`);
    return response.json();
  }
}
```

### Python

```python
import requests

class LLMProfilesClient:
    def __init__(self, base_url='https://llmprofiles.org'):
        self.base_url = base_url
    
    def get_registry(self):
        response = requests.get(f'{self.base_url}/index.json')
        return response.json()
    
    def get_profile(self, profile, version='v1'):
        response = requests.get(f'{self.base_url}/{profile}/{version}')
        return response.json()
    
    def get_schema(self, profile, version='v1'):
        response = requests.get(f'{self.base_url}/{profile}/{version}/output.schema.json')
        return response.json()
```

## Best Practices

1. **Cache Responses**: Use appropriate caching to reduce API calls
2. **Handle Errors**: Always handle 404 and rate limit errors gracefully
3. **Validate Content**: Use the output schemas to validate extracted content
4. **Follow Constraints**: Adhere to the SHACL constraints in profile definitions
5. **Version Management**: Always specify version numbers in requests

## Support

For API support and questions:

- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
- **Documentation:** [Project README](../README.md)
- **Examples:** [Usage Examples](examples.md)

## Testing Endpoints

### External Testing Tools

While llmprofiles doesn't provide its own testing endpoints, you can use these external services to validate your structured data:

#### 1. Google Rich Results Test

**URL:** https://search.google.com/test/rich-results

Test your JSON-LD markup to see if it's eligible for Google's rich results.

**Usage:**
1. Go to https://search.google.com/test/rich-results
2. Enter your URL or paste your JSON-LD code
3. Click "Test URL" or "Test Code"
4. Review the results for rich result eligibility

**Example with llmprofiles:**
```bash
# Get FAQPage example and test it
curl https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld | \
  curl -X POST https://search.google.com/test/rich-results/api/validate \
  -H "Content-Type: application/json" \
  -d @-
```

#### 2. Schema.org Validator

**URL:** https://validator.schema.org/

Validate your structured data against Schema.org vocabulary.

**Usage:**
1. Go to https://validator.schema.org/
2. Enter your URL or paste your JSON-LD code
3. Click "Go" to validate
4. Review validation results and suggestions

**API Endpoint:**
```bash
# Validate JSON-LD against Schema.org
curl -X POST https://validator.schema.org/validate \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/page-with-structured-data"
  }'
```

#### 3. Google Structured Data Testing Tool (Legacy)

**URL:** https://search.google.com/structured-data/testing-tool

**Note:** This tool is deprecated but still functional for basic validation.

#### 4. JSON-LD Playground

**URL:** https://json-ld.org/playground/

Test and debug your JSON-LD markup with interactive visualization.

**Usage:**
1. Go to https://json-ld.org/playground/
2. Paste your JSON-LD code
3. View the expanded, compacted, and flattened forms
4. Check for syntax errors and context resolution

### Testing Workflow

#### Step 1: Get Profile Example
```bash
# Get a working example from llmprofiles
curl https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld
```

#### Step 2: Test with Google Rich Results
```bash
# Test the example with Google Rich Results Test
curl -X POST https://search.google.com/test/rich-results/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "'$(curl -s https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld | jq -c .)'"
  }'
```

#### Step 3: Validate with Schema.org
```bash
# Validate with Schema.org validator
curl -X POST https://validator.schema.org/validate \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld"
  }'
```

#### Step 4: Check JSON-LD Syntax
```bash
# Test JSON-LD syntax and expansion
curl -X POST https://json-ld.org/playground/api/expand \
  -H "Content-Type: application/json" \
  -d '{
    "input": "'$(curl -s https://llmprofiles.org/faqpage/v1/index.jsonld/examples/rich.jsonld | jq -c .)'"
  }'
```

### Automated Testing Script

Here's a script to automate testing with multiple validators:

```javascript
class LLMProfilesTester {
  constructor() {
    this.baseUrl = 'https://llmprofiles.org';
  }

  async getProfileExample(profile, version = 'v1', type = 'rich') {
    const response = await fetch(`${this.baseUrl}/${profile}/${version}/examples/${type}.jsonld`);
    return response.json();
  }

  async testWithGoogleRichResults(jsonld) {
    try {
      const response = await fetch('https://search.google.com/test/rich-results/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: JSON.stringify(jsonld) })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async testWithSchemaOrg(jsonld) {
    try {
      const response = await fetch('https://validator.schema.org/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: JSON.stringify(jsonld) })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async runFullTest(profile, version = 'v1') {
    console.log(`Testing ${profile} profile...`);
    
    // Get example
    const example = await this.getProfileExample(profile, version);
    console.log('✓ Got profile example');
    
    // Test with Google Rich Results
    const googleResults = await this.testWithGoogleRichResults(example);
    console.log('Google Rich Results:', googleResults);
    
    // Test with Schema.org
    const schemaResults = await this.testWithSchemaOrg(example);
    console.log('Schema.org Validation:', schemaResults);
    
    return {
      profile,
      example,
      googleResults,
      schemaResults
    };
  }
}

// Usage
const tester = new LLMProfilesTester();
tester.runFullTest('faqpage', 'v1').then(results => {
  console.log('Test completed:', results);
});
```

### Python Testing Script

```python
import requests
import json

class LLMProfilesTester:
    def __init__(self):
        self.base_url = 'https://llmprofiles.org'
    
    def get_profile_example(self, profile, version='v1', example_type='rich'):
        url = f'{self.base_url}/{profile}/{version}/examples/{example_type}.jsonld'
        response = requests.get(url)
        return response.json()
    
    def test_with_google_rich_results(self, jsonld_data):
        try:
            url = 'https://search.google.com/test/rich-results/api/validate'
            payload = {'code': json.dumps(jsonld_data)}
            response = requests.post(url, json=payload)
            return response.json()
        except Exception as e:
            return {'error': str(e)}
    
    def test_with_schema_org(self, jsonld_data):
        try:
            url = 'https://validator.schema.org/validate'
            payload = {'code': json.dumps(jsonld_data)}
            response = requests.post(url, json=payload)
            return response.json()
        except Exception as e:
            return {'error': str(e)}
    
    def run_full_test(self, profile, version='v1'):
        print(f'Testing {profile} profile...')
        
        # Get example
        example = self.get_profile_example(profile, version)
        print('✓ Got profile example')
        
        # Test with Google Rich Results
        google_results = self.test_with_google_rich_results(example)
        print('Google Rich Results:', google_results)
        
        # Test with Schema.org
        schema_results = self.test_with_schema_org(example)
        print('Schema.org Validation:', schema_results)
        
        return {
            'profile': profile,
            'example': example,
            'google_results': google_results,
            'schema_results': schema_results
        }

# Usage
tester = LLMProfilesTester()
results = tester.run_full_test('faqpage', 'v1')
print('Test completed:', results)
```

### Testing Checklist

When testing your structured data with llmprofiles:

- [ ] **Get profile definition** from llmprofiles API
- [ ] **Use profile examples** as starting templates
- [ ] **Test with Google Rich Results Test** for rich result eligibility
- [ ] **Validate with Schema.org validator** for vocabulary compliance
- [ ] **Check JSON-LD syntax** with JSON-LD Playground
- [ ] **Verify context resolution** and property mapping
- [ ] **Test with real content** from your website
- [ ] **Monitor search console** for rich result performance

### Common Testing Issues

1. **Missing required properties** - Check profile SHACL constraints
2. **Invalid property values** - Verify data types and formats
3. **Context resolution errors** - Ensure all namespaces are defined
4. **Rich result ineligibility** - Review Google's rich result guidelines
5. **Schema.org validation errors** - Check vocabulary compliance

### Support

For testing-related issues:

- **Google Rich Results:** [Google Search Central](https://developers.google.com/search/docs)
- **Schema.org:** [Schema.org Documentation](https://schema.org/docs/)
- **JSON-LD:** [JSON-LD Specification](https://json-ld.org/)
- **llmprofiles Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
