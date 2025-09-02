#!/usr/bin/env node

/**
 * Release Management Script for LLM Profiles
 * Handles versioning, tagging, and release preparation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ChangelogGenerator = require('./generate-changelog');

class ReleaseManager {
  constructor() {
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  }

  /**
   * Get current version from package.json
   */
  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      throw new Error(`Could not read package.json: ${error.message}`);
    }
  }

  /**
   * Update version in package.json
   */
  updateVersion(newVersion) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
      const oldVersion = packageJson.version;
      packageJson.version = newVersion;
      
      fs.writeFileSync(this.packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✅ Updated package.json version: ${oldVersion} → ${newVersion}`);
      
      return oldVersion;
    } catch (error) {
      throw new Error(`Could not update package.json: ${error.message}`);
    }
  }

  /**
   * Validate version format
   */
  validateVersion(version) {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    if (!semverRegex.test(version)) {
      throw new Error(`Invalid version format: ${version}. Use semantic versioning (e.g., 1.0.0)`);
    }
    return true;
  }

  /**
   * Calculate next version based on type
   */
  calculateNextVersion(currentVersion, type = 'patch') {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        throw new Error(`Invalid version type: ${type}. Use major, minor, or patch`);
    }
  }

  /**
   * Check if working directory is clean
   */
  isWorkingDirectoryClean() {
    try {
      const output = execSync('git status --porcelain', { encoding: 'utf8' });
      return output.trim() === '';
    } catch (error) {
      console.warn('Warning: Could not check git status:', error.message);
      return true; // Assume clean if we can't check
    }
  }

  /**
   * Check if tag already exists
   */
  tagExists(tag) {
    try {
      execSync(`git rev-parse ${tag}`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get git remote origin URL
   */
  getRemoteOrigin() {
    try {
      return execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    } catch (error) {
      throw new Error('Could not get remote origin URL. Make sure you have a git remote configured.');
    }
  }

  /**
   * Create git tag
   */
  createTag(tag, message) {
    try {
      execSync(`git tag -a ${tag} -m "${message}"`, { stdio: 'inherit' });
      console.log(`✅ Created git tag: ${tag}`);
    } catch (error) {
      throw new Error(`Could not create git tag: ${error.message}`);
    }
  }

  /**
   * Push tag to remote
   */
  pushTag(tag) {
    try {
      execSync(`git push origin ${tag}`, { stdio: 'inherit' });
      console.log(`✅ Pushed tag ${tag} to remote`);
    } catch (error) {
      throw new Error(`Could not push tag: ${error.message}`);
    }
  }

  /**
   * Generate release notes
   */
  async generateReleaseNotes(version, since) {
    const generator = new ChangelogGenerator();
    const result = await generator.run({
      since: since || `v${this.getCurrentVersion()}`,
      version: version,
      updateFile: false
    });
    
    return result.changelog;
  }

  /**
   * Create GitHub release
   */
  async createGitHubRelease(tag, releaseNotes) {
    try {
      // Check if gh CLI is available
      execSync('gh --version', { stdio: 'ignore' });
      
      const releaseBody = releaseNotes.replace(/^## \[.*?\] - .*?\n\n/, '');
      
      execSync(`gh release create ${tag} --title "Release ${tag}" --notes "${releaseBody}"`, {
        stdio: 'inherit'
      });
      
      console.log(`✅ Created GitHub release: ${tag}`);
    } catch (error) {
      console.warn(`⚠️  Could not create GitHub release: ${error.message}`);
      console.log('💡 You can manually create a release at:');
      console.log(`   ${this.getRemoteOrigin().replace('.git', '')}/releases/new`);
      console.log(`   Tag: ${tag}`);
      console.log(`   Title: Release ${tag}`);
      console.log('   Description:');
      console.log(releaseNotes);
    }
  }

  /**
   * Prepare release
   */
  async prepareRelease(options = {}) {
    const {
      version,
      type = 'patch',
      since,
      createTag = true,
      pushTag = true,
      createRelease = true,
      dryRun = false
    } = options;

    console.log('🚀 Preparing release...');
    
    // Check working directory
    if (!this.isWorkingDirectoryClean()) {
      throw new Error('Working directory is not clean. Please commit or stash your changes.');
    }

    // Determine version
    let newVersion = version;
    if (!newVersion) {
      const currentVersion = this.getCurrentVersion();
      newVersion = this.calculateNextVersion(currentVersion, type);
    }

    // Validate version
    this.validateVersion(newVersion);
    
    if (dryRun) {
      console.log(`🔍 DRY RUN - Would update version to: ${newVersion}`);
      const releaseNotes = await this.generateReleaseNotes(newVersion, since);
      console.log('\n📝 Release notes:');
      console.log(releaseNotes);
      return { version: newVersion, releaseNotes };
    }

    // Update version in package.json
    const oldVersion = this.updateVersion(newVersion);

    // Generate changelog
    console.log('📝 Generating changelog...');
    const releaseNotes = await this.generateReleaseNotes(newVersion, since);

    // Update CHANGELOG.md
    const generator = new ChangelogGenerator();
    await generator.run({
      since: since || `v${oldVersion}`,
      version: newVersion,
      updateFile: true
    });

    // Commit changes
    try {
      execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
      execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
      console.log(`✅ Committed version bump to ${newVersion}`);
    } catch (error) {
      throw new Error(`Could not commit changes: ${error.message}`);
    }

    // Create tag
    if (createTag) {
      const tag = `v${newVersion}`;
      if (this.tagExists(tag)) {
        throw new Error(`Tag ${tag} already exists`);
      }
      
      this.createTag(tag, `Release ${tag}`);
      
      // Push tag
      if (pushTag) {
        this.pushTag(tag);
      }
    }

    // Create GitHub release
    if (createRelease && createTag) {
      const tag = `v${newVersion}`;
      await this.createGitHubRelease(tag, releaseNotes);
    }

    console.log(`🎉 Release ${newVersion} prepared successfully!`);
    
    return {
      version: newVersion,
      oldVersion,
      releaseNotes,
      tag: `v${newVersion}`
    };
  }

  /**
   * Show release status
   */
  async showStatus() {
    const currentVersion = this.getCurrentVersion();
    const isClean = this.isWorkingDirectoryClean();
    const remoteOrigin = this.getRemoteOrigin();
    
    console.log('📊 Release Status:');
    console.log(`Current version: ${currentVersion}`);
    console.log(`Working directory clean: ${isClean ? '✅' : '❌'}`);
    console.log(`Remote origin: ${remoteOrigin}`);
    
    // Check for unreleased changes
    try {
      const generator = new ChangelogGenerator();
      const result = await generator.run({
        since: `v${currentVersion}`,
        updateFile: false
      });
      
      console.log(`Unreleased changes: ${result.summary.totalChanges}`);
      if (result.summary.profilesModified.size > 0) {
        console.log(`Profiles modified: ${Array.from(result.summary.profilesModified).join(', ')}`);
      }
    } catch (error) {
      console.warn('Could not check unreleased changes:', error.message);
    }
  }
}

// CLI execution
if (require.main === module) {
  const manager = new ReleaseManager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'prepare':
      const options = {};
      for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
          case '--version':
            options.version = args[++i];
            break;
          case '--type':
            options.type = args[++i];
            break;
          case '--since':
            options.since = args[++i];
            break;
          case '--no-tag':
            options.createTag = false;
            break;
          case '--no-push':
            options.pushTag = false;
            break;
          case '--no-release':
            options.createRelease = false;
            break;
          case '--dry-run':
            options.dryRun = true;
            break;
          case '--help':
            console.log(`
Usage: node manage-release.js <command> [options]

Commands:
  prepare    Prepare a new release
  status     Show release status

Options for prepare:
  --version <version>     Specific version number
  --type <type>          Version type: major, minor, patch (default: patch)
  --since <ref>          Git reference to analyze from
  --no-tag               Don't create git tag
  --no-push              Don't push tag to remote
  --no-release           Don't create GitHub release
  --dry-run              Show what would be done without making changes
  --help                 Show this help message

Examples:
  node manage-release.js prepare --type minor
  node manage-release.js prepare --version 2.0.0 --dry-run
  node manage-release.js status
            `);
            process.exit(0);
        }
      }
      
      manager.prepareRelease(options).catch(error => {
        console.error('❌ Error preparing release:', error.message);
        process.exit(1);
      });
      break;
      
    case 'status':
      manager.showStatus().catch(error => {
        console.error('❌ Error showing status:', error.message);
        process.exit(1);
      });
      break;
      
    default:
      console.log('Usage: node manage-release.js <command>');
      console.log('Commands: prepare, status');
      console.log('Use --help for more information');
      process.exit(1);
  }
}

module.exports = ReleaseManager;
