#!/usr/bin/env node

/**
 * Generate the main index.html page using the new template system
 */

const fs = require('fs');
const path = require('path');
const TemplateEngine = require('./template-engine');

function generateHomePage() {
    const engine = new TemplateEngine();
    
    // Create page data
    const pageData = engine.createPageData({
        title: 'LLMProfiles - Structured Data for AI Applications',
        description: 'Profile Registry & Remote Context Graphs for LLM-friendly structured data. Discover, validate, and implement structured data profiles designed for AI applications and semantic web.',
        keywords: 'llm profiles, structured data, ai, json-ld, schema.org, semantic web, seo, machine learning, artificial intelligence',
        path: '/',
        og_type: 'website',
        nav_home: true
    });

    // Add structured data for the homepage
    pageData.structured_data = engine.generateStructuredData('Organization', {
        title: 'LLMProfiles',
        description: 'Open source structured data profiles for AI applications and semantic web',
        canonical_url: 'https://llmprofiles.org',
        image: 'https://llmprofiles.org/images/llmprofiles-overview.jpg',
        author: 'LLMProfiles'
    });

    // Render the page
    const html = engine.renderWithBase('home', pageData);
    
    // Write to web directory
    const outputPath = path.join(__dirname, '..', 'web', 'index.html');
    fs.writeFileSync(outputPath, html);
    
    console.log('✅ Generated enhanced home page: web/index.html');
}

// Also create a 404 page
function generate404Page() {
    const engine = new TemplateEngine();
    
    // Create 404 template content
    const notFoundContent = `
    <div class="container-narrow">
        <div class="not-found-page">
            <div class="not-found-content">
                <h1>404 - Page Not Found</h1>
                <p class="lead">The page you're looking for doesn't exist or has been moved.</p>
                <p>Don't worry, let's get you back on track:</p>
                
                <div class="not-found-actions">
                    <a href="/" class="btn btn-primary">Go Home</a>
                    <a href="/profiles/" class="btn btn-secondary">Browse Profiles</a>
                    <a href="/tools/validator.html" class="btn btn-secondary">Try Validator</a>
                </div>
                
                <div class="not-found-suggestions">
                    <h3>Popular Pages:</h3>
                    <ul>
                        <li><a href="/profiles/">All Profiles</a></li>
                        <li><a href="/profiles/content/article/v1/">Article Profile</a></li>
                        <li><a href="/profiles/business/localbusiness/v1/">Local Business Profile</a></li>
                        <li><a href="/tools/validator.html">Data Validator</a></li>
                        <li><a href="/api/">API Documentation</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <style>
    .not-found-page {
        padding: 4rem 0;
        text-align: center;
    }
    
    .not-found-content h1 {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .not-found-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;
    }
    
    .not-found-suggestions {
        margin-top: 3rem;
        text-align: left;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .not-found-suggestions h3 {
        text-align: center;
        margin-bottom: 1rem;
    }
    
    .not-found-suggestions ul {
        list-style: none;
        padding: 0;
    }
    
    .not-found-suggestions li {
        padding: 0.5rem;
        border-bottom: 1px solid var(--border-light);
    }
    
    .not-found-suggestions li:last-child {
        border-bottom: none;
    }
    
    @media (max-width: 768px) {
        .not-found-actions {
            flex-direction: column;
            align-items: center;
        }
    }
    </style>
    `;

    // Create page data for 404
    const pageData = engine.createPageData({
        title: '404 - Page Not Found | LLMProfiles',
        description: 'The page you\'re looking for doesn\'t exist. Find structured data profiles, validation tools, and API documentation.',
        path: '/404.html',
        content: notFoundContent,
        container_class: 'container-narrow'
    });

    // Render using base template directly
    const html = engine.render('base', pageData);
    
    // Write 404 page
    const outputPath = path.join(__dirname, '..', 'web', '404.html');
    fs.writeFileSync(outputPath, html);
    
    console.log('✅ Generated 404 page: web/404.html');
}

// Generate robots.txt
function generateRobotsTxt() {
    const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://llmprofiles.org/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow certain paths
Disallow: /api/server.js
Disallow: /.well-known/
Disallow: /dist/

# Allow important resources
Allow: /profiles/
Allow: /tools/
Allow: /examples/
Allow: /schemas/
Allow: /training/
Allow: /images/
Allow: /logo.png
`;

    const outputPath = path.join(__dirname, '..', 'web', 'robots.txt');
    fs.writeFileSync(outputPath, robotsContent);
    
    console.log('✅ Generated robots.txt: web/robots.txt');
}

if (require.main === module) {
    generateHomePage();
    generate404Page();
    generateRobotsTxt();
}

module.exports = { generateHomePage, generate404Page, generateRobotsTxt };
