#!/usr/bin/env node

/**
 * Automated Changelog Generator for LLM Profiles
 * Analyzes git commits and profile changes to generate meaningful changelog entries
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Profile types to track
const PROFILE_TYPES = [
  'article', 'book', 'course', 'dataset', 'event', 'faqpage', 'howto',
  'jobposting', 'localbusiness', 'product-offer', 'qapage', 'recipe',
  'review', 'softwareapplication', 'videoobject'
];

// Change categories
const CHANGE_CATEGORIES = {
  ADDED: 'Added',
  CHANGED: 'Changed',
  DEPRECATED: 'Deprecated',
  REMOVED: 'Removed',
  FIXED: 'Fixed',
  SECURITY: 'Security'
};

class ChangelogGenerator {
  constructor() {
    this.changes = {
      [CHANGE_CATEGORIES.ADDED]: [],
      [CHANGE_CATEGORIES.CHANGED]: [],
      [CHANGE_CATEGORIES.FIXED]: [],
      [CHANGE_CATEGORIES.DEPRECATED]: [],
      [CHANGE_CATEGORIES.REMOVED]: [],
      [CHANGE_CATEGORIES.SECURITY]: []
    };
  }

  /**
   * Get git commits since a specific reference
   */
  getCommitsSince(ref = 'HEAD~10') {
    try {
      const output = execSync(`git log --oneline --format="%H|%s|%an|%ad" --date=short ${ref}..HEAD`, { encoding: 'utf8' });
      return output.trim().split('\n').filter(line => line.length > 0).map(line => {
        const [hash, subject, author, date] = line.split('|');
        return { hash, subject, author, date };
      });
    } catch (error) {
      console.warn(`Warning: Could not get commits since ${ref}:`, error.message);
      return [];
    }
  }

  /**
   * Analyze commit message and categorize changes
   */
  categorizeCommit(commit) {
    const { subject } = commit;
    const lowerSubject = subject.toLowerCase();

    // Profile additions
    if (lowerSubject.includes('add') || lowerSubject.includes('new') || lowerSubject.includes('create')) {
      for (const profileType of PROFILE_TYPES) {
        if (lowerSubject.includes(profileType)) {
          this.changes[CHANGE_CATEGORIES.ADDED].push({
            ...commit,
            profile: profileType,
            description: subject
          });
          return;
        }
      }
    }

    // Profile updates
    if (lowerSubject.includes('update') || lowerSubject.includes('modify') || lowerSubject.includes('change')) {
      for (const profileType of PROFILE_TYPES) {
        if (lowerSubject.includes(profileType)) {
          this.changes[CHANGE_CATEGORIES.CHANGED].push({
            ...commit,
            profile: profileType,
            description: subject
          });
          return;
        }
      }
    }

    // Bug fixes
    if (lowerSubject.includes('fix') || lowerSubject.includes('bug') || lowerSubject.includes('issue')) {
      this.changes[CHANGE_CATEGORIES.FIXED].push({
        ...commit,
        description: subject
      });
      return;
    }

    // Security updates
    if (lowerSubject.includes('security') || lowerSubject.includes('vulnerability')) {
      this.changes[CHANGE_CATEGORIES.SECURITY].push({
        ...commit,
        description: subject
      });
      return;
    }

    // Schema changes
    if (lowerSubject.includes('schema') || lowerSubject.includes('validation')) {
      this.changes[CHANGE_CATEGORIES.CHANGED].push({
        ...commit,
        description: subject
      });
      return;
    }

    // Documentation updates
    if (lowerSubject.includes('doc') || lowerSubject.includes('readme') || lowerSubject.includes('example')) {
      this.changes[CHANGE_CATEGORIES.CHANGED].push({
        ...commit,
        description: subject
      });
      return;
    }

    // API changes
    if (lowerSubject.includes('api') || lowerSubject.includes('endpoint')) {
      this.changes[CHANGE_CATEGORIES.CHANGED].push({
        ...commit,
        description: subject
      });
      return;
    }

    // Default to added for new features
    this.changes[CHANGE_CATEGORIES.ADDED].push({
      ...commit,
      description: subject
    });
  }

  /**
   * Detect profile changes by analyzing file modifications
   */
  detectProfileChanges() {
    try {
      // Get list of modified files
      const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
      const modifiedFiles = output.trim().split('\n').filter(line => line.length > 0);

      for (const file of modifiedFiles) {
        // Check for profile index files
        if (file.match(/^(\w+)\/v\d+\/index\.jsonld$/)) {
          const profileType = file.split('/')[0];
          if (PROFILE_TYPES.includes(profileType)) {
            this.changes[CHANGE_CATEGORIES.CHANGED].push({
              hash: 'auto-detected',
              subject: `Updated ${profileType} profile`,
              author: 'auto-detection',
              date: new Date().toISOString().split('T')[0],
              profile: profileType,
              description: `Modified ${profileType} profile structure or metadata`
            });
          }
        }

        // Check for schema changes
        if (file.match(/^(\w+)\/v\d+\/.*\.schema\.json$/)) {
          const profileType = file.split('/')[0];
          if (PROFILE_TYPES.includes(profileType)) {
            this.changes[CHANGE_CATEGORIES.CHANGED].push({
              hash: 'auto-detected',
              subject: `Updated ${profileType} schemas`,
              author: 'auto-detection',
              date: new Date().toISOString().split('T')[0],
              profile: profileType,
              description: `Modified ${profileType} validation schemas`
            });
          }
        }

        // Check for new examples
        if (file.match(/^(\w+)\/v\d+\/examples\/.*\.jsonld$/)) {
          const profileType = file.split('/')[0];
          if (PROFILE_TYPES.includes(profileType)) {
            this.changes[CHANGE_CATEGORIES.ADDED].push({
              hash: 'auto-detected',
              subject: `Added ${profileType} examples`,
              author: 'auto-detection',
              date: new Date().toISOString().split('T')[0],
              profile: profileType,
              description: `Added new examples for ${profileType} profile`
            });
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Could not detect profile changes:', error.message);
    }
  }

  /**
   * Generate changelog content
   */
  generateChangelog(version = 'Unreleased', date = new Date().toISOString().split('T')[0]) {
    let changelog = `## [${version}] - ${date}\n\n`;

    // Add changes by category
    for (const [category, changes] of Object.entries(this.changes)) {
      if (changes.length > 0) {
        changelog += `### ${category}\n`;
        
        // Group by profile if applicable
        const profileGroups = {};
        const generalChanges = [];
        
        changes.forEach(change => {
          if (change.profile) {
            if (!profileGroups[change.profile]) {
              profileGroups[change.profile] = [];
            }
            profileGroups[change.profile].push(change);
          } else {
            generalChanges.push(change);
          }
        });

        // Add profile-specific changes
        for (const [profile, profileChanges] of Object.entries(profileGroups)) {
          changelog += `- **${profile}**: ${profileChanges.map(c => c.description).join(', ')}\n`;
        }

        // Add general changes
        generalChanges.forEach(change => {
          changelog += `- ${change.description}\n`;
        });

        changelog += '\n';
      }
    }

    return changelog;
  }

  /**
   * Update the main CHANGELOG.md file
   */
  updateChangelogFile(version = 'Unreleased') {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    let content = '';

    try {
      content = fs.readFileSync(changelogPath, 'utf8');
    } catch (error) {
      console.warn('Warning: Could not read CHANGELOG.md, creating new file');
      content = '# Changelog\n\nAll notable changes to this project will be documented here.\n\n';
    }

    // Find the [Unreleased] section
    const unreleasedIndex = content.indexOf('## [Unreleased]');
    if (unreleasedIndex !== -1) {
      // Replace [Unreleased] with the new version
      const newChangelog = this.generateChangelog(version);
      const beforeUnreleased = content.substring(0, unreleasedIndex);
      const afterUnreleased = content.substring(unreleasedIndex + '## [Unreleased]'.length);
      
      // Find the next section to get the content after [Unreleased]
      const nextSectionMatch = afterUnreleased.match(/## \[.*?\]/);
      const unreleasedContent = nextSectionMatch 
        ? afterUnreleased.substring(0, nextSectionMatch.index)
        : afterUnreleased;
      
      const finalContent = beforeUnreleased + newChangelog + unreleasedContent;
      fs.writeFileSync(changelogPath, finalContent);
    } else {
      // Add to the beginning after the header
      const headerEnd = content.indexOf('\n\n');
      const newChangelog = this.generateChangelog(version);
      const finalContent = content.substring(0, headerEnd + 2) + newChangelog + content.substring(headerEnd + 2);
      fs.writeFileSync(changelogPath, finalContent);
    }

    console.log(`✅ Updated CHANGELOG.md with version ${version}`);
  }

  /**
   * Generate a release summary
   */
  generateReleaseSummary() {
    const summary = {
      totalChanges: 0,
      profilesModified: new Set(),
      changeTypes: {}
    };

    for (const [category, changes] of Object.entries(this.changes)) {
      summary.totalChanges += changes.length;
      summary.changeTypes[category] = changes.length;
      
      changes.forEach(change => {
        if (change.profile) {
          summary.profilesModified.add(change.profile);
        }
      });
    }

    return summary;
  }

  /**
   * Main execution method
   */
  async run(options = {}) {
    const { 
      since = 'HEAD~10', 
      version = 'Unreleased', 
      updateFile = true,
      detectProfiles = true 
    } = options;

    console.log('🚀 Generating changelog...');
    console.log(`📅 Analyzing commits since: ${since}`);
    console.log(`🏷️  Version: ${version}`);

    // Get commits and categorize them
    const commits = this.getCommitsSince(since);
    console.log(`📝 Found ${commits.length} commits`);

    commits.forEach(commit => {
      this.categorizeCommit(commit);
    });

    // Detect profile changes if enabled
    if (detectProfiles) {
      console.log('🔍 Detecting profile changes...');
      this.detectProfileChanges();
    }

    // Generate changelog
    const changelog = this.generateChangelog(version);
    
    // Update file if requested
    if (updateFile) {
      this.updateChangelogFile(version);
    }

    // Generate summary
    const summary = this.generateReleaseSummary();
    
    console.log('\n📊 Change Summary:');
    console.log(`Total changes: ${summary.totalChanges}`);
    console.log(`Profiles modified: ${summary.profilesModified.size}`);
    console.log('Change types:', summary.changeTypes);
    
    if (summary.profilesModified.size > 0) {
      console.log(`Modified profiles: ${Array.from(summary.profilesModified).join(', ')}`);
    }

    return {
      changelog,
      summary,
      changes: this.changes
    };
  }
}

// CLI execution
if (require.main === module) {
  const generator = new ChangelogGenerator();
  
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--since':
        options.since = args[++i];
        break;
      case '--version':
        options.version = args[++i];
        break;
      case '--no-update-file':
        options.updateFile = false;
        break;
      case '--no-detect-profiles':
        options.detectProfiles = false;
        break;
      case '--help':
        console.log(`
Usage: node generate-changelog.js [options]

Options:
  --since <ref>           Git reference to analyze from (default: HEAD~10)
  --version <version>     Version number for changelog (default: Unreleased)
  --no-update-file        Don't update CHANGELOG.md file
  --no-detect-profiles    Don't auto-detect profile changes
  --help                  Show this help message

Examples:
  node generate-changelog.js --since HEAD~20 --version 1.1.0
  node generate-changelog.js --no-update-file
        `);
        process.exit(0);
    }
  }
  
  generator.run(options).catch(error => {
    console.error('❌ Error generating changelog:', error);
    process.exit(1);
  });
}

module.exports = ChangelogGenerator;
