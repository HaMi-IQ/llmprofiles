#!/usr/bin/env node

/**
 * ProfileDiscoveryAPI - Generates API data for LLM Profiles
 * Scans the profiles directory and creates discovery endpoints
 */

const fs = require('fs');
const path = require('path');

class ProfileDiscoveryAPI {
  constructor() {
    this.baseDir = path.join(__dirname, '..', '..');
    this.profilesDir = path.join(this.baseDir, 'profiles');
    this.webProfilesDir = path.join(this.baseDir, 'web', 'profiles');
    this.schemasDir = path.join(this.baseDir, 'schemas');
    this.baseUrl = 'https://llmprofiles.org';
  }

  /**
   * Get all profiles with their metadata
   */
  getAllProfiles() {
    const profiles = [];
    const categories = this.getCategories();

    for (const category of categories) {
      const categoryPath = path.join(this.profilesDir, category);
      if (!fs.existsSync(categoryPath)) continue;

      const profileTypes = fs.readdirSync(categoryPath).filter(item => {
        const itemPath = path.join(categoryPath, item);
        return fs.statSync(itemPath).isDirectory();
      });

      for (const profileType of profileTypes) {
        const profileData = this.getProfileData(category, profileType);
        if (profileData) {
          profiles.push(profileData);
        }
      }
    }

    return {
      "@context": {
        "@vocab": "https://llmprofiles.org/vocab#",
        "schema": "https://schema.org/"
      },
      "@type": "ProfileDiscovery",
      "name": "LLM Profiles Discovery API",
      "description": "Discovery endpoint for all available LLM profiles",
      "version": "1.0.0",
      "baseUrl": this.baseUrl,
      "totalProfiles": profiles.length,
      "lastUpdated": new Date().toISOString(),
      "profiles": profiles
    };
  }

  /**
   * Get capabilities summary
   */
  getCapabilitiesSummary() {
    const allProfiles = this.getAllProfiles();
    const capabilities = {
      totalProfiles: allProfiles.totalProfiles,
      categories: {},
      schemaTypes: new Set(),
      hasTrainingData: 0,
      hasPageSchema: 0,
      hasOutputSchema: 0
    };

    // Analyze capabilities
    for (const profile of allProfiles.profiles) {
      // Count by category
      if (!capabilities.categories[profile.category]) {
        capabilities.categories[profile.category] = 0;
      }
      capabilities.categories[profile.category]++;

      // Collect schema types
      if (profile.schemaType) {
        capabilities.schemaTypes.add(profile.schemaType);
      }

      // Count features
      if (profile.hasTrainingData) capabilities.hasTrainingData++;
      if (profile.hasPageSchema) capabilities.hasPageSchema++;
      if (profile.hasOutputSchema) capabilities.hasOutputSchema++;
    }

    return {
      "@context": {
        "@vocab": "https://llmprofiles.org/vocab#",
        "schema": "https://schema.org/"
      },
      "@type": "CapabilitiesSummary",
      "name": "LLM Profiles Capabilities Summary",
      "description": "Summary of available profile capabilities and features",
      "lastUpdated": new Date().toISOString(),
      "totalProfiles": capabilities.totalProfiles,
      "categoryCounts": capabilities.categories,
      "supportedSchemaTypes": Array.from(capabilities.schemaTypes).sort(),
      "featureCounts": {
        "trainingData": capabilities.hasTrainingData,
        "pageSchema": capabilities.hasPageSchema,
        "outputSchema": capabilities.hasOutputSchema
      }
    };
  }

  /**
   * Get API documentation
   */
  getAPIDocumentation() {
    return {
      "@context": {
        "@vocab": "https://llmprofiles.org/vocab#",
        "schema": "https://schema.org/"
      },
      "@type": "APIDocumentation",
      "name": "LLM Profiles API Documentation",
      "description": "Complete API documentation for LLM Profiles discovery and access",
      "version": "1.0.0",
      "baseUrl": this.baseUrl,
      "lastUpdated": new Date().toISOString(),
      "endpoints": {
        "discovery": {
          "path": "/api/discovery.json",
          "method": "GET",
          "description": "Get all available profiles with metadata",
          "response": {
            "type": "ProfileDiscovery",
            "contentType": "application/json"
          }
        },
        "capabilities": {
          "path": "/api/capabilities.json",
          "method": "GET",
          "description": "Get summary of profile capabilities",
          "response": {
            "type": "CapabilitiesSummary",
            "contentType": "application/json"
          }
        },
        "profileAccess": {
          "path": "/profiles/{category}/{type}/v1/index.jsonld",
          "method": "GET",
          "description": "Get specific profile definition",
          "parameters": {
            "category": "Profile category (business, content, interaction, technology)",
            "type": "Profile type (e.g., faqpage, article, product-offer)"
          },
          "response": {
            "type": "Profile",
            "contentType": "application/ld+json"
          }
        },
        "schemaAccess": {
          "path": "/profiles/{category}/{type}/v1/{schema}.schema.json",
          "method": "GET",
          "description": "Get profile validation schemas",
          "parameters": {
            "category": "Profile category",
            "type": "Profile type",
            "schema": "Schema type (page or output)"
          },
          "response": {
            "type": "JSONSchema",
            "contentType": "application/json"
          }
        }
      },
      "examples": {
        "getFAQProfile": `${this.baseUrl}/profiles/interaction/faqpage/v1/index.jsonld`,
        "getArticleSchema": `${this.baseUrl}/profiles/content/article/v1/page.schema.json`,
        "getAllProfiles": `${this.baseUrl}/api/discovery.json`
      }
    };
  }

  /**
   * Get profile categories
   */
  getCategories() {
    if (!fs.existsSync(this.profilesDir)) return [];
    
    return fs.readdirSync(this.profilesDir).filter(item => {
      const itemPath = path.join(this.profilesDir, item);
      return fs.statSync(itemPath).isDirectory() && item !== 'README.md';
    });
  }

  /**
   * Get detailed profile data
   */
  getProfileData(category, profileType) {
    const profilePath = path.join(this.profilesDir, category, profileType, 'v1');
    
    if (!fs.existsSync(profilePath)) return null;

    const profileData = {
      name: this.formatProfileName(profileType),
      type: profileType,
      category: category,
      version: "1.0.0",
      urls: {
        profile: `${this.baseUrl}/profiles/${category}/${profileType}/v1/index.jsonld`,
        documentation: `${this.baseUrl}/profiles/${category}/${profileType}/`
      },
      schemas: {},
      examples: {},
      hasTrainingData: false,
      hasPageSchema: false,
      hasOutputSchema: false
    };

    // Check for schemas
    const pageSchemaPath = path.join(profilePath, 'page.schema.json');
    const outputSchemaPath = path.join(profilePath, 'output.schema.json');
    
    if (fs.existsSync(pageSchemaPath)) {
      profileData.schemas.page = `${this.baseUrl}/profiles/${category}/${profileType}/v1/page.schema.json`;
      profileData.hasPageSchema = true;
    }
    
    if (fs.existsSync(outputSchemaPath)) {
      profileData.schemas.output = `${this.baseUrl}/profiles/${category}/${profileType}/v1/output.schema.json`;
      profileData.hasOutputSchema = true;
    }

    // Check for training data
    const trainingPath = path.join(profilePath, 'training.jsonl');
    if (fs.existsSync(trainingPath)) {
      profileData.trainingData = `${this.baseUrl}/profiles/${category}/${profileType}/v1/training.jsonl`;
      profileData.hasTrainingData = true;
    }

    // Check for examples
    const examplesPath = path.join(profilePath, 'examples');
    if (fs.existsSync(examplesPath)) {
      const exampleFiles = fs.readdirSync(examplesPath).filter(f => f.endsWith('.jsonld'));
      for (const example of exampleFiles) {
        const exampleName = path.basename(example, '.jsonld');
        profileData.examples[exampleName] = `${this.baseUrl}/profiles/${category}/${profileType}/v1/examples/${example}`;
      }
    }

    // Try to extract schema type from profile definition
    try {
      const profileDefPath = path.join(profilePath, 'index.jsonld');
      if (fs.existsSync(profileDefPath)) {
        const profileDef = JSON.parse(fs.readFileSync(profileDefPath, 'utf8'));
        if (profileDef.schemaType) {
          profileData.schemaType = profileDef.schemaType;
        } else if (profileDef['@type']) {
          profileData.schemaType = profileDef['@type'];
        }
      }
    } catch (error) {
      // Continue without schema type if parsing fails
    }

    // Add description if available
    profileData.description = this.getProfileDescription(profileType);

    return profileData;
  }

  /**
   * Format profile name for display
   */
  formatProfileName(profileType) {
    return profileType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get profile description
   */
  getProfileDescription(profileType) {
    const descriptions = {
      'faqpage': 'Frequently Asked Questions page with structured Q&A content',
      'qapage': 'Question and Answer page for community-driven content',
      'article': 'News articles, blog posts, and editorial content',
      'product-offer': 'E-commerce product listings and commercial offers',
      'event': 'Events, conferences, and scheduled activities',
      'course': 'Educational courses and learning materials',
      'book': 'Books, publications, and written works',
      'dataset': 'Data collections and research datasets',
      'jobposting': 'Job listings and employment opportunities',
      'localbusiness': 'Local business listings and directory entries',
      'softwareapplication': 'Software applications and digital tools',
      'review': 'User reviews and rating content',
      'recipe': 'Cooking recipes and food preparation instructions',
      'howto': 'Step-by-step instructional guides',
      'videoobject': 'Video content and multimedia presentations'
    };

    return descriptions[profileType] || `Structured data profile for ${this.formatProfileName(profileType)}`;
  }
}

module.exports = ProfileDiscoveryAPI;
