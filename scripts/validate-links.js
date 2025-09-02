#!/usr/bin/env node

/**
 * Link Validation Script
 * Validates all links in documentation and HTML files
 * Ensures they work with the new organized directory structure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class LinkValidator {
  constructor() {
    this.rootDir = process.cwd();
    this.issues = [];
    this.warnings = [];
    this.fixedLinks = [];
    
    // Files to check for links
    this.fileTypes = ['.md', '.html', '.json', '.jsonld'];
    
    // Link patterns to check
    this.linkPatterns = [
      // Markdown links: [text](url)
      /\[([^\]]+)\]\(([^)]+)\)/g,
      // HTML links: <a href="url">
      /href=["']([^"']+)["']/g,
      // JSON URLs: "url": "value"
      /"url":\s*"([^"]+)"/g,
      // Profile paths: /profile-name/
      /"([^"]*\/[^"]*\/[^"]*\.jsonld)"/g,
      // Schema paths: /profile-name/schema.json
      /"([^"]*\/[^"]*\/[^"]*\.schema\.json)"/g
    ];
    
    // Old vs new path mappings
    this.pathMappings = {
      '/article/': '/profiles/content/article/',
      '/book/': '/profiles/content/book/',
      '/course/': '/profiles/content/course/',
      '/dataset/': '/profiles/content/dataset/',
      '/howto/': '/profiles/content/howto/',
      '/recipe/': '/profiles/content/recipe/',
      '/videoobject/': '/profiles/content/videoobject/',
      '/localbusiness/': '/profiles/business/localbusiness/',
      '/jobposting/': '/profiles/business/jobposting/',
      '/product-offer/': '/profiles/business/product-offer/',
      '/review/': '/profiles/business/review/',
      '/faqpage/': '/profiles/interaction/faqpage/',
      '/qapage/': '/profiles/interaction/qapage/',
      '/event/': '/profiles/interaction/event/',
      '/softwareapplication/': '/profiles/technology/softwareapplication/'
    };
  }

  /**
   * Main validation method
   */
  async validateAllLinks() {
    console.log('🔗 Validating all links in documentation and HTML files...');
    console.log('========================================================');
    console.log('');

    // Find all files to check
    const filesToCheck = this.findFilesToCheck();
    console.log(`📁 Found ${filesToCheck.length} files to check for links`);
    console.log('');

    // Check each file
    for (const file of filesToCheck) {
      await this.validateFileLinks(file);
    }

    // Generate report
    this.generateReport();
    
    // Offer to fix broken links
    if (this.issues.length > 0) {
      await this.offerToFixLinks();
    }
  }

  /**
   * Find all files that need link validation
   */
  findFilesToCheck() {
    const files = [];
    
    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // Skip certain directories
          if (!['node_modules', '.git', 'dist'].includes(item)) {
            scanDirectory(itemPath);
          }
        } else if (this.fileTypes.some(ext => item.endsWith(ext))) {
          files.push(itemPath);
        }
      }
    };
    
    scanDirectory(this.rootDir);
    return files;
  }

  /**
   * Validate links in a single file
   */
  async validateFileLinks(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.rootDir, filePath);
      
      console.log(`🔍 Checking: ${relativePath}`);
      
      // Check for broken links
      const brokenLinks = this.findBrokenLinks(content, filePath);
      
      if (brokenLinks.length > 0) {
        this.issues.push({
          file: relativePath,
          links: brokenLinks
        });
        
        console.log(`  ❌ Found ${brokenLinks.length} broken links`);
        brokenLinks.forEach(link => {
          console.log(`    - ${link.original} → ${link.expected}`);
        });
      } else {
        console.log(`  ✅ No broken links found`);
      }
      
      // Check for old path patterns
      const oldPathLinks = this.findOldPathLinks(content, filePath);
      
      if (oldPathLinks.length > 0) {
        this.warnings.push({
          file: relativePath,
          links: oldPathLinks
        });
        
        console.log(`  ⚠️  Found ${oldPathLinks.length} old path patterns`);
        oldPathLinks.forEach(link => {
          console.log(`    - ${link.original} → ${link.expected}`);
        });
      }
      
    } catch (error) {
      console.log(`  ❌ Error reading file: ${error.message}`);
    }
  }

  /**
   * Find broken links in content
   */
  findBrokenLinks(content, filePath) {
    const brokenLinks = [];
    
    // Check for relative file paths that don't exist
    const relativePathPattern = /"([^"]*\.(?:json|jsonld|html|md))"/g;
    let match;
    
    while ((match = relativePathPattern.exec(content)) !== null) {
      const linkPath = match[1];
      
      // Skip external URLs and absolute paths
      if (linkPath.startsWith('http') || linkPath.startsWith('/')) {
        continue;
      }
      
      // Check if the file exists
      const fullPath = path.join(path.dirname(filePath), linkPath);
      if (!fs.existsSync(fullPath)) {
        brokenLinks.push({
          original: linkPath,
          expected: 'File not found',
          type: 'missing_file'
        });
      }
    }
    
    return brokenLinks;
  }

  /**
   * Find old path patterns that should be updated
   */
  findOldPathLinks(content, filePath) {
    const oldPathLinks = [];
    
    // Check for old profile paths
    Object.entries(this.pathMappings).forEach(([oldPath, newPath]) => {
      if (content.includes(oldPath)) {
        oldPathLinks.push({
          original: oldPath,
          expected: newPath,
          type: 'old_path'
        });
      }
    });
    
    return oldPathLinks;
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('');
    console.log('📊 Link Validation Report');
    console.log('=========================');
    console.log('');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ All links are valid! No issues found.');
      return;
    }

    if (this.issues.length > 0) {
      console.log('❌ Broken Links Found:');
      this.issues.forEach(issue => {
        console.log(`\n📄 ${issue.file}:`);
        issue.links.forEach(link => {
          console.log(`  - ${link.original} → ${link.expected}`);
        });
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Old Path Patterns Found:');
      this.warnings.forEach(warning => {
        console.log(`\n📄 ${warning.file}:`);
        warning.links.forEach(link => {
          console.log(`  - ${link.original} → ${link.expected}`);
        });
      });
      console.log('');
    }

    // Summary
    console.log('📈 Summary:');
    console.log(`  - Broken links: ${this.issues.length}`);
    console.log(`  - Old path patterns: ${this.warnings.length}`);
    console.log(`  - Total issues: ${this.issues.length + this.warnings.length}`);
    console.log('');
  }

  /**
   * Offer to fix broken links
   */
  async offerToFixLinks() {
    console.log('🔧 Would you like me to attempt to fix the broken links?');
    console.log('This will update files to use the new directory structure.');
    console.log('');
    
    // For now, just show what would be fixed
    console.log('📝 Links that would be fixed:');
    
    this.warnings.forEach(warning => {
      console.log(`\n📄 ${warning.file}:`);
      warning.links.forEach(link => {
        console.log(`  - ${link.original} → ${link.expected}`);
      });
    });
    
    console.log('');
    console.log('💡 To fix these automatically, run:');
    console.log('   npm run links:fix');
    console.log('');
  }

  /**
   * Fix broken links in files
   */
  async fixBrokenLinks() {
    console.log('🔧 Fixing broken links...');
    console.log('==========================');
    console.log('');

    let filesFixed = 0;
    let linksFixed = 0;

    // Fix old path patterns
    for (const warning of this.warnings) {
      const filePath = path.join(this.rootDir, warning.file);
      
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileChanged = false;

        // Replace old paths with new paths
        Object.entries(this.pathMappings).forEach(([oldPath, newPath]) => {
          if (content.includes(oldPath)) {
            const oldContent = content;
            // Use global replacement to catch all instances
            content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
            
            if (content !== oldContent) {
              fileChanged = true;
              // Count how many replacements were made
              const matches = (oldContent.match(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
              linksFixed += matches;
            }
          }
        });

        if (fileChanged) {
          fs.writeFileSync(filePath, content);
          filesFixed++;
          console.log(`✅ Fixed: ${warning.file}`);
        }

      } catch (error) {
        console.log(`❌ Error fixing ${warning.file}: ${error.message}`);
      }
    }

    console.log('');
    console.log(`🎉 Fixed ${linksFixed} links in ${filesFixed} files`);
    
    // Update index.json URLs if needed
    await this.updateIndexJsonUrls();
  }

  /**
   * Update index.json URLs to use new structure
   */
  async updateIndexJsonUrls() {
    const indexPath = path.join(this.rootDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
      return;
    }

    try {
      console.log('\n📝 Updating index.json URLs...');
      
      const content = fs.readFileSync(indexPath, 'utf8');
      let updatedContent = content;
      let urlsUpdated = 0;

      // Update profile URLs
      Object.entries(this.pathMappings).forEach(([oldPath, newPath]) => {
        const oldUrl = `https://llmprofiles.org${oldPath}`;
        const newUrl = `https://llmprofiles.org${newPath}`;
        
        if (updatedContent.includes(oldUrl)) {
          updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
          urlsUpdated++;
        }
      });

      if (updatedContent !== content) {
        fs.writeFileSync(indexPath, updatedContent);
        console.log(`✅ Updated ${urlsUpdated} URLs in index.json`);
      } else {
        console.log('ℹ️  No URLs needed updating in index.json');
      }

    } catch (error) {
      console.log(`❌ Error updating index.json: ${error.message}`);
    }
  }

  /**
   * Check specific file types
   */
  async validateSpecificFiles() {
    console.log('🔍 Validating specific file types...');
    console.log('====================================');
    console.log('');

    // Check README files
    const readmeFiles = this.findFilesByPattern('**/README.md');
    console.log(`📚 README files: ${readmeFiles.length}`);
    
    // Check HTML files
    const htmlFiles = this.findFilesByPattern('**/*.html');
    console.log(`🌐 HTML files: ${htmlFiles.length}`);
    
    // Check JSON files
    const jsonFiles = this.findFilesByPattern('**/*.json');
    console.log(`📋 JSON files: ${jsonFiles.length}`);
    
    // Check JSON-LD files
    const jsonldFiles = this.findFilesByPattern('**/*.jsonld');
    console.log(`🔗 JSON-LD files: ${jsonldFiles.length}`);
    
    console.log('');
  }

  /**
   * Find files by pattern
   */
  findFilesByPattern(pattern) {
    const files = [];
    
    const scanDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (!['node_modules', '.git', 'dist'].includes(item)) {
            scanDirectory(itemPath);
          }
        } else if (this.matchesPattern(itemPath, pattern)) {
          files.push(itemPath);
        }
      }
    };
    
    scanDirectory(this.rootDir);
    return files;
  }

  /**
   * Check if file matches pattern
   */
  matchesPattern(filePath, pattern) {
    const relativePath = path.relative(this.rootDir, filePath);
    
    // Simple pattern matching
    if (pattern === '**/README.md') {
      return relativePath.endsWith('README.md');
    } else if (pattern === '**/*.html') {
      return relativePath.endsWith('.html');
    } else if (pattern === '**/*.json') {
      return relativePath.endsWith('.json');
    } else if (pattern === '**/*.jsonld') {
      return relativePath.endsWith('.jsonld');
    }
    
    return false;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new LinkValidator();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'validate';
  
  switch (command) {
    case 'validate':
      validator.validateAllLinks().catch(error => {
        console.error('❌ Validation failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'fix':
      validator.validateAllLinks().then(() => {
        return validator.fixBrokenLinks();
      }).catch(error => {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'report':
      validator.validateSpecificFiles().then(() => {
        return validator.validateAllLinks();
      }).catch(error => {
        console.error('❌ Report failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'help':
      console.log(`
Usage: node validate-links.js [command]

Commands:
  validate    Validate all links (default)
  fix         Validate and fix broken links
  report      Generate detailed validation report
  help        Show this help message

Examples:
  node validate-links.js
  node validate-links.js fix
  node validate-links.js report
      `);
      break;
      
    default:
      console.log('Unknown command. Use "help" for usage information.');
      process.exit(1);
  }
}

module.exports = LinkValidator;
