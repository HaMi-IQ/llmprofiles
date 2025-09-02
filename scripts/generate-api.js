#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ProfileDiscoveryAPI = require('../web/api/discovery');

// Initialize API
const api = new ProfileDiscoveryAPI();

// Create API directory in web/dist
const apiDir = path.join(__dirname, '..', 'web', 'dist', 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

console.log('🚀 Generating static API files...');

// Generate discovery.json
try {
  const discovery = api.getAllProfiles();
  fs.writeFileSync(path.join(apiDir, 'discovery.json'), JSON.stringify(discovery, null, 2));
  console.log('✅ Generated api/discovery.json');
} catch (error) {
  console.error('❌ Failed to generate discovery.json:', error.message);
}

// Generate capabilities.json
try {
  const capabilities = api.getCapabilitiesSummary();
  fs.writeFileSync(path.join(apiDir, 'capabilities.json'), JSON.stringify(capabilities, null, 2));
  console.log('✅ Generated api/capabilities.json');
} catch (error) {
  console.error('❌ Failed to generate capabilities.json:', error.message);
}

// Generate docs.json
try {
  const docs = api.getAPIDocumentation();
  fs.writeFileSync(path.join(apiDir, 'docs.json'), JSON.stringify(docs, null, 2));
  console.log('✅ Generated api/docs.json');
} catch (error) {
  console.error('❌ Failed to generate docs.json:', error.message);
}

// Generate individual profile files
try {
  const allProfiles = api.getAllProfiles();
  allProfiles.profiles.forEach(profile => {
    const profileName = profile.name.toLowerCase();
    const profileFile = path.join(apiDir, `profile-${profileName}.json`);
    fs.writeFileSync(profileFile, JSON.stringify(profile, null, 2));
    console.log(`✅ Generated api/profile-${profileName}.json`);
  });
} catch (error) {
  console.error('❌ Failed to generate profile files:', error.message);
}

// Generate search examples
try {
  const searchExamples = {
    "@context": {
      "@vocab": "https://llmprofiles.org/vocab#",
      "schema": "https://schema.org/"
    },
    "@type": "SearchExamples",
    "examples": [
      {
        "name": "FAQ Search",
        "description": "Search for FAQ-related profiles",
        "url": "https://llmprofiles.org/api/search.json?q=faq&hasPageSchema=true",
        "query": "faq",
        "filters": { "hasPageSchema": true }
      },
      {
        "name": "E-commerce Search",
        "description": "Search for e-commerce related profiles",
        "url": "https://llmprofiles.org/api/search.json?q=e-commerce&hasTrainingData=true",
        "query": "e-commerce",
        "filters": { "hasTrainingData": true }
      },
      {
        "name": "Article Search",
        "description": "Search for article and content profiles",
        "url": "https://llmprofiles.org/api/search.json?q=article&schemaType=Article",
        "query": "article",
        "filters": { "schemaType": "Article" }
      }
    ]
  };
  
  fs.writeFileSync(path.join(apiDir, 'search-examples.json'), JSON.stringify(searchExamples, null, 2));
  console.log('✅ Generated api/search-examples.json');
} catch (error) {
  console.error('❌ Failed to generate search examples:', error.message);
}

// Generate recommendations examples
try {
  const recommendationExamples = {
    "@context": {
      "@vocab": "https://llmprofiles.org/vocab#",
      "schema": "https://schema.org/"
    },
    "@type": "RecommendationExamples",
    "examples": [
      {
        "name": "E-commerce Recommendations",
        "description": "Get profiles recommended for e-commerce use cases",
        "url": "https://llmprofiles.org/api/recommendations.json?useCase=e-commerce&limit=3",
        "useCase": "e-commerce",
        "limit": 3
      },
      {
        "name": "Content Management Recommendations",
        "description": "Get profiles recommended for content management",
        "url": "https://llmprofiles.org/api/recommendations.json?useCase=content+management&limit=5",
        "useCase": "content management",
        "limit": 5
      },
      {
        "name": "Local Business Recommendations",
        "description": "Get profiles recommended for local business",
        "url": "https://llmprofiles.org/api/recommendations.json?useCase=local+business&limit=3",
        "useCase": "local business",
        "limit": 3
      }
    ]
  };
  
  fs.writeFileSync(path.join(apiDir, 'recommendation-examples.json'), JSON.stringify(recommendationExamples, null, 2));
  console.log('✅ Generated api/recommendation-examples.json');
} catch (error) {
  console.error('❌ Failed to generate recommendation examples:', error.message);
}

// Generate API index
try {
  const apiIndex = {
    "@context": {
      "@vocab": "https://llmprofiles.org/vocab#",
      "schema": "https://schema.org/"
    },
    "@type": "APIIndex",
    "name": "LLM Profiles API Index",
    "description": "Index of all available API endpoints",
    "version": "1.0.0",
    "baseUrl": "https://llmprofiles.org/api",
    "endpoints": {
      "discovery": {
        "url": "/discovery.json",
        "description": "Get all available profiles with metadata",
        "method": "GET"
      },
      "capabilities": {
        "url": "/capabilities.json",
        "description": "Get summary of profile capabilities",
        "method": "GET"
      },
      "docs": {
        "url": "/docs.json",
        "description": "Get API documentation",
        "method": "GET"
      },
      "searchExamples": {
        "url": "/search-examples.json",
        "description": "Get search examples",
        "method": "GET"
      },
      "recommendationExamples": {
        "url": "/recommendation-examples.json",
        "description": "Get recommendation examples",
        "method": "GET"
      }
    },
    "profiles": [
      "profile-faqpage.json",
      "profile-qapage.json",
      "profile-article.json",
      "profile-product-offer.json",
      "profile-event.json",
      "profile-course.json",
      "profile-jobposting.json",
      "profile-localbusiness.json",
      "profile-softwareapplication.json",
      "profile-review.json"
    ],
    "lastUpdated": new Date().toISOString()
  };
  
  fs.writeFileSync(path.join(apiDir, 'index.json'), JSON.stringify(apiIndex, null, 2));
  console.log('✅ Generated api/index.json');
} catch (error) {
  console.error('❌ Failed to generate API index:', error.message);
}

console.log('\n🎉 Static API generation complete!');
console.log(`📁 API files generated in: ${apiDir}`);
console.log('🌐 Available endpoints:');
console.log('  - https://llmprofiles.org/api/discovery.json');
console.log('  - https://llmprofiles.org/api/capabilities.json');
console.log('  - https://llmprofiles.org/api/docs.json');
console.log('  - https://llmprofiles.org/api/index.json');
