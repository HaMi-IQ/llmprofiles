#!/usr/bin/env node

/**
 * Build documentation script for llmprofiles
 * Copies and builds the website distribution
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
Usage: node build-docs.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each operation
  --clean       Clean dist directory before building
  --dry-run     Show what would be copied without actually copying

Examples:
  node build-docs.js
  node build-docs.js --verbose
  node build-docs.js --clean --verbose
  node build-docs.js --dry-run
  `);
  process.exit(0);
}

// Create dist directory
function ensureDistDir() {
  const distDir = path.join(__dirname, '..', 'web', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    log(`Created dist directory: ${distDir}`, 'green');
  }
  return distDir;
}

// Copy all JSON and JSONLD files
function copyFiles(src, dest, options = {}) {
  if (!fs.existsSync(src)) {
    if (options.verbose) {
      log(`Source directory does not exist: ${src}`, 'yellow');
    }
    return;
  }
  
  if (!options.dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  try {
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      try {
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          copyFiles(srcPath, destPath, options);
        } else if (item.endsWith('.json') || item.endsWith('.jsonld') || item.endsWith('.jsonl') || item.endsWith('.md') || item.endsWith('.html')) {
          if (options.dryRun) {
            log(`Would copy: ${srcPath} → ${destPath}`, 'blue');
          } else {
            fs.copyFileSync(srcPath, destPath);
            if (options.verbose) {
              log(`Copied: ${srcPath}`, 'green');
            }
          }
        }
      } catch (statError) {
        log(`Warning: Could not stat ${srcPath}: ${statError.message}`, 'yellow');
      }
    });
  } catch (readError) {
    log(`Warning: Could not read directory ${src}: ${readError.message}`, 'yellow');
  }
}

// Copy directory recursively (all files and subfolders)
function copyDirAll(src, dest, options = {}) {
  if (!fs.existsSync(src)) {
    if (options.verbose) {
      log(`Source directory does not exist: ${src}`, 'yellow');
    }
    return;
  }
  
  if (!options.dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  try {
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      try {
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          copyDirAll(srcPath, destPath, options);
        } else {
          if (options.dryRun) {
            log(`Would copy: ${srcPath} → ${destPath}`, 'blue');
          } else {
            fs.copyFileSync(srcPath, destPath);
            if (options.verbose) {
              log(`Copied: ${srcPath}`, 'green');
            }
          }
        }
      } catch (statError) {
        log(`Warning: Could not stat ${srcPath}: ${statError.message}`, 'yellow');
      }
    });
  } catch (readError) {
    log(`Warning: Could not read directory ${src}: ${readError.message}`, 'yellow');
  }
}

// Clean dist directory
function cleanDistDir(distDir, options = {}) {
  if (options.clean && fs.existsSync(distDir)) {
    try {
      fs.rmSync(distDir, { recursive: true, force: true });
      log(`Cleaned dist directory: ${distDir}`, 'yellow');
    } catch (error) {
      log(`Warning: Could not clean dist directory: ${error.message}`, 'yellow');
    }
  }
  
  // Always ensure dist directory is clean of recursive structures
  if (fs.existsSync(distDir)) {
    try {
      // Check for recursive web/dist/web structure
      const webDistPath = path.join(distDir, 'web', 'dist');
      if (fs.existsSync(webDistPath)) {
        log(`⚠️  Detected recursive web/dist/web structure, cleaning...`, 'yellow');
        fs.rmSync(webDistPath, { recursive: true, force: true });
      }
      
      // Check for any other recursive structures
      const webPath = path.join(distDir, 'web');
      if (fs.existsSync(webPath)) {
        const webItems = fs.readdirSync(webPath);
        webItems.forEach(item => {
          if (item === 'dist') {
            const itemPath = path.join(webPath, item);
            if (fs.existsSync(itemPath)) {
              log(`⚠️  Removing recursive dist directory: ${itemPath}`, 'yellow');
              fs.rmSync(itemPath, { recursive: true, force: true });
            }
          }
        });
      }
    } catch (error) {
      log(`Warning: Could not clean recursive structures: ${error.message}`, 'yellow');
    }
  }
}

// Create legacy redirects for backward compatibility
function createLegacyRedirects(distDir, options = {}) {
  const legacyProfileDirs = [
    'faqpage', 'qapage', 'article', 'product-offer', 'event', 
    'course', 'jobposting', 'localbusiness', 'softwareapplication', 'review',
    'book', 'dataset', 'howto', 'recipe', 'videoobject', 'software'
  ];

  legacyProfileDirs.forEach(profile => {
    const destPath = path.join(distDir, profile);
    
    if (!options.dryRun && !fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    // Create {profile}/index.html that redirects to profiles/ structure
    let redirectPath = '';
    if (['article', 'book', 'course', 'dataset', 'howto', 'recipe', 'videoobject'].includes(profile)) {
      redirectPath = `/profiles/content/${profile}/`;
    } else if (['localbusiness', 'jobposting', 'product-offer', 'event'].includes(profile)) {
      redirectPath = `/profiles/business/${profile}/`;
    } else if (['review', 'faqpage', 'qapage'].includes(profile)) {
      redirectPath = `/profiles/interaction/${profile}/`;
    } else if (['softwareapplication', 'software'].includes(profile)) {
      redirectPath = `/profiles/technology/${profile}/`;
    }
    
    const profileIndexHtml = `<!doctype html><meta http-equiv="refresh" content="0; url=${redirectPath}">`;
    const indexPath = path.join(destPath, 'index.html');
    
    if (options.dryRun) {
      log(`Would create redirect: ${indexPath} → ${redirectPath}`, 'blue');
    } else {
      fs.writeFileSync(indexPath, profileIndexHtml);
      if (options.verbose) {
        log(`Created redirect: ${profile} → ${redirectPath}`, 'green');
      }
    }
  });
}

function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: false,
    clean: false,
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
      case '--clean':
      case '-c':
        options.clean = true;
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
  
  log('🏗️  Building llmprofiles documentation...', 'blue');
  log('');
  
  try {
    const distDir = ensureDistDir();
    cleanDistDir(distDir, options);
    
    // Copy profiles directory structure
    const profilesSrc = path.join(__dirname, '..', 'profiles');
    const profilesDest = path.join(distDir, 'profiles');
    if (fs.existsSync(profilesSrc)) {
      log('📁 Copying profiles...', 'blue');
      copyDirAll(profilesSrc, profilesDest, options);
    }
    
    // Create legacy redirects
    log('🔄 Creating legacy redirects...', 'blue');
    createLegacyRedirects(distDir, options);
    
    // Copy main files
    const mainFiles = ['index.json', 'README.md', 'CHANGELOG.md', 'LICENSE-CODE', 'LICENSE-CONTENT', 'vocab.json'];
    log('📄 Copying main files...', 'blue');
    mainFiles.forEach(file => {
      const srcPath = path.join(__dirname, '..', file);
      const destPath = path.join(distDir, file);
      if (fs.existsSync(srcPath)) {
        if (options.dryRun) {
          log(`Would copy: ${srcPath} → ${destPath}`, 'blue');
        } else {
          fs.copyFileSync(srcPath, destPath);
          if (options.verbose) {
            log(`Copied: ${file}`, 'green');
          }
        }
      }
    });
    
    // Copy docs directory
    const docsSrc = path.join(__dirname, '..', 'docs');
    const docsDest = path.join(distDir, 'docs');
    if (fs.existsSync(docsSrc)) {
      log('📚 Copying documentation...', 'blue');
      copyFiles(docsSrc, docsDest, options);
    }
    
    // Copy examples directory
    const examplesSrc = path.join(__dirname, '..', 'examples');
    const examplesDest = path.join(distDir, 'examples');
    if (fs.existsSync(examplesSrc)) {
      log('💡 Copying examples...', 'blue');
      copyDirAll(examplesSrc, examplesDest, options);
    }
    
    // Copy training directory
    const trainingSrc = path.join(__dirname, '..', 'training');
    const trainingDest = path.join(distDir, 'training');
    if (fs.existsSync(trainingSrc)) {
      log('🎓 Copying training materials...', 'blue');
      copyDirAll(trainingSrc, trainingDest, options);
    }
    
    // Copy schemas directory
    const schemasSrc = path.join(__dirname, '..', 'schemas');
    const schemasDest = path.join(distDir, 'schemas');
    if (fs.existsSync(schemasSrc)) {
      log('🔧 Copying schemas...', 'blue');
      copyDirAll(schemasSrc, schemasDest, options);
    }
    
    // Copy tools directory
    const toolsSrc = path.join(__dirname, '..', 'tools');
    const toolsDest = path.join(distDir, 'tools');
    if (fs.existsSync(toolsSrc)) {
      log('🛠️  Copying tools...', 'blue');
      copyDirAll(toolsSrc, toolsDest, options);
    }
    
    // Copy web assets (but exclude dist to prevent recursion)
    const webSrc = path.join(__dirname, '..', 'web');
    if (fs.existsSync(webSrc)) {
      log('🌐 Copying web assets...', 'blue');
      
      // Copy web files but exclude dist directory to prevent recursion
      const webItems = fs.readdirSync(webSrc);
      webItems.forEach(item => {
        if (item !== 'dist') { // Skip dist directory to prevent recursion
          const srcPath = path.join(webSrc, item);
          const destPath = path.join(distDir, item);
          
          try {
            const stat = fs.statSync(srcPath);
            if (stat.isDirectory()) {
              copyDirAll(srcPath, destPath, options);
            } else {
              if (options.dryRun) {
                log(`Would copy: ${srcPath} → ${destPath}`, 'blue');
              } else {
                fs.copyFileSync(srcPath, destPath);
                if (options.verbose) {
                  log(`Copied: ${item}`, 'green');
                }
              }
            }
          } catch (error) {
            log(`Warning: Could not copy ${item}: ${error.message}`, 'yellow');
          }
        }
      });
    }
    
    // Copy images
    const imagesSrc = path.join(__dirname, '..', 'images');
    const imagesDest = path.join(distDir, 'images');
    if (fs.existsSync(imagesSrc)) {
      log('🖼️  Copying images...', 'blue');
      copyDirAll(imagesSrc, imagesDest, options);
    }
    
    // Copy logo
    const logoSrc = path.join(__dirname, '..', 'logo.png');
    const logoDest = path.join(distDir, 'logo.png');
    if (fs.existsSync(logoSrc)) {
      if (options.dryRun) {
        log(`Would copy: ${logoSrc} → ${logoDest}`, 'blue');
      } else {
        fs.copyFileSync(logoSrc, logoDest);
        if (options.verbose) {
          log(`Copied: logo.png`, 'green');
        }
      }
    }
    
    if (!options.dryRun) {
      log('');
      log('✅ Build completed successfully!', 'green');
      log(`📁 Output directory: ${distDir}`, 'blue');
    } else {
      log('');
      log('✅ Dry run completed!', 'green');
      log('Use --verbose to see detailed operations', 'blue');
    }
    
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
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
  ensureDistDir,
  copyFiles,
  copyDirAll,
  createLegacyRedirects
};

