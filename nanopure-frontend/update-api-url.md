# 🔄 Update Frontend API URL

## After Backend Deployment

Once your Railway backend is deployed, you'll need to update your frontend to point to the new backend URL.

## Method 1: Firebase Environment Variables (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Hosting** → **Environment variables**
4. Add new environment variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-backend-url.railway.app/api`
5. Redeploy your frontend

## Method 2: Local Development

If you want to test locally with the deployed backend:

1. Create `.env.local` file in `nanopure-frontend/`:
```env
REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
```

2. Restart your development server:
```bash
npm start
```

## Method 3: Build-time Configuration

For production builds, you can set the environment variable during build:

```bash
REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api npm run build
```

## 🔍 How to Find Your Backend URL

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your backend project
3. Copy the URL from the service overview
4. It will look like: `https://your-app-name.railway.app`

## ✅ Test the Connection

1. Visit your frontend: https://nanopure-frontend.web.app
2. Try to log in or access any API-dependent feature
3. Check browser console for any CORS errors
4. Verify the API calls are going to your Railway backend

## 🚨 Troubleshooting

- **CORS Errors**: Make sure `FRONTEND_URL` in Railway matches your Firebase domain
- **404 Errors**: Ensure the backend URL includes `/api` at the end
- **Connection Timeout**: Check if Railway backend is running and healthy 