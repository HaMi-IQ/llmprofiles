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

function showHelp() {
  console.log(`
Usage: node validate-json.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each file
  --quiet       Suppress success messages, only show errors

Examples:
  node validate-json.js
  node validate-json.js --verbose
  node validate-json.js --quiet
  `);
  process.exit(0);
}

function findJsonFiles(dir = '.') {
  const files = [];
  
  function scanDirectory(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            // Skip node_modules and dist directories
            if (item === 'node_modules' || item === 'dist' || item === '.git') {
              continue;
            }
            scanDirectory(fullPath);
          } else if (item.endsWith('.json') || item.endsWith('.jsonld')) {
            files.push(fullPath);
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
  return files;
}

function validateJsonFile(filePath, verbose = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    
    if (verbose) {
      log(`✓ ${filePath}`, 'green');
    }
    
    return { valid: true, path: filePath };
  } catch (error) {
    log(`✗ ${filePath}`, 'red');
    log(`  Error: ${error.message}`, 'red');
    return { valid: false, path: filePath, error: error.message };
  }
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    quiet: false
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
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for usage information', 'yellow');
        process.exit(1);
    }
  }
  
  if (!options.quiet) {
    log('🔍 Validating JSON files...', 'blue');
    log('');
  }
  
  const jsonFiles = findJsonFiles();
  
  if (jsonFiles.length === 0) {
    log('No JSON files found.', 'yellow');
    process.exit(0);
  }
  
  if (!options.quiet) {
    log(`Found ${jsonFiles.length} JSON file(s) to validate`, 'blue');
    log('');
  }
  
  let validCount = 0;
  let invalidCount = 0;
  const errors = [];
  
  for (const filePath of jsonFiles) {
    const result = validateJsonFile(filePath, options.verbose);
    
    if (result.valid) {
      validCount++;
    } else {
      invalidCount++;
      errors.push(result);
    }
  }
  
  // Report results
  if (!options.quiet) {
    log('');
    log('📊 Validation Summary:', 'blue');
    log(`  Total files: ${jsonFiles.length}`, 'reset');
    log(`  Valid: ${validCount}`, 'green');
    log(`  Invalid: ${invalidCount}`, invalidCount > 0 ? 'red' : 'green');
  }
  
  if (invalidCount > 0) {
    if (!options.quiet) {
      log('');
      log(`❌ Found ${invalidCount} invalid JSON file(s):`, 'red');
      for (const error of errors) {
        log(`  ${error.path}: ${error.error}`, 'red');
      }
    }
    process.exit(1);
  } else {
    if (!options.quiet) {
      log('');
      log(`✅ All ${validCount} JSON files are valid!`, 'green');
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
  validateJsonFile,
  findJsonFiles
};
