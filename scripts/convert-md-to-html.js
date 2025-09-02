#!/usr/bin/env node

/**
 * Markdown to HTML Converter for llmprofiles
 * Converts markdown files to HTML with consistent styling
 */

const fs = require('fs');
const path = require('path');
const marked = require('marked');

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
Usage: node convert-md-to-html.js [command] [options]

Commands:
  convert <input> [output-dir]  Convert a single file or directory
  batch                        Convert all .md files in docs/ to dist/docs/

Options:
  --help        Show this help message
  --verbose     Show detailed output for each operation
  --dry-run     Show what would be converted without actually converting

Examples:
  node convert-md-to-html.js convert docs/api.md
  node convert-md-to-html.js convert docs/ dist/docs/
  node convert-md-to-html.js batch
  node convert-md-to-html.js batch --verbose --dry-run
  `);
  process.exit(0);
}

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
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .markdown-content pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            overflow-x: auto;
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
            font-style: italic;
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
            font-weight: 600;
        }
        
        .markdown-content ul,
        .markdown-content ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        .markdown-content li {
            margin: 5px 0;
        }
        
        .footer {
            background: #ecf0f1;
            padding: 20px;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
        }
        
        .footer a {
            color: #3498db;
            text-decoration: none;
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
            <a href="/">Home</a> &gt; 
            <a href="/docs/">Documentation</a> &gt; 
            ${originalPath ? `<a href="/docs/${path.dirname(originalPath)}/">${path.dirname(originalPath)}</a> &gt; ` : ''}
            ${path.basename(originalPath, '.md')}
        </div>
        
        <div class="content">
            <div class="markdown-content">
                ${content}
            </div>
        </div>
        
        <div class="footer">
            <p>Generated from <a href="https://github.com/HaMi-IQ/llmprofiles">llmprofiles</a> | 
            <a href="https://llmprofiles.org">llmprofiles.org</a></p>
        </div>
    </div>
</body>
</html>`;

function findMarkdownFiles(dir) {
    const files = [];
    
    function scanDirectory(currentDir) {
        try {
            const items = fs.readdirSync(currentDir);
            
            for (const item of items) {
                const fullPath = path.join(currentDir, item);
                
                try {
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        // Skip certain directories
                        if (item === 'node_modules' || item === 'dist' || item === '.git') {
                            continue;
                        }
                        scanDirectory(fullPath);
                    } else if (item.endsWith('.md')) {
                        files.push(fullPath);
                    }
                } catch (statError) {
                    log(`Warning: Could not stat ${fullPath}: ${statError.message}`, 'yellow');
                }
            }
        } catch (readError) {
            log(`Warning: Could not read directory ${currentDir}: ${readError.message}`, 'yellow');
        }
    }
    
    scanDirectory(dir);
    return files;
}

function convertMarkdownToHtml(inputPath, outputDir = null, options = {}) {
    try {
        if (!fs.existsSync(inputPath)) {
            log(`Error: Input file not found: ${inputPath}`, 'red');
            return false;
        }
        
        // Read the markdown file
        const mdContent = fs.readFileSync(inputPath, 'utf8');
        
        // Convert markdown to HTML
        const htmlContent = marked.parse(mdContent);
        
        // Extract title from first h1 or use filename
        const titleMatch = mdContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : path.basename(inputPath, '.md');
        
        // Generate HTML with template
        const fullHtml = htmlTemplate(title, htmlContent, inputPath);
        
        // Determine output path
        let outputPath;
        if (outputDir) {
            const filename = path.basename(inputPath, '.md') + '.html';
            outputPath = path.join(outputDir, filename);
        } else {
            outputPath = inputPath.replace('.md', '.html');
        }
        
        // Ensure output directory exists
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
            if (!options.dryRun) {
                fs.mkdirSync(outputDirPath, { recursive: true });
            }
        }
        
        if (options.dryRun) {
            log(`Would convert: ${inputPath} → ${outputPath}`, 'blue');
            return true;
        }
        
        // Write HTML file
        fs.writeFileSync(outputPath, fullHtml);
        
        if (options.verbose) {
            log(`✓ Converted: ${inputPath} → ${outputPath}`, 'green');
        }
        
        return true;
        
    } catch (error) {
        log(`✗ Error converting ${inputPath}: ${error.message}`, 'red');
        return false;
    }
}

function main() {
    const args = process.argv.slice(2);
    
    // Parse global options
    const globalOptions = {
        verbose: false,
        dryRun: false
    };
    
    // Remove global options from args
    const filteredArgs = args.filter(arg => {
        if (arg === '--help' || arg === '-h') {
            showHelp();
        } else if (arg === '--verbose' || arg === '-v') {
            globalOptions.verbose = true;
            return false;
        } else if (arg === '--dry-run' || arg === '-n') {
            globalOptions.dryRun = true;
            return false;
        }
        return true;
    });
    
    if (filteredArgs.length === 0) {
        showHelp();
    }
    
    const command = filteredArgs[0];
    
    if (globalOptions.dryRun) {
        log('🔍 DRY RUN MODE - No files will be modified', 'blue');
        log('');
    }
    
    if (command === 'convert') {
        const inputPath = filteredArgs[1];
        const outputDir = filteredArgs[2] || null;
        
        if (!inputPath) {
            log('Error: Input file or directory required', 'red');
            log('Usage: node convert-md-to-html.js convert <input-file> [output-dir]', 'yellow');
            process.exit(1);
        }
        
        try {
            if (fs.statSync(inputPath).isDirectory()) {
                // Convert all markdown files in directory
                const mdFiles = findMarkdownFiles(inputPath);
                log(`Found ${mdFiles.length} markdown files to convert...`, 'blue');
                
                let successCount = 0;
                for (const mdFile of mdFiles) {
                    if (convertMarkdownToHtml(mdFile, outputDir, globalOptions)) {
                        successCount++;
                    }
                }
                
                log(`\n✅ Successfully converted ${successCount}/${mdFiles.length} files`, 'green');
            } else {
                // Convert single file
                if (convertMarkdownToHtml(inputPath, outputDir, globalOptions)) {
                    log('✅ File converted successfully', 'green');
                } else {
                    process.exit(1);
                }
            }
        } catch (error) {
            log(`❌ Error: ${error.message}`, 'red');
            process.exit(1);
        }
        
    } else if (command === 'batch') {
        // Convert all markdown files in docs directory
        const docsDir = path.join(process.cwd(), 'docs');
        const outputDir = path.join(process.cwd(), 'dist', 'docs');
        
        if (!fs.existsSync(docsDir)) {
            log('Error: docs directory not found', 'red');
            process.exit(1);
        }
        
        log('🔄 Starting batch conversion...', 'blue');
        log(`Input: ${docsDir}`, 'blue');
        log(`Output: ${outputDir}`, 'blue');
        log('');
        
        const mdFiles = findMarkdownFiles(docsDir);
        log(`Found ${mdFiles.length} markdown files to convert...`, 'blue');
        
        let successCount = 0;
        for (const mdFile of mdFiles) {
            // For batch processing, preserve directory structure
            const relativePath = path.relative(docsDir, mdFile);
            const outputPath = path.join(outputDir, relativePath.replace('.md', '.html'));
            
            // Ensure output directory exists
            const outputDirPath = path.dirname(outputPath);
            if (!fs.existsSync(outputDirPath)) {
                if (!globalOptions.dryRun) {
                    fs.mkdirSync(outputDirPath, { recursive: true });
                }
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
                
                if (globalOptions.dryRun) {
                    log(`Would convert: ${relativePath} → ${path.relative(process.cwd(), outputPath)}`, 'blue');
                    successCount++;
                } else {
                    // Write HTML file
                    fs.writeFileSync(outputPath, fullHtml);
                    
                    if (globalOptions.verbose) {
                        log(`✓ Converted: ${relativePath} → ${path.relative(process.cwd(), outputPath)}`, 'green');
                    }
                    successCount++;
                }
                
            } catch (error) {
                log(`✗ Error converting ${relativePath}: ${error.message}`, 'red');
            }
        }
        
        if (globalOptions.dryRun) {
            log(`\n✅ Dry run completed! Would convert ${successCount}/${mdFiles.length} files`, 'green');
        } else {
            log(`\n✅ Successfully converted ${successCount}/${mdFiles.length} files to ${outputDir}`, 'green');
        }
        
    } else {
        log(`Unknown command: ${command}`, 'red');
        showHelp();
    }
}

if (require.main === module) {
    try {
        main();
    } catch (error) {
        log(`❌ Unexpected error: ${error.message}`, 'red');
        process.exit(1);
    }
}

module.exports = { convertMarkdownToHtml, findMarkdownFiles };
