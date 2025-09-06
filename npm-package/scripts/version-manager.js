#!/usr/bin/env node

/**
 * Version Management Script
 * Handles version bumping, changelog updates, and release preparation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionManager {
  constructor() {
    this.packageDir = path.join(__dirname, '..');
    this.packageJsonPath = path.join(this.packageDir, 'package.json');
    this.changelogPath = path.join(this.packageDir, 'CHANGELOG.md');
    this.packageJson = require(this.packageJsonPath);
    this.currentVersion = this.packageJson.version;
  }

  /**
   * Parse version string into components
   */
  parseVersion(version) {
    // Handle prerelease versions like "1.0.1-alpha.7"
    const baseVersion = version.split('-')[0]; // Remove prerelease part
    const [major, minor, patch] = baseVersion.split('.').map(Number);
    return { major, minor, patch };
  }

  /**
   * Bump version based on type
   */
  bumpVersion(type) {
    const { major, minor, patch } = this.parseVersion(this.currentVersion);
    let newVersion;

    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      case 'prerelease':
        newVersion = `${major}.${minor}.${patch}-alpha.1`;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    return newVersion;
  }

  /**
   * Get next version for display purposes
   */
  getNextVersion(type) {
    const { major, minor, patch } = this.parseVersion(this.currentVersion);
    let newVersion;

    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
      case 'prerelease':
        newVersion = `${major}.${minor}.${patch}-alpha.1`;
        break;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }

    return newVersion;
  }

  /**
   * Update package.json version
   */
  updatePackageJson(newVersion) {
    this.packageJson.version = newVersion;
    fs.writeFileSync(
      this.packageJsonPath, 
      JSON.stringify(this.packageJson, null, 2) + '\n'
    );
    console.log(`✅ Updated package.json version to ${newVersion}`);
  }

  /**
   * Update changelog
   */
  updateChangelog(newVersion, type, notes = []) {
    if (!fs.existsSync(this.changelogPath)) {
      this.createChangelog();
    }

    const changelog = fs.readFileSync(this.changelogPath, 'utf8');
    const date = new Date().toISOString().split('T')[0];
    
    const releaseNotes = [
      `## [${newVersion}] - ${date}`,
      '',
      ...notes.map(note => `- ${note}`),
      ''
    ].join('\n');

    const newChangelog = changelog.replace(
      /^## \[Unreleased\]/m,
      `## [Unreleased]\n\n${releaseNotes}`
    );

    fs.writeFileSync(this.changelogPath, newChangelog);
    console.log(`✅ Updated CHANGELOG.md with version ${newVersion}`);
  }

  /**
   * Create initial changelog if it doesn't exist
   */
  createChangelog() {
    const initialChangelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release with ES module support
- Individual profile imports
- 15 core Schema.org profiles
- Three output modes (Strict SEO, Split Channels, Standards Header)
- Comprehensive TypeScript definitions
- Input sanitization and validation
- Builder pattern for easy structured data creation

### Features
- **ES Module Support**: Import individual profiles without loading entire package
- **Tree Shaking**: Optimized for modern bundlers
- **Backward Compatibility**: Full CommonJS support maintained
- **TypeScript**: Complete type definitions for all features
- **Security**: Built-in input sanitization
- **Validation**: Comprehensive data validation with Google Rich Results compliance
`;

    fs.writeFileSync(this.changelogPath, initialChangelog);
    console.log('✅ Created initial CHANGELOG.md');
  }

  /**
   * Generate release notes based on git commits
   */
  generateReleaseNotes(fromVersion, toVersion) {
    try {
      const commits = execSync(
        `git log --oneline --pretty=format:"%s" ${fromVersion}..HEAD`,
        { cwd: this.packageDir, encoding: 'utf8' }
      ).trim().split('\n').filter(Boolean);

      const features = [];
      const fixes = [];
      const breaking = [];

      commits.forEach(commit => {
        const message = commit.toLowerCase();
        if (message.includes('feat:') || message.includes('feature:')) {
          features.push(commit);
        } else if (message.includes('fix:') || message.includes('bug:')) {
          fixes.push(commit);
        } else if (message.includes('breaking:') || message.includes('!:')) {
          breaking.push(commit);
        }
      });

      const notes = [];
      if (breaking.length > 0) {
        notes.push('### Breaking Changes');
        breaking.forEach(change => notes.push(change));
        notes.push('');
      }
      if (features.length > 0) {
        notes.push('### Added');
        features.forEach(change => notes.push(change));
        notes.push('');
      }
      if (fixes.length > 0) {
        notes.push('### Fixed');
        fixes.forEach(change => notes.push(change));
        notes.push('');
      }

      return notes;
    } catch (error) {
      console.log('⚠️  Could not generate release notes from git commits');
      return ['- General improvements and bug fixes'];
    }
  }

  /**
   * Create git tag for the version
   */
  createGitTag(version) {
    try {
      execSync(`git tag -a v${version} -m "Release version ${version}"`, {
        cwd: this.packageDir,
        stdio: 'inherit'
      });
      console.log(`✅ Created git tag v${version}`);
    } catch (error) {
      console.log('⚠️  Could not create git tag:', error.message);
    }
  }

  /**
   * Commit version changes
   */
  commitChanges(version) {
    try {
      execSync('git add package.json CHANGELOG.md', {
        cwd: this.packageDir,
        stdio: 'inherit'
      });
      
      execSync(`git commit -m "chore: bump version to ${version}"`, {
        cwd: this.packageDir,
        stdio: 'inherit'
      });
      
      console.log(`✅ Committed version changes for ${version}`);
    } catch (error) {
      console.log('⚠️  Could not commit changes:', error.message);
    }
  }

  /**
   * Main version bump workflow
   */
  async bumpVersion(type, options = {}) {
    console.log(`🚀 Bumping version from ${this.currentVersion}...\n`);

    const newVersion = this.getNextVersion(type);
    console.log(`📋 New version: ${newVersion}`);

    // Update package.json
    console.log('\n📋 Updating package.json...');
    this.updatePackageJson(newVersion);

    // Generate release notes
    console.log('\n📋 Generating release notes...');
    const releaseNotes = options.notes || this.generateReleaseNotes(this.currentVersion, newVersion);

    // Update changelog
    console.log('\n📋 Updating changelog...');
    this.updateChangelog(newVersion, type, releaseNotes);

    // Commit changes
    if (!options.skipCommit) {
      console.log('\n📋 Committing changes...');
      this.commitChanges(newVersion);
    }

    // Create git tag
    if (!options.skipTag) {
      console.log('\n📋 Creating git tag...');
      this.createGitTag(newVersion);
    }

    console.log(`\n🎉 Version bumped to ${newVersion}`);
    console.log(`📦 Package: ${this.packageJson.name}@${newVersion}`);
    
    if (!options.skipCommit) {
      console.log('\n📋 Next steps:');
      console.log('1. Review the changes: git log --oneline -5');
      console.log('2. Push changes: git push origin main --tags');
      console.log('3. Publish to NPM: npm run publish');
    }

    return newVersion;
  }

  /**
   * Show current version info
   */
  showVersionInfo() {
    console.log('📦 Package Version Information\n');
    console.log(`Package: ${this.packageJson.name}`);
    console.log(`Current Version: ${this.currentVersion}`);
    console.log(`Description: ${this.packageJson.description}`);
    
    const { major, minor, patch } = this.parseVersion(this.currentVersion);
    console.log(`\nVersion Components:`);
    console.log(`- Major: ${major}`);
    console.log(`- Minor: ${minor}`);
    console.log(`- Patch: ${patch}`);
    
    console.log(`\nNext Versions:`);
    console.log(`- Patch: ${this.getNextVersion('patch')}`);
    console.log(`- Minor: ${this.getNextVersion('minor')}`);
    console.log(`- Major: ${this.getNextVersion('major')}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const options = {
    skipCommit: args.includes('--no-commit'),
    skipTag: args.includes('--no-tag'),
    notes: args.includes('--notes') ? args[args.indexOf('--notes') + 1]?.split(',') : null
  };

  const versionManager = new VersionManager();

  switch (command) {
    case 'bump':
      const type = args[1] || 'patch';
      if (!['major', 'minor', 'patch', 'prerelease'].includes(type)) {
        console.error('❌ Invalid version type. Use: major, minor, patch, or prerelease');
        process.exit(1);
      }
      versionManager.bumpVersion(type, options);
      break;
      
    case 'info':
      versionManager.showVersionInfo();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node scripts/version-manager.js bump [major|minor|patch|prerelease]');
      console.log('  node scripts/version-manager.js info');
      console.log('');
      console.log('Options:');
      console.log('  --no-commit    Skip git commit');
      console.log('  --no-tag       Skip git tag creation');
      console.log('  --notes        Custom release notes (comma-separated)');
  }
}

module.exports = VersionManager;
