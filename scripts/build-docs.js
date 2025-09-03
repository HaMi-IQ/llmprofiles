#!/usr/bin/env node

/**
 * Build documentation script for llmprofiles
 * Creates a clean website distribution for GitHub Pages
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

// Create web directory for deployment
function ensureWebDir() {
  const webDir = path.join(__dirname, '..', 'web');
  if (!fs.existsSync(webDir)) {
    fs.mkdirSync(webDir, { recursive: true });
    log(`Created web directory: ${webDir}`, 'green');
  }
  return webDir;
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
      // Skip node_modules and other unnecessary directories
      if (item === 'node_modules' || item === '.git' || item === '.github' || item === 'scripts') {
        return;
      }
      
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
              log(`Copied: ${item}`, 'green');
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
function cleanWebDir(webDir, options = {}) {
  if (options.clean && fs.existsSync(webDir)) {
    try {
      fs.rmSync(webDir, { recursive: true, force: true });
      log(`Cleaned dist directory: ${webDir}`, 'yellow');
    } catch (error) {
      log(`Warning: Could not clean dist directory: ${error.message}`, 'yellow');
    }
  }
  
  // Always ensure dist directory is clean
  if (fs.existsSync(webDir)) {
    try {
      // Remove any existing content
      const items = fs.readdirSync(webDir);
      items.forEach(item => {
        const itemPath = path.join(webDir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          fs.rmSync(itemPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(itemPath);
        }
      });
      log(`🧹 Cleaned existing content in dist directory`, 'yellow');
    } catch (error) {
      log(`Warning: Could not clean existing content: ${error.message}`, 'yellow');
    }
  }
}

// Create profile index files for version directories
function createProfileIndexFiles(profilesDir, options = {}) {
  const categories = ['business', 'content', 'interaction', 'technology'];
  
  categories.forEach(category => {
    const categoryPath = path.join(profilesDir, category);
    if (!fs.existsSync(categoryPath)) return;
    
    const profileTypes = fs.readdirSync(categoryPath).filter(item => 
      fs.statSync(path.join(categoryPath, item)).isDirectory()
    );
    
    profileTypes.forEach(profileType => {
      const profilePath = path.join(categoryPath, profileType);
      const versions = fs.readdirSync(profilePath).filter(item => 
        fs.statSync(path.join(profilePath, item)).isDirectory() && 
        item.startsWith('v')
      );
      
      versions.forEach(version => {
        const versionPath = path.join(profilePath, version);
        const indexPath = path.join(versionPath, 'index.html');
        
        // Create a proper HTML page for the profile version
        const profileName = profileType.charAt(0).toUpperCase() + profileType.slice(1).replace(/-/g, ' ');
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${profileName} Profile - LLM Profiles</title>
    <meta name="description" content="${profileName} structured data profile for AI applications and SEO optimization">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e1e5e9; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; }
        .header p { color: #7f8c8d; }
        .content { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px; }
        .content h2 { color: #2c3e50; margin-top: 0; }
        .file-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .file-link { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e1e5e9; text-decoration: none; color: #3498db; display: block; }
        .file-link:hover { background: #f8f9fa; }
        .file-link h3 { margin: 0 0 10px 0; color: #2c3e50; }
        .file-link p { margin: 0; color: #6b7280; font-size: 0.9em; }
        .back-link { text-align: center; margin-top: 30px; }
        .back-link a { color: #3498db; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${profileName} Profile</h1>
        <p>${categoryName} Category - Version ${version}</p>
    </div>
    
    <div class="content">
        <h2>Profile Files</h2>
        <p>This directory contains the following files for the ${profileName} profile:</p>
        
        <div class="file-links">
            <a href="index.jsonld" class="file-link">
                <h3>Profile Definition</h3>
                <p>JSON-LD profile definition with all properties and constraints</p>
            </a>
            <a href="page.schema.json" class="file-link">
                <h3>Page Schema</h3>
                <p>JSON Schema for validating page markup</p>
            </a>
            <a href="output.schema.json" class="file-link">
                <h3>Output Schema</h3>
                <p>JSON Schema for RAG/ML output validation</p>
            </a>
            <a href="training.jsonl" class="file-link">
                <h3>Training Data</h3>
                <p>Sample training data in JSONL format</p>
            </a>
        </div>
        
        <div class="back-link">
            <a href="/profiles/">← Back to All Profiles</a> | 
            <a href="/profile-viewer.html">Profile Viewer</a> | 
            <a href="/">Home</a>
        </div>
    </div>
</body>
</html>`;
        
        if (options.dryRun) {
          log(`Would create profile index: ${indexPath}`, 'blue');
        } else {
          fs.writeFileSync(indexPath, indexHtml);
          if (options.verbose) {
            log(`Created profile index: ${profileType}/${version}/index.html`, 'green');
          }
                 }
       });
     });
   });
 }

// Create main profiles index.html
function createMainProfilesIndex(profilesDir, options = {}) {
  const indexPath = path.join(profilesDir, 'index.html');
  
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LLM Profiles - All Available Profiles</title>
    <meta name="description" content="Browse all available LLM Profiles for structured data, AI applications, and SEO optimization">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e1e5e9; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; }
        .header p { color: #7f8c8d; }
        .categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 30px 0; }
        .category { background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #3498db; }
        .category h2 { color: #2c3e50; margin-top: 0; margin-bottom: 20px; }
        .profile-list { list-style: none; padding: 0; }
        .profile-list li { margin-bottom: 15px; }
        .profile-list a { color: #3498db; text-decoration: none; font-weight: 500; display: block; padding: 10px; background: white; border-radius: 6px; border: 1px solid #e1e5e9; transition: all 0.3s ease; }
        .profile-list a:hover { background: #f8f9fa; border-color: #3498db; transform: translateY(-2px); }
        .profile-list .version { color: #6b7280; font-size: 0.9em; margin-left: 10px; }
        .back-link { text-align: center; margin-top: 40px; }
        .back-link a { color: #3498db; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>LLM Profiles</h1>
        <p>All Available Structured Data Profiles</p>
    </div>
    
    <div class="categories">
        <div class="category">
            <h2>Business Profiles</h2>
            <ul class="profile-list">
                <li><a href="business/localbusiness/v1/">Local Business <span class="version">v1</span></a></li>
                <li><a href="business/jobposting/v1/">Job Posting <span class="version">v1</span></a></li>
                <li><a href="business/product-offer/v1/">Product Offer <span class="version">v1</span></a></li>
                <li><a href="business/review/v1/">Review <span class="version">v1</span></a></li>
            </ul>
        </div>
        
        <div class="category">
            <h2>Content Profiles</h2>
            <ul class="profile-list">
                <li><a href="content/article/v1/">Article <span class="version">v1</span></a></li>
                <li><a href="content/book/v1/">Book <span class="version">v1</span></a></li>
                <li><a href="content/course/v1/">Course <span class="version">v1</span></a></li>
                <li><a href="content/dataset/v1/">Dataset <span class="version">v1</span></a></li>
                <li><a href="content/howto/v1/">How-to <span class="version">v1</span></a></li>
                <li><a href="content/recipe/v1/">Recipe <span class="version">v1</span></a></li>
                <li><a href="content/videoobject/v1/">Video Object <span class="version">v1</span></a></li>
            </ul>
        </div>
        
        <div class="category">
            <h2>Interaction Profiles</h2>
            <ul class="profile-list">
                <li><a href="interaction/faqpage/v1/">FAQ Page <span class="version">v1</span></a></li>
                <li><a href="interaction/qapage/v1/">Q&A Page <span class="version">v1</span></a></li>
                <li><a href="interaction/event/v1/">Event <span class="version">v1</span></a></li>
            </ul>
        </div>
        
        <div class="category">
            <h2>Technology Profiles</h2>
            <ul class="profile-list">
                <li><a href="technology/softwareapplication/v1/">Software Application <span class="version">v1</span></a></li>
                <li><a href="technology/software/v1/">Software <span class="version">v1</span></a></li>
            </ul>
        </div>
    </div>
    
    <div class="back-link">
        <a href="/profile-viewer.html">Interactive Profile Viewer</a> | 
        <a href="/tools/validator.html">Validator</a> | 
        <a href="/">Home</a>
    </div>
</body>
</html>`;
  
  if (options.dryRun) {
    log(`Would create main profiles index: ${indexPath}`, 'blue');
  } else {
    fs.writeFileSync(indexPath, indexHtml);
    if (options.verbose) {
      log(`Created main profiles index: profiles/index.html`, 'green');
    }
  }
}

// Create category index files
function createCategoryIndexFiles(profilesDir, options = {}) {
  const categories = [
    { name: 'business', title: 'Business Profiles', description: 'Profiles for business-related structured data' },
    { name: 'content', title: 'Content Profiles', description: 'Profiles for content and media structured data' },
    { name: 'interaction', title: 'Interaction Profiles', description: 'Profiles for user interaction and engagement' },
    { name: 'technology', title: 'Technology Profiles', description: 'Profiles for software and technology structured data' }
  ];
  
  categories.forEach(category => {
    const categoryPath = path.join(profilesDir, category.name);
    if (!fs.existsSync(categoryPath)) return;
    
    const indexPath = path.join(categoryPath, 'index.html');
    
    // Get list of profiles in this category
    const profileTypes = fs.readdirSync(categoryPath).filter(item => 
      fs.statSync(path.join(categoryPath, item)).isDirectory()
    );
    
    const profileLinks = profileTypes.map(profileType => {
      const profileName = profileType.charAt(0).toUpperCase() + profileType.slice(1).replace(/-/g, ' ');
      return `<li><a href="${profileType}/v1/">${profileName} <span class="version">v1</span></a></li>`;
    }).join('');
    
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${category.title} - LLM Profiles</title>
    <meta name="description" content="${category.description}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e1e5e9; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; }
        .header p { color: #7f8c8d; }
        .content { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px; }
        .content h2 { color: #2c3e50; margin-top: 0; }
        .profile-list { list-style: none; padding: 0; }
        .profile-list li { margin-bottom: 15px; }
        .profile-list a { color: #3498db; text-decoration: none; font-weight: 500; display: block; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e1e5e9; transition: all 0.3s ease; }
        .profile-list a:hover { background: #f8f9fa; border-color: #3498db; transform: translateY(-2px); }
        .profile-list .version { color: #6b7280; font-size: 0.9em; margin-left: 10px; }
        .back-link { text-align: center; margin-top: 30px; }
        .back-link a { color: #3498db; text-decoration: none; }
        .back-link a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${category.title}</h1>
        <p>${category.description}</p>
    </div>
    
    <div class="content">
        <h2>Available Profiles</h2>
        <ul class="profile-list">
            ${profileLinks}
        </ul>
        
        <div class="back-link">
            <a href="/profiles/">← Back to All Profiles</a> | 
            <a href="/profile-viewer.html">Profile Viewer</a> | 
            <a href="/">Home</a>
        </div>
    </div>
</body>
</html>`;
    
    if (options.dryRun) {
      log(`Would create category index: ${indexPath}`, 'blue');
    } else {
      fs.writeFileSync(indexPath, indexHtml);
      if (options.verbose) {
        log(`Created category index: ${category.name}/index.html`, 'green');
      }
    }
  });
}

// Create legacy redirects for backward compatibility
function createLegacyRedirects(webDir, options = {}) {
  const legacyProfileDirs = [
    'faqpage', 'qapage', 'article', 'product-offer', 'event', 
    'course', 'jobposting', 'localbusiness', 'softwareapplication', 'review',
    'book', 'dataset', 'howto', 'recipe', 'videoobject', 'software'
  ];

  legacyProfileDirs.forEach(profile => {
    const destPath = path.join(webDir, profile);
    
    if (!options.dryRun && !fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    // Create {profile}/index.html that redirects to profiles/ structure
    let redirectPath = '';
    if (['article', 'book', 'course', 'dataset', 'howto', 'recipe', 'videoobject'].includes(profile)) {
      redirectPath = `/profiles/content/${profile}/v1/`;
    } else if (['localbusiness', 'jobposting', 'product-offer', 'event'].includes(profile)) {
      redirectPath = `/profiles/business/${profile}/v1/`;
    } else if (['review', 'faqpage', 'qapage'].includes(profile)) {
      redirectPath = `/profiles/interaction/${profile}/v1/`;
    } else if (['softwareapplication', 'software'].includes(profile)) {
      redirectPath = `/profiles/technology/${profile}/v1/`;
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
  
  log('🏗️  Building llmprofiles website for GitHub Pages...', 'blue');
  log('');
  
  try {
    const webDir = ensureWebDir();
    cleanWebDir(webDir, options);
    
    // Copy web assets (the actual website)
    const webSrc = path.join(__dirname, '..', 'web');
    if (fs.existsSync(webSrc)) {
      log('🌐 Copying website files...', 'blue');
      copyDirAll(webSrc, webDir, options);
    }
    
    // Copy profiles directory structure (for API access)
    const profilesSrc = path.join(__dirname, '..', 'profiles');
    const profilesDest = path.join(webDir, 'profiles');
    if (fs.existsSync(profilesSrc)) {
      log('📁 Copying profiles...', 'blue');
      copyDirAll(profilesSrc, profilesDest, options);
      
      // Create index.html files for profile version directories
      log('📝 Creating profile index files...', 'blue');
      createProfileIndexFiles(profilesDest, options);
      
      // Create main profiles index.html
      log('📝 Creating main profiles index...', 'blue');
      createMainProfilesIndex(profilesDest, options);
      
      // Create category index files
      log('📝 Creating category index files...', 'blue');
      createCategoryIndexFiles(profilesDest, options);
    }
    
    // Copy schemas directory (for API access)
    const schemasSrc = path.join(__dirname, '..', 'schemas');
    const schemasDest = path.join(webDir, 'schemas');
    if (fs.existsSync(schemasSrc)) {
      log('🔧 Copying schemas...', 'blue');
      copyDirAll(schemasSrc, schemasDest, options);
    }
    
    // Copy examples directory (for documentation)
    const examplesSrc = path.join(__dirname, '..', 'examples');
    const examplesDest = path.join(webDir, 'examples');
    if (fs.existsSync(examplesSrc)) {
      log('💡 Copying examples...', 'blue');
      copyDirAll(examplesSrc, examplesDest, options);
    }
    
    // Copy training directory (for documentation)
    const trainingSrc = path.join(__dirname, '..', 'training');
    const trainingDest = path.join(webDir, 'training');
    if (fs.existsSync(trainingSrc)) {
      log('🎓 Copying training materials...', 'blue');
      copyDirAll(trainingSrc, trainingDest, options);
    }
    
    // Copy tools directory (for website functionality)
    const toolsSrc = path.join(__dirname, '..', 'tools');
    const toolsDest = path.join(webDir, 'tools');
    if (fs.existsSync(toolsSrc)) {
      log('🛠️  Copying tools...', 'blue');
      copyDirAll(toolsSrc, toolsDest, options);
    }
    
    // Copy main index files (for API access)
    const mainFiles = ['index.json', 'vocab.json'];
    log('📄 Copying main index files...', 'blue');
    mainFiles.forEach(file => {
      const srcPath = path.join(__dirname, '..', file);
      const destPath = path.join(webDir, file);
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
    
    // Copy images
    const imagesSrc = path.join(__dirname, '..', 'images');
    const imagesDest = path.join(webDir, 'images');
    if (fs.existsSync(imagesSrc)) {
      log('🖼️  Copying images...', 'blue');
      copyDirAll(imagesSrc, imagesDest, options);
    }
    
    // Copy logo
    const logoSrc = path.join(__dirname, '..', 'logo.png');
    const logoDest = path.join(webDir, 'logo.png');
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
    
    // Copy .well-known directory (important for domain verification)
    const wellKnownSrc = path.join(__dirname, '..', '.well-known');
    const wellKnownDest = path.join(webDir, '.well-known');
    if (fs.existsSync(wellKnownSrc)) {
      log('🔐 Copying .well-known directory...', 'blue');
      copyDirAll(wellKnownSrc, wellKnownDest, options);
    }
    
    // Create legacy redirects for backward compatibility
    log('🔄 Creating legacy redirects...', 'blue');
    createLegacyRedirects(webDir, options);
    
    // Create .nojekyll file to disable Jekyll processing
    const nojekyllPath = path.join(webDir, '.nojekyll');
    if (!options.dryRun) {
      fs.writeFileSync(nojekyllPath, '');
      log('📝 Created .nojekyll file', 'green');
    } else {
      log(`Would create: ${nojekyllPath}`, 'blue');
    }
    
    if (!options.dryRun) {
      log('');
      log('✅ Website build completed successfully!', 'green');
      log(`📁 Output directory: ${webDir}`, 'blue');
      log('🚀 Ready for deployment to GitHub Pages', 'green');
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
  ensureWebDir,
  copyDirAll,
  createLegacyRedirects
};

