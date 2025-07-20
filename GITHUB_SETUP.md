# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in repository details**:
   - Repository name: `nanopure-app`
   - Description: `NanoPure Uganda Water Purification System - IoT monitoring with real-time alerts`
   - Visibility: `Public` (recommended for easier Azure integration)
   - ✅ **Do NOT** initialize with README (we already have one)
   - ✅ **Do NOT** add .gitignore (we already have one)
   - ✅ **Do NOT** choose a license (can add later)

5. **Click "Create repository"**

## Step 2: Connect Local Repository to GitHub

Open PowerShell in your project directory and run these commands:

```powershell
# Navigate to your project directory (if not already there)
cd "c:\Users\balir\OneDrive\Documents\Code\final"

# Set your Git username and email (if not already set)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add the GitHub repository as remote origin
git remote add origin https://github.com/balirwaalvin/NanoPure.git

# Rename the default branch to 'main' (GitHub standard)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Verify Repository Upload

1. **Go to your GitHub repository** in the browser
2. **Check that all files are uploaded**:
   - ✅ README.md displays project information
   - ✅ .github/workflows/deploy.yml exists
   - ✅ nanopure-frontend/ folder exists
   - ✅ nanopure-backend/ folder exists
   - ✅ AZURE_DEPLOYMENT.md exists
   - ✅ DEPLOYMENT_CHECKLIST.md exists

## Step 4: Configure Repository Settings

### Enable GitHub Actions
1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Actions"** in the left sidebar
4. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
5. Click **"Save"**

### Set Repository Secrets (Required for Deployment)
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each of these:

   ```
   AZURE_BACKEND_APP_NAME
   Value: nanopure-backend-api
   
   AZURE_BACKEND_PUBLISH_PROFILE
   Value: [Get this from Azure after creating App Service]
   
   AZURE_STATIC_WEB_APPS_API_TOKEN
   Value: [Get this from Azure after creating Static Web App]
   
   REACT_APP_API_URL
   Value: https://nanopure-backend-api.azurewebsites.net
   ```

## Step 5: Repository Protection (Optional but Recommended)

### Branch Protection Rules
1. Go to **Settings** → **Branches**
2. Click **"Add rule"**
3. **Branch name pattern**: `main`
4. **Enable these protections**:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## Step 6: Add Collaborators (If Working in a Team)

1. Go to **Settings** → **Collaborators**
2. Click **"Add people"**
3. Enter GitHub usernames or email addresses
4. Select permission level (Read, Write, or Admin)

## Step 7: Create Issues and Project Boards (Optional)

### Enable Issues
1. Go to **Settings** → **General**
2. Scroll down to **Features**
3. Ensure **"Issues"** is checked

### Create Issue Templates
1. Go to **Settings** → **General**
2. Scroll to **Features** → **Issues**
3. Click **"Set up templates"**
4. Add templates for:
   - Bug Report
   - Feature Request
   - Question

## Common Git Commands for Your Project

```powershell
# Check status
git status

# Add specific files
git add filename.txt

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# View commit history
git log --oneline
```

## Next Steps After GitHub Setup

1. **Follow the Azure deployment guide**: See `AZURE_DEPLOYMENT.md`
2. **Use the deployment checklist**: See `DEPLOYMENT_CHECKLIST.md`
3. **Set up Azure resources** as described in the documentation
4. **Configure GitHub secrets** with Azure deployment credentials
5. **Test the CI/CD pipeline** by making a small change and pushing to main

## Troubleshooting

### Common Issues and Solutions

**Issue**: `git push` fails with authentication error
**Solution**: 
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys for GitHub

**Issue**: Large files cause push to fail
**Solution**:
- Add large files to `.gitignore`
- Use Git LFS for large assets if needed

**Issue**: GitHub Actions workflow fails
**Solution**:
- Check the Actions tab for error details
- Ensure all required secrets are set
- Verify the workflow file syntax

**Issue**: Can't see private repository
**Solution**:
- Make repository public for easier Azure integration
- Or configure proper access tokens

## Security Best Practices

1. **Never commit sensitive information**:
   - Database passwords
   - API keys
   - JWT secrets
   - Email passwords

2. **Use environment variables** for all sensitive data

3. **Enable two-factor authentication** on your GitHub account

4. **Regularly review** repository access and permissions

5. **Keep dependencies updated** with security patches

## Additional Resources

- [GitHub Docs](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Static Web Apps with GitHub](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
