# Profile Discovery API

The Profile Discovery API provides programmatic access to discover, search, and explore LLM-friendly structured data profiles. This API enables developers to integrate profile discovery into their applications and tools.

## Overview

The API is designed to be:
- **RESTful**: Simple HTTP GET requests
- **JSON-LD**: Structured data responses with semantic context
- **Static**: Served as static JSON files for high performance
- **CORS-enabled**: Accessible from web browsers and applications

## Base URL

```
https://llmprofiles.org/api/
```

## Endpoints

### 1. Discovery Endpoint

**GET** `/discovery.json`

Returns all available profiles with comprehensive metadata.

**Response:**
```json
{
  "@context": {
    "@vocab": "https://llmprofiles.org/vocab#",
    "schema": "https://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#"
  },
  "@type": "ProfileRegistry",
  "name": "LLM Profiles Registry",
  "description": "A comprehensive registry of LLM-friendly structured data profiles",
  "version": "1.0.0",
  "totalProfiles": 10,
  "lastUpdated": "2025-08-28T10:00:00Z",
  "profiles": [...]
}
```

**Example:**
```bash
curl https://llmprofiles.org/api/discovery.json
```

### 2. Capabilities Endpoint

**GET** `/capabilities.json`

Returns a summary of profile capabilities and statistics.

**Response:**
```json
{
  "@type": "ProfileCapabilities",
  "summary": {
    "totalProfiles": 10,
    "profilesWithPageSchema": 10,
    "profilesWithOutputSchema": 10,
    "profilesWithTrainingData": 10,
    "profilesWithExamples": 10
  },
  "schemaTypes": ["FAQPage", "QAPage", "Article", ...],
  "useCases": ["E-commerce", "Content Management", ...]
}
```

**Example:**
```bash
curl https://llmprofiles.org/api/capabilities.json
```

### 3. API Documentation

**GET** `/docs.json`

Returns comprehensive API documentation.

**Example:**
```bash
curl https://llmprofiles.org/api/docs.json
```

### 4. Individual Profile Endpoints

**GET** `/profile-{name}.json`

Returns detailed information about a specific profile.

**Available profiles:**
- `/profile-faqpage.json`
- `/profile-qapage.json`
- `/profile-article.json`
- `/profile-product-offer.json`
- `/profile-event.json`
- `/profile-course.json`
- `/profile-jobposting.json`
- `/profile-localbusiness.json`
- `/profile-softwareapplication.json`
- `/profile-review.json`
- `/profile-recipe.json`
- `/profile-howto.json`
- `/profile-videoobject.json`
- `/profile-book.json`
- `/profile-dataset.json`

**Example:**
```bash
curl https://llmprofiles.org/api/profile-faqpage.json
```

### 5. API Index

**GET** `/index.json`

Returns an index of all available API endpoints.

**Example:**
```bash
curl https://llmprofiles.org/api/index.json
```

## Profile Data Structure

Each profile in the API response includes:

```json
{
  "@type": "Profile",
  "name": "FAQPage",
  "description": "FAQ pages with Q&A pairs, training data, and implementation examples",
  "schemaType": "FAQPage",
  "version": "v1",
  "profileUrl": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld",
  "capabilities": {
    "pageSchema": true,
    "outputSchema": true,
    "trainingData": true,
    "examples": true
  },
  "endpoints": {
    "definition": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld",
    "pageSchema": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld/page.schema.json",
    "outputSchema": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld/output.schema.json",
    "training": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld/training.jsonl",
    "examples": {
      "minimal": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld/examples/minimal.jsonld",
      "rich": "https://llmprofiles.org/profiles/interaction/faqpage/v1/index.jsonld/examples/rich.jsonld"
    }
  },
  "useCases": [
    "Support/help pages with Q&A content",
    "Product documentation FAQs",
    "Service information pages"
  ]
}
```

## Usage Examples

### JavaScript

```javascript
// Get all profiles
async function getAllProfiles() {
  const response = await fetch('https://llmprofiles.org/api/discovery.json');
  const data = await response.json();
  return data.profiles;
}

// Get specific profile
async function getProfile(name) {
  const response = await fetch(`https://llmprofiles.org/api/profile-${name}.json`);
  return await response.json();
}

// Get capabilities summary
async function getCapabilities() {
  const response = await fetch('https://llmprofiles.org/api/capabilities.json');
  return await response.json();
}

// Example usage
getAllProfiles().then(profiles => {
  console.log('Available profiles:', profiles.map(p => p.name));
});

getProfile('faqpage').then(profile => {
  console.log('FAQPage capabilities:', profile.capabilities);
});
```

### Python

```python
import requests
import json

# Get all profiles
def get_all_profiles():
    response = requests.get('https://llmprofiles.org/api/discovery.json')
    return response.json()

# Get specific profile
def get_profile(name):
    response = requests.get(f'https://llmprofiles.org/api/profile-{name}.json')
    return response.json()

# Get capabilities
def get_capabilities():
    response = requests.get('https://llmprofiles.org/api/capabilities.json')
    return response.json()

# Example usage
profiles = get_all_profiles()
print(f"Total profiles: {profiles['totalProfiles']}")

faq_profile = get_profile('faqpage')
print(f"FAQPage use cases: {faq_profile['useCases']}")
```

### cURL

```bash
# Get all profiles
curl https://llmprofiles.org/api/discovery.json

# Get specific profile
curl https://llmprofiles.org/api/profile-faqpage.json

# Get capabilities
curl https://llmprofiles.org/api/capabilities.json

# Pretty print JSON
curl https://llmprofiles.org/api/discovery.json | jq '.profiles[0]'
```

## Integration Examples

### 1. Profile Selection Tool

```javascript
class ProfileSelector {
  constructor() {
    this.profiles = [];
  }

  async loadProfiles() {
    const response = await fetch('https://llmprofiles.org/api/discovery.json');
    const data = await response.json();
    this.profiles = data.profiles;
  }

  searchProfiles(query) {
    return this.profiles.filter(profile => 
      profile.name.toLowerCase().includes(query.toLowerCase()) ||
      profile.description.toLowerCase().includes(query.toLowerCase()) ||
      profile.useCases.some(useCase => 
        useCase.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  getProfilesByCapability(capability) {
    return this.profiles.filter(profile => 
      profile.capabilities[capability]
    );
  }

  getProfilesByUseCase(useCase) {
    return this.profiles.filter(profile => 
      profile.useCases.some(uc => 
        uc.toLowerCase().includes(useCase.toLowerCase())
      )
    );
  }
}

// Usage
const selector = new ProfileSelector();
await selector.loadProfiles();

const ecommerceProfiles = selector.getProfilesByUseCase('e-commerce');
const profilesWithTraining = selector.getProfilesByCapability('trainingData');
```

### 2. Profile Validation Tool

```javascript
class ProfileValidator {
  async validateProfile(profileName, content) {
    // Get profile schema
    const profile = await this.getProfile(profileName);
    const schemaUrl = profile.endpoints.outputSchema;
    
    // Fetch schema
    const schemaResponse = await fetch(schemaUrl);
    const schema = await schemaResponse.json();
    
    // Validate content against schema
    return this.validateAgainstSchema(content, schema);
  }

  async getProfile(name) {
    const response = await fetch(`https://llmprofiles.org/api/profile-${name}.json`);
    return await response.json();
  }

  validateAgainstSchema(content, schema) {
    // Implementation using JSON Schema validation library
    // e.g., ajv, jsonschema, etc.
  }
}
```

### 3. Profile Documentation Generator

```javascript
class DocumentationGenerator {
  async generateProfileDocs(profileName) {
    const profile = await this.getProfile(profileName);
    
    return {
      title: `${profile.name} Profile`,
      description: profile.description,
      capabilities: this.formatCapabilities(profile.capabilities),
      useCases: profile.useCases,
      endpoints: this.formatEndpoints(profile.endpoints),
      examples: await this.getExamples(profile.endpoints.examples)
    };
  }

  formatCapabilities(capabilities) {
    return Object.entries(capabilities)
      .filter(([_, available]) => available)
      .map(([capability, _]) => capability);
  }

  formatEndpoints(endpoints) {
    return Object.entries(endpoints)
      .map(([name, url]) => ({ name, url }));
  }

  async getExamples(examples) {
    const results = {};
    for (const [type, url] of Object.entries(examples)) {
      const response = await fetch(url);
      results[type] = await response.json();
    }
    return results;
  }
}
```

## Error Handling

The API returns standard HTTP status codes:

- **200**: Success
- **404**: Endpoint not found
- **500**: Server error

Error responses include:

```json
{
  "error": "Not found",
  "message": "The requested endpoint does not exist",
  "availableEndpoints": [...]
}
```

## Rate Limiting

Currently, no rate limiting is applied. However, we recommend:

- Caching responses when possible
- Using appropriate user agents
- Respecting robots.txt

## CORS Support

The API supports CORS for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

## Caching

API responses are static JSON files that can be cached:

- **Cache-Control**: Public, max-age=3600 (1 hour)
- **ETag**: Available for conditional requests
- **Last-Modified**: Available for conditional requests

## Versioning

The API version is included in the response:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-08-28T10:00:00Z"
}
```

## Support

For questions about the API:

- **Documentation**: [API Documentation](https://llmprofiles.org/api/docs.json)
- **Examples**: [Usage Examples](https://llmprofiles.org/docs/examples.md)
- **Issues**: [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HaMi-IQ/llmprofiles/discussions)

## Changelog

### v1.0.0 (2025-08-28)
- Initial API release
- Discovery endpoint
- Capabilities endpoint
- Individual profile endpoints
- API documentation endpoint
- CORS support
- Static JSON responses
