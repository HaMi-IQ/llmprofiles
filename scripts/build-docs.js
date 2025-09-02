#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, '..', 'web', 'dist');
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
    } else if (item.endsWith('.json') || item.endsWith('.jsonld') || item.endsWith('.jsonl') || item.endsWith('.md') || item.endsWith('.html')) {
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

// Copy profiles directory structure
const profilesSrc = path.join(__dirname, '..', 'profiles');
const profilesDest = path.join(distDir, 'profiles');
if (fs.existsSync(profilesSrc)) {
  copyDirAll(profilesSrc, profilesDest);
}

// Create legacy redirects for backward compatibility
const legacyProfileDirs = [
  'faqpage', 'qapage', 'article', 'product-offer', 'event', 
  'course', 'jobposting', 'localbusiness', 'softwareapplication', 'review',
  'book', 'dataset', 'howto', 'recipe', 'videoobject', 'software'
];

legacyProfileDirs.forEach(profile => {
  const destPath = path.join(distDir, profile);
  if (!fs.existsSync(destPath)) {
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
  fs.writeFileSync(path.join(destPath, 'index.html'), profileIndexHtml);
});

// Copy main files
const mainFiles = ['index.json', 'README.md', 'CHANGELOG.md', 'LICENSE-CODE', 'LICENSE-CONTENT', 'vocab.json'];
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
const imagesSrc = path.join(__dirname, '..', 'web', 'images');
const imagesDest = path.join(distDir, 'images');
if (fs.existsSync(imagesSrc)) {
  copyDirAll(imagesSrc, imagesDest);
}

// Copy root logo if present
const logoSrc = path.join(__dirname, '..', 'web', 'logo.png');
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
fs.copyFileSync(path.join(__dirname, '..', 'web', 'CNAME'), path.join(distDir, 'CNAME'));

// Copy utility HTML pages
const utilityPages = ['faq.html', 'about.html'];
utilityPages.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy article pages
const articlePages = ['article/standardizing-structured-data.html'];
articlePages.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    // Ensure directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy course pages
const coursePages = ['courses/structured-data-101.html'];
coursePages.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    // Ensure directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy event pages
const eventPages = ['events/conference-2025.html', 'events/conference-2025/tickets.html'];
eventPages.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    // Ensure directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy tools directory
const toolsSrc = path.join(__dirname, '..', 'tools');
const toolsDest = path.join(distDir, 'tools');
if (fs.existsSync(toolsSrc)) {
  copyDirAll(toolsSrc, toolsDest);
}

// Copy blog directory
const blogSrc = path.join(__dirname, '..', 'web', 'blog');
const blogDest = path.join(distDir, 'blog');
if (fs.existsSync(blogSrc)) {
  copyDirAll(blogSrc, blogDest);
}
// Copy robots.txt, sitemap.xml, and _redirects if they exist
const seoFiles = ['robots.txt', 'sitemap.xml', '_redirects'];
seoFiles.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
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

// Ensure GitHub Pages does not run Jekyll (serves directories/files as-is)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('✅ Documentation built successfully in dist/ directory');

