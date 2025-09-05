# GitHub Secrets Setup Guide

## 🔐 Required Secrets

To enable GitHub-based publishing, you need to configure these secrets in your GitHub repository.

## 📋 Setup Steps

### 1. NPM Token Setup

1. **Go to NPM**
   - Visit [npmjs.com](https://npmjs.com)
   - Log in to your account

2. **Create Access Token**
   - Go to Account Settings → Access Tokens
   - Click "Generate New Token"
   - Choose "Automation" type (for CI/CD)
   - Copy the token (you won't see it again!)

3. **Add to GitHub**
   - Go to your GitHub repository
   - Click Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM token
   - Click "Add secret"

### 2. Verify Setup

1. **Check Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - You should see `NPM_TOKEN` listed

2. **Test Workflow**
   - Go to Actions tab
   - Run "Publish NPM Package" workflow
   - Choose "patch" version and "dry run"
   - Check if it runs successfully

## 🎯 Quick Setup Commands

### For Repository Owners
```bash
# 1. Create NPM token (do this on npmjs.com)
# 2. Add to GitHub secrets (do this on github.com)
# 3. Test the workflow
```

### For Team Members
```bash
# No setup needed! Just use the workflow:
# GitHub → Actions → "Publish NPM Package" → Run workflow
```

## 🔒 Security Notes

### NPM Token Security
- **Automation Token**: Use "Automation" type, not "Publish"
- **Limited Scope**: Only allows publishing, not account access
- **Repository Specific**: Only works for this repository
- **Rotate Regularly**: Update token periodically

### GitHub Secrets Security
- **Encrypted Storage**: Secrets are encrypted at rest
- **Access Control**: Only repository admins can view/edit
- **Audit Trail**: All secret usage is logged
- **Environment Isolation**: Secrets are isolated per repository

## 🚨 Troubleshooting

### Common Issues

#### "NPM_TOKEN not found"
- Check if secret is properly configured
- Verify secret name is exactly `NPM_TOKEN`
- Ensure you have admin access to repository

#### "Authentication failed"
- Verify NPM token is valid and not expired
- Check if token has "Automation" type
- Ensure token has publish permissions

#### "Package already exists"
- Version already published to NPM
- Bump version before publishing
- Or unpublish if within 24 hours

### Recovery Steps

#### Reset NPM Token
1. Go to NPM → Account Settings → Access Tokens
2. Delete old token
3. Create new token
4. Update GitHub secret

#### Check Permissions
1. Verify you're repository admin
2. Check NPM account permissions
3. Ensure package name is available

## ✅ Verification Checklist

- [ ] NPM account created and verified
- [ ] NPM token generated (Automation type)
- [ ] GitHub secret `NPM_TOKEN` configured
- [ ] Repository has Actions enabled
- [ ] Test workflow runs successfully
- [ ] Dry run completes without errors

## 🎉 You're Ready!

Once secrets are configured:
1. Go to GitHub → Actions
2. Select "Publish NPM Package"
3. Click "Run workflow"
4. Choose your options
5. Watch the magic happen! ✨

No more manual CI/CD management needed! 🚀
