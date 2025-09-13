# 🚀 HappyTracker Deployment Guide

## Option 1: Manual Render Deployment (Recommended)

### Backend Deployment
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub: `danxdz/HappyTracker`
4. Configure:
   - **Name**: `happytracker-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=3001
```

### Frontend Deployment
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect GitHub: `danxdz/HappyTracker`
4. Configure:
   - **Name**: `happytracker-frontend`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Frontend Environment Variables
```
NODE_ENV=production
VITE_HUGGINGFACE_TOKEN=your_huggingface_token_here
VITE_MESHY_API_KEY=your_meshy_api_key_here
REACT_APP_API_URL=https://happytracker-backend.onrender.com/api
```

## Option 2: Vercel + Render
- **Backend**: Deploy to Render (manual)
- **Frontend**: Deploy to Vercel (automatic)

## Option 3: Netlify + Render
- **Backend**: Deploy to Render (manual)
- **Frontend**: Deploy to Netlify (automatic)

## Why Manual Deployment?
Render Blueprints have strict requirements and can be finicky. Manual deployment gives you full control and is more reliable.