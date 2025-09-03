#!/usr/bin/env node

/**
 * Clean up gh-pages branch to contain only built website files
 */

const { execSync } = require('child_process');

console.log('🧹 Cleaning up gh-pages branch...');

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

if (currentBranch === 'gh-pages') {
  console.error('❌ Already on gh-pages branch. Please run this from main branch.');
  process.exit(1);
}

// Switch to gh-pages branch
try {
  console.log('🔄 Switching to gh-pages branch...');
  execSync('git checkout gh-pages', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Could not switch to gh-pages branch');
  process.exit(1);
}

// Remove all files
console.log('🧹 Removing all files from gh-pages branch...');
execSync('git rm -rf .', { stdio: 'inherit' });

// Create a simple placeholder
console.log('📝 Creating placeholder file...');
execSync('echo "Website will be deployed here" > README.md', { stdio: 'inherit' });

// Add and commit
console.log('💾 Committing cleanup...');
execSync('git add README.md', { stdio: 'inherit' });
execSync('git commit -m "Clean gh-pages branch for fresh deployment"', { stdio: 'inherit' });

// Push
console.log('🚀 Pushing cleaned gh-pages branch...');
execSync('git push origin gh-pages', { stdio: 'inherit' });

// Switch back to original branch
console.log(`🔄 Switching back to ${currentBranch} branch...`);
execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });

console.log('✅ Gh-pages branch cleaned successfully!');
console.log('🚀 Ready for fresh deployment with: npm run deploy');
