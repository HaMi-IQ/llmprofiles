#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// HTML template for converted markdown files
const htmlTemplate = (title, content, originalPath) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} - llmprofiles</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css">
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2em;
        }
        
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.8;
        }
        
        .breadcrumb {
            background: #ecf0f1;
            padding: 10px 20px;
            border-bottom: 1px solid #ddd;
            font-size: 0.9em;
        }
        
        .breadcrumb a {
            color: #3498db;
            text-decoration: none;
        }
        
        .breadcrumb a:hover {
            text-decoration: underline;
        }
        
        .content {
            padding: 30px;
        }
        
        /* Markdown styling */
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        
        .markdown-content h1 {
            border-bottom: 2px solid #e1e5e9;
            padding-bottom: 10px;
        }
        
        .markdown-content h2 {
            border-bottom: 1px solid #e1e5e9;
            padding-bottom: 5px;
        }
        
        .markdown-content p {
            margin-bottom: 15px;
        }
        
        .markdown-content code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        
        .markdown-content pre {
            background: #f8f9fa;
            border: 1px solid #e1e5e9;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            margin: 20px 0;
        }
        
        .markdown-content pre code {
            background: none;
            padding: 0;
        }
        
        .markdown-content blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background: #f8f9fa;
            color: #555;
        }
        
        .markdown-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        
        .markdown-content th,
        .markdown-content td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
        }
        
        .markdown-content th {
            background: #f8f9fa;
            font-weight: bold;
        }
        
        .markdown-content ul,
        .markdown-content ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        .markdown-content li {
            margin-bottom: 5px;
        }
        
        .markdown-content a {
            color: #3498db;
            text-decoration: none;
        }
        
        .markdown-content a:hover {
            text-decoration: underline;
        }
        
        .markdown-content img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 10px 0;
        }
        
        .footer {
            background: #ecf0f1;
            padding: 15px 20px;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .view-options {
            background: #ecf0f1;
            padding: 10px 20px;
            border-bottom: 1px solid #ddd;
            text-align: center;
        }
        
        .view-options a {
            display: inline-block;
            margin: 0 10px;
            padding: 5px 10px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 3px;
            font-size: 0.9em;
        }
        
        .view-options a:hover {
            background: #2980b9;
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>llmprofiles Documentation</p>
        </div>
        
        <div class="breadcrumb">
            <a href="/">Home</a> / 
            <a href="/docs/">Documentation</a> / 
            <span>${path.basename(originalPath, '.md')}</span>
        </div>
        
        <div class="view-options">
            <a href="${originalPath}" target="_blank">View Raw Markdown</a>
            <a href="/docs/md-viewer.html?file=${originalPath}" target="_blank">Open in Markdown Viewer</a>
        </div>
        
        <div class="content">
            <div class="markdown-content">
                ${content}
            </div>
        </div>
        
        <div class="footer">
            <p>Generated from ${originalPath} - llmprofiles Documentation</p>
        </div>
    </div>
    
    <script>
        // Highlight code blocks
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
        });
    </script>
</body>
</html>
`;

// Configure marked.js
marked.setOptions({
    highlight: function(code, lang) {
        return code; // We'll handle highlighting with Prism.js
    },
    breaks: true,
    gfm: true
});

function convertMarkdownToHtml(mdFilePath, outputDir = null) {
    try {
        // Read the markdown file
        const mdContent = fs.readFileSync(mdFilePath, 'utf8');
        
        // Convert markdown to HTML
        const htmlContent = marked.parse(mdContent);
        
        // Extract title from first h1 or use filename
        const titleMatch = mdContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : path.basename(mdFilePath, '.md');
        
        // Generate HTML with template
        const fullHtml = htmlTemplate(title, htmlContent, mdFilePath);
        
        // Determine output path
        const relativePath = path.relative(process.cwd(), mdFilePath);
        const outputPath = outputDir 
            ? path.join(outputDir, path.basename(mdFilePath).replace('.md', '.html'))
            : mdFilePath.replace('.md', '.html');
        
        // Ensure output directory exists
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
        }
        
        // Write HTML file
        fs.writeFileSync(outputPath, fullHtml);
        
        console.log(`✓ Converted ${mdFilePath} to ${outputPath}`);
        return outputPath;
        
    } catch (error) {
        console.error(`✗ Error converting ${mdFilePath}:`, error.message);
        return null;
    }
}

function findMarkdownFiles(dir, extensions = ['.md']) {
    const files = [];
    
    function scanDirectory(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip node_modules and other common directories
                if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                    scanDirectory(fullPath);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    scanDirectory(dir);
    return files;
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (command === 'convert') {
        const inputPath = args[1];
        const outputDir = args[2] || null;
        
        if (!inputPath) {
            console.error('Usage: node convert-md-to-html.js convert <input-file> [output-dir]');
            process.exit(1);
        }
        
        if (fs.statSync(inputPath).isDirectory()) {
            // Convert all markdown files in directory
            const mdFiles = findMarkdownFiles(inputPath);
            console.log(`Found ${mdFiles.length} markdown files to convert...`);
            
            let successCount = 0;
            for (const mdFile of mdFiles) {
                if (convertMarkdownToHtml(mdFile, outputDir)) {
                    successCount++;
                }
            }
            
            console.log(`\n✓ Successfully converted ${successCount}/${mdFiles.length} files`);
        } else {
            // Convert single file
            convertMarkdownToHtml(inputPath, outputDir);
        }
        
    } else if (command === 'batch') {
        // Convert all markdown files in docs directory
        const docsDir = path.join(process.cwd(), 'docs');
        const outputDir = path.join(process.cwd(), 'dist', 'docs');
        
        if (!fs.existsSync(docsDir)) {
            console.error('docs directory not found');
            process.exit(1);
        }
        
        const mdFiles = findMarkdownFiles(docsDir);
        console.log(`Found ${mdFiles.length} markdown files to convert...`);
        
        let successCount = 0;
        for (const mdFile of mdFiles) {
            // For batch processing, preserve directory structure
            const relativePath = path.relative(docsDir, mdFile);
            const outputPath = path.join(outputDir, relativePath.replace('.md', '.html'));
            
            // Ensure output directory exists
            const outputDirPath = path.dirname(outputPath);
            if (!fs.existsSync(outputDirPath)) {
                fs.mkdirSync(outputDirPath, { recursive: true });
            }
            
            try {
                // Read the markdown file
                const mdContent = fs.readFileSync(mdFile, 'utf8');
                
                // Convert markdown to HTML
                const htmlContent = marked.parse(mdContent);
                
                // Extract title from first h1 or use filename
                const titleMatch = mdContent.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : path.basename(mdFile, '.md');
                
                // Generate HTML with template
                const fullHtml = htmlTemplate(title, htmlContent, relativePath);
                
                // Write HTML file
                fs.writeFileSync(outputPath, fullHtml);
                
                console.log(`✓ Converted ${relativePath} to ${path.relative(process.cwd(), outputPath)}`);
                successCount++;
                
            } catch (error) {
                console.error(`✗ Error converting ${relativePath}:`, error.message);
            }
        }
        
        console.log(`\n✓ Successfully converted ${successCount}/${mdFiles.length} files to ${outputDir}`);
        
    } else {
        console.log(`
Markdown to HTML Converter

Usage:
  node convert-md-to-html.js convert <input-file> [output-dir]  Convert a single file or directory
  node convert-md-to-html.js batch                              Convert all .md files in docs/ to dist/docs/

Examples:
  node convert-md-to-html.js convert docs/api.md
  node convert-md-to-html.js convert docs/ dist/docs/
  node convert-md-to-html.js batch
        `);
    }
}

if (require.main === module) {
    main();
}

module.exports = { convertMarkdownToHtml, findMarkdownFiles };
