# Azure Deployment Guide for NanoPure Application

This guide will walk you through deploying the NanoPure water purification system to Microsoft Azure using GitHub Actions.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Account**: Your code will be hosted on GitHub
3. **Azure CLI**: Install Azure CLI on your local machine
4. **Node.js 18+**: Ensure you have Node.js 18 or later installed

## Architecture Overview

- **Frontend**: React application deployed to Azure Static Web Apps
- **Backend**: Node.js API deployed to Azure App Service
- **Database**: Azure Database for MySQL
- **CI/CD**: GitHub Actions for automated deployment

## Step-by-Step Deployment

### 1. Create Azure Resources

#### Create Resource Group
```bash
az group create --name nanopure-rg --location "East US"
```

#### Create Azure Database for MySQL
```bash
az mysql flexible-server create \
  --resource-group nanopure-rg \
  --name nanopure-mysql-server \
  --admin-user nanopadmin \
  --admin-password YourSecurePassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 20 \
  --version 8.0.21 \
  --location "East US"
```

#### Create Azure App Service (Backend)
```bash
# Create App Service Plan
az appservice plan create \
  --name nanopure-plan \
  --resource-group nanopure-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group nanopure-rg \
  --plan nanopure-plan \
  --name nanopure-backend-api \
  --runtime "NODE|18-lts"
```

#### Create Azure Static Web App (Frontend)
```bash
az staticwebapp create \
  --name nanopure-frontend \
  --resource-group nanopure-rg \
  --source https://github.com/balirwaalvin/NanoPure \
  --location "East US 2" \
  --branch main \
  --app-location "nanopure-frontend" \
  --output-location "build"
```

### 2. Configure Database

#### Configure MySQL Database
```bash
# Create database
az mysql flexible-server db create \
  --resource-group nanopure-rg \
  --server-name nanopure-mysql-server \
  --database-name nanopure_production

# Configure firewall to allow Azure services
az mysql flexible-server firewall-rule create \
  --resource-group nanopure-rg \
  --name nanopure-mysql-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 3. Set Up GitHub Repository

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit for Azure deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/nanopure-app.git
   git push -u origin main
   ```

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

#### Required Secrets:
- `AZURE_BACKEND_APP_NAME`: `nanopure-backend-api`
- `AZURE_BACKEND_PUBLISH_PROFILE`: Get from Azure portal
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get from Azure portal
- `REACT_APP_API_URL`: `https://nanopure-backend-api.azurewebsites.net`

#### To get Azure Publish Profile:
```bash
az webapp deployment list-publishing-profiles \
  --name nanopure-backend-api \
  --resource-group nanopure-rg \
  --xml
```

### 5. Configure Environment Variables

#### Backend Environment Variables (Azure App Service):
```bash
az webapp config appsettings set \
  --resource-group nanopure-rg \
  --name nanopure-backend-api \
  --settings \
    NODE_ENV=production \
    PORT=8000 \
    DB_HOST=nanopure-mysql-server.mysql.database.azure.com \
    DB_NAME=nanopure_production \
    DB_USER=nanopadmin \
    DB_PASSWORD=YourSecurePassword123! \
    DB_PORT=3306 \
    JWT_SECRET=your-super-secure-jwt-secret \
    CORS_ORIGIN=https://nanopure-frontend.azurestaticapps.net
```

### 6. Database Migration

After deploying the backend, run the setup script to initialize the database:

1. Go to Azure App Service → Development Tools → SSH
2. Run: `node setup.js`

### 7. Custom Domain (Optional)

#### For Backend:
```bash
az webapp config hostname add \
  --webapp-name nanopure-backend-api \
  --resource-group nanopure-rg \
  --hostname api.yourdomain.com
```

#### For Frontend:
```bash
az staticwebapp hostname set \
  --name nanopure-frontend \
  --resource-group nanopure-rg \
  --hostname yourdomain.com
```

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=8000
DB_HOST=nanopure-mysql-server.mysql.database.azure.com
DB_NAME=nanopure_production
DB_USER=nanopadmin
DB_PASSWORD=YourSecurePassword123!
DB_PORT=3306
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://nanopure-frontend.azurestaticapps.net
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```
REACT_APP_API_URL=https://nanopure-backend-api.azurewebsites.net
GENERATE_SOURCEMAP=false
```

## Monitoring and Logging

### Enable Application Insights
```bash
az monitor app-insights component create \
  --app nanopure-insights \
  --location "East US" \
  --resource-group nanopure-rg \
  --application-type web
```

### Configure Logging
```bash
az webapp log config \
  --name nanopure-backend-api \
  --resource-group nanopure-rg \
  --application-logging filesystem \
  --level information
```

## Security Best Practices

1. **Use Azure Key Vault** for storing sensitive secrets
2. **Enable HTTPS only** for all services
3. **Configure CORS** properly to only allow your frontend domain
4. **Use Managed Identity** for Azure resource access
5. **Enable Application Gateway** for additional security layer

## Scaling and Performance

### Backend Scaling
```bash
az appservice plan update \
  --name nanopure-plan \
  --resource-group nanopure-rg \
  --sku P1V2
```

### Database Scaling
```bash
az mysql flexible-server update \
  --resource-group nanopure-rg \
  --name nanopure-mysql-server \
  --sku-name Standard_B2s
```

## Troubleshooting

### Common Issues:
1. **Database Connection**: Check firewall rules and connection strings
2. **CORS Issues**: Verify CORS_ORIGIN environment variable
3. **Build Failures**: Check Node.js version compatibility
4. **SSL/TLS Issues**: Ensure all endpoints use HTTPS

### Useful Commands:
```bash
# View backend logs
az webapp log tail --name nanopure-backend-api --resource-group nanopure-rg

# Restart backend service
az webapp restart --name nanopure-backend-api --resource-group nanopure-rg

# Check deployment status
az webapp deployment list --name nanopure-backend-api --resource-group nanopure-rg
```

## Cost Optimization

1. **Use B1 tier** for App Service Plan (can be scaled up later)
2. **Use Burstable tier** for MySQL Flexible Server
3. **Enable auto-scaling** based on CPU/memory usage
4. **Set up cost alerts** in Azure portal

## Next Steps

1. Set up monitoring and alerting
2. Configure backup strategies
3. Implement blue-green deployment
4. Set up staging environments
5. Configure CDN for better performance

## Support

For issues related to deployment, check:
- Azure documentation
- GitHub Actions logs
- Application Insights logs
- Azure support portal
