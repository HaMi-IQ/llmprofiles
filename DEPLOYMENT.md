# 🚀 Deployment Guide

This document explains how the website deployment works with GitHub Pages and the custom domain `llmprofiles.org`.

## 🌐 **How It Works**

### **Repository Structure**
```
llmprofiles-hami/
├── web/                    # 🌐 Website source files
│   ├── dist/              # 📦 Built website (generated)
│   ├── blog/              # 📝 Blog content
│   ├── api/               # 🔌 API endpoints
│   ├── images/            # 🖼️ Website images
│   └── ...                # Other web content
├── profiles/               # 📋 Core LLM profiles
├── schemas/                # 🏗️ Schema definitions
└── ...                    # Other project files
```

### **Deployment Flow**
1. **Source**: Files are built to `web/dist/`
2. **Deployment**: Files are copied to `gh-pages` branch root
3. **GitHub Pages**: Serves files from `gh-pages` branch root
4. **Domain**: `llmprofiles.org` points to the served files

## 🔧 **Deployment Methods**

### **Method 1: Manual Deployment**
```bash
# Build the website
npm run build:docs

# Deploy to GitHub Pages
npm run deploy
```

### **Method 2: Automatic Deployment (GitHub Actions)**
The website automatically deploys when you push changes to the `main` branch.

## 📋 **GitHub Pages Configuration**

### **Required Settings**
1. Go to your repository **Settings** > **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **Branch**: `gh-pages`
4. Select **Folder**: `/ (root)`
5. Click **Save**

### **Custom Domain**
- **Domain**: `llmprofiles.org`
- **CNAME file**: Automatically copied during deployment
- **SSL**: GitHub Pages provides automatic HTTPS

## 🚨 **Important Notes**

### **File Locations**
- **Development**: Work with files in `web/` directory
- **Build Output**: Generated in `web/dist/` directory
- **Deployment**: Files copied to `gh-pages` branch root
- **Live Website**: Served from `gh-pages` branch root

### **Domain Verification**
- `.well-known/` directory is preserved during deployment
- CNAME file is automatically copied
- Domain verification should work automatically

### **Build Process**
```bash
npm run build:docs  # Builds to web/dist/
npm run deploy      # Copies web/dist/* to gh-pages branch
```

## 🔍 **Troubleshooting**

### **Website Not Updating**
1. Check if `gh-pages` branch was updated
2. Verify GitHub Pages is configured correctly
3. Wait a few minutes for changes to propagate

### **Domain Not Working**
1. Verify CNAME file exists in `gh-pages` branch
2. Check DNS settings with your domain provider
3. Ensure `.well-known/` directory is present

### **Build Failures**
1. Check Node.js version (requires 20+)
2. Verify all dependencies are installed
3. Check for syntax errors in source files

## 📚 **Related Commands**

```bash
# Build website
npm run build:docs

# Deploy manually
npm run deploy

# Validate structure
npm run validate:structure

# Check links
npm run links:validate

# Full CI process
npm run ci:full
```

## 🌟 **Benefits of This Setup**

1. **Clean Separation**: Web content separate from core profiles
2. **Automatic Deployment**: Push to main = automatic website update
3. **Domain Support**: Custom domain with automatic HTTPS
4. **Version Control**: All changes tracked in git
5. **Easy Rollback**: Can revert to previous deployment

---

**Need Help?** Check the [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues) or create a new one.
