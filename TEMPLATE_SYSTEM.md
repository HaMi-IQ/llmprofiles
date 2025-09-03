# Enhanced Template System Documentation

## Overview

The LLMProfiles project now uses a scalable, modern template system that generates SEO-optimized HTML pages with comprehensive metadata, structured data, and responsive design.

## Key Features

### 🎨 Modern Template System
- **Base Template**: `scripts/templates/base.html` - Universal template with complete HTML structure
- **Page Templates**: Specialized templates for different page types
- **Template Engine**: `scripts/template-engine.js` - Simple but powerful templating with variables and conditionals

### 🔍 SEO Optimization
- **Complete Meta Tags**: Title, description, keywords, author
- **Open Graph**: Facebook and social media sharing
- **Twitter Cards**: Enhanced Twitter sharing
- **Canonical URLs**: Proper SEO canonicalization
- **Structured Data**: Automatic Schema.org JSON-LD generation
- **Sitemap**: Comprehensive XML sitemap
- **Robots.txt**: Optimized for search engines

### 🚀 Scalable Architecture
- **Centralized Metadata**: All profile information in one place
- **Automatic Generation**: Profiles, categories, and pages generated automatically
- **Template Inheritance**: Base template with specialized content
- **Responsive Design**: Mobile-first CSS with modern styling

## File Structure

```
scripts/
├── templates/
│   ├── base.html              # Base template with header/footer
│   ├── home.html              # Homepage content
│   ├── profile-detail.html    # Individual profile pages
│   └── profile-viewer.html    # Interactive profile viewer
├── template-engine.js         # Template rendering engine
├── generate-home-page.js      # Home page generator
├── enhanced-build-docs.js     # Main build script
└── generate-profile-viewer.js # Profile viewer generator
```

## Generated Pages

### 🏠 Homepage (`/`)
- Hero section with call-to-action
- Feature showcase
- Category overview
- Modern design with gradients and animations

### 📋 Profile Pages (`/profiles/{category}/{profile}/v1/`)
- Tabbed interface (Overview, Files, Examples, Schema)
- Interactive elements with JavaScript
- Comprehensive profile information
- Download and validation links

### 📂 Category Pages (`/profiles/{category}/`)
- Grid layout of profiles in category
- Quick access to validation tools
- Responsive card design

### 🔍 Profile Viewer (`/profile-viewer.html`)
- Interactive JSON-LD viewer
- Profile selection dropdown
- Real-time validation
- Download functionality

### ❌ 404 Page (`/404.html`)
- Helpful error page with navigation
- Links to popular content
- Branded design

## Build Process

### Scripts

```bash
# Generate home page
npm run build:home

# Build all profile documentation
npm run build:docs

# Generate profile viewer
npm run build:viewer

# Full CI build
npm run ci:full
```

### Workflow Integration

The GitHub Actions workflow automatically:
1. Validates all JSON/schema files
2. Generates home page with enhanced template
3. Builds all profile pages with new system
4. Creates profile viewer
5. Converts markdown documentation
6. Generates API documentation
7. Creates sitemap and robots.txt
8. Deploys to GitHub Pages

## Template Variables

### Common Variables
- `title` - Page title
- `description` - Meta description
- `keywords` - SEO keywords
- `canonical_url` - Canonical URL
- `breadcrumbs` - Navigation breadcrumbs
- `structured_data` - Schema.org JSON-LD

### Profile-Specific Variables
- `profile_name` - Human-readable profile name
- `profile_key` - URL-safe profile identifier
- `profile_icon` - Emoji icon for profile
- `category_name` - Category name
- `schema_type` - Schema.org type
- `use_cases` - List of use cases
- `dos` - Best practices
- `donts` - Things to avoid

## SEO Features

### Metadata
- Complete HTML5 semantic structure
- Proper heading hierarchy
- Alt text for images
- Descriptive link text

### Performance
- Minimal CSS/JS footprint
- Optimized images
- Efficient caching headers

### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Skip navigation links
- Keyboard navigation support

## Adding New Profiles

1. Add profile metadata to `PROFILE_METADATA` in `enhanced-build-docs.js`
2. Create profile files in `profiles/{category}/{profile}/v1/`
3. Run `npm run build:docs` to generate pages
4. Profile automatically appears in all lists and navigation

## Maintenance

### Template Updates
- Edit templates in `scripts/templates/`
- Run build scripts to regenerate pages
- Test with `npm run ci:full`

### Metadata Changes
- Update `PROFILE_METADATA` and `CATEGORY_METADATA`
- Regenerate with `npm run build:docs`

### SEO Improvements
- Update structured data in `template-engine.js`
- Modify meta tag generation
- Update sitemap generation logic

## Benefits

### For Users
- **Fast Loading**: Optimized HTML and CSS
- **Mobile Friendly**: Responsive design
- **Search Friendly**: Complete SEO optimization
- **Accessible**: Semantic HTML and ARIA support

### For Developers
- **Scalable**: Easy to add new profiles
- **Maintainable**: Centralized configuration
- **Consistent**: Uniform design across pages
- **Automated**: No manual HTML editing needed

### For Search Engines
- **Rich Snippets**: Structured data for enhanced listings
- **Clear Navigation**: Logical URL structure and breadcrumbs
- **Fast Indexing**: Sitemap and proper meta tags
- **Mobile First**: Responsive design for mobile indexing

This enhanced template system ensures LLMProfiles presents a professional, scalable, and SEO-optimized web presence that can grow with the project without requiring workflow changes.
