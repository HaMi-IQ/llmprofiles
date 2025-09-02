#!/usr/bin/env node

/**
 * Structure Validation Script
 * Validates the organized directory structure and reports issues
 */

const fs = require('fs');
const path = require('path');

class StructureValidator {
  constructor() {
    this.rootDir = process.cwd();
    this.expectedStructure = {
      profiles: {
        content: ['article', 'book', 'course', 'dataset', 'howto', 'recipe', 'videoobject'],
        business: ['localbusiness', 'jobposting', 'product-offer', 'review'],
        interaction: ['faqpage', 'qapage', 'event'],
        technology: ['softwareapplication']
      },
      schemas: ['core', 'extensions', 'validators'],
      examples: ['minimal', 'rich', 'edge-cases'],
      training: ['datasets', 'combined']
    };
    
    this.issues = [];
    this.warnings = [];
  }

  /**
   * Validate the entire structure
   */
  validateStructure() {
    console.log('🔍 Validating repository structure...');
    console.log('=====================================');
    console.log('');

    this.validateProfiles();
    this.validateSchemas();
    this.validateExamples();
    this.validateTraining();
    this.validateRequiredFiles();
    this.validateIndexFile();

    this.printReport();
  }

  /**
   * Validate profile organization
   */
  validateProfiles() {
    console.log('📁 Validating profiles...');
    
    const profilesDir = path.join(this.rootDir, 'profiles');
    
    if (!fs.existsSync(profilesDir)) {
      this.issues.push('profiles/ directory does not exist');
      return;
    }

    Object.entries(this.expectedStructure.profiles).forEach(([category, expectedProfiles]) => {
      const categoryDir = path.join(profilesDir, category);
      
      if (!fs.existsSync(categoryDir)) {
        this.issues.push(`profiles/${category}/ directory does not exist`);
        return;
      }

      const actualProfiles = fs.readdirSync(categoryDir).filter(item => 
        fs.statSync(path.join(categoryDir, item)).isDirectory()
      );

      expectedProfiles.forEach(expectedProfile => {
        const profileDir = path.join(categoryDir, expectedProfile);
        
        if (!fs.existsSync(profileDir)) {
          this.issues.push(`Profile ${expectedProfile} not found in profiles/${category}/`);
        } else {
          this.validateProfileStructure(profileDir, expectedProfile, category);
        }
      });

      // Check for unexpected profiles
      actualProfiles.forEach(actualProfile => {
        if (!expectedProfiles.includes(actualProfile)) {
          this.warnings.push(`Unexpected profile ${actualProfile} found in profiles/${category}/`);
        }
      });
    });
  }

  /**
   * Validate individual profile structure
   */
  validateProfileStructure(profileDir, profileName, category) {
    const requiredFiles = ['index.jsonld', 'page.schema.json', 'output.schema.json'];
    const requiredDirs = ['examples'];
    
    // Check if v1 subdirectory exists and contains the files
    const v1Dir = path.join(profileDir, 'v1');
    if (!fs.existsSync(v1Dir)) {
      this.issues.push(`v1/ directory missing in profiles/${category}/${profileName}/`);
      return;
    }
    
    requiredFiles.forEach(file => {
      const filePath = path.join(v1Dir, file);
      if (!fs.existsSync(filePath)) {
        this.issues.push(`Required file ${file} missing in profiles/${category}/${profileName}/v1/`);
      }
    });

    requiredDirs.forEach(dir => {
      const dirPath = path.join(v1Dir, dir);
      if (!fs.existsSync(dirPath)) {
        this.issues.push(`Required directory ${dir}/ missing in profiles/${category}/${profileName}/v1/`);
      }
    });

    // Check for training data
    const trainingFile = path.join(v1Dir, 'training.jsonl');
    if (!fs.existsSync(trainingFile)) {
      this.warnings.push(`Training data missing in profiles/${category}/${profileName}/v1/`);
    }

    // Validate JSON-LD files
    this.validateJsonLdFiles(v1Dir, profileName, category);
  }

  /**
   * Validate JSON-LD files
   */
  validateJsonLdFiles(profileDir, profileName, category) {
    const jsonldFiles = ['index.jsonld'];
    
    jsonldFiles.forEach(file => {
      const filePath = path.join(profileDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          
          // Basic validation
          if (!data['@context']) {
            this.issues.push(`Missing @context in profiles/${category}/${profileName}/v1/${file}`);
          }
          
          // Check for either @type or skos:prefLabel (LLM Profiles use SKOS)
          if (!data['@type'] && !data['skos:prefLabel']) {
            this.issues.push(`Missing @type or skos:prefLabel in profiles/${category}/${profileName}/v1/${file}`);
          }
          
          if (!data['skos:prefLabel']) {
            this.warnings.push(`Missing skos:prefLabel in profiles/${category}/${profileName}/v1/${file}`);
          }
          
          if (!data['skos:definition']) {
            this.warnings.push(`Missing skos:definition in profiles/${category}/${profileName}/v1/${file}`);
          }
          
        } catch (error) {
          this.issues.push(`Invalid JSON in profiles/${category}/${profileName}/v1/${file}: ${error.message}`);
        }
      }
    });
  }

  /**
   * Validate schemas directory
   */
  validateSchemas() {
    console.log('📋 Validating schemas...');
    
    const schemasDir = path.join(this.rootDir, 'schemas');
    
    if (!fs.existsSync(schemasDir)) {
      this.issues.push('schemas/ directory does not exist');
      return;
    }

    this.expectedStructure.schemas.forEach(expectedDir => {
      const dirPath = path.join(schemasDir, expectedDir);
      
      if (!fs.existsSync(dirPath)) {
        this.issues.push(`schemas/${expectedDir}/ directory does not exist`);
      } else {
        // Check if directory has content
        const items = fs.readdirSync(dirPath);
        if (items.length === 0) {
          this.warnings.push(`schemas/${expectedDir}/ directory is empty`);
        }
      }
    });
  }

  /**
   * Validate examples directory
   */
  validateExamples() {
    console.log('💡 Validating examples...');
    
    const examplesDir = path.join(this.rootDir, 'examples');
    
    if (!fs.existsSync(examplesDir)) {
      this.issues.push('examples/ directory does not exist');
      return;
    }

    this.expectedStructure.examples.forEach(expectedDir => {
      const dirPath = path.join(examplesDir, expectedDir);
      
      if (!fs.existsSync(dirPath)) {
        this.issues.push(`examples/${expectedDir}/ directory does not exist`);
      } else {
        // Check if directory has content
        const items = fs.readdirSync(dirPath);
        if (items.length === 0) {
          this.warnings.push(`examples/${expectedDir}/ directory is empty`);
        }
      }
    });
  }

  /**
   * Validate training directory
   */
  validateTraining() {
    console.log('🎯 Validating training data...');
    
    const trainingDir = path.join(this.rootDir, 'training');
    
    if (!fs.existsSync(trainingDir)) {
      this.issues.push('training/ directory does not exist');
      return;
    }

    this.expectedStructure.training.forEach(expectedDir => {
      const dirPath = path.join(trainingDir, expectedDir);
      
      if (!fs.existsSync(dirPath)) {
        this.issues.push(`training/${expectedDir}/ directory does not exist`);
      } else {
        // Check if directory has content
        const items = fs.readdirSync(dirPath);
        if (items.length === 0) {
          this.warnings.push(`training/${expectedDir}/ directory is empty`);
        }
      }
    });
  }

  /**
   * Validate required files
   */
  validateRequiredFiles() {
    console.log('📄 Validating required files...');
    
    const requiredFiles = [
      'package.json',
      'README.md',
      'CHANGELOG.md',
      'index.json',
      'vocab.json'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(this.rootDir, file);
      if (!fs.existsSync(filePath)) {
        this.issues.push(`Required file ${file} does not exist`);
      }
    });
  }

  /**
   * Validate index.json structure
   */
  validateIndexFile() {
    console.log('🔗 Validating index.json...');
    
    const indexPath = path.join(this.rootDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      this.issues.push('index.json does not exist');
      return;
    }

    try {
      const content = fs.readFileSync(indexPath, 'utf8');
      const data = JSON.parse(content);
      
      // Check for structure metadata
      if (!data.structure) {
        this.warnings.push('index.json missing structure metadata');
      } else {
        if (!data.structure.organization || data.structure.organization !== 'categorized') {
          this.warnings.push('index.json structure.organization should be "categorized"');
        }
        
        if (!data.structure.categories) {
          this.warnings.push('index.json missing structure.categories');
        }
        
        if (!data.structure.directories) {
          this.warnings.push('index.json missing structure.directories');
        }
      }
      
      // Check profile paths - profiles are stored as object keys, not array
      if (data.profiles && typeof data.profiles === 'object') {
        Object.keys(data.profiles).forEach(profileKey => {
          const profile = data.profiles[profileKey];
          // Check if profile URLs are updated to new structure
          if (profile.profile && !profile.profile.includes('/profiles/')) {
            this.warnings.push(`Profile URL should use new structure: ${profile.profile}`);
          }
        });
      }
      
    } catch (error) {
      this.issues.push(`Invalid JSON in index.json: ${error.message}`);
    }
  }

  /**
   * Print validation report
   */
  printReport() {
    console.log('');
    console.log('📊 Structure Validation Report');
    console.log('==============================');
    console.log('');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ All validations passed! Structure is correct.');
      return;
    }

    if (this.issues.length > 0) {
      console.log('❌ Issues found:');
      this.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  - ${warning}`);
      });
      console.log('');
    }

    // Summary
    console.log('📈 Summary:');
    console.log(`  - Issues: ${this.issues.length}`);
    console.log(`  - Warnings: ${this.warnings.length}`);
    console.log(`  - Total: ${this.issues.length + this.warnings.length}`);
    console.log('');

    if (this.issues.length > 0) {
      console.log('🚨 Structure validation failed. Please fix the issues above.');
      process.exit(1);
    } else if (this.warnings.length > 0) {
      console.log('⚠️  Structure validation passed with warnings. Consider addressing the warnings above.');
    } else {
      console.log('🎉 Structure validation passed successfully!');
    }
  }

  /**
   * Generate structure report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      structure: 'organized',
      validation: {
        issues: this.issues,
        warnings: this.warnings,
        total: this.issues.length + this.warnings.length,
        passed: this.issues.length === 0
      },
      directories: this.getDirectoryStats(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Get directory statistics
   */
  getDirectoryStats() {
    const stats = {};
    
    // Count profiles by category
    Object.entries(this.expectedStructure.profiles).forEach(([category, profiles]) => {
      const categoryDir = path.join(this.rootDir, 'profiles', category);
      if (fs.existsSync(categoryDir)) {
        const actualProfiles = fs.readdirSync(categoryDir).filter(item => 
          fs.statSync(path.join(categoryDir, item)).isDirectory()
        );
        stats[category] = {
          expected: profiles.length,
          actual: actualProfiles.length,
          profiles: actualProfiles
        };
      }
    });

    return stats;
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.issues.length > 0) {
      recommendations.push('Fix all validation issues before proceeding');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('Consider addressing validation warnings for better structure');
    }
    
    // Check for empty directories
    const emptyDirs = this.findEmptyDirectories();
    if (emptyDirs.length > 0) {
      recommendations.push(`Consider adding content to empty directories: ${emptyDirs.join(', ')}`);
    }
    
    return recommendations;
  }

  /**
   * Find empty directories
   */
  findEmptyDirectories() {
    const emptyDirs = [];
    
    const checkDir = (dirPath, dirName) => {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        if (items.length === 0) {
          emptyDirs.push(dirName);
        }
      }
    };

    checkDir(path.join(this.rootDir, 'schemas', 'core'), 'schemas/core');
    checkDir(path.join(this.rootDir, 'schemas', 'validators'), 'schemas/validators');
    checkDir(path.join(this.rootDir, 'examples', 'edge-cases'), 'examples/edge-cases');
    checkDir(path.join(this.rootDir, 'training', 'combined'), 'training/combined');

    return emptyDirs;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new StructureValidator();
  
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--json':
        options.json = true;
        break;
      case '--help':
        console.log(`
Usage: node validate-structure.js [options]

Options:
  --json        Output validation report as JSON
  --help        Show this help message

Examples:
  node validate-structure.js
  node validate-structure.js --json
        `);
        process.exit(0);
    }
  }
  
  try {
    validator.validateStructure();
    
    if (options.json) {
      const report = validator.generateReport();
      console.log(JSON.stringify(report, null, 2));
    }
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

module.exports = StructureValidator;
