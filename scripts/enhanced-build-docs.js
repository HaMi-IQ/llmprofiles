#!/usr/bin/env node

/**
 * Enhanced Build documentation script for llmprofiles
 * Uses the new template system to create scalable, SEO-optimized pages
 */

const fs = require('fs');
const path = require('path');
const TemplateEngine = require('./template-engine');

// Profile metadata - centralized configuration
const PROFILE_METADATA = {
    // Business profiles
    'localbusiness': { 
        name: 'Local Business', 
        icon: '🏢', 
        category: 'business',
        schemaType: 'LocalBusiness',
        description: 'Structured data for local business listings and information'
    },
    'jobposting': { 
        name: 'Job Posting', 
        icon: '💼', 
        category: 'business',
        schemaType: 'JobPosting',
        description: 'Job advertisements and career opportunities'
    },
    'product-offer': { 
        name: 'Product Offer', 
        icon: '🛍️', 
        category: 'business',
        schemaType: 'Product',
        description: 'E-commerce product listings and offers'
    },
    'review': { 
        name: 'Review', 
        icon: '⭐', 
        category: 'business',
        schemaType: 'Review',
        description: 'Product and service reviews with ratings'
    },
    
    // Content profiles
    'article': { 
        name: 'Article', 
        icon: '📰', 
        category: 'content',
        schemaType: 'Article',
        description: 'Blog posts, articles, and editorial content'
    },
    'book': { 
        name: 'Book', 
        icon: '📚', 
        category: 'content',
        schemaType: 'Book',
        description: 'Books, eBooks, and published literature'
    },
    'course': { 
        name: 'Course', 
        icon: '🎓', 
        category: 'content',
        schemaType: 'Course',
        description: 'Educational courses and training programs'
    },
    'dataset': { 
        name: 'Dataset', 
        icon: '📊', 
        category: 'content',
        schemaType: 'Dataset',
        description: 'Data collections and scientific datasets'
    },
    'howto': { 
        name: 'How-to', 
        icon: '📝', 
        category: 'content',
        schemaType: 'HowTo',
        description: 'Step-by-step guides and tutorials'
    },
    'recipe': { 
        name: 'Recipe', 
        icon: '🍳', 
        category: 'content',
        schemaType: 'Recipe',
        description: 'Cooking recipes and food preparation'
    },
    'videoobject': { 
        name: 'Video Object', 
        icon: '🎥', 
        category: 'content',
        schemaType: 'VideoObject',
        description: 'Videos and multimedia content'
    },
    
    // Interaction profiles
    'faqpage': { 
        name: 'FAQ Page', 
        icon: '❓', 
        category: 'interaction',
        schemaType: 'FAQPage',
        description: 'Frequently asked questions pages'
    },
    'qapage': { 
        name: 'Q&A Page', 
        icon: '💬', 
        category: 'interaction',
        schemaType: 'QAPage',
        description: 'Question and answer pages'
    },
    'event': { 
        name: 'Event', 
        icon: '📅', 
        category: 'interaction',
        schemaType: 'Event',
        description: 'Events, conferences, and scheduled activities'
    },
    
    // Technology profiles
    'softwareapplication': { 
        name: 'Software Application', 
        icon: '💻', 
        category: 'technology',
        schemaType: 'SoftwareApplication',
        description: 'Software products and applications'
    },
    'software': { 
        name: 'Software', 
        icon: '⚙️', 
        category: 'technology',
        schemaType: 'SoftwareSourceCode',
        description: 'Software projects and source code'
    }
};

const CATEGORY_METADATA = {
    'business': {
        name: 'Business',
        title: 'Business Profiles',
        description: 'Structured data profiles for business-related content including local business listings, job postings, product offers, and reviews.',
        icon: '🏢'
    },
    'content': {
        name: 'Content',
        title: 'Content Profiles', 
        description: 'Profiles for various content types including articles, books, courses, datasets, and multimedia content.',
        icon: '📄'
    },
    'interaction': {
        name: 'Interaction',
        title: 'Interaction Profiles',
        description: 'Structured data for user interactions including FAQ pages, Q&A pages, and events.',
        icon: '🤝'
    },
    'technology': {
        name: 'Technology',
        title: 'Technology Profiles',
        description: 'Profiles for software applications, development tools, and technology-related content.',
        icon: '💻'
    }
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
    console.log(`
Usage: node enhanced-build-docs.js [options]

Options:
  --help        Show this help message
  --verbose     Show detailed output for each operation
  --clean       Clean web directory before building
  --dry-run     Show what would be generated without actually generating

Examples:
  node enhanced-build-docs.js
  node enhanced-build-docs.js --verbose
  node enhanced-build-docs.js --clean --verbose
  node enhanced-build-docs.js --dry-run
  `);
    process.exit(0);
}

class EnhancedDocBuilder {
    constructor(options = {}) {
        this.options = options;
        this.engine = new TemplateEngine();
        this.webDir = path.join(__dirname, '..', 'web');
    }

    // Generate enhanced profile page
    generateProfilePage(profileKey, version = 'v1') {
        const metadata = PROFILE_METADATA[profileKey];
        if (!metadata) {
            log(`Warning: No metadata found for profile: ${profileKey}`, 'yellow');
            return;
        }

        const category = CATEGORY_METADATA[metadata.category];
        const profileDir = path.join(this.webDir, 'profiles', metadata.category, profileKey, version);
        
        // Load profile definition if available
        let profileData = {};
        const profileDefPath = path.join(__dirname, '..', 'profiles', metadata.category, profileKey, version, 'index.jsonld');
        if (fs.existsSync(profileDefPath)) {
            try {
                const content = fs.readFileSync(profileDefPath, 'utf8');
                profileData = JSON.parse(content);
            } catch (error) {
                log(`Warning: Could not parse profile definition for ${profileKey}: ${error.message}`, 'yellow');
            }
        }

        // Create page data
        const pageData = this.engine.createPageData({
            title: `${metadata.name} Profile - LLMProfiles`,
            description: `${metadata.description}. Schema.org ${metadata.schemaType} profile for AI applications and structured data.`,
            keywords: `${metadata.name.toLowerCase()}, ${metadata.schemaType.toLowerCase()}, structured data, schema.org, json-ld, ai, llm`,
            path: `/profiles/${metadata.category}/${profileKey}/${version}/`,
            
            // Template variables
            profile_name: metadata.name,
            profile_key: profileKey,
            profile_icon: metadata.icon,
            profile_description: metadata.description,
            category_name: category.name,
            schema_type: metadata.schemaType,
            version: version,
            profile_url: `https://llmprofiles.org/profiles/${metadata.category}/${profileKey}/${version}/`,
            
            // Navigation
            nav_profiles: true,
            
            // Breadcrumbs
            breadcrumbs: [
                { title: 'Home', url: '/' },
                { title: 'Profiles', url: '/profiles/' },
                { title: category.name, url: `/profiles/${metadata.category}/` },
                { title: metadata.name }
            ],
            
            // Profile-specific data
            use_cases: profileData['x:useCases'] || [],
            dos: profileData['x:dos'] || [],
            donts: profileData['x:donts'] || []
        });

        // Add structured data
        pageData.structured_data = this.engine.generateStructuredData('WebPage', {
            title: pageData.title,
            description: pageData.description,
            canonical_url: pageData.canonical_url,
            dateModified: new Date().toISOString()
        }) + this.engine.generateBreadcrumbData(pageData.breadcrumbs);

        // Render the page
        const html = this.engine.renderWithBase('profile-detail', pageData);
        
        // Ensure directory exists
        if (!this.options.dryRun && !fs.existsSync(profileDir)) {
            fs.mkdirSync(profileDir, { recursive: true });
        }
        
        const outputPath = path.join(profileDir, 'index.html');
        
        if (this.options.dryRun) {
            log(`Would generate: ${outputPath}`, 'blue');
        } else {
            fs.writeFileSync(outputPath, html);
            if (this.options.verbose) {
                log(`Generated: ${metadata.category}/${profileKey}/${version}/index.html`, 'green');
            }
        }
    }

    // Generate category index page
    generateCategoryPage(categoryKey) {
        const category = CATEGORY_METADATA[categoryKey];
        if (!category) {
            log(`Warning: No metadata found for category: ${categoryKey}`, 'yellow');
            return;
        }

        // Get profiles in this category
        const profiles = Object.entries(PROFILE_METADATA)
            .filter(([key, data]) => data.category === categoryKey)
            .map(([key, data]) => ({ key, ...data }));

        // Create page data
        const pageData = this.engine.createPageData({
            title: `${category.title} - LLMProfiles`,
            description: category.description,
            path: `/profiles/${categoryKey}/`,
            
            // Template variables
            category_title: category.title,
            category_description: category.description,
            category_icon: category.icon,
            profiles: profiles,
            
            // Navigation
            nav_profiles: true,
            
            // Breadcrumbs
            breadcrumbs: [
                { title: 'Home', url: '/' },
                { title: 'Profiles', url: '/profiles/' },
                { title: category.name }
            ]
        });

        // Render using category template
        const html = this.engine.renderWithBase('category', pageData);
        
        const categoryDir = path.join(this.webDir, 'profiles', categoryKey);
        const outputPath = path.join(categoryDir, 'index.html');
        
        if (!this.options.dryRun && !fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }
        
        if (this.options.dryRun) {
            log(`Would generate: ${outputPath}`, 'blue');
        } else {
            fs.writeFileSync(outputPath, html);
            if (this.options.verbose) {
                log(`Generated: profiles/${categoryKey}/index.html`, 'green');
            }
        }
    }

    // Generate main profiles index
    generateProfilesIndex() {
        const categories = Object.entries(CATEGORY_METADATA).map(([key, data]) => {
            const profiles = Object.entries(PROFILE_METADATA)
                .filter(([profileKey, profileData]) => profileData.category === key)
                .map(([profileKey, profileData]) => ({ key: profileKey, ...profileData }));
            
            // Generate profile links HTML
            const profileLinksHtml = profiles.map(profile => 
                `<a href="${key}/${profile.key}/v1/" class="profile-link">
                    <span class="profile-icon">${profile.icon}</span>
                    <span class="profile-name">${profile.name}</span>
                </a>`
            ).join('');
            
            return {
                key,
                ...data,
                profiles: profiles,
                profile_links_html: profileLinksHtml
            };
        });

        const pageData = this.engine.createPageData({
            title: 'All Profiles - LLMProfiles',
            description: 'Browse all available structured data profiles for AI applications and semantic web.',
            path: '/profiles/',
            nav_profiles: true,
            breadcrumbs: [
                { title: 'Home', url: '/' },
                { title: 'Profiles' }
            ]
        });

        pageData.categories = categories;

        const html = this.engine.renderWithBase('profiles-index', pageData);
        
        const outputPath = path.join(this.webDir, 'profiles', 'index.html');
        
        if (this.options.dryRun) {
            log(`Would generate: ${outputPath}`, 'blue');
        } else {
            fs.writeFileSync(outputPath, html);
            if (this.options.verbose) {
                log(`Generated: profiles/index.html`, 'green');
            }
        }
    }

    // Generate sitemap
    generateSitemap() {
        const urls = [
            { loc: 'https://llmprofiles.org/', changefreq: 'weekly', priority: '1.0' },
            { loc: 'https://llmprofiles.org/profiles/', changefreq: 'weekly', priority: '0.9' },
            { loc: 'https://llmprofiles.org/tools/validator.html', changefreq: 'monthly', priority: '0.8' },
            { loc: 'https://llmprofiles.org/api/', changefreq: 'monthly', priority: '0.7' },
            { loc: 'https://llmprofiles.org/examples/', changefreq: 'monthly', priority: '0.6' }
        ];

        // Add category pages
        Object.keys(CATEGORY_METADATA).forEach(categoryKey => {
            urls.push({
                loc: `https://llmprofiles.org/profiles/${categoryKey}/`,
                changefreq: 'weekly',
                priority: '0.8'
            });
        });

        // Add profile pages
        Object.entries(PROFILE_METADATA).forEach(([profileKey, metadata]) => {
            urls.push({
                loc: `https://llmprofiles.org/profiles/${metadata.category}/${profileKey}/v1/`,
                changefreq: 'monthly',
                priority: '0.7'
            });
        });

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        const outputPath = path.join(this.webDir, 'sitemap.xml');
        
        if (this.options.dryRun) {
            log(`Would generate: ${outputPath}`, 'blue');
        } else {
            fs.writeFileSync(outputPath, sitemap);
            if (this.options.verbose) {
                log(`Generated: sitemap.xml`, 'green');
            }
        }
    }

    // Copy tools directory for website functionality
    copyToolsDirectory() {
        const toolsSrc = path.join(__dirname, '..', 'tools');
        const toolsDest = path.join(this.webDir, 'tools');
        
        if (!fs.existsSync(toolsSrc)) {
            console.warn('⚠️  Tools directory not found, skipping copy');
            return;
        }

        // Create destination directory if it doesn't exist
        if (!fs.existsSync(toolsDest)) {
            fs.mkdirSync(toolsDest, { recursive: true });
        }

        // Copy all files from tools directory
        const files = fs.readdirSync(toolsSrc);
        files.forEach(file => {
            const srcPath = path.join(toolsSrc, file);
            const destPath = path.join(toolsDest, file);
            
            if (fs.statSync(srcPath).isDirectory()) {
                // Recursively copy directories
                this.copyDirectory(srcPath, destPath);
            } else {
                // Copy files
                fs.copyFileSync(srcPath, destPath);
                console.log(`   📄 Copied ${file}`);
            }
        });
        
        console.log(`✅ Tools directory copied to ${toolsDest}`);
    }

    // Helper method to recursively copy directories
    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            
            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    // Build all pages
    build() {
        log('🏗️  Building enhanced documentation with new template system...', 'blue');
        
        if (this.options.dryRun) {
            log('🔍 DRY RUN MODE - No files will be modified', 'blue');
        }

        // Generate main profiles index
        log('📄 Generating profiles index...', 'blue');
        this.generateProfilesIndex();

        // Generate category pages
        log('📁 Generating category pages...', 'blue');
        Object.keys(CATEGORY_METADATA).forEach(categoryKey => {
            this.generateCategoryPage(categoryKey);
        });

        // Generate profile pages
        log('📋 Generating profile pages...', 'blue');
        Object.keys(PROFILE_METADATA).forEach(profileKey => {
            this.generateProfilePage(profileKey);
        });

        // Generate sitemap
        log('🗺️  Generating sitemap...', 'blue');
        this.generateSitemap();

        // Copy tools directory (for website functionality including validator)
        log('🛠️  Copying tools directory...', 'blue');
        this.copyToolsDirectory();

        log('✅ Enhanced documentation build completed!', 'green');
    }
}

function main() {
    const args = process.argv.slice(2);
    const options = {
        verbose: false,
        clean: false,
        dryRun: false
    };
    
    // Parse command line arguments
    for (const arg of args) {
        switch (arg) {
            case '--help':
            case '-h':
                showHelp();
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--clean':
            case '-c':
                options.clean = true;
                break;
            case '--dry-run':
            case '-n':
                options.dryRun = true;
                break;
            default:
                log(`Unknown option: ${arg}`, 'yellow');
                log('Use --help for usage information', 'yellow');
                process.exit(1);
        }
    }

    try {
        const builder = new EnhancedDocBuilder(options);
        builder.build();
    } catch (error) {
        log(`❌ Build failed: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Run the build
if (require.main === module) {
    main();
}

module.exports = EnhancedDocBuilder;
