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

function findSchemaFiles(dir = '.') {
  const schemas = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip dist directory (build output)
        if (item === 'dist') {
          continue;
        }
        scanDirectory(fullPath);
      } else if (item === 'output.schema.json') {
        schemas.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return schemas;
}

function validateSchema(schemaPath) {
  try {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    // Compile the schema to check for syntax errors
    const validate = ajv.compile(schema);
    
    log(`✓ ${schemaPath}`, 'green');
    return { valid: true, path: schemaPath };
  } catch (error) {
    log(`✗ ${schemaPath}`, 'red');
    log(`  Error: ${error.message}`, 'red');
    return { valid: false, path: schemaPath, error: error.message };
  }
}

function validateSampleData(schemaPath) {
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
        log(`  Warning: Sample data validation failed`, 'yellow');
        log(`  Errors: ${JSON.stringify(validate.errors, null, 2)}`, 'yellow');
      }
    }
    
    return true;
  } catch (error) {
    log(`  Warning: Could not validate sample data: ${error.message}`, 'yellow');
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
  log('🔍 Validating llmprofiles schemas...', 'blue');
  log('');
  
  const schemaFiles = findSchemaFiles();
  
  if (schemaFiles.length === 0) {
    log('No schema files found.', 'yellow');
    process.exit(0);
  }
  
  log(`Found ${schemaFiles.length} schema file(s):`, 'blue');
  log('');
  
  let validCount = 0;
  let invalidCount = 0;
  const results = [];
  
  for (const schemaPath of schemaFiles) {
    const result = validateSchema(schemaPath);
    results.push(result);
    
    if (result.valid) {
      validCount++;
      // Try to validate with sample data
      validateSampleData(schemaPath);
    } else {
      invalidCount++;
    }
  }
  
  log('');
  log('📊 Validation Summary:', 'blue');
  log(`  Total schemas: ${schemaFiles.length}`, 'reset');
  log(`  Valid: ${validCount}`, 'green');
  log(`  Invalid: ${invalidCount}`, invalidCount > 0 ? 'red' : 'green');
  
  if (invalidCount > 0) {
    log('');
    log('❌ Validation failed. Please fix the errors above.', 'red');
    process.exit(1);
  } else {
    log('');
    log('✅ All schemas are valid!', 'green');
    process.exit(0);
  }
}

// Run the validation
if (require.main === module) {
  main();
}

module.exports = {
  validateSchema,
  findSchemaFiles,
  generateSampleData
};
