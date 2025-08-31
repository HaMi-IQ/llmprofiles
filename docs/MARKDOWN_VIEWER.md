# Markdown Viewer for llmprofiles

This directory contains tools and viewers for rendering Markdown files on GitHub Pages.

## Overview

GitHub Pages doesn't automatically render `.md` files as HTML - they're served as plain text. This project provides several solutions for viewing Markdown files properly:

## Available Tools

### 1. Interactive Markdown Viewer (`md-viewer.html`)

A full-featured markdown viewer with:
- File input field to load any markdown file
- Syntax highlighting for code blocks
- Responsive design
- Support for GitHub Flavored Markdown

**Usage:**
- Visit: `https://llmprofiles.org/docs/md-viewer.html`
- Enter a file path (e.g., `docs/api.md`)
- Click "Load File" to view the rendered content

### 2. Direct File Viewer (`view.html`)

A simple viewer for viewing specific markdown files:
- Loads markdown files via URL parameter
- Clean, minimal interface
- Automatic syntax highlighting

**Usage:**
- Visit: `https://llmprofiles.org/docs/view.html?file=docs/api.md`
- Replace `docs/api.md` with the path to any markdown file

### 3. Converted HTML Files

All markdown files in the `docs/` directory are automatically converted to HTML files in `dist/docs/` with:
- Professional styling
- Navigation breadcrumbs
- Links to raw markdown and viewer
- Syntax highlighting

**Usage:**
- Visit: `https://llmprofiles.org/docs/api.html` (instead of `api.md`)

## Building HTML Files

### Automatic Conversion

Run the build script to convert all markdown files to HTML:

```bash
npm run build:md
```

This will:
1. Find all `.md` files in the `docs/` directory
2. Convert them to HTML with proper styling
3. Save them to `dist/docs/` maintaining directory structure

### Manual Conversion

Convert a single file:

```bash
node scripts/convert-md-to-html.js convert docs/api.md
```

Convert a directory:

```bash
node scripts/convert-md-to-html.js convert docs/ dist/docs/
```

## URL Structure

### Original Markdown Files
- `https://llmprofiles.org/docs/api.md` - Raw markdown (plain text)

### Converted HTML Files
- `https://llmprofiles.org/docs/api.html` - Rendered HTML with styling

### Viewer URLs
- `https://llmprofiles.org/docs/md-viewer.html` - Interactive viewer
- `https://llmprofiles.org/docs/view.html?file=docs/api.md` - Direct file viewer

## Features

### Markdown Support
- **Headers**: All levels (H1-H6)
- **Code blocks**: Syntax highlighting with Prism.js
- **Tables**: Responsive table styling
- **Lists**: Ordered and unordered lists
- **Links**: Internal and external links
- **Images**: Responsive image display
- **Blockquotes**: Styled quote blocks
- **GitHub Flavored Markdown**: Extended syntax support

### Styling
- **Responsive design**: Works on mobile and desktop
- **Professional appearance**: Clean, modern styling
- **Consistent branding**: Matches llmprofiles design
- **Accessibility**: Proper contrast and semantic HTML

### Navigation
- **Breadcrumbs**: Easy navigation back to main sections
- **Raw markdown links**: View original markdown source
- **Viewer links**: Open in interactive viewer
- **Home links**: Return to main documentation

## Technical Details

### Dependencies
- **marked.js**: Markdown parsing
- **Prism.js**: Syntax highlighting
- **Custom CSS**: Styling and layout

### File Structure
```
docs/
├── md-viewer.html          # Interactive viewer
├── view.html              # Direct file viewer
├── _redirects             # URL redirects for .md files
├── api.md                 # Original markdown
├── examples.md            # Original markdown
└── ...

dist/docs/
├── api.html               # Converted HTML
├── examples.html          # Converted HTML
└── ...
```

### Build Process
1. **Scan**: Find all `.md` files in `docs/`
2. **Parse**: Convert markdown to HTML using marked.js
3. **Template**: Apply HTML template with styling
4. **Output**: Save to `dist/docs/` with proper structure

## Usage Examples

### View API Documentation
```bash
# Direct HTML (recommended)
open https://llmprofiles.org/docs/api.html

# Interactive viewer
open https://llmprofiles.org/docs/md-viewer.html

# Direct file viewer
open https://llmprofiles.org/docs/view.html?file=docs/api.md
```

### View Examples
```bash
# Direct HTML
open https://llmprofiles.org/docs/examples.html

# Interactive viewer with examples
open https://llmprofiles.org/docs/md-viewer.html
# Then enter: docs/examples.md
```

### View Deployment Guides
```bash
# GitHub Pages setup
open https://llmprofiles.org/docs/deployment/GITHUB_PAGES_SETUP.html

# Deployment summary
open https://llmprofiles.org/docs/deployment/DEPLOYMENT_SUMMARY.html
```

## Troubleshooting

### Common Issues

1. **File not found**: Ensure the file path is correct relative to the repository root
2. **No syntax highlighting**: Check that Prism.js is loading properly
3. **Styling issues**: Verify CSS is loading and browser supports modern CSS features

### Development

To modify the styling or functionality:

1. **Update templates**: Edit the HTML template in `scripts/convert-md-to-html.js`
2. **Modify viewers**: Edit `docs/md-viewer.html` or `docs/view.html`
3. **Add features**: Extend the JavaScript functionality in the viewer files

### Testing

Test the viewers locally:

```bash
# Start a local server
python3 -m http.server 8000

# Visit viewers
open http://localhost:8000/docs/md-viewer.html
open http://localhost:8000/docs/view.html?file=docs/api.md
```

## Contributing

When adding new markdown files:

1. **Place in docs/**: Add new `.md` files to the `docs/` directory
2. **Run build**: Execute `npm run build:md` to generate HTML
3. **Test**: Verify the HTML renders correctly
4. **Commit**: Include both `.md` and generated `.html` files

## Links

- **Interactive Viewer**: [md-viewer.html](md-viewer.html)
- **Direct Viewer**: [view.html](view.html)
- **API Documentation**: [api.html](api.html)
- **Examples**: [examples.html](examples.html)
- **Well-known**: [well-known.html](well-known.html)
