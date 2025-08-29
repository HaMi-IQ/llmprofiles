#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all JSON and JSONLD files
function copyFiles(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath);
    } else if (item.endsWith('.json') || item.endsWith('.jsonld') || item.endsWith('.jsonl')) {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy directory recursively (all files and subfolders)
function copyDirAll(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirAll(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy profile directories
const profileDirs = [
  'faqpage', 'qapage', 'article', 'product-offer', 'event', 
  'course', 'jobposting', 'localbusiness', 'softwareapplication', 'review'
];

profileDirs.forEach(profile => {
  const srcPath = path.join(__dirname, '..', profile);
  const destPath = path.join(distDir, profile);
  if (fs.existsSync(srcPath)) {
    copyFiles(srcPath, destPath);
  }

  // Ensure profile directory exists in dist for index generation
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  // Create {profile}/index.html that redirects to v1/
  const profileIndexHtml = `<!doctype html><meta http-equiv="refresh" content="0; url=v1/">`;
  fs.writeFileSync(path.join(destPath, 'index.html'), profileIndexHtml);

  // Create {profile}/v1/index.html that redirects to index.jsonld
  const v1Path = path.join(destPath, 'v1');
  if (fs.existsSync(v1Path)) {
    const v1IndexHtml = `<!doctype html><meta http-equiv="refresh" content="0; url=index.jsonld">`;
    fs.writeFileSync(path.join(v1Path, 'index.html'), v1IndexHtml);
  }
});

// Copy main files
const mainFiles = ['index.json', 'README.md', 'CHANGELOG.md', 'LICENSE-CODE', 'LICENSE-CONTENT'];
mainFiles.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy docs directory
const docsSrc = path.join(__dirname, '..', 'docs');
const docsDest = path.join(distDir, 'docs');
if (fs.existsSync(docsSrc)) {
  copyFiles(docsSrc, docsDest);
}

// Generate placeholder images if needed
try {
  console.log('🖼️  Generating placeholder images...');
  const { execSync } = require('child_process');
  execSync('npm run generate-images', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Image generation failed, continuing with build...');
}

// Copy images directory (all files)
const imagesSrc = path.join(__dirname, '..', 'images');
const imagesDest = path.join(distDir, 'images');
if (fs.existsSync(imagesSrc)) {
  copyDirAll(imagesSrc, imagesDest);
}

// Copy root logo if present
const logoSrc = path.join(__dirname, '..', 'logo.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, path.join(distDir, 'logo.png'));
}

// Copy well-known directory
const wellKnownSrc = path.join(__dirname, '..', '.well-known');
const wellKnownDest = path.join(distDir, '.well-known');
if (fs.existsSync(wellKnownSrc)) {
  copyDirAll(wellKnownSrc, wellKnownDest);
}

// Copy examples directory
const examplesSrc = path.join(__dirname, '..', 'examples');
const examplesDest = path.join(distDir, 'examples');
if (fs.existsSync(examplesSrc)) {
  copyDirAll(examplesSrc, examplesDest);
}

// Copy CNAME
fs.copyFileSync(path.join(__dirname, '..', 'CNAME'), path.join(distDir, 'CNAME'));

// Copy robots.txt, sitemap.xml, and _redirects if they exist
const seoFiles = ['robots.txt', 'sitemap.xml', '_redirects'];
seoFiles.forEach(file => {
  const srcPath = path.join(__dirname, '..', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Generate API files
try {
  console.log('🔧 Generating API files...');
  const { execSync } = require('child_process');
  execSync('npm run generate-api', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  API generation failed, continuing with build...');
}

// Copy .gitignore to dist (but exclude node_modules and other build artifacts)
const gitignoreContent = `# Dependencies
node_modules/

# Build outputs
*.tgz
*.tar.gz

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Temporary folders
tmp/
temp/
`;

fs.writeFileSync(path.join(distDir, '.gitignore'), gitignoreContent);

console.log('✅ Documentation built successfully in dist/ directory');
