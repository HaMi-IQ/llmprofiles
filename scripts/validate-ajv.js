#!/usr/bin/env node

/**
 * AJV validation script for CI workflows
 * Usage: node scripts/validate-ajv.js <schema-file> <data-file>
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

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
Usage: node scripts/validate-ajv.js <schema-file> <data-file> [options]

Arguments:
  <schema-file>    Path to the schema file (e.g., profiles/interaction/faqpage/v1/output.schema.json)
  <data-file>      Path to the data file to validate (e.g., examples/faqpage/sample.output.json)

Options:
  --help           Show this help message
  --verbose        Show detailed validation output
  --auto-find      Automatically find schema files if exact path not found

Examples:
  node scripts/validate-ajv.js profiles/interaction/faqpage/v1/output.schema.json examples/faqpage/sample.output.json
  node scripts/validate-ajv.js profiles/content/article/v1/output.schema.json examples/article/minimal.output.json
  node scripts/validate-ajv.js --auto-find faqpage examples/faqpage/sample.output.json
  `);
  process.exit(0);
}

// Initialize Ajv
const ajv = new Ajv({
  strict: false,
  allErrors: true,
  verbose: true,
  validateSchema: false
});
addFormats(ajv);

function findSchemaFile(schemaPath, autoFind = false) {
  // If auto-find is enabled and the path doesn't exist, try to find it
  if (autoFind && !fs.existsSync(schemaPath)) {
    const parts = schemaPath.split('/');
    const profileName = parts[0];
    
    // Try to find the schema in the profiles directory
    const profilesDir = path.join(process.cwd(), 'profiles');
    if (fs.existsSync(profilesDir)) {
      // Search through all profile categories
      const categories = ['content', 'business', 'interaction', 'technology'];
      
      for (const category of categories) {
        const categoryDir = path.join(profilesDir, category);
        if (fs.existsSync(categoryDir)) {
          const profileDir = path.join(categoryDir, profileName);
          if (fs.existsSync(profileDir)) {
            const v1Dir = path.join(profileDir, 'v1');
            if (fs.existsSync(v1Dir)) {
              const schemaFile = path.join(v1Dir, 'output.schema.json');
              if (fs.existsSync(schemaFile)) {
                log(`🔍 Auto-found schema: ${schemaFile}`, 'blue');
                return schemaFile;
              }
            }
          }
        }
      }
    }
  }
  
  return schemaPath;
}

function validateFile(schemaPath, dataPath, options = {}) {
  try {
    // Read schema
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    if (options.verbose) {
      log(`📋 Schema loaded: ${schemaPath}`, 'blue');
      log(`   Type: ${schema.type || 'unknown'}`, 'blue');
      log(`   Properties: ${Object.keys(schema.properties || {}).length}`, 'blue');
    }
    
    // Read data
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(dataContent);
    
    if (options.verbose) {
      log(`📄 Data loaded: ${dataPath}`, 'blue');
      log(`   Size: ${JSON.stringify(data).length} characters`, 'blue');
    }
    
    // Compile and validate
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    
    if (isValid) {
      log(`✅ Validation passed: ${dataPath} against ${schemaPath}`, 'green');
      return true;
    } else {
      log(`❌ Validation failed: ${dataPath} against ${schemaPath}`, 'red');
      if (options.verbose) {
        log('Errors:', 'red');
        console.log(JSON.stringify(validate.errors, null, 2));
      } else {
        log(`   ${validate.errors.length} validation error(s) found`, 'red');
        log('   Use --verbose to see detailed errors', 'yellow');
      }
      return false;
    }
  } catch (error) {
    log(`❌ Error validating ${dataPath} against ${schemaPath}: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    autoFind: false
  };
  
  // Parse options
  const filteredArgs = args.filter(arg => {
    if (arg === '--help' || arg === '-h') {
      showHelp();
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
      return false;
    } else if (arg === '--auto-find' || arg === '-a') {
      options.autoFind = true;
      return false;
    }
    return true;
  });
  
  if (filteredArgs.length !== 2) {
    log('Error: Schema file and data file are required', 'red');
    log('Usage: node scripts/validate-ajv.js <schema-file> <data-file>', 'yellow');
    log('Use --help for more information', 'yellow');
    process.exit(1);
  }
  
  let [schemaPath, dataPath] = filteredArgs;
  
  log('🔍 AJV Validation Script', 'blue');
  log('========================', 'blue');
  log('');
  
  // Try to auto-find schema if enabled
  if (options.autoFind) {
    // If auto-find is enabled, the first argument might be just the profile name
    if (!schemaPath.includes('/') && !schemaPath.includes('.')) {
      // This looks like just a profile name, try to find the schema
      const foundSchema = findSchemaFile(schemaPath, true);
      if (foundSchema !== schemaPath) {
        schemaPath = foundSchema;
      }
    } else {
      // Try to auto-find even with a partial path
      schemaPath = findSchemaFile(schemaPath, true);
    }
  }
  
  // Check if schema file exists
  if (!fs.existsSync(schemaPath)) {
    log(`❌ Schema file not found: ${schemaPath}`, 'red');
    log('', 'reset');
    log('💡 Try these alternatives:', 'yellow');
    log('   - Use the full path: profiles/interaction/faqpage/v1/output.schema.json', 'yellow');
    log('   - Use --auto-find to automatically locate schema files', 'yellow');
    log('   - Check the current directory structure:', 'yellow');
    
    // Show available schema files
    const profilesDir = path.join(process.cwd(), 'profiles');
    if (fs.existsSync(profilesDir)) {
      log('   Available schema files:', 'blue');
      try {
        const categories = fs.readdirSync(profilesDir);
        for (const category of categories) {
          const categoryDir = path.join(profilesDir, category);
          if (fs.statSync(categoryDir).isDirectory()) {
            const profiles = fs.readdirSync(categoryDir);
            for (const profile of profiles) {
              const profileDir = path.join(categoryDir, profile);
              if (fs.statSync(profileDir).isDirectory()) {
                const v1Dir = path.join(profileDir, 'v1');
                if (fs.existsSync(v1Dir)) {
                  const schemaFile = path.join(v1Dir, 'output.schema.json');
                  if (fs.existsSync(schemaFile)) {
                    log(`     ${schemaFile}`, 'blue');
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        log(`   Could not scan profiles directory: ${error.message}`, 'yellow');
      }
    }
    
    process.exit(1);
  }
  
  // Check if data file exists
  if (!fs.existsSync(dataPath)) {
    log(`❌ Data file not found: ${dataPath}`, 'red');
    log('', 'reset');
    log('💡 Check the file path and ensure the file exists', 'yellow');
    process.exit(1);
  }
  
  log(`📋 Schema: ${schemaPath}`, 'blue');
  log(`📄 Data:  ${dataPath}`, 'blue');
  log('');
  
  // Validate
  const isValid = validateFile(schemaPath, dataPath, options);
  
  if (isValid) {
    log('🎉 Validation completed successfully!', 'green');
    process.exit(0);
  } else {
    log('❌ Validation failed!', 'red');
    process.exit(1);
  }
}

// Run the validation
if (require.main === module) {
  try {
    main();
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = {
  validateFile,
  findSchemaFile
};
