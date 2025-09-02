#!/usr/bin/env node

/**
 * CI Validation Test Script for llmprofiles
 * Tests the validation pipeline in CI environment
 */

const { execSync } = require('child_process');
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
Usage: node test-ci-validation.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each test
  --quiet       Suppress success messages, only show errors
  --fast        Skip slow validation steps

Examples:
  node test-ci-validation.js
  node test-ci-validation.js --verbose
  node test-ci-validation.js --quiet --fast
  `);
  process.exit(0);
}

function runCommand(command, description, options = {}) {
  try {
    if (options.verbose) {
      log(`Running: ${command}`, 'blue');
    }
    
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: options.verbose ? 'inherit' : 'pipe'
    });
    
    if (options.verbose) {
      log(`✅ ${description} completed successfully`, 'green');
    }
    
    return { success: true, output: result };
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    if (options.verbose && error.stdout) {
      log(`Output: ${error.stdout}`, 'yellow');
    }
    if (options.verbose && error.stderr) {
      log(`Error: ${error.stderr}`, 'red');
    }
    return { success: false, error: error.message };
  }
}

function checkDependencies(options = {}) {
  log('🔍 Checking dependencies...', 'blue');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredDeps = ['ajv', 'ajv-formats'];
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      log(`❌ Missing dependency: ${dep}`, 'red');
      return false;
    }
  }
  
  if (options.verbose) {
    log('✅ All required dependencies found', 'green');
  }
  
  return true;
}

function runValidationTests(options = {}) {
  log('🧪 Running validation tests...', 'blue');
  
  const tests = [
    {
      command: 'npm run validate:json',
      description: 'JSON validation'
    },
    {
      command: 'npm run validate:schemas',
      description: 'Schema validation'
    }
  ];
  
  if (!options.fast) {
    tests.push({
      command: 'npm run validate:structure',
      description: 'Structure validation'
    });
  }
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const result = runCommand(test.command, test.description, options);
    if (result.success) {
      passedTests++;
    }
  }
  
  if (options.verbose) {
    log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`, passedTests === totalTests ? 'green' : 'red');
  }
  
  return passedTests === totalTests;
}

function runBuildTests(options = {}) {
  log('🏗️  Running build tests...', 'blue');
  
  const tests = [
    {
      command: 'npm run build:docs',
      description: 'Documentation build'
    }
  ];
  
  if (!options.fast) {
    tests.push({
      command: 'npm run build:md',
      description: 'Markdown to HTML conversion'
    });
  }
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const result = runCommand(test.command, test.description, options);
    if (result.success) {
      passedTests++;
    }
  }
  
  if (options.verbose) {
    log(`\n📊 Build Test Results: ${passedTests}/${totalTests} passed`, passedTests === totalTests ? 'green' : 'red');
  }
  
  return passedTests === totalTests;
}

function checkOutputFiles(options = {}) {
  log('📁 Checking output files...', 'blue');
  
  const distDir = path.join(process.cwd(), 'web', 'dist');
  if (!fs.existsSync(distDir)) {
    log('❌ Dist directory not found', 'red');
    return false;
  }
  
  const requiredFiles = ['index.json', 'README.md'];
  const requiredDirs = ['profiles', 'docs'];
  
  let missingItems = [];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(distDir, file))) {
      missingItems.push(file);
    }
  }
  
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(distDir, dir))) {
      missingItems.push(dir);
    }
  }
  
  if (missingItems.length > 0) {
    log(`❌ Missing required files/directories: ${missingItems.join(', ')}`, 'red');
    return false;
  }
  
  if (options.verbose) {
    log('✅ All required output files found', 'green');
  }
  
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    quiet: false,
    fast: false
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
      case '--fast':
      case '-f':
        options.fast = true;
        break;
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for usage information', 'yellow');
        process.exit(1);
    }
  }
  
  if (!options.quiet) {
    log('🚀 Starting CI validation tests...', 'blue');
    log('');
  }
  
  try {
    // Check dependencies
    if (!checkDependencies(options)) {
      log('❌ Dependency check failed', 'red');
      process.exit(1);
    }
    
    // Run validation tests
    if (!runValidationTests(options)) {
      log('❌ Validation tests failed', 'red');
      process.exit(1);
    }
    
    // Run build tests
    if (!runBuildTests(options)) {
      log('❌ Build tests failed', 'red');
      process.exit(1);
    }
    
    // Check output files
    if (!checkOutputFiles(options)) {
      log('❌ Output file check failed', 'red');
      process.exit(1);
    }
    
    if (!options.quiet) {
      log('');
      log('🎉 All CI validation tests passed!', 'green');
      log('✅ The project is ready for CI/CD deployment', 'green');
    }
    
  } catch (error) {
    log(`❌ CI validation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  try {
    main();
  } catch (error) {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = {
  runCommand,
  checkDependencies,
  runValidationTests,
  runBuildTests,
  checkOutputFiles
};
