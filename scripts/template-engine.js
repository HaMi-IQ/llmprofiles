#!/usr/bin/env node

/**
 * Template Engine for LLMProfiles
 * Simple template engine that supports variable substitution and basic conditionals
 */

const fs = require('fs');
const path = require('path');

class TemplateEngine {
    constructor(templatesDir = path.join(__dirname, 'templates')) {
        this.templatesDir = templatesDir;
        this.templates = new Map();
    }

    /**
     * Load a template from file
     */
    loadTemplate(templateName) {
        if (this.templates.has(templateName)) {
            return this.templates.get(templateName);
        }

        const templatePath = path.join(this.templatesDir, `${templateName}.html`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templateName}`);
        }

        const template = fs.readFileSync(templatePath, 'utf8');
        this.templates.set(templateName, template);
        return template;
    }

    /**
     * Simple variable substitution {{variable}}
     */
    substituteVariables(template, data) {
        return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
            const value = this.getNestedProperty(data, variable.trim());
            return value !== undefined ? value : match;
        });
    }

    /**
     * Handle conditional blocks {{#if condition}} ... {{/if}}
     */
    handleConditionals(template, data) {
        // Handle {{#if}} blocks
        template = template.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
            const value = this.getNestedProperty(data, condition.trim());
            return this.isTruthy(value) ? content : '';
        });

        // Handle {{#each}} blocks
        template = template.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
            const array = this.getNestedProperty(data, arrayName.trim());
            if (!Array.isArray(array)) {
                return '';
            }

            return array.map((item, index) => {
                let itemContent = content;
                // Replace {{this}} with current item
                itemContent = itemContent.replace(/\{\{this\}\}/g, item);
                // Replace {{@index}} with current index
                itemContent = itemContent.replace(/\{\{@index\}\}/g, index);
                // Replace {{@last}} with boolean indicating if this is the last item
                itemContent = itemContent.replace(/\{\{@last\}\}/g, index === array.length - 1);
                
                // Handle nested properties if item is an object
                if (typeof item === 'object' && item !== null) {
                    itemContent = this.substituteVariables(itemContent, item);
                }
                
                return itemContent;
            }).join('');
        });

        return template;
    }

    /**
     * Get nested property from object using dot notation
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    /**
     * Check if value is truthy for template conditions
     */
    isTruthy(value) {
        if (value === undefined || value === null || value === false || value === 0 || value === '') {
            return false;
        }
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return true;
    }

    /**
     * Render a template with data
     */
    render(templateName, data = {}) {
        let template = this.loadTemplate(templateName);
        
        // Handle conditionals first
        template = this.handleConditionals(template, data);
        
        // Then substitute variables
        template = this.substituteVariables(template, data);
        
        return template;
    }

    /**
     * Render with base template
     */
    renderWithBase(contentTemplate, data = {}) {
        const content = this.render(contentTemplate, data);
        const baseData = {
            ...data,
            content: content
        };
        
        return this.render('base', baseData);
    }

    /**
     * Create page data with common defaults
     */
    createPageData(overrides = {}) {
        const defaults = {
            lang: 'en',
            author: 'LLMProfiles',
            og_type: 'website',
            og_image: 'https://llmprofiles.org/images/llmprofiles-overview.jpg',
            keywords: 'llm, ai, structured data, json-ld, schema.org, semantic web',
            container_class: 'container',
            structured_data: '',
            custom_styles: '',
            analytics_code: '',
            breadcrumbs: []
        };

        const data = { ...defaults, ...overrides };
        
        // Generate canonical URL if not provided
        if (!data.canonical_url && data.path) {
            data.canonical_url = `https://llmprofiles.org${data.path}`;
        }

        // Generate breadcrumb HTML if breadcrumbs are provided
        if (data.breadcrumbs && data.breadcrumbs.length > 0) {
            data.breadcrumb_html = this.generateBreadcrumbHtml(data.breadcrumbs);
        } else {
            data.breadcrumb_html = '';
        }
        
        return data;
    }

    /**
     * Generate structured data JSON-LD for a page
     */
    generateStructuredData(type, data) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": type,
            "name": data.title,
            "description": data.description,
            "url": data.canonical_url
        };

        if (data.image) {
            structuredData.image = data.image;
        }

        if (data.datePublished) {
            structuredData.datePublished = data.datePublished;
        }

        if (data.dateModified) {
            structuredData.dateModified = data.dateModified;
        }

        if (data.author) {
            structuredData.author = {
                "@type": "Organization",
                "name": data.author,
                "url": "https://llmprofiles.org"
            };
        }

        return `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;
    }

    /**
     * Generate breadcrumb structured data
     */
    generateBreadcrumbData(breadcrumbs) {
        if (!breadcrumbs || breadcrumbs.length === 0) {
            return '';
        }

        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.title,
                "item": crumb.url ? `https://llmprofiles.org${crumb.url}` : undefined
            }))
        };

        return `<script type="application/ld+json">
${JSON.stringify(breadcrumbList, null, 2)}
</script>`;
    }

    /**
     * Generate breadcrumb HTML
     */
    generateBreadcrumbHtml(breadcrumbs) {
        if (!breadcrumbs || breadcrumbs.length === 0) {
            return '';
        }

        const items = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast) {
                return `<span>${crumb.title}</span>`;
            } else {
                return `<a href="${crumb.url}">${crumb.title}</a><span class="breadcrumb-separator">/</span>`;
            }
        }).join('');

        return `<div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                ${items}
            </nav>
        </div>`;
    }
}

module.exports = TemplateEngine;

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node template-engine.js <template> <output-file> [data-file]');
        console.log('Example: node template-engine.js home index.html data.json');
        process.exit(1);
    }

    const [templateName, outputFile, dataFile] = args;
    const engine = new TemplateEngine();
    
    let data = {};
    if (dataFile && fs.existsSync(dataFile)) {
        data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }

    try {
        const html = engine.renderWithBase(templateName, engine.createPageData(data));
        fs.writeFileSync(outputFile, html);
        console.log(`✅ Generated: ${outputFile}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}
