#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Profile discovery API endpoints
class ProfileDiscoveryAPI {
  constructor() {
    this.baseUrl = 'https://llmprofiles.org';
    this.profilesDir = path.join(__dirname, '..');
    this.registryPath = path.join(this.profilesDir, 'index.json');
  }

  // Get all available profiles with metadata
  getAllProfiles() {
    try {
      const registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      const profiles = [];
      
      Object.entries(registry.profiles).forEach(([name, profile]) => {
        const profileDir = path.join(this.profilesDir, name.toLowerCase());
        const profileInfo = this.getProfileInfo(name, profile, profileDir);
        profiles.push(profileInfo);
      });
      
      return {
        "@context": {
          "@vocab": "https://llmprofiles.org/vocab#",
          "schema": "https://schema.org/",
          "skos": "http://www.w3.org/2004/02/skos/core#"
        },
        "@type": "ProfileRegistry",
        "name": "LLM Profiles Registry",
        "description": "A comprehensive registry of LLM-friendly structured data profiles",
        "version": "1.0.0",
        "totalProfiles": profiles.length,
        "lastUpdated": new Date().toISOString(),
        "profiles": profiles
      };
    } catch (error) {
      throw new Error(`Failed to load profile registry: ${error.message}`);
    }
  }

  // Get specific profile information
  getProfileInfo(name, profile, profileDir) {
    const profileInfo = {
      "@type": "Profile",
      "name": name,
      "profileUrl": profile.profile,
      "version": "v1",
      "capabilities": {
        "pageSchema": !!profile.pageSchema,
        "outputSchema": !!profile.outputSchema,
        "trainingData": !!profile.training,
        "examples": !!profile.examples
      },
      "endpoints": {
        "definition": profile.profile,
        "pageSchema": profile.pageSchema,
        "outputSchema": profile.outputSchema,
        "training": profile.training,
        "examples": profile.examples
      }
    };

    // Add profile metadata if README exists
    const readmePath = path.join(profileDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      const metadata = this.extractProfileMetadata(readmeContent);
      Object.assign(profileInfo, metadata);
    }

    // Add schema information
    if (fs.existsSync(path.join(profileDir, 'v1', 'index.jsonld'))) {
      const schemaInfo = this.getSchemaInfo(path.join(profileDir, 'v1'));
      profileInfo.schema = schemaInfo;
    }

    return profileInfo;
  }

  // Extract metadata from README
  extractProfileMetadata(readmeContent) {
    const metadata = {};
    
    // Extract description
    const descMatch = readmeContent.match(/The \w+ profile provides a standardized way to structure ([^.]+)/);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
    }

    // Extract use cases
    const useCasesMatch = readmeContent.match(/## Use Cases\s*\n([\s\S]*?)(?=\n## |$)/);
    if (useCasesMatch) {
      const useCasesText = useCasesMatch[1];
      const useCases = useCasesText
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);
      metadata.useCases = useCases;
    }

    // Extract schema.org type
    const schemaMatch = readmeContent.match(/Schema\.org Type:\s*\[(\w+)\]\(https:\/\/schema\.org\/\w+\)/);
    if (schemaMatch) {
      metadata.schemaType = schemaMatch[1];
    }

    return metadata;
  }

  // Get schema information
  getSchemaInfo(profileV1Dir) {
    const schemaInfo = {};
    
    // Check for page schema
    const pageSchemaPath = path.join(profileV1Dir, 'page.schema.json');
    if (fs.existsSync(pageSchemaPath)) {
      const pageSchema = JSON.parse(fs.readFileSync(pageSchemaPath, 'utf8'));
      schemaInfo.pageSchema = {
        title: pageSchema.title,
        type: pageSchema.type,
        required: pageSchema.required || [],
        properties: Object.keys(pageSchema.properties || {}).length
      };
    }

    // Check for output schema
    const outputSchemaPath = path.join(profileV1Dir, 'output.schema.json');
    if (fs.existsSync(outputSchemaPath)) {
      const outputSchema = JSON.parse(fs.readFileSync(outputSchemaPath, 'utf8'));
      schemaInfo.outputSchema = {
        title: outputSchema.title,
        type: outputSchema.type,
        required: outputSchema.required || [],
        properties: Object.keys(outputSchema.properties || {}).length
      };
    }

    return schemaInfo;
  }

  // Search profiles by criteria
  searchProfiles(query, filters = {}) {
    const allProfiles = this.getAllProfiles();
    let results = allProfiles.profiles;

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(profile => 
        profile.name.toLowerCase().includes(searchTerm) ||
        (profile.description && profile.description.toLowerCase().includes(searchTerm)) ||
        (profile.useCases && profile.useCases.some(useCase => 
          useCase.toLowerCase().includes(searchTerm)
        ))
      );
    }

    // Filter by capabilities
    if (filters.hasPageSchema !== undefined) {
      results = results.filter(profile => 
        profile.capabilities.pageSchema === filters.hasPageSchema
      );
    }

    if (filters.hasTrainingData !== undefined) {
      results = results.filter(profile => 
        profile.capabilities.trainingData === filters.hasTrainingData
      );
    }

    if (filters.hasExamples !== undefined) {
      results = results.filter(profile => 
        profile.capabilities.examples === filters.hasExamples
      );
    }

    // Filter by schema type
    if (filters.schemaType) {
      results = results.filter(profile => 
        profile.schemaType === filters.schemaType
      );
    }

    return {
      "@context": allProfiles["@context"],
      "@type": "ProfileSearchResults",
      "query": query,
      "filters": filters,
      "totalResults": results.length,
      "results": results
    };
  }

  // Get profile capabilities summary
  getCapabilitiesSummary() {
    const allProfiles = this.getAllProfiles();
    const capabilities = {
      totalProfiles: allProfiles.totalProfiles,
      profilesWithPageSchema: 0,
      profilesWithOutputSchema: 0,
      profilesWithTrainingData: 0,
      profilesWithExamples: 0,
      schemaTypes: new Set(),
      useCases: new Set()
    };

    allProfiles.profiles.forEach(profile => {
      if (profile.capabilities.pageSchema) capabilities.profilesWithPageSchema++;
      if (profile.capabilities.outputSchema) capabilities.profilesWithOutputSchema++;
      if (profile.capabilities.trainingData) capabilities.profilesWithTrainingData++;
      if (profile.capabilities.examples) capabilities.profilesWithExamples++;
      
      if (profile.schemaType) capabilities.schemaTypes.add(profile.schemaType);
      if (profile.useCases) {
        profile.useCases.forEach(useCase => capabilities.useCases.add(useCase));
      }
    });

    return {
      "@context": allProfiles["@context"],
      "@type": "ProfileCapabilities",
      "summary": {
        totalProfiles: capabilities.totalProfiles,
        profilesWithPageSchema: capabilities.profilesWithPageSchema,
        profilesWithOutputSchema: capabilities.profilesWithOutputSchema,
        profilesWithTrainingData: capabilities.profilesWithTrainingData,
        profilesWithExamples: capabilities.profilesWithExamples
      },
      "schemaTypes": Array.from(capabilities.schemaTypes),
      "useCases": Array.from(capabilities.useCases),
      "lastUpdated": new Date().toISOString()
    };
  }

  // Get profile recommendations based on use case
  getRecommendations(useCase, limit = 5) {
    const allProfiles = this.getAllProfiles();
    const recommendations = [];

    allProfiles.profiles.forEach(profile => {
      if (profile.useCases) {
        const relevance = profile.useCases.filter(uc => 
          uc.toLowerCase().includes(useCase.toLowerCase())
        ).length;
        
        if (relevance > 0) {
          recommendations.push({
            profile: profile.name,
            relevance: relevance,
            useCases: profile.useCases,
            description: profile.description
          });
        }
      }
    });

    // Sort by relevance and limit results
    recommendations.sort((a, b) => b.relevance - a.relevance);
    recommendations.splice(limit);

    return {
      "@context": allProfiles["@context"],
      "@type": "ProfileRecommendations",
      "useCase": useCase,
      "recommendations": recommendations,
      "totalFound": recommendations.length
    };
  }

  // Get API documentation
  getAPIDocumentation() {
    return {
      "@context": {
        "@vocab": "https://llmprofiles.org/vocab#",
        "schema": "https://schema.org/"
      },
      "@type": "API",
      "name": "LLM Profiles Discovery API",
      "description": "API for discovering and exploring LLM-friendly structured data profiles",
      "version": "1.0.0",
      "baseUrl": this.baseUrl,
      "endpoints": {
        "discovery": {
          "url": "/api/discovery",
          "method": "GET",
          "description": "Get all available profiles with metadata",
          "response": "ProfileRegistry"
        },
        "search": {
          "url": "/api/discovery/search",
          "method": "GET",
          "description": "Search profiles by query and filters",
          "parameters": {
            "q": "Search query string",
            "hasPageSchema": "Filter by page schema availability (boolean)",
            "hasTrainingData": "Filter by training data availability (boolean)",
            "hasExamples": "Filter by examples availability (boolean)",
            "schemaType": "Filter by schema.org type"
          },
          "response": "ProfileSearchResults"
        },
        "capabilities": {
          "url": "/api/discovery/capabilities",
          "method": "GET",
          "description": "Get summary of profile capabilities",
          "response": "ProfileCapabilities"
        },
        "recommendations": {
          "url": "/api/discovery/recommendations",
          "method": "GET",
          "description": "Get profile recommendations for a use case",
          "parameters": {
            "useCase": "Use case description",
            "limit": "Maximum number of recommendations (default: 5)"
          },
          "response": "ProfileRecommendations"
        },
        "profile": {
          "url": "/api/discovery/profile/{name}",
          "method": "GET",
          "description": "Get detailed information about a specific profile",
          "parameters": {
            "name": "Profile name (e.g., faqpage, article)"
          },
          "response": "Profile"
        }
      },
      "examples": {
        "getAllProfiles": `${this.baseUrl}/api/discovery`,
        "searchProfiles": `${this.baseUrl}/api/discovery/search?q=faq&hasPageSchema=true`,
        "getCapabilities": `${this.baseUrl}/api/discovery/capabilities`,
        "getRecommendations": `${this.baseUrl}/api/discovery/recommendations?useCase=e-commerce&limit=3`,
        "getProfile": `${this.baseUrl}/api/discovery/profile/faqpage`
      }
    };
  }
}

module.exports = ProfileDiscoveryAPI;
