#!/usr/bin/env node

/**
 * JSON validation script to replace jsonlint
 * Validates all JSON and JSON-LD files in the project
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

function findJsonFiles(dir = '.') {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and dist directories
        if (item === 'node_modules' || item === 'dist') {
          continue;
        }
        scanDirectory(fullPath);
      } else if (item.endsWith('.json') || item.endsWith('.jsonld')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true, path: filePath };
  } catch (error) {
    return { valid: false, path: filePath, error: error.message };
  }
}

function main() {
  const jsonFiles = findJsonFiles();
  
  if (jsonFiles.length === 0) {
    log('No JSON files found.', 'yellow');
    process.exit(0);
  }
  
  let validCount = 0;
  let invalidCount = 0;
  const errors = [];
  
  for (const filePath of jsonFiles) {
    const result = validateJsonFile(filePath);
    
    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
      errors.push(result);
    }
  }
  
  // Report results
  if (invalidCount > 0) {
    log(`❌ Found ${invalidCount} invalid JSON file(s):`, 'red');
    for (const error of errors) {
      log(`  ${error.path}: ${error.error}`, 'red');
    }
    process.exit(1);
  } else {
    log(`✅ All ${validCount} JSON files are valid!`, 'green');
    process.exit(0);
  }
}

// Run the validation
if (require.main === module) {
  main();
}

module.exports = {
  validateJsonFile,
  findJsonFiles
};
