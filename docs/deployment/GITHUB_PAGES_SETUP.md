# GitHub Pages Setup for llmprofiles.org

This guide explains how to set up GitHub Pages to host the llmprofiles project at the custom domain `llmprofiles.org`.

## 🚀 Quick Setup

### 1. Repository Configuration

1. Go to your repository: `https://github.com/HaMi-IQ/llmprofiles`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The deployment workflow will be automatically triggered when you push to the `main` branch

### 2. Custom Domain Configuration

1. In the **Pages** settings, under **Custom domain**:
   - Enter: `llmprofiles.org`
   - Check **Enforce HTTPS** (recommended)
2. Click **Save**

### 3. DNS Configuration

Configure your domain's DNS settings with your domain provider:

#### A Records
```
llmprofiles.org.     A     185.199.108.153
llmprofiles.org.     A     185.199.109.153
llmprofiles.org.     A     185.199.110.153
llmprofiles.org.     A     185.199.111.153
```

#### CNAME Record (if using www subdomain)
```
www.llmprofiles.org.     CNAME     llmprofiles.org.
```

### 4. Verification

After DNS propagation (can take up to 24 hours):
- Visit `https://llmprofiles.org` to verify the site is live
- Check that HTTPS is working correctly
- Verify that the CNAME file is present in the repository

## 📁 Project Structure

```
llmprofiles/
├── .github/workflows/deploy.yml    # GitHub Actions deployment
├── dist/                          # Built site (generated)
│   ├── index.html                 # Main homepage
│   ├── profile-viewer.html        # Interactive profile viewer
│   ├── index.json                 # Profile registry
│   ├── CNAME                      # Custom domain
│   ├── robots.txt                 # SEO
│   ├── sitemap.xml               # SEO
│   ├── docs/                      # Documentation
│   └── [profile-directories]/     # All profile files
├── scripts/build-docs.js          # Build script
├── CNAME                          # Custom domain (root)
└── [source-files]                 # Original source files
```

## 🔧 Build Process

The site is built using the following process:

1. **Validation**: All JSON/JSONLD files are validated
2. **Build**: The `scripts/build-docs.js` script:
   - Creates the `dist/` directory
   - Copies all profile files (JSON, JSONLD, JSONL)
   - Copies documentation files
   - Copies SEO files (robots.txt, sitemap.xml)
   - Copies the CNAME file
3. **Deploy**: GitHub Actions uploads the `dist/` directory to GitHub Pages

### Manual Build

To build the site locally:

```bash
npm install
npm run build:docs
```

The built site will be in the `dist/` directory.

## 🌐 Site Features

### Main Homepage (`/`)
- Modern, responsive design
- Interactive profile grid with search
- Quick start guide
- Feature overview
- Links to documentation and GitHub

### Interactive Profile Viewer (`/profile-viewer.html`)
- Dropdown to select any profile
- Tabbed interface for different schema types
- JSON syntax highlighting
- Live validation
- Copy-to-clipboard functionality
- Training data viewer

### API Endpoints
All original API endpoints remain accessible:
- `https://llmprofiles.org/index.json` - Profile registry
- `https://llmprofiles.org/{profile}/v1/` - Profile definitions
- `https://llmprofiles.org/{profile}/v1/page.schema.json` - Page schemas
- `https://llmprofiles.org/{profile}/v1/output.schema.json` - Output schemas
- `https://llmprofiles.org/{profile}/v1/training.jsonl` - Training data
- `https://llmprofiles.org/{profile}/v1/examples/` - Examples

## 🔍 SEO Optimization

The site includes several SEO optimizations:

- **Meta tags**: Open Graph and Twitter Card support
- **Sitemap**: `sitemap.xml` for search engine discovery
- **Robots.txt**: Proper crawling instructions
- **Structured data**: JSON-LD markup for rich snippets
- **Fast loading**: Optimized CSS and minimal JavaScript
- **Mobile responsive**: Works on all device sizes

## 🛠️ Development

### Adding New Profiles

1. Create the profile directory and files
2. Update `index.json` with the new profile
3. Push to `main` branch
4. GitHub Actions will automatically build and deploy

### Updating the Site

1. Make changes to source files
2. Test locally: `npm run build:docs`
3. Push to `main` branch
4. Monitor the GitHub Actions workflow
5. Verify changes at `https://llmprofiles.org`

### Local Development

```bash
# Install dependencies
npm install

# Validate all files
npm run validate

# Build documentation
npm run build:docs

# Serve locally (optional)
npx serve dist/
```

## 🔒 Security

- HTTPS is enforced by GitHub Pages
- No sensitive data is exposed
- All content is publicly accessible (as intended)
- CORS headers are properly configured

## 📊 Monitoring

- **GitHub Actions**: Monitor deployment status
- **GitHub Pages**: Check site status in repository settings
- **DNS**: Use tools like `dig` or `nslookup` to verify DNS
- **SSL**: Check SSL certificate status

## 🆘 Troubleshooting

### Site Not Loading
1. Check DNS propagation: `dig llmprofiles.org`
2. Verify GitHub Actions deployment succeeded
3. Check custom domain settings in repository
4. Ensure CNAME file is present

### Build Failures
1. Check GitHub Actions logs
2. Run validation locally: `npm run validate`
3. Verify all JSON files are valid
4. Check for missing dependencies

### DNS Issues
1. Verify A records point to GitHub Pages IPs
2. Check for conflicting CNAME records
3. Wait for DNS propagation (up to 24 hours)
4. Contact domain provider if issues persist

## 📞 Support

- **GitHub Issues**: Report bugs and feature requests
- **GitHub Discussions**: Community support
- **Documentation**: Check the main README.md
- **API Reference**: See docs/api.md

---

**Last Updated**: 2025-08-28  
**Maintained by**: HAMI
