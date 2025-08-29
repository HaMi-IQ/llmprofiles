#!/usr/bin/env node

/**
 * AJV validation script for CI workflows
 * Usage: node scripts/validate-ajv.js <schema-file> <data-file>
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
  validateSchema: false
});
addFormats(ajv);

function validateFile(schemaPath, dataPath) {
  try {
    // Read schema
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    // Read data
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(dataContent);
    
    // Compile and validate
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    
    if (isValid) {
      console.log(`✅ Validation passed: ${dataPath} against ${schemaPath}`);
      return true;
    } else {
      console.log(`❌ Validation failed: ${dataPath} against ${schemaPath}`);
      console.log('Errors:', JSON.stringify(validate.errors, null, 2));
      return false;
    }
  } catch (error) {
    console.error(`❌ Error validating ${dataPath} against ${schemaPath}:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log('Usage: node scripts/validate-ajv.js <schema-file> <data-file>');
    console.log('Example: node scripts/validate-ajv.js faqpage/v1/page.schema.json examples/faqpage/minimal.page.jsonld');
    process.exit(1);
  }
  
  const [schemaPath, dataPath] = args;
  
  // Check if files exist
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found: ${dataPath}`);
    process.exit(1);
  }
  
  // Validate
  const isValid = validateFile(schemaPath, dataPath);
  process.exit(isValid ? 0 : 1);
}

// Run the validation
if (require.main === module) {
  main();
}

module.exports = {
  validateFile
};
