#!/usr/bin/env node

/**
 * NPM Package Publishing Script
 * Handles the complete publishing workflow with validation and safety checks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NPMPublisher {
  constructor() {
    this.packageDir = path.join(__dirname, '..');
    this.packageJson = require(path.join(this.packageDir, 'package.json'));
    this.currentVersion = this.packageJson.version;
  }

  /**
   * Run a command and return the output
   */
  runCommand(command, options = {}) {
    try {
      const result = execSync(command, { 
        cwd: this.packageDir, 
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options 
      });
      return result;
    } catch (error) {
      console.error(`❌ Command failed: ${command}`);
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Check if we're in a clean git state
   */
  checkGitStatus() {
    console.log('🔍 Checking Git status...');
    try {
      const status = this.runCommand('git status --porcelain', { silent: true });
      if (status.trim()) {
        console.error('❌ Working directory is not clean. Please commit or stash changes.');
        console.log('Uncommitted changes:');
        console.log(status);
        process.exit(1);
      }
      console.log('✅ Git working directory is clean');
    } catch (error) {
      console.log('⚠️  Git status check failed, continuing...');
    }
  }

  /**
   * Validate package.json configuration
   */
  validatePackageJson() {
    console.log('🔍 Validating package.json...');
    
    const required = ['name', 'version', 'description', 'main', 'module', 'types'];
    const missing = required.filter(field => !this.packageJson[field]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required fields in package.json:', missing);
      process.exit(1);
    }

    // Check exports configuration
    if (!this.packageJson.exports) {
      console.error('❌ Missing exports configuration in package.json');
      process.exit(1);
    }

    // Check individual profile exports
    const profileExports = Object.keys(this.packageJson.exports)
      .filter(key => key.startsWith('./profiles/'));
    
    if (profileExports.length < 10) {
      console.error('❌ Insufficient individual profile exports configured');
      process.exit(1);
    }

    console.log('✅ Package.json validation passed');
    console.log(`📊 Configured ${profileExports.length} individual profile exports`);
  }

  /**
   * Check if all required files exist
   */
  validateFiles() {
    console.log('🔍 Validating required files...');
    
    const requiredFiles = [
      'index.js',
      'index.mjs',
      'types/index.d.ts',
      'profiles/index.json',
      'lib/builder.js',
      'lib/builder.mjs',
      'lib/modes.js',
      'lib/modes.mjs',
      'lib/sanitizer.js',
      'lib/sanitizer.mjs',
      'lib/validator.js',
      'lib/validator.mjs',
      'README.md',
      'CHANGELOG.md'
    ];

    const missing = requiredFiles.filter(file => 
      !fs.existsSync(path.join(this.packageDir, file))
    );

    if (missing.length > 0) {
      console.error('❌ Missing required files:', missing);
      process.exit(1);
    }

    // Check individual profile files
    const profileFiles = fs.readdirSync(path.join(this.packageDir, 'profiles'))
      .filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
    
    if (profileFiles.length < 20) {
      console.error('❌ Insufficient individual profile files');
      process.exit(1);
    }

    console.log('✅ All required files present');
    console.log(`📄 Found ${profileFiles.length} individual profile files`);
  }

  /**
   * Run tests
   */
  runTests() {
    console.log('🧪 Running tests...');
    
    try {
      this.runCommand('npm test');
      console.log('✅ All tests passed');
    } catch (error) {
      console.error('❌ Tests failed');
      process.exit(1);
    }
  }

  /**
   * Build the package
   */
  buildPackage() {
    console.log('🔨 Building package...');
    
    try {
      this.runCommand('npm run build');
      console.log('✅ Package built successfully');
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }
  }

  /**
   * Check if version already exists on NPM
   */
  checkVersionExists() {
    console.log('🔍 Checking if version already exists on NPM...');
    
    try {
      const result = this.runCommand(`npm view ${this.packageJson.name}@${this.currentVersion} version`, { silent: true });
      if (result.trim()) {
        console.error(`❌ Version ${this.currentVersion} already exists on NPM`);
        console.log('Please bump the version before publishing');
        process.exit(1);
      }
    } catch (error) {
      // Version doesn't exist, which is what we want
      console.log('✅ Version is available for publishing');
    }
  }

  /**
   * Perform dry run publish
   */
  dryRunPublish() {
    console.log('🧪 Performing dry run publish...');
    
    try {
      this.runCommand('npm publish --dry-run');
      console.log('✅ Dry run successful');
    } catch (error) {
      console.error('❌ Dry run failed');
      process.exit(1);
    }
  }

  /**
   * Publish to NPM
   */
  publish() {
    console.log('🚀 Publishing to NPM...');
    
    try {
      this.runCommand('npm publish --access public');
      console.log('✅ Successfully published to NPM');
    } catch (error) {
      console.error('❌ Publishing failed');
      process.exit(1);
    }
  }

  /**
   * Verify publication
   */
  verifyPublication() {
    console.log('🔍 Verifying publication...');
    
    try {
      const result = this.runCommand(`npm view ${this.packageJson.name}@${this.currentVersion}`, { silent: true });
      const packageInfo = JSON.parse(result);
      
      console.log('✅ Package successfully published');
      console.log(`📦 Package: ${packageInfo.name}`);
      console.log(`📋 Version: ${packageInfo.version}`);
      console.log(`📊 Size: ${packageInfo.dist?.unpackedSize || 'Unknown'}`);
      console.log(`🔗 NPM URL: https://www.npmjs.com/package/${packageInfo.name}`);
    } catch (error) {
      console.error('❌ Verification failed');
      process.exit(1);
    }
  }

  /**
   * Test installation
   */
  testInstallation() {
    console.log('🧪 Testing installation...');
    
    const testDir = path.join(this.packageDir, 'test-install');
    
    try {
      // Clean up any existing test directory
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true });
      }
      
      fs.mkdirSync(testDir);
      
      // Create package.json
      fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({
        name: 'test-install',
        version: '1.0.0',
        type: 'module'
      }, null, 2));
      
      // Install the package
      execSync(`npm install ${this.packageJson.name}@${this.currentVersion}`, {
        cwd: testDir,
        stdio: 'inherit'
      });
      
      // Test CommonJS
      fs.writeFileSync(path.join(testDir, 'test-cjs.js'), `
        const pkg = require('${this.packageJson.name}');
        console.log('✅ CommonJS import works');
        console.log('📋 Available profiles:', pkg.listProfiles().length);
      `);
      
      execSync('node test-cjs.js', { cwd: testDir, stdio: 'inherit' });
      
      // Test ES modules
      fs.writeFileSync(path.join(testDir, 'test-esm.mjs'), `
        import { listProfiles, ArticleBuilder, MODES } from '${this.packageJson.name}';
        import { articleProfile } from '${this.packageJson.name}/profiles/article';
        
        console.log('✅ ES Module import works');
        console.log('📋 Available profiles:', listProfiles().length);
        console.log('📄 Individual profile import works:', articleProfile.type);
        
        const article = new ArticleBuilder(MODES.STRICT_SEO)
          .headline('Test')
          .build();
        console.log('✅ Builder works in ES modules');
      `);
      
      execSync('node test-esm.mjs', { cwd: testDir, stdio: 'inherit' });
      
      // Clean up
      fs.rmSync(testDir, { recursive: true });
      
      console.log('✅ Installation test passed');
    } catch (error) {
      console.error('❌ Installation test failed');
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Main publishing workflow
   */
  async publishPackage(options = {}) {
    console.log('🚀 Starting NPM package publishing workflow...\n');
    
    const steps = [
      { name: 'Git Status Check', fn: () => this.checkGitStatus() },
      { name: 'Package.json Validation', fn: () => this.validatePackageJson() },
      { name: 'Files Validation', fn: () => this.validateFiles() },
      { name: 'Tests', fn: () => this.runTests() },
      { name: 'Build', fn: () => this.buildPackage() },
      { name: 'Version Check', fn: () => this.checkVersionExists() },
      { name: 'Dry Run', fn: () => this.dryRunPublish() }
    ];

    // Run all validation steps
    for (const step of steps) {
      console.log(`\n📋 ${step.name}`);
      step.fn();
    }

    // Ask for confirmation before publishing
    if (!options.skipConfirmation) {
      console.log(`\n⚠️  Ready to publish ${this.packageJson.name}@${this.currentVersion}`);
      console.log('This will make the package available on NPM registry.');
      
      // In a real implementation, you might want to use readline for user input
      console.log('Proceeding with publication...');
    }

    // Publish
    console.log('\n📋 Publishing');
    this.publish();

    // Verify and test
    console.log('\n📋 Verification');
    this.verifyPublication();
    
    console.log('\n📋 Installation Test');
    this.testInstallation();

    console.log('\n🎉 Package successfully published and verified!');
    console.log(`📦 Package: ${this.packageJson.name}@${this.currentVersion}`);
    console.log(`🔗 NPM: https://www.npmjs.com/package/${this.packageJson.name}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    skipConfirmation: args.includes('--yes') || args.includes('-y')
  };

  const publisher = new NPMPublisher();
  publisher.publishPackage(options).catch(error => {
    console.error('❌ Publishing failed:', error.message);
    process.exit(1);
  });
}

module.exports = NPMPublisher;
