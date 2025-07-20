# Deployment Checklist

## Pre-Deployment Setup

### 1. Azure Account Setup
- [ ] Create Azure account and subscription
- [ ] Install Azure CLI on local machine
- [ ] Login to Azure CLI: `az login`

### 2. GitHub Repository Setup
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Set repository to public or ensure proper access permissions

### 3. Environment Configuration
- [ ] Copy `.env.template` files and create `.env` files
- [ ] Configure database credentials
- [ ] Set up email service credentials
- [ ] Generate secure JWT secret

## Azure Resource Creation

### 4. Create Azure Resources
- [ ] Create Resource Group
- [ ] Create Azure Database for MySQL Flexible Server
- [ ] Create App Service Plan
- [ ] Create Web App for backend
- [ ] Create Static Web App for frontend

### 5. Database Setup
- [ ] Configure MySQL firewall rules
- [ ] Create production database
- [ ] Test database connectivity

## GitHub Actions Configuration

### 6. Set GitHub Secrets
- [ ] `AZURE_BACKEND_APP_NAME`
- [ ] `AZURE_BACKEND_PUBLISH_PROFILE`
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN`
- [ ] `REACT_APP_API_URL`

### 7. Configure Azure App Service
- [ ] Set environment variables in Azure portal
- [ ] Configure Node.js version (18.x)
- [ ] Enable application logging

## Testing & Verification

### 8. Local Testing
- [ ] Run `npm test` for backend
- [ ] Run `npm test` for frontend
- [ ] Test local build: `npm run build`
- [ ] Verify all environment variables work

### 9. Deployment Testing
- [ ] Push to main branch to trigger deployment
- [ ] Monitor GitHub Actions workflow
- [ ] Check backend deployment in Azure portal
- [ ] Check frontend deployment in Azure portal
- [ ] Test API endpoints
- [ ] Test frontend functionality

## Post-Deployment

### 10. Database Migration
- [ ] SSH into Azure App Service
- [ ] Run `node setup.js` to initialize database
- [ ] Verify database tables are created
- [ ] Run `node scripts/seed.js` for sample data (optional)

### 11. Monitoring Setup
- [ ] Configure Application Insights
- [ ] Set up Azure Monitor alerts
- [ ] Configure logging retention
- [ ] Set up cost alerts

### 12. Security Configuration
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Review firewall settings
- [ ] Set up Key Vault for secrets (optional)

### 13. Performance Optimization
- [ ] Configure CDN (optional)
- [ ] Set up auto-scaling rules
- [ ] Monitor performance metrics
- [ ] Optimize database queries

## Final Verification

### 14. End-to-End Testing
- [ ] User registration works
- [ ] User login works
- [ ] Sensor data collection works
- [ ] Alerts are triggered correctly
- [ ] Email notifications work
- [ ] Mobile responsiveness verified
- [ ] Multi-language switching works

### 15. Documentation
- [ ] Update README with live URLs
- [ ] Document API endpoints
- [ ] Create user manual
- [ ] Set up monitoring dashboard

## Troubleshooting Commands

```bash
# Check backend logs
az webapp log tail --name nanopure-backend-api --resource-group nanopure-rg

# Restart backend
az webapp restart --name nanopure-backend-api --resource-group nanopure-rg

# Check database connection
az mysql flexible-server show --name nanopure-mysql-server --resource-group nanopure-rg

# View GitHub Actions logs
# Go to GitHub repository → Actions tab
```

## Important URLs After Deployment

- **Frontend URL**: `https://nanopure-frontend.azurestaticapps.net`
- **Backend API URL**: `https://nanopure-backend-api.azurewebsites.net`
- **Database Host**: `nanopure-mysql-server.mysql.database.azure.com`
- **Azure Portal**: `https://portal.azure.com`

## Support Contacts

- Azure Support: https://azure.microsoft.com/support/
- GitHub Support: https://support.github.com/
- Project Documentation: See README.md and AZURE_DEPLOYMENT.md
