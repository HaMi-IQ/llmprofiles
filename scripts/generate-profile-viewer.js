#!/usr/bin/env node

/**
 * Generate the profile viewer page
 */

const fs = require('fs');
const path = require('path');
const TemplateEngine = require('./template-engine');

function generateProfileViewer() {
    const engine = new TemplateEngine();
    
    // Profile categories and metadata (matching enhanced-build-docs.js)
    const PROFILE_METADATA = {
        'localbusiness': { name: 'Local Business', category: 'business' },
        'jobposting': { name: 'Job Posting', category: 'business' },
        'product-offer': { name: 'Product Offer', category: 'business' },
        'review': { name: 'Review', category: 'business' },
        'article': { name: 'Article', category: 'content' },
        'book': { name: 'Book', category: 'content' },
        'course': { name: 'Course', category: 'content' },
        'dataset': { name: 'Dataset', category: 'content' },
        'howto': { name: 'How-to', category: 'content' },
        'recipe': { name: 'Recipe', category: 'content' },
        'videoobject': { name: 'Video Object', category: 'content' },
        'faqpage': { name: 'FAQ Page', category: 'interaction' },
        'qapage': { name: 'Q&A Page', category: 'interaction' },
        'event': { name: 'Event', category: 'interaction' },
        'softwareapplication': { name: 'Software Application', category: 'technology' },
        'software': { name: 'Software', category: 'technology' }
    };

    const CATEGORY_METADATA = {
        'business': { title: 'Business Profiles' },
        'content': { title: 'Content Profiles' },
        'interaction': { title: 'Interaction Profiles' },
        'technology': { title: 'Technology Profiles' }
    };
    
    // Group profiles by category and generate select options HTML
    const categories = Object.entries(CATEGORY_METADATA).map(([key, data]) => {
        const profiles = Object.entries(PROFILE_METADATA)
            .filter(([profileKey, profileData]) => profileData.category === key)
            .map(([profileKey, profileData]) => ({ key: profileKey, ...profileData }));
        
        const optionsHtml = profiles.map(profile => 
            `<option value="${key}/${profile.key}/v1/index.jsonld">${profile.name} (${data.title})</option>`
        ).join('');
        
        return {
            key,
            ...data,
            profiles: profiles,
            options_html: optionsHtml
        };
    });

    // Generate complete select options HTML
    const allOptionsHtml = categories.map(category => 
        `<optgroup label="${category.title}">
            ${category.options_html}
        </optgroup>`
    ).join('');

    // Create page data
    const pageData = engine.createPageData({
        title: 'Profile Viewer - LLMProfiles',
        description: 'Interactive viewer for LLMProfiles structured data definitions. Explore, validate, and download profile definitions.',
        keywords: 'profile viewer, structured data, json-ld, interactive tool, llm profiles',
        path: '/profile-viewer.html',
        nav_profiles: true,
        categories: categories,
        profile_options_html: allOptionsHtml
    });

    // Render the page
    const html = engine.renderWithBase('profile-viewer', pageData);
    
    // Write to web directory
    const outputPath = path.join(__dirname, '..', 'web', 'profile-viewer.html');
    fs.writeFileSync(outputPath, html);
    
    console.log('✅ Generated profile viewer: web/profile-viewer.html');
}

if (require.main === module) {
    generateProfileViewer();
}

module.exports = { generateProfileViewer };
