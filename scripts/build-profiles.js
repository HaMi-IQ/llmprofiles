#!/usr/bin/env node

/**
 * Build Profiles Script for llmprofiles
 * Validates and prepares profile data for deployment
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

function showHelp() {
  console.log(`
Usage: node build-profiles.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each operation
  --validate    Run validation checks on profiles
  --dry-run     Show what would be processed without actually processing

Examples:
  node build-profiles.js
  node build-profiles.js --verbose --validate
  node build-profiles.js --dry-run
  `);
  process.exit(0);
}

function validateProfileStructure(profilePath, options = {}) {
  const requiredFiles = ['index.jsonld', 'page.schema.json', 'output.schema.json'];
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    const filePath = path.join(profilePath, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    if (options.verbose) {
      log(`❌ Missing required files in ${path.basename(profilePath)}: ${missingFiles.join(', ')}`, 'red');
    }
    return false;
  }
  
  if (options.verbose) {
    log(`✅ ${path.basename(profilePath)} structure is valid`, 'green');
  }
  
  return true;
}

function processProfiles(profilesDir, options = {}) {
  if (!fs.existsSync(profilesDir)) {
    log(`❌ Profiles directory not found: ${profilesDir}`, 'red');
    return { total: 0, valid: 0, invalid: 0 };
  }
  
  const categories = fs.readdirSync(profilesDir).filter(item => 
    fs.statSync(path.join(profilesDir, item)).isDirectory()
  );
  
  let totalProfiles = 0;
  let validProfiles = 0;
  let invalidProfiles = 0;
  
  for (const category of categories) {
    const categoryPath = path.join(profilesDir, category);
    const profileTypes = fs.readdirSync(categoryPath).filter(item => 
      fs.statSync(path.join(categoryPath, item)).isDirectory()
    );
    
    for (const profileType of profileTypes) {
      const profilePath = path.join(categoryPath, profileType);
      const versions = fs.readdirSync(profilePath).filter(item => 
        fs.statSync(path.join(profilePath, item)).isDirectory() && 
        item.startsWith('v')
      );
      
      for (const version of versions) {
        const versionPath = path.join(profilePath, version);
        totalProfiles++;
        
        if (validateProfileStructure(versionPath, options)) {
          validProfiles++;
        } else {
          invalidProfiles++;
        }
      }
    }
  }
  
  return { total: totalProfiles, valid: validProfiles, invalid: invalidProfiles };
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    validate: false,
    dryRun: false
  };
  
  // Parse command line arguments
  for (const arg of args) {
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--validate':
        options.validate = true;
        break;
      case '--dry-run':
      case '-n':
        options.dryRun = true;
        break;
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for usage information', 'yellow');
        process.exit(1);
    }
  }
  
  if (options.dryRun) {
    log('🔍 DRY RUN MODE - No files will be modified', 'blue');
    log('');
  }
  
  log('🏗️  Building llmprofiles profiles...', 'blue');
  log('');
  
  try {
    const profilesDir = path.join(__dirname, '..', 'profiles');
    
    if (options.verbose) {
      log(`📁 Processing profiles from: ${profilesDir}`, 'blue');
    }
    
    const results = processProfiles(profilesDir, options);
    
    log('');
    log('📊 Profile Build Results:', 'blue');
    log(`  Total profiles: ${results.total}`, results.total > 0 ? 'green' : 'yellow');
    log(`  Valid profiles: ${results.valid}`, results.valid > 0 ? 'green' : 'red');
    log(`  Invalid profiles: ${results.invalid}`, results.invalid === 0 ? 'green' : 'red');
    
    if (results.invalid > 0) {
      log('', 'red');
      log('❌ Some profiles have validation issues. Please fix them before deployment.', 'red');
      process.exit(1);
    }
    
    if (results.total > 0) {
      log('', 'green');
      log('✅ All profiles are valid and ready for deployment!', 'green');
    } else {
      log('', 'yellow');
      log('⚠️  No profiles found to process.', 'yellow');
    }
    
  } catch (error) {
    log(`❌ Profile build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the build
if (require.main === module) {
  try {
    main();
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = {
  processProfiles,
  validateProfileStructure
};
