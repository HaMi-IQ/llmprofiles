#!/usr/bin/env node

/**
 * Build script for NPM package
 * Extracts minimal profile definitions from the main repository
 * and creates a production-ready NPM package
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class NPMPackageBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.packageDir = path.join(this.rootDir, 'npm-package');
    this.profilesDir = path.join(this.rootDir, 'profiles');
    this.outputProfilesDir = path.join(this.packageDir, 'profiles');
  }

  async build() {
    log('🚀 Building NPM package...', 'blue');
    
    try {
      // Ensure package directory exists
      this.ensureDirectories();
      
      // Extract and convert profile definitions
      await this.extractProfiles();
      
      // Update package version from main package.json
      await this.updatePackageVersion();
      
      // Validate the built package
      await this.validatePackage();
      
      log('✅ NPM package built successfully!', 'green');
      log(`📁 Package location: ${this.packageDir}`, 'blue');
      
    } catch (error) {
      log(`❌ Build failed: ${error.message}`, 'red');
      throw error;
    }
  }

  ensureDirectories() {
    const dirs = [
      this.packageDir,
      this.outputProfilesDir,
      path.join(this.packageDir, 'lib'),
      path.join(this.packageDir, 'types'),
      path.join(this.packageDir, 'examples'),
      path.join(this.packageDir, 'schemas')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async extractProfiles() {
    log('📋 Extracting profile definitions...', 'blue');
    
    const categories = ['business', 'content', 'interaction', 'technology'];
    const profileRegistry = {};
    let extractedCount = 0;

    for (const category of categories) {
      const categoryPath = path.join(this.profilesDir, category);
      if (!fs.existsSync(categoryPath)) {
        log(`⚠️  Category directory not found: ${category}`, 'yellow');
        continue;
      }

      const profileTypes = fs.readdirSync(categoryPath);
      
      for (const profileType of profileTypes) {
        const profilePath = path.join(categoryPath, profileType, 'v1');
        if (!fs.existsSync(profilePath)) {
          log(`⚠️  Profile v1 directory not found: ${category}/${profileType}`, 'yellow');
          continue;
        }

        try {
          const minimal = await this.extractMinimalProfile(profilePath, profileType, category);
          
          // Convert kebab-case to PascalCase for profile key
          const profileKey = this.toPascalCase(profileType);
          profileRegistry[profileKey] = minimal;
          
          extractedCount++;
          log(`  ✓ Extracted ${profileKey} (${category})`, 'green');
          
        } catch (error) {
          log(`  ❌ Failed to extract ${profileType}: ${error.message}`, 'red');
        }
      }
    }

    // Save profile registry
    const registryPath = path.join(this.outputProfilesDir, 'index.json');
    fs.writeFileSync(registryPath, JSON.stringify(profileRegistry, null, 2));
    
    log(`📊 Extracted ${extractedCount} profiles`, 'green');
  }

  async extractMinimalProfile(profilePath, profileType, category) {
    // Read the main profile definition
    const indexPath = path.join(profilePath, 'index.jsonld');
    const pageSchemaPath = path.join(profilePath, 'page.schema.json');
    const outputSchemaPath = path.join(profilePath, 'output.schema.json');

    if (!fs.existsSync(indexPath)) {
      throw new Error(`index.jsonld not found in ${profilePath}`);
    }

    const profileDef = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const pageSchema = fs.existsSync(pageSchemaPath) ? 
      JSON.parse(fs.readFileSync(pageSchemaPath, 'utf8')) : null;

    // Convert to minimal profile format
    const minimal = {
      type: this.toPascalCase(profileType),
      category: category,
      schemaType: profileDef['rdfs:seeAlso'] || `https://schema.org/${this.toPascalCase(profileType)}`,
      profileUrl: profileDef['@id'] || `https://llmprofiles.org/profiles/${category}/${profileType}/v1`,
      description: profileDef['skos:definition'] || `${this.toPascalCase(profileType)} structured data profile`,
      required: this.extractSchemaFields(pageSchema, true),
      recommended: this.extractSchemaFields(pageSchema, false),
      optional: {},
      googleRichResults: this.getGoogleRichResultsFields(profileType),
      llmOptimized: this.getLLMOptimizedFields(profileType)
    };

    return minimal;
  }

  extractSchemaFields(pageSchema, requiredOnly = true) {
    if (!pageSchema || !pageSchema.properties) {
      return {};
    }

    const fields = {};
    const required = pageSchema.required || [];

    Object.entries(pageSchema.properties).forEach(([fieldName, fieldDef]) => {
      const isRequired = required.includes(fieldName);
      
      if (requiredOnly && isRequired) {
        fields[fieldName] = this.simplifyFieldDefinition(fieldDef);
      } else if (!requiredOnly && !isRequired) {
        fields[fieldName] = this.simplifyFieldDefinition(fieldDef);
      }
    });

    return fields;
  }

  simplifyFieldDefinition(fieldDef) {
    // Simplify complex field definitions for minimal package
    if (fieldDef.const) {
      return { const: fieldDef.const };
    }
    
    if (fieldDef.type) {
      const simplified = { type: fieldDef.type };
      
      // Add important constraints
      if (fieldDef.minLength) simplified.minLength = fieldDef.minLength;
      if (fieldDef.maxLength) simplified.maxLength = fieldDef.maxLength;
      if (fieldDef.minimum) simplified.minimum = fieldDef.minimum;
      if (fieldDef.maximum) simplified.maximum = fieldDef.maximum;
      if (fieldDef.format) simplified.format = fieldDef.format;
      if (fieldDef.description) simplified.description = fieldDef.description;
      
      return simplified;
    }
    
    if (fieldDef.anyOf || fieldDef.oneOf) {
      return {
        anyOf: (fieldDef.anyOf || fieldDef.oneOf).map(def => this.simplifyFieldDefinition(def))
      };
    }
    
    return fieldDef;
  }

  getGoogleRichResultsFields(profileType) {
    // Define Google Rich Results required fields for each profile type
    const googleFields = {
      'article': ['headline', 'image', 'author', 'datePublished', 'publisher'],
      'jobposting': ['title', 'hiringOrganization', 'jobLocation', 'datePosted', 'description'],
      'localbusiness': ['name', 'address', 'telephone', 'openingHours', 'image'],
      'product-offer': ['name', 'image', 'offers', 'aggregateRating', 'brand'],
      'event': ['name', 'startDate', 'location', 'image', 'description'],
      'faqpage': ['mainEntity'],
      'softwareapplication': ['name', 'operatingSystem', 'applicationCategory', 'aggregateRating', 'offers'],
      'review': ['itemReviewed', 'author', 'reviewRating', 'reviewBody'],
      'recipe': ['name', 'image', 'author', 'datePublished', 'description'],
      'course': ['name', 'description', 'provider', 'offers'],
      'book': ['name', 'author', 'isbn', 'publisher'],
      'videoobject': ['name', 'description', 'thumbnailUrl', 'uploadDate'],
      'dataset': ['name', 'description', 'creator', 'distribution'],
      'howto': ['name', 'step', 'totalTime', 'tool'],
      'qapage': ['mainEntity']
    };

    return googleFields[profileType] || [];
  }

  getLLMOptimizedFields(profileType) {
    // Define LLM-optimized fields for each profile type
    const llmFields = {
      'article': ['headline', 'description', 'author', 'articleBody', 'keywords', 'datePublished'],
      'jobposting': ['title', 'description', 'hiringOrganization', 'jobLocation', 'requirements', 'skills'],
      'localbusiness': ['name', 'description', 'address', 'telephone', 'openingHours', 'geo'],
      'product-offer': ['name', 'description', 'brand', 'offers', 'sku', 'aggregateRating'],
      'event': ['name', 'description', 'startDate', 'endDate', 'location', 'organizer'],
      'faqpage': ['mainEntity', 'name', 'description'],
      'softwareapplication': ['name', 'description', 'applicationCategory', 'operatingSystem', 'offers'],
      'review': ['itemReviewed', 'author', 'reviewRating', 'reviewBody', 'datePublished'],
      'recipe': ['name', 'description', 'recipeIngredient', 'recipeInstructions', 'cookTime'],
      'course': ['name', 'description', 'coursePrerequisites', 'educationalCredentialAwarded'],
      'book': ['name', 'author', 'description', 'genre', 'numberOfPages'],
      'videoobject': ['name', 'description', 'duration', 'transcript'],
      'dataset': ['name', 'description', 'variableMeasured', 'spatialCoverage'],
      'howto': ['name', 'description', 'step', 'tool', 'supply'],
      'qapage': ['mainEntity', 'name', 'description']
    };

    return llmFields[profileType] || [];
  }

  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  async updatePackageVersion() {
    log('📦 Updating package version...', 'blue');
    
    const mainPackagePath = path.join(this.rootDir, 'package.json');
    const npmPackagePath = path.join(this.packageDir, 'package.json');
    
    if (fs.existsSync(mainPackagePath) && fs.existsSync(npmPackagePath)) {
      const mainPackage = JSON.parse(fs.readFileSync(mainPackagePath, 'utf8'));
      const npmPackage = JSON.parse(fs.readFileSync(npmPackagePath, 'utf8'));
      
      // Update version to match main package
      npmPackage.version = mainPackage.version;
      
      fs.writeFileSync(npmPackagePath, JSON.stringify(npmPackage, null, 2));
      log(`  ✓ Updated to version ${npmPackage.version}`, 'green');
    }
  }

  async validatePackage() {
    log('🔍 Validating package...', 'blue');
    
    const packageJsonPath = path.join(this.packageDir, 'package.json');
    const indexJsPath = path.join(this.packageDir, 'index.js');
    const profilesIndexPath = path.join(this.outputProfilesDir, 'index.json');
    
    // Check required files exist
    const requiredFiles = [
      packageJsonPath,
      indexJsPath,
      profilesIndexPath,
      path.join(this.packageDir, 'lib', 'validator.js'),
      path.join(this.packageDir, 'lib', 'builder.js'),
      path.join(this.packageDir, 'types', 'index.d.ts'),
      path.join(this.packageDir, 'README.md')
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file missing: ${path.relative(this.packageDir, file)}`);
      }
    }

    // Validate package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.name || !packageJson.version || !packageJson.main) {
      throw new Error('Invalid package.json: missing required fields');
    }

    // Validate profiles
    const profiles = JSON.parse(fs.readFileSync(profilesIndexPath, 'utf8'));
    const profileCount = Object.keys(profiles).length;
    
    if (profileCount === 0) {
      throw new Error('No profiles found in package');
    }

    log(`  ✓ Package validation passed`, 'green');
    log(`  ✓ ${profileCount} profiles included`, 'green');
    
    // Calculate package size
    const packageSize = this.calculateDirectorySize(this.packageDir);
    log(`  ✓ Package size: ${(packageSize / 1024).toFixed(1)}KB`, 'green');
  }

  calculateDirectorySize(dir) {
    let size = 0;
    
    function addSize(filePath) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => addSize(path.join(filePath, file)));
      } else {
        size += stats.size;
      }
    }
    
    addSize(dir);
    return size;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node build-npm-package.js [options]

Options:
  --help, -h     Show this help message
  --verbose, -v  Show detailed output

Examples:
  node scripts/build-npm-package.js
  node scripts/build-npm-package.js --verbose
    `);
    process.exit(0);
  }

  try {
    const builder = new NPMPackageBuilder();
    await builder.build();
    
    log('', 'green');
    log('🎉 NPM package is ready for publishing!', 'green');
    log('', 'green');
    log('Next steps:', 'blue');
    log('1. cd npm-package', 'blue');
    log('2. npm publish', 'blue');
    
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { NPMPackageBuilder };

