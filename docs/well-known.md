# Well-Known LLM Profiles Discovery

The `/.well-known/llmprofiles.json` endpoint enables publishers to declare their LLM Profiles usage and training data locations for auto-discovery by aggregators and partners.

## Overview

By placing a `llmprofiles.json` file at `/.well-known/llmprofiles.json` on your domain, you can:

- **Declare which profiles** you're using
- **Point to your training data** exports
- **Enable auto-discovery** by aggregators and partners
- **Provide metadata** about your structured data implementation

## File Location

```
https://yourdomain.com/.well-known/llmprofiles.json
```

## Schema

```json
{
  "@context": {
    "@vocab": "https://llmprofiles.org/vocab#",
    "schema": "https://schema.org/"
  },
  "@type": "LLMProfilesDeclaration",
  "publisher": {
    "@type": "Organization",
    "name": "Your Organization Name",
    "url": "https://yourdomain.com"
  },
  "version": "1.0.0",
  "lastUpdated": "2025-08-28T10:00:00Z",
  "profiles": [
    {
      "type": "FAQPage",
      "version": "v1",
      "profileUrl": "https://llmprofiles.org/faqpage/v1",
      "page": "https://yourdomain.com/faq",
      "training": "https://yourdomain.com/data/faq.training.jsonl",
      "description": "FAQ page with Q&A content"
    }
  ],
  "capabilities": {
    "totalProfiles": 1,
    "hasTrainingData": true,
    "hasPageSchemas": true,
    "hasOutputSchemas": true,
    "hasExamples": true
  },
  "endpoints": {
    "discovery": "https://llmprofiles.org/api/discovery.json",
    "capabilities": "https://llmprofiles.org/api/capabilities.json",
    "docs": "https://llmprofiles.org/api/docs.json"
  },
  "contact": {
    "email": "structured-data@yourdomain.com",
    "support": "https://yourdomain.com/support/structured-data"
  }
}
```

## Profile Declaration

Each profile in the `profiles` array should include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Profile type (e.g., "FAQPage", "Article") |
| `version` | string | ✅ | Profile version (e.g., "v1") |
| `profileUrl` | string | ✅ | Canonical profile URL |
| `page` | string | ✅ | URL to your page using this profile |
| `training` | string | ❌ | URL to your training data export |
| `description` | string | ❌ | Brief description of usage |

## Example Implementations

### Minimal Example

```json
{
  "@context": {
    "@vocab": "https://llmprofiles.org/vocab#"
  },
  "@type": "LLMProfilesDeclaration",
  "publisher": {
    "@type": "Organization",
    "name": "My Company",
    "url": "https://mycompany.com"
  },
  "profiles": [
    {
      "type": "FAQPage",
      "version": "v1",
      "profileUrl": "https://llmprofiles.org/faqpage/v1",
      "page": "https://mycompany.com/faq"
    }
  ]
}
```

### Complete Example

```json
{
  "@context": {
    "@vocab": "https://llmprofiles.org/vocab#",
    "schema": "https://schema.org/"
  },
  "@type": "LLMProfilesDeclaration",
  "publisher": {
    "@type": "Organization",
    "name": "Tech Blog",
    "url": "https://techblog.com"
  },
  "version": "1.0.0",
  "lastUpdated": "2025-08-28T10:00:00Z",
  "profiles": [
    {
      "type": "Article",
      "version": "v1",
      "profileUrl": "https://llmprofiles.org/article/v1",
      "page": "https://techblog.com/blog",
      "training": "https://techblog.com/api/articles.training.jsonl",
      "description": "Technical blog articles"
    },
    {
      "type": "FAQPage",
      "version": "v1",
      "profileUrl": "https://llmprofiles.org/faqpage/v1",
      "page": "https://techblog.com/faq",
      "training": "https://techblog.com/api/faq.training.jsonl",
      "description": "Frequently asked questions"
    }
  ],
  "capabilities": {
    "totalProfiles": 2,
    "hasTrainingData": true,
    "hasPageSchemas": true,
    "hasOutputSchemas": true,
    "hasExamples": true
  },
  "contact": {
    "email": "data@techblog.com"
  }
}
```

## Discovery Process

Aggregators and partners can discover your LLM Profiles usage by:

1. **Fetching the well-known file:**
   ```bash
   curl https://yourdomain.com/.well-known/llmprofiles.json
   ```

2. **Parsing the declaration:**
   ```javascript
   const declaration = await fetch('https://yourdomain.com/.well-known/llmprofiles.json');
   const data = await declaration.json();
   
   // Get all profiles
   const profiles = data.profiles;
   
   // Get training data URLs
   const trainingUrls = profiles
     .filter(p => p.training)
     .map(p => p.training);
   ```

3. **Validating against schemas:**
   ```javascript
   // Validate each profile against its schema
   for (const profile of data.profiles) {
     const schemaUrl = `${profile.profileUrl}/page.schema.json`;
     const schema = await fetch(schemaUrl);
     // Validate your content against the schema
   }
   ```

## Benefits

### For Publishers

- **Own your data** - Declare your training data exports
- **Partner discovery** - Let aggregators find your content
- **Future-proof** - Versioned profiles ensure stability
- **Operational** - Machine-readable declarations

### For Aggregators

- **Auto-discovery** - Find publishers programmatically
- **Standardized access** - Consistent API across publishers
- **Training data** - Access to publisher-owned exports
- **Validation** - Ensure content meets profile requirements

### For Partners

- **Integration** - Easy to integrate with your content
- **Quality assurance** - Validate content before processing
- **Scalability** - Discover new publishers automatically
- **Compliance** - Ensure adherence to profile specifications

## Implementation Guide

### 1. Create the File

Create `/.well-known/llmprofiles.json` on your domain:

```bash
mkdir -p .well-known
touch .well-known/llmprofiles.json
```

### 2. Add Your Declaration

Add your profile declarations to the file:

```json
{
  "@context": {
    "@vocab": "https://llmprofiles.org/vocab#"
  },
  "@type": "LLMProfilesDeclaration",
  "publisher": {
    "@type": "Organization",
    "name": "Your Company",
    "url": "https://yourdomain.com"
  },
  "profiles": [
    {
      "type": "FAQPage",
      "version": "v1",
      "profileUrl": "https://llmprofiles.org/faqpage/v1",
      "page": "https://yourdomain.com/faq"
    }
  ]
}
```

### 3. Deploy

Deploy the file to your web server at `/.well-known/llmprofiles.json`.

### 4. Test

Test that the file is accessible:

```bash
curl https://yourdomain.com/.well-known/llmprofiles.json
```

### 5. Validate

Validate your declaration against the schema:

```bash
# Validate JSON syntax
node scripts/validate-json.js

# Validate against profile schemas
for profile in $(jq -r '.profiles[].type' .well-known/llmprofiles.json); do
  echo "Validating $profile..."
  # Add your validation logic here
done
```

## Best Practices

### 1. Keep It Updated

- Update `lastUpdated` when you modify your declaration
- Add new profiles as you implement them
- Remove profiles you no longer use

### 2. Provide Training Data

- Include `training` URLs when possible
- Ensure training data is publicly accessible
- Use consistent naming conventions

### 3. Be Specific

- Use accurate `page` URLs
- Provide meaningful `description` fields
- Include contact information

### 4. Validate Regularly

- Test your declaration periodically
- Ensure all URLs are accessible
- Validate against profile schemas

## Integration Examples

### Discovery Script

```javascript
async function discoverPublishers(domains) {
  const publishers = [];
  
  for (const domain of domains) {
    try {
      const response = await fetch(`https://${domain}/.well-known/llmprofiles.json`);
      if (response.ok) {
        const declaration = await response.json();
        publishers.push({
          domain,
          declaration,
          profiles: declaration.profiles.length
        });
      }
    } catch (error) {
      console.log(`No LLM Profiles declaration found for ${domain}`);
    }
  }
  
  return publishers;
}

// Usage
const domains = ['example.com', 'techblog.com', 'newsite.com'];
const publishers = await discoverPublishers(domains);
console.log(`Found ${publishers.length} publishers using LLM Profiles`);
```

### Training Data Aggregator

```javascript
async function aggregateTrainingData(declaration) {
  const trainingData = [];
  
  for (const profile of declaration.profiles) {
    if (profile.training) {
      try {
        const response = await fetch(profile.training);
        if (response.ok) {
          const data = await response.text();
          trainingData.push({
            profile: profile.type,
            publisher: declaration.publisher.name,
            data: data
          });
        }
      } catch (error) {
        console.log(`Failed to fetch training data for ${profile.type}`);
      }
    }
  }
  
  return trainingData;
}
```

## Support

For questions about the well-known endpoint:

- **Documentation**: [API Documentation](https://llmprofiles.org/api/docs.json)
- **Examples**: [Usage Examples](https://llmprofiles.org/docs/examples.md)
- **Issues**: [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HaMi-IQ/llmprofiles/discussions)
