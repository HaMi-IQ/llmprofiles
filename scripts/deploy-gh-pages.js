#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Deploying to GitHub Pages...');

// Build the website first
console.log('📦 Building website...');
try {
  execSync('npm run build:docs', { stdio: 'inherit' });
  console.log('✅ Build completed');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Not in a git repository');
  process.exit(1);
}

// Get current branch
const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
console.log(`📍 Current branch: ${currentBranch}`);

// Create or switch to gh-pages branch
try {
  // Check if gh-pages branch exists
  execSync('git show-ref --verify --quiet refs/heads/gh-pages', { stdio: 'pipe' });
  console.log('🔄 Switching to existing gh-pages branch...');
  execSync('git checkout gh-pages', { stdio: 'inherit' });
} catch (error) {
  console.log('🆕 Creating new gh-pages branch...');
  execSync('git checkout --orphan gh-pages', { stdio: 'inherit' });
}

// Remove all existing files
console.log('🧹 Cleaning gh-pages branch...');
execSync('git rm -rf .', { stdio: 'inherit' });

// Copy built files from web/dist to root
console.log('📁 Copying built files...');
const distDir = path.join(__dirname, '..', 'web', 'dist');
const files = fs.readdirSync(distDir);

files.forEach(file => {
  const srcPath = path.join(distDir, file);
  const destPath = path.join(__dirname, '..', file);
  
  if (fs.statSync(srcPath).isDirectory()) {
    // Copy directory recursively
    copyDirRecursive(srcPath, destPath);
  } else {
    // Copy file
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy .well-known directory from root (important for domain verification)
const wellKnownSrc = path.join(__dirname, '..', '.well-known');
const wellKnownDest = path.join(__dirname, '..', '.well-known');
if (fs.existsSync(wellKnownSrc)) {
  copyDirRecursive(wellKnownSrc, wellKnownDest);
}

// Copy CNAME and other important files
const importantFiles = ['CNAME', '_redirects', 'robots.txt', 'sitemap.xml'];
importantFiles.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'web', file);
  const destPath = path.join(__dirname, '..', file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Add all files
console.log('📝 Adding files to git...');
execSync('git add .', { stdio: 'inherit' });

// Commit
const commitMessage = `Deploy website - ${new Date().toISOString()}`;
console.log('💾 Committing changes...');
execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

// Push to gh-pages branch
console.log('🚀 Pushing to gh-pages branch...');
execSync('git push origin gh-pages --force', { stdio: 'inherit' });

// Switch back to original branch
console.log(`🔄 Switching back to ${currentBranch} branch...`);
execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });

console.log('🎉 Deployment completed!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Go to your repository Settings > Pages');
console.log('2. Set Source to "Deploy from a branch"');
console.log('3. Select "gh-pages" branch and "/ (root)" folder');
console.log('4. Save the configuration');
console.log('');
console.log('🌐 Your website will be available at: https://llmprofiles.org');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
