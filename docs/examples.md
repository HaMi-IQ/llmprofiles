# llmprofiles Usage Examples

This document provides practical examples of how to use llmprofiles in various scenarios and programming languages.

## Table of Contents

- [Basic Usage](#basic-usage)
- [FAQPage Examples](#faqpage-examples)
- [Content Extraction](#content-extraction)
- [Validation Examples](#validation-examples)
- [Integration Examples](#integration-examples)
- [Error Handling](#error-handling)

## Basic Usage

### Fetching the Registry

```javascript
// JavaScript/Node.js
async function getRegistry() {
  const response = await fetch('https://llmprofiles.org/index.json');
  const registry = await response.json();
  console.log('Available profiles:', Object.keys(registry.profiles));
  return registry;
}
```

```python
# Python
import requests

def get_registry():
    response = requests.get('https://llmprofiles.org/index.json')
    registry = response.json()
    print('Available profiles:', list(registry['profiles'].keys()))
    return registry
```

```bash
# cURL
curl https://llmprofiles.org/index.json | jq '.profiles'
```

### Fetching a Profile

```javascript
async function getProfile(profileName, version = 'v1') {
  const response = await fetch(`https://llmprofiles.org/${profileName}/${version}`);
  const profile = await response.json();
  return profile;
}

// Usage
const faqProfile = await getProfile('faqpage');
console.log('Profile definition:', faqProfile['skos:definition']);
```

## FAQPage Examples

### Creating FAQ Content

```javascript
async function createFAQContent() {
  // Fetch the profile definition
  const profile = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld');
  const profileData = await profile.json();
  
  // Create FAQ content using the profile context
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
      },
      {
        "@type": "Question",
        "name": "How do I use llmprofiles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can fetch profile definitions from the API and use them to structure your content according to the defined schemas."
        }
      }
    ]
  };
  
  return faqContent;
}
```

### Extracting FAQ Data

```javascript
async function extractFAQData(htmlContent) {
  // Fetch the output schema
  const schemaResponse = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Simulate content extraction (in real usage, you'd parse HTML)
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

### Python Example

```python
import requests
import json
from datetime import datetime
from jsonschema import validate

class LLMProfilesFAQ:
    def __init__(self):
        self.base_url = 'https://llmprofiles.org'
    
    def get_profile(self):
        response = requests.get(f'{self.base_url}/faqpage/v1')
        return response.json()
    
    def get_schema(self):
        response = requests.get(f'{self.base_url}/faqpage/v1/output.schema.json')
        return response.json()
    
    def create_faq_content(self):
        profile = self.get_profile()
        
        faq_content = {
            "@context": profile["@context"],
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
        }
        
        return faq_content
    
    def extract_and_validate(self, html_content):
        schema = self.get_schema()
        
        # Simulate extraction
        extracted_data = {
            "faqs": [
                {
                    "id": "what-is-llmprofiles",
                    "question": "What is llmprofiles?",
                    "answer": "A registry of LLM-friendly structured data profiles.",
                    "url": "https://example.com/faq#what-is-llmprofiles",
                    "tags": ["introduction"],
                    "lastUpdated": datetime.now().isoformat()
                }
            ]
        }
        
        try:
            validate(instance=extracted_data, schema=schema)
            return extracted_data
        except Exception as e:
            print(f"Validation error: {e}")
            return None
```

## Content Extraction

### Web Scraping Integration

```javascript
// Using Puppeteer for web scraping
const puppeteer = require('puppeteer');

async function extractFAQsFromWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  
  // Fetch the FAQ profile schema
  const schemaResponse = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld/output.schema.json');
  const schema = await schemaResponse.json();
  
  // Extract FAQ content from the page
  const faqs = await page.evaluate(() => {
    const questions = Array.from(document.querySelectorAll('.faq-question'));
    return questions.map((q, index) => {
      const answer = q.nextElementSibling?.textContent || '';
      return {
        id: `faq-${index}`,
        question: q.textContent.trim(),
        answer: answer.trim(),
        url: window.location.href + `#faq-${index}`,
        tags: [],
        lastUpdated: new Date().toISOString()
      };
    });
  });
  
  const extractedData = { faqs };
  
  // Validate against schema
  const Ajv = require('ajv');
  const addFormats = require('ajv-formats');
  const ajv = new Ajv({strict: false, allErrors: true});
  addFormats(ajv);
  
  const validate = ajv.compile(schema);
  const isValid = validate(extractedData);
  
  await browser.close();
  
  return isValid ? extractedData : null;
}
```

### Content Management System Integration

```javascript
// WordPress plugin example
class LLMProfilesWordPress {
  constructor() {
    this.baseUrl = 'https://llmprofiles.org';
  }
  
  async getFAQProfile() {
    const response = await fetch(`${this.baseUrl}/faqpage/v1`);
    return response.json();
  }
  
  async createFAQPost(faqData) {
    const profile = await this.getFAQProfile();
    
    // Create structured data for WordPress
    const structuredData = {
      "@context": profile["@context"],
      "@type": "FAQPage",
      "mainEntity": faqData.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    // Add to WordPress post
    const postContent = `
      <script type="application/ld+json">
        ${JSON.stringify(structuredData, null, 2)}
      </script>
      
      ${faqData.faqs.map(faq => `
        <div class="faq-item" id="${faq.id}">
          <h3 class="faq-question">${faq.question}</h3>
          <div class="faq-answer">${faq.answer}</div>
        </div>
      `).join('')}
    `;
    
    return postContent;
  }
}
```

## Validation Examples

### Client-Side Validation

```javascript
class LLMProfilesValidator {
  constructor() {
    this.ajv = new Ajv({strict: false, allErrors: true});
    addFormats(this.ajv);
  }
  
  async validateContent(profileName, version, content) {
    try {
      const schemaResponse = await fetch(
        `https://llmprofiles.org/${profileName}/${version}/output.schema.json`
      );
      const schema = await schemaResponse.json();
      
      const validate = this.ajv.compile(schema);
      const isValid = validate(content);
      
      return {
        isValid,
        errors: validate.errors || [],
        schema
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{ message: error.message }],
        schema: null
      };
    }
  }
  
  async validateFAQContent(content) {
    return this.validateContent('faqpage', 'v1', content);
  }
}

// Usage
const validator = new LLMProfilesValidator();
const result = await validator.validateFAQContent({
  faqs: [
    {
      question: "Test question?",
      answer: "Test answer."
    }
  ]
});

if (result.isValid) {
  console.log('Content is valid!');
} else {
  console.log('Validation errors:', result.errors);
}
```

### Server-Side Validation

```python
# Flask API example
from flask import Flask, request, jsonify
import requests
from jsonschema import validate, ValidationError

app = Flask(__name__)

class LLMProfilesValidator:
    def __init__(self):
        self.base_url = 'https://llmprofiles.org'
    
    def get_schema(self, profile, version='v1'):
        response = requests.get(f'{self.base_url}/{profile}/{version}/output.schema.json')
        return response.json()
    
    def validate_content(self, profile, version, content):
        try:
            schema = self.get_schema(profile, version)
            validate(instance=content, schema=schema)
            return {'valid': True, 'errors': []}
        except ValidationError as e:
            return {'valid': False, 'errors': [str(e)]}
        except Exception as e:
            return {'valid': False, 'errors': [f'Unexpected error: {str(e)}']}

validator = LLMProfilesValidator()

@app.route('/validate/<profile>/<version>', methods=['POST'])
def validate_content(profile, version):
    content = request.json
    
    if not content:
        return jsonify({'error': 'No content provided'}), 400
    
    result = validator.validate_content(profile, version, content)
    
    if result['valid']:
        return jsonify({'valid': True, 'message': 'Content is valid'})
    else:
        return jsonify({
            'valid': False,
            'errors': result['errors']
        }), 400

if __name__ == '__main__':
    app.run(debug=True)
```

## Integration Examples

### React Component

```jsx
import React, { useState, useEffect } from 'react';

const LLMProfilesFAQ = () => {
  const [profile, setProfile] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('https://llmprofiles.org/faqpage/v1/index.jsonld');
      const profileData = await response.json();
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFAQ = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const generateStructuredData = () => {
    if (!profile) return null;

    return {
      "@context": profile["@context"],
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>FAQ Builder</h2>
      <button onClick={addFAQ}>Add FAQ</button>
      
      {faqs.map((faq, index) => (
        <div key={index}>
          <input
            placeholder="Question"
            value={faq.question}
            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
          />
          <textarea
            placeholder="Answer"
            value={faq.answer}
            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
          />
        </div>
      ))}
      
      {faqs.length > 0 && (
        <div>
          <h3>Generated Structured Data:</h3>
          <pre>{JSON.stringify(generateStructuredData(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LLMProfilesFAQ;
```

## Error Handling

### Comprehensive Error Handling

```javascript
class LLMProfilesClient {
  constructor(baseUrl = 'https://llmprofiles.org') {
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to llmprofiles API');
      }
      
      if (error.message.includes('404')) {
        throw new Error('Profile not found. Check the profile name and version.');
      }
      
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async getProfile(profile, version = 'v1') {
    return this.makeRequest(`/${profile}/${version}`);
  }

  async getSchema(profile, version = 'v1') {
    return this.makeRequest(`/${profile}/${version}/output.schema.json`);
  }

  async validateContent(profile, version, content) {
    try {
      const schema = await this.getSchema(profile, version);
      const Ajv = require('ajv');
      const addFormats = require('ajv-formats');
      const ajv = new Ajv({strict: false, allErrors: true});
      addFormats(ajv);
      
      const validate = ajv.compile(schema);
      const isValid = validate(content);
      
      return {
        isValid,
        errors: validate.errors || [],
        schema
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{ message: `Validation failed: ${error.message}` }],
        schema: null
      };
    }
  }
}

// Usage with error handling
async function example() {
  const client = new LLMProfilesClient();
  
  try {
    const profile = await client.getProfile('faqpage');
    console.log('Profile loaded:', profile['skos:prefLabel']);
    
    const validation = await client.validateContent('faqpage', 'v1', {
      faqs: [{ question: 'Test?', answer: 'Test.' }]
    });
    
    if (validation.isValid) {
      console.log('Content is valid!');
    } else {
      console.log('Validation errors:', validation.errors);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Best Practices Summary

1. **Always validate content** against the output schemas
2. **Handle errors gracefully** with proper error messages
3. **Cache profile definitions** to reduce API calls
4. **Use version numbers** explicitly in requests
5. **Follow the SHACL constraints** defined in profiles
6. **Implement rate limiting** in your applications
7. **Provide meaningful error messages** to users
8. **Test with real content** before production deployment

For more examples and use cases, check out the [API Documentation](api.md) and [Project README](../README.md).

