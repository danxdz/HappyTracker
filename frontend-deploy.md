# 🚀 Frontend Deployment Guide

## Deploy Frontend to Render.com

### Option 1: Manual Static Site Deployment
1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository: `danxdz/HappyTracker`
4. Configure:
   - **Name**: `happytracker-frontend`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
VITE_HUGGINGFACE_TOKEN=your_huggingface_token_here
VITE_MESHY_API_KEY=your_meshy_api_key_here
REACT_APP_API_URL=https://happytracker-backend.onrender.com/api
```

### Option 2: Netlify Deployment
[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danxdz/HappyTracker)

### Option 3: Netlify Deployment
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/danxdz/HappyTracker&base=apps/web)

## Backend Deployment
Use the backend render.yaml in the `/backend` folder for backend deployment.