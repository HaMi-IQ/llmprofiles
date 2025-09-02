#!/usr/bin/env node

/**
 * Fix Double Paths Script
 * Fixes the double path replacements that occurred during link fixing
 */

const fs = require('fs');
const path = require('path');

class DoublePathFixer {
  constructor() {
    this.rootDir = process.cwd();
    
    // Patterns to fix double paths
    this.doublePathPatterns = [
      {
        pattern: /profiles\/content\/profiles\/content\//g,
        replacement: 'profiles/content/'
      },
      {
        pattern: /profiles\/business\/profiles\/business\//g,
        replacement: 'profiles/business/'
      },
      {
        pattern: /profiles\/interaction\/profiles\/interaction\//g,
        replacement: 'profiles/interaction/'
      },
      {
        pattern: /profiles\/technology\/profiles\/technology\//g,
        replacement: 'profiles/technology/'
      }
    ];
  }

  /**
   * Fix double paths in all files
   */
  async fixDoublePaths() {
    console.log('🔧 Fixing double path replacements...');
    console.log('=====================================');
    console.log('');

    let filesFixed = 0;
    let totalReplacements = 0;

    // Find all files that might have double paths
    const filesToCheck = this.findFilesToCheck();
    console.log(`📁 Found ${filesToCheck.length} files to check for double paths`);
    console.log('');

    for (const file of filesToCheck) {
      const result = await this.fixFileDoublePaths(file);
      if (result.fixed) {
        filesFixed++;
        totalReplacements += result.replacements;
        console.log(`✅ Fixed: ${result.file} (${result.replacements} replacements)`);
      }
    }

    console.log('');
    console.log(`🎉 Fixed ${totalReplacements} double paths in ${filesFixed} files`);
  }

  /**
   * Find files to check
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
          if (!['node_modules', '.git', 'dist'].includes(item)) {
            scanDirectory(itemPath);
          }
        } else if (this.shouldCheckFile(itemPath)) {
          files.push(itemPath);
        }
      }
    };
    
    scanDirectory(this.rootDir);
    return files;
  }

  /**
   * Check if file should be examined
   */
  shouldCheckFile(filePath) {
    const ext = path.extname(filePath);
    return ['.md', '.html', '.json', '.jsonld'].includes(ext);
  }

  /**
   * Fix double paths in a single file
   */
  async fixFileDoublePaths(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.rootDir, filePath);
      
      let updatedContent = content;
      let totalReplacements = 0;

      // Apply all double path fixes
      for (const fix of this.doublePathPatterns) {
        const matches = (updatedContent.match(fix.pattern) || []).length;
        if (matches > 0) {
          updatedContent = updatedContent.replace(fix.pattern, fix.replacement);
          totalReplacements += matches;
        }
      }

      if (totalReplacements > 0) {
        fs.writeFileSync(filePath, updatedContent);
        return {
          file: relativePath,
          fixed: true,
          replacements: totalReplacements
        };
      }

      return {
        file: relativePath,
        fixed: false,
        replacements: 0
      };

    } catch (error) {
      console.log(`❌ Error fixing ${filePath}: ${error.message}`);
      return {
        file: path.relative(this.rootDir, filePath),
        fixed: false,
        replacements: 0
      };
    }
  }

  /**
   * Show what would be fixed
   */
  async showDoublePaths() {
    console.log('🔍 Scanning for double path patterns...');
    console.log('=======================================');
    console.log('');

    const filesToCheck = this.findFilesToCheck();
    let totalFilesWithIssues = 0;
    let totalIssues = 0;

    for (const file of filesToCheck) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(this.rootDir, filePath);
        let fileIssues = 0;

        for (const fix of this.doublePathPatterns) {
          const matches = (content.match(fix.pattern) || []).length;
          if (matches > 0) {
            if (fileIssues === 0) {
              console.log(`📄 ${relativePath}:`);
            }
            console.log(`  - ${fix.pattern.source} → ${fix.replacement} (${matches} instances)`);
            fileIssues += matches;
          }
        }

        if (fileIssues > 0) {
          totalFilesWithIssues++;
          totalIssues += fileIssues;
          console.log('');
        }

      } catch (error) {
        // Skip files we can't read
      }
    }

    console.log(`📊 Found ${totalIssues} double path issues in ${totalFilesWithIssues} files`);
  }
}

// CLI execution
if (require.main === module) {
  const fixer = new DoublePathFixer();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'fix';
  
  switch (command) {
    case 'fix':
      fixer.fixDoublePaths().catch(error => {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'show':
      fixer.showDoublePaths().catch(error => {
        console.error('❌ Show failed:', error.message);
        process.exit(1);
      });
      break;
      
    case 'help':
      console.log(`
Usage: node fix-double-paths.js [command]

Commands:
  fix         Fix double path replacements (default)
  show        Show what double paths exist
  help        Show this help message

Examples:
  node fix-double-paths.js
  node fix-double-paths.js show
      `);
      break;
      
    default:
      console.log('Unknown command. Use "help" for usage information.');
      process.exit(1);
  }
}

module.exports = DoublePathFixer;
