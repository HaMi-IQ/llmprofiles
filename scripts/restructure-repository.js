#!/usr/bin/env node

/**
 * Repository Restructuring Script
 * Migrates from flat structure to organized, scalable structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RepositoryRestructurer {
  constructor() {
    this.rootDir = process.cwd();
    this.profilesDir = path.join(this.rootDir, 'profiles');
    this.schemasDir = path.join(this.rootDir, 'schemas');
    this.examplesDir = path.join(this.rootDir, 'examples');
    this.trainingDir = path.join(this.rootDir, 'training');
    
    // Profile categorization
    this.profileCategories = {
      content: ['article', 'book', 'course', 'dataset', 'howto', 'recipe', 'videoobject'],
      business: ['localbusiness', 'jobposting', 'product-offer', 'review'],
      interaction: ['faqpage', 'qapage', 'event'],
      technology: ['softwareapplication']
    };
  }

  /**
   * Create new directory structure
   */
  createDirectoryStructure() {
    console.log('🏗️  Creating new directory structure...');
    
    const directories = [
      this.profilesDir,
      this.schemasDir,
      this.examplesDir,
      this.trainingDir,
      path.join(this.schemasDir, 'core'),
      path.join(this.schemasDir, 'extensions'),
      path.join(this.schemasDir, 'validators'),
      path.join(this.examplesDir, 'minimal'),
      path.join(this.examplesDir, 'rich'),
      path.join(this.examplesDir, 'edge-cases'),
      path.join(this.trainingDir, 'datasets'),
      path.join(this.trainingDir, 'combined')
    ];

    // Create profile category directories
    Object.keys(this.profileCategories).forEach(category => {
      directories.push(path.join(this.profilesDir, category));
    });

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      }
    });
  }

  /**
   * Move profiles to organized structure
   */
  moveProfiles() {
    console.log('\n📁 Moving profiles to organized structure...');
    
    Object.entries(this.profileCategories).forEach(([category, profiles]) => {
      profiles.forEach(profile => {
        const sourceDir = path.join(this.rootDir, profile);
        const targetDir = path.join(this.profilesDir, category, profile);
        
        if (fs.existsSync(sourceDir)) {
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // Move all contents
          this.moveDirectoryContents(sourceDir, targetDir);
          console.log(`✅ Moved ${profile} to profiles/${category}/`);
        }
      });
    });
  }

  /**
   * Move directory contents recursively
   */
  moveDirectoryContents(source, target) {
    if (!fs.existsSync(source)) return;
    
    const items = fs.readdirSync(source);
    
    items.forEach(item => {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
        }
        this.moveDirectoryContents(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
  }

  /**
   * Consolidate schemas
   */
  consolidateSchemas() {
    console.log('\n📋 Consolidating schemas...');
    
    const schemaFiles = [];
    
    // Find all schema files
    Object.values(this.profileCategories).flat().forEach(profile => {
      const profileDir = path.join(this.profilesDir, this.getProfileCategory(profile), profile);
      if (fs.existsSync(profileDir)) {
        this.findSchemaFiles(profileDir, schemaFiles);
      }
    });
    
    // Move schemas to centralized location
    schemaFiles.forEach(schemaFile => {
      const fileName = path.basename(schemaFile);
      const targetPath = path.join(this.schemasDir, 'extensions', fileName);
      
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(schemaFile, targetPath);
        console.log(`✅ Moved schema: ${fileName}`);
      }
    });
  }

  /**
   * Find schema files in directory
   */
  findSchemaFiles(dir, schemaFiles) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      
      if (fs.statSync(itemPath).isDirectory()) {
        this.findSchemaFiles(itemPath, schemaFiles);
      } else if (item.endsWith('.schema.json')) {
        schemaFiles.push(itemPath);
      }
    });
  }

  /**
   * Get profile category
   */
  getProfileCategory(profile) {
    for (const [category, profiles] of Object.entries(this.profileCategories)) {
      if (profiles.includes(profile)) {
        return category;
      }
    }
    return 'other';
  }

  /**
   * Consolidate examples
   */
  consolidateExamples() {
    console.log('\n💡 Consolidating examples...');
    
    const exampleFiles = [];
    
    // Find all example files
    Object.values(this.profileCategories).flat().forEach(profile => {
      const profileDir = path.join(this.profilesDir, this.getProfileCategory(profile), profile);
      if (fs.existsSync(profileDir)) {
        this.findExampleFiles(profileDir, exampleFiles);
      }
    });
    
    // Categorize and move examples
    exampleFiles.forEach(exampleFile => {
      const fileName = path.basename(exampleFile);
      const fileContent = fs.readFileSync(exampleFile, 'utf8');
      
      // Determine if minimal or rich example
      let targetCategory = 'minimal';
      if (fileContent.length > 2000 || fileContent.includes('"@context"')) {
        targetCategory = 'rich';
      }
      
      const targetPath = path.join(this.examplesDir, targetCategory, fileName);
      
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(exampleFile, targetPath);
        console.log(`✅ Moved example: ${fileName} to ${targetCategory}/`);
      }
    });
  }

  /**
   * Find example files in directory
   */
  findExampleFiles(dir, exampleFiles) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      
      if (fs.statSync(itemPath).isDirectory()) {
        this.findExampleFiles(itemPath, exampleFiles);
      } else if (item.endsWith('.jsonld') || item.endsWith('.json')) {
        exampleFiles.push(itemPath);
      }
    });
  }

  /**
   * Consolidate training data
   */
  consolidateTrainingData() {
    console.log('\n🎯 Consolidating training data...');
    
    const trainingFiles = [];
    
    // Find all training files
    Object.values(this.profileCategories).flat().forEach(profile => {
      const profileDir = path.join(this.profilesDir, this.getProfileCategory(profile), profile);
      if (fs.existsSync(profileDir)) {
        this.findTrainingFiles(profileDir, trainingFiles);
      }
    });
    
    // Move training files
    trainingFiles.forEach(trainingFile => {
      const fileName = path.basename(trainingFile);
      const profileName = this.getProfileFromPath(trainingFile);
      const targetPath = path.join(this.trainingDir, 'datasets', `${profileName}-${fileName}`);
      
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(trainingFile, targetPath);
        console.log(`✅ Moved training data: ${fileName} for ${profileName}`);
      }
    });
  }

  /**
   * Find training files in directory
   */
  findTrainingFiles(dir, trainingFiles) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      
      if (fs.statSync(itemPath).isDirectory()) {
        this.findTrainingFiles(itemPath, trainingFiles);
      } else if (item.endsWith('.jsonl') || item.endsWith('.json')) {
        trainingFiles.push(itemPath);
      }
    });
  }

  /**
   * Get profile name from file path
   */
  getProfileFromPath(filePath) {
    const parts = filePath.split(path.sep);
    const profileIndex = parts.findIndex(part => 
      Object.values(this.profileCategories).flat().includes(part)
    );
    return profileIndex !== -1 ? parts[profileIndex] : 'unknown';
  }

  /**
   * Update index.json with new structure
   */
  updateIndexFile() {
    console.log('\n📝 Updating index.json with new structure...');
    
    const indexPath = path.join(this.rootDir, 'index.json');
    if (fs.existsSync(indexPath)) {
      const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      
      // Update profile paths in the profiles object
      if (indexData.profiles && typeof indexData.profiles === 'object') {
        Object.keys(indexData.profiles).forEach(profileKey => {
          const profile = indexData.profiles[profileKey];
          
          // Update profile URL to use new structure
          if (profile.profile) {
            const profileName = this.getProfileNameFromUrl(profile.profile);
            const category = this.getProfileCategory(profileName);
            profile.profile = profile.profile.replace(
              `/${profileName}/`,
              `/profiles/${category}/${profileName}/`
            );
          }
          
          // Update page schema URL
          if (profile.pageSchema) {
            const profileName = this.getProfileNameFromUrl(profile.pageSchema);
            const category = this.getProfileCategory(profileName);
            profile.pageSchema = profile.pageSchema.replace(
              `/${profileName}/`,
              `/profiles/${category}/${profileName}/`
            );
          }
          
          // Update output schema URL
          if (profile.outputSchema) {
            const profileName = this.getProfileNameFromUrl(profile.outputSchema);
            const category = this.getProfileCategory(profileName);
            profile.outputSchema = profile.outputSchema.replace(
              `/${profileName}/`,
              `/profiles/${category}/${profileName}/`
            );
          }
          
          // Update training URL
          if (profile.training) {
            const profileName = this.getProfileNameFromUrl(profile.training);
            const category = this.getProfileCategory(profileName);
            profile.training = profile.training.replace(
              `/${profileName}/`,
              `/profiles/${category}/${profileName}/`
            );
          }
          
          // Update examples URLs
          if (profile.examples) {
            Object.keys(profile.examples).forEach(exampleKey => {
              const exampleUrl = profile.examples[exampleKey];
              const profileName = this.getProfileNameFromUrl(exampleUrl);
              const category = this.getProfileCategory(profileName);
              profile.examples[exampleKey] = exampleUrl.replace(
                `/${profileName}/`,
                `/profiles/${category}/${profileName}/`
              );
            });
          }
        });
      }
      
      // Add structure metadata
      indexData.structure = {
        version: '2.0.0',
        organization: 'categorized',
        categories: this.profileCategories,
        directories: {
          profiles: 'profiles/',
          schemas: 'schemas/',
          examples: 'examples/',
          training: 'training/',
          docs: 'docs/',
          api: 'api/'
        }
      };
      
      fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
      console.log('✅ Updated index.json with new structure');
    }
  }

  /**
   * Extract profile name from URL
   */
  getProfileNameFromUrl(url) {
    // Extract profile name from URL like https://llmprofiles.org/faqpage/v1/...
    const match = url.match(/https:\/\/llmprofiles\.org\/([^\/]+)\//);
    return match ? match[1] : 'unknown';
  }

  /**
   * Create new README files for organized structure
   */
  createStructureREADMEs() {
    console.log('\n📚 Creating structure documentation...');
    
    // Main profiles README
    const profilesReadme = `# LLM Profiles

This directory contains all profile definitions organized by category.

## Structure

- **content/**: Content-focused profiles (articles, books, courses, etc.)
- **business/**: Business-focused profiles (local businesses, jobs, products, etc.)
- **interaction/**: User interaction profiles (FAQs, Q&A, events, etc.)
- **technology/**: Technology profiles (software, applications, etc.)

## Adding New Profiles

1. Create a new directory in the appropriate category
2. Follow the standard profile structure:
   - \`index.jsonld\` - Profile definition
   - \`page.schema.json\` - Page validation schema
   - \`output.schema.json\` - Output validation schema
   - \`examples/\` - Implementation examples
   - \`training.jsonl\` - Training data

## Profile Categories

### Content Profiles
${this.profileCategories.content.map(p => `- \`${p}\` - ${this.getProfileDescription(p)}`).join('\n')}

### Business Profiles
${this.profileCategories.business.map(p => `- \`${p}\` - ${this.getProfileDescription(p)}`).join('\n')}

### Interaction Profiles
${this.profileCategories.interaction.map(p => `- \`${p}\` - ${this.getProfileDescription(p)}`).join('\n')}

### Technology Profiles
${this.profileCategories.technology.map(p => `- \`${p}\` - ${this.getProfileDescription(p)}`).join('\n')}
`;

    fs.writeFileSync(path.join(this.profilesDir, 'README.md'), profilesReadme);
    
    // Schemas README
    const schemasReadme = `# Schemas

This directory contains all validation schemas and extensions.

## Structure

- **core/**: Core schema definitions
- **extensions/**: Profile-specific schema extensions
- **validators/**: Validation utilities and tools

## Usage

Schemas are automatically loaded and validated during the build process.
`;

    fs.writeFileSync(path.join(this.schemasDir, 'README.md'), schemasReadme);
    
    // Examples README
    const examplesReadme = `# Examples

This directory contains implementation examples for all profiles.

## Structure

- **minimal/**: Minimal implementation examples
- **rich/**: Rich, feature-complete examples
- **edge-cases/**: Edge case and boundary examples

## Adding Examples

1. Place examples in the appropriate category
2. Use descriptive filenames
3. Include both minimal and rich implementations
4. Test examples with validation schemas
`;

    fs.writeFileSync(path.join(this.examplesDir, 'README.md'), examplesReadme);
    
    // Training README
    const trainingReadme = `# Training Data

This directory contains training datasets for LLM fine-tuning.

## Structure

- **datasets/**: Individual profile training datasets
- **combined/**: Combined training data for multiple profiles

## Usage

Training data is used for:
- LLM fine-tuning
- Validation testing
- Documentation generation
- Quality assurance
`;

    fs.writeFileSync(path.join(this.trainingDir, 'README.md'), trainingReadme);
    
    console.log('✅ Created structure documentation');
  }

  /**
   * Get profile description
   */
  getProfileDescription(profile) {
    const descriptions = {
      article: 'Article and blog post profiles',
      book: 'Book and publication profiles',
      course: 'Educational course profiles',
      dataset: 'Dataset and data collection profiles',
      howto: 'How-to guide profiles',
      recipe: 'Recipe and instruction profiles',
      videoobject: 'Video content profiles',
      localbusiness: 'Local business profiles',
      jobposting: 'Job posting profiles',
      'product-offer': 'Product offer profiles',
      review: 'Review and rating profiles',
      faqpage: 'FAQ page profiles',
      qapage: 'Q&A page profiles',
      event: 'Event profiles',
      softwareapplication: 'Software application profiles',
      software: 'Software profiles'
    };
    
    return descriptions[profile] || 'Profile for structured data';
  }

  /**
   * Update build scripts for new structure
   */
  updateBuildScripts() {
    console.log('\n🔧 Updating build scripts for new structure...');
    
    // Update package.json scripts
    const packagePath = path.join(this.rootDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      // Add new structure-related scripts
      packageData.scripts = packageData.scripts || {};
      packageData.scripts['build:profiles'] = 'node scripts/build-profiles.js';
      packageData.scripts['validate:structure'] = 'node scripts/validate-structure.js';
      packageData.scripts['migrate:structure'] = 'node scripts/restructure-repository.js';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
      console.log('✅ Updated package.json with new scripts');
    }
  }

  /**
   * Create migration backup
   */
  createBackup() {
    console.log('\nℹ️  Backup functionality removed as part of cleanup');
    console.log('   The repository has already been restructured and cleaned up.');
  }

  /**
   * Copy directory recursively
   */
  copyDirectory(source, target) {
    if (!fs.existsSync(source)) return;
    
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    
    const items = fs.readdirSync(source);
    
    items.forEach(item => {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    });
  }

  /**
   * Main execution method
   */
  async run(options = {}) {
    const { 
      dryRun = false,
      createBackup = true,
      updateScripts = true
    } = options;

    console.log('🚀 LLM Profiles Repository Restructuring');
    console.log('==========================================');
    console.log('');
    
    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made');
      console.log('');
    }

    try {
      if (createBackup && !dryRun) {
        this.createBackup();
      }

      if (!dryRun) {
        this.createDirectoryStructure();
        this.moveProfiles();
        this.consolidateSchemas();
        this.consolidateExamples();
        this.consolidateTrainingData();
        this.updateIndexFile();
        this.createStructureREADMEs();
        
        if (updateScripts) {
          this.updateBuildScripts();
        }
      }

      console.log('');
      console.log('🎉 Repository restructuring completed successfully!');
      console.log('');
      console.log('New structure created:');
      console.log('├── profiles/     - Organized profile definitions');
      console.log('├── schemas/      - Centralized schemas');
      console.log('├── examples/     - Consolidated examples');
      console.log('├── training/     - Training data');
      console.log('├── docs/         - Documentation');
      console.log('├── api/          - API endpoints');
      console.log('└── scripts/      - Build scripts');
      console.log('');
      console.log('Next steps:');
      console.log('1. Review the new structure');
      console.log('2. Update any hardcoded paths in your code');
      console.log('3. Test the build process');
      console.log('4. Remove old directories when ready');
      console.log('5. Update documentation references');

    } catch (error) {
      console.error('❌ Error during restructuring:', error.message);
      throw error;
    }
  }
}

// CLI execution
if (require.main === module) {
  const restructurer = new RepositoryRestructurer();
  
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--no-backup':
        options.createBackup = false;
        break;
      case '--no-scripts':
        options.updateScripts = false;
        break;
      case '--help':
        console.log(`
Usage: node restructure-repository.js [options]

Options:
  --dry-run        Show what would be done without making changes
  --no-backup      Don't create backup of current structure
  --no-scripts     Don't update build scripts
  --help           Show this help message

Examples:
  node restructure-repository.js --dry-run
  node restructure-repository.js --no-backup
        `);
        process.exit(0);
    }
  }
  
  restructurer.run(options).catch(error => {
    console.error('❌ Restructuring failed:', error.message);
    process.exit(1);
  });
}

module.exports = RepositoryRestructurer;
