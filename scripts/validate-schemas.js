#!/usr/bin/env node

/**
 * Schema validation script for llmprofiles
 * Validates all output.schema.json files using Ajv
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize Ajv
const ajv = new Ajv({
  strict: false,
  allErrors: true,
  verbose: true,
  validateSchema: false // Don't validate the schema itself
});
addFormats(ajv);

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
Usage: node validate-schemas.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each schema
  --quiet       Suppress success messages, only show errors
  --no-sample   Skip sample data validation

Examples:
  node validate-schemas.js
  node validate-schemas.js --verbose
  node validate-schemas.js --quiet --no-sample
  `);
  process.exit(0);
}

function findSchemaFiles(dir = '.') {
  const schemas = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Skip dist directory (build output)
            if (item === 'dist' || item === 'node_modules' || item === '.git') {
              continue;
            }
            scanDirectory(fullPath);
          } else if (item === 'output.schema.json') {
            schemas.push(fullPath);
          }
        } catch (statError) {
          log(`Warning: Could not stat ${fullPath}: ${statError.message}`, 'yellow');
        }
      }
    } catch (readError) {
      log(`Warning: Could not read directory ${currentDir}: ${readError.message}`, 'yellow');
    }
  }
  
  scanDirectory(dir);
  return schemas;
}

function validateSchema(schemaPath, verbose = false) {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    // Create a new Ajv instance for each schema to avoid ID conflicts
    const localAjv = new Ajv({
      strict: false,
      allErrors: true,
      verbose: true,
      validateSchema: false
    });
    addFormats(localAjv);
    
    // Compile the schema to check for syntax errors
    const validate = localAjv.compile(schema);
    
    if (verbose) {
      log(`✓ ${schemaPath}`, 'green');
    }
    
    return { valid: true, path: schemaPath };
  } catch (error) {
    log(`✗ ${schemaPath}`, 'red');
    log(`  Error: ${error.message}`, 'red');
    return { valid: false, path: schemaPath, error: error.message };
  }
}

function validateSampleData(schemaPath, verbose = false) {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    // Create a new Ajv instance for each schema to avoid ID conflicts
    const localAjv = new Ajv({
      strict: false,
      allErrors: true,
      validateSchema: false
    });
    addFormats(localAjv);
    
    const validate = localAjv.compile(schema);
    
    // Generate sample data based on schema
    const sampleData = generateSampleData(schema);
    
    if (sampleData) {
      const isValid = validate(sampleData);
      if (!isValid) {
        if (verbose) {
          log(`  Warning: Sample data validation failed`, 'yellow');
          log(`  Errors: ${JSON.stringify(validate.errors, null, 2)}`, 'yellow');
        }
      }
    }
    
    return true;
  } catch (error) {
    if (verbose) {
      log(`  Warning: Could not validate sample data: ${error.message}`, 'yellow');
    }
    return false;
  }
}

function generateSampleData(schema) {
  // Simple sample data generator
  const sample = {};
  
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.type === 'string') {
        sample[key] = `Sample ${key}`;
      } else if (prop.type === 'array') {
        sample[key] = [];
      } else if (prop.type === 'object') {
        sample[key] = {};
      } else if (prop.type === 'number' || prop.type === 'integer') {
        sample[key] = 1;
      } else if (prop.type === 'boolean') {
        sample[key] = true;
      }
    }
  }
  
  return Object.keys(sample).length > 0 ? sample : null;
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    quiet: false,
    noSample: false
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
      case '--quiet':
      case '-q':
        options.quiet = true;
        break;
      case '--no-sample':
        options.noSample = true;
        break;
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for usage information', 'yellow');
        process.exit(1);
    }
  }
  
  if (!options.quiet) {
    log('🔍 Validating llmprofiles schemas...', 'blue');
    log('');
  }
  
  const schemaFiles = findSchemaFiles();
  
  if (schemaFiles.length === 0) {
    log('No schema files found.', 'yellow');
    process.exit(0);
  }
  
  if (!options.quiet) {
    log(`Found ${schemaFiles.length} schema file(s):`, 'blue');
    log('');
  }
  
  let validCount = 0;
  let invalidCount = 0;
  const results = [];
  
  for (const schemaPath of schemaFiles) {
    const result = validateSchema(schemaPath, options.verbose);
    results.push(result);
    
    if (result.valid) {
      validCount++;
      // Try to validate with sample data unless disabled
      if (!options.noSample) {
        validateSampleData(schemaPath, options.verbose);
      }
    } else {
      invalidCount++;
    }
  }
  
  if (!options.quiet) {
    log('');
    log('📊 Validation Summary:', 'blue');
    log(`  Total schemas: ${schemaFiles.length}`, 'reset');
    log(`  Valid: ${validCount}`, 'green');
    log(`  Invalid: ${invalidCount}`, invalidCount > 0 ? 'red' : 'green');
  }
  
  if (invalidCount > 0) {
    if (!options.quiet) {
      log('');
      log('❌ Validation failed. Please fix the errors above.', 'red');
    }
    process.exit(1);
  } else {
    if (!options.quiet) {
      log('');
      log('✅ All schemas are valid!', 'green');
    }
    process.exit(0);
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
  validateSchema,
  findSchemaFiles,
  generateSampleData
};
