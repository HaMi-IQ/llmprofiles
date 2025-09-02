#!/usr/bin/env node

/**
 * Well-Known Endpoints Test Script for llmprofiles
 * Tests the .well-known endpoints for proper configuration
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
Usage: node test-well-known.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each test
  --quiet       Suppress success messages, only show errors
  --url <url>   Test specific URL instead of local files
  --timeout <ms> Set timeout for HTTP requests (default: 5000)

Examples:
  node test-well-known.js
  node test-well-known.js --verbose
  node test-well-known.js --url https://llmprofiles.org
  node test-well-known.js --timeout 10000
  `);
  process.exit(0);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 5000;
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.get(url, { timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.setTimeout(timeout);
  });
}

function testWellKnownEndpoint(baseUrl, endpoint, options = {}) {
  const url = `${baseUrl}/.well-known/${endpoint}`;
  
  return makeRequest(url, options)
    .then(response => {
      if (options.verbose) {
        log(`✅ ${endpoint}: ${response.statusCode}`, 'green');
      }
      return { success: true, endpoint, statusCode: response.statusCode, data: response.data };
    })
    .catch(error => {
      log(`❌ ${endpoint}: ${error.message}`, 'red');
      return { success: false, endpoint, error: error.message };
    });
}

function testLocalWellKnownFiles(options = {}) {
  log('🔍 Testing local .well-known files...', 'blue');
  
  const wellKnownDir = path.join(process.cwd(), '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    log('❌ .well-known directory not found', 'red');
    return false;
  }
  
  const files = fs.readdirSync(wellKnownDir);
  if (files.length === 0) {
    log('⚠️  .well-known directory is empty', 'yellow');
    return true;
  }
  
  let validFiles = 0;
  let totalFiles = files.length;
  
  for (const file of files) {
    const filePath = path.join(wellKnownDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Basic validation based on file type
        let isValid = true;
        let validationMessage = '';
        
        if (file === 'host-meta') {
          // Check if it's valid XML
          if (!content.includes('<?xml') || !content.includes('<XRD')) {
            isValid = false;
            validationMessage = 'Invalid XML format for host-meta';
          }
        } else if (file === 'webfinger') {
          // Check if it's valid JSON
          try {
            JSON.parse(content);
          } catch (e) {
            isValid = false;
            validationMessage = 'Invalid JSON format for webfinger';
          }
        } else if (file === 'nodeinfo') {
          // Check if it's valid JSON
          try {
            JSON.parse(content);
          } catch (e) {
            isValid = false;
            validationMessage = 'Invalid JSON format for nodeinfo';
          }
        }
        
        if (isValid) {
          validFiles++;
          if (options.verbose) {
            log(`✅ ${file}: Valid`, 'green');
          }
        } else {
          log(`❌ ${file}: ${validationMessage}`, 'red');
        }
        
      } catch (error) {
        log(`❌ ${file}: Could not read file - ${error.message}`, 'red');
      }
    }
  }
  
  if (options.verbose) {
    log(`\n📊 Local file validation: ${validFiles}/${totalFiles} valid`, validFiles === totalFiles ? 'green' : 'red');
  }
  
  return validFiles === totalFiles;
}

function testRemoteWellKnownEndpoints(baseUrl, options = {}) {
  log('🌐 Testing remote .well-known endpoints...', 'blue');
  
  const endpoints = [
    'host-meta',
    'webfinger',
    'nodeinfo',
    'security.txt',
    'robots.txt'
  ];
  
  let successfulTests = 0;
  let totalTests = endpoints.length;
  const results = [];
  
  const promises = endpoints.map(endpoint => 
    testWellKnownEndpoint(baseUrl, endpoint, options)
      .then(result => {
        results.push(result);
        if (result.success) {
          successfulTests++;
        }
        return result;
      })
  );
  
  return Promise.all(promises)
    .then(() => {
      if (options.verbose) {
        log(`\n📊 Remote endpoint tests: ${successfulTests}/${totalTests} successful`, successfulTests === totalTests ? 'green' : 'red');
      }
      
      // Show detailed results for failed tests
      const failedTests = results.filter(r => !r.success);
      if (failedTests.length > 0 && !options.quiet) {
        log('\n❌ Failed endpoint tests:', 'red');
        failedTests.forEach(test => {
          log(`  ${test.endpoint}: ${test.error}`, 'red');
        });
      }
      
      return successfulTests === totalTests;
    });
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    quiet: false,
    url: null,
    timeout: 5000
  };
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
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
      case '--url':
        if (i + 1 < args.length) {
          options.url = args[++i];
        } else {
          log('Error: --url requires a URL value', 'red');
          process.exit(1);
        }
        break;
      case '--timeout':
        if (i + 1 < args.length) {
          const timeout = parseInt(args[++i]);
          if (isNaN(timeout) || timeout <= 0) {
            log('Error: --timeout requires a positive number', 'red');
            process.exit(1);
          }
          options.timeout = timeout;
        } else {
          log('Error: --timeout requires a value', 'red');
          process.exit(1);
        }
        break;
      default:
        log(`Unknown option: ${arg}`, 'yellow');
        log('Use --help for usage information', 'yellow');
        process.exit(1);
    }
  }
  
  if (!options.quiet) {
    log('🚀 Starting well-known endpoint tests...', 'blue');
    log('');
  }
  
  try {
    let allTestsPassed = true;
    
    // Test local .well-known files
    if (!testLocalWellKnownFiles(options)) {
      allTestsPassed = false;
    }
    
    // Test remote endpoints if URL is provided
    if (options.url) {
      if (!options.quiet) {
        log(`\n🌐 Testing remote endpoints at: ${options.url}`, 'blue');
        log(`⏱️  Timeout: ${options.timeout}ms`, 'blue');
      }
      
      return testRemoteWellKnownEndpoints(options.url, options)
        .then(success => {
          if (!success) {
            allTestsPassed = false;
          }
          
          if (allTestsPassed) {
            if (!options.quiet) {
              log('\n🎉 All well-known endpoint tests passed!', 'green');
            }
            process.exit(0);
          } else {
            log('\n❌ Some well-known endpoint tests failed', 'red');
            process.exit(1);
          }
        })
        .catch(error => {
          log(`❌ Remote endpoint testing failed: ${error.message}`, 'red');
          process.exit(1);
        });
    } else {
      if (!options.quiet) {
        log('\n💡 Tip: Use --url <url> to test remote endpoints', 'blue');
      }
      
      if (allTestsPassed) {
        if (!options.quiet) {
          log('\n🎉 Local well-known file tests passed!', 'green');
        }
        process.exit(0);
      } else {
        log('\n❌ Some local well-known file tests failed', 'red');
        process.exit(1);
      }
    }
    
  } catch (error) {
    log(`❌ Well-known endpoint testing failed: ${error.message}`, 'red');
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
  makeRequest,
  testWellKnownEndpoint,
  testLocalWellKnownFiles,
  testRemoteWellKnownEndpoints
};
