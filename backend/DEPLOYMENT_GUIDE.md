# 🚀 Render.com Deployment Guide

## 📋 **Quick Deployment Steps**

### **1. Create GitHub Repository**
```bash
# In render-backend directory
git remote add origin https://github.com/YOUR_USERNAME/character-generator-backend.git
git branch -M main
git push -u origin main
```

### **2. Deploy to Render.com**

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect Repository**: Select your `character-generator-backend` repo
5. **Configure Service**:
   - **Name**: `character-generator-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` ($7/month) or `Free` (750 hours/month)

### **3. Environment Variables**
Add these in Render dashboard:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### **4. Deploy!**
Click **"Create Web Service"** and wait for deployment.

## 🔗 **API Endpoints**

Once deployed, your API will be available at:
```
https://your-service-name.onrender.com/api/
```

### **Test Endpoints:**
- **Health Check**: `GET /api/health`
- **Gallery**: `GET /api/gallery`
- **Stats**: `GET /api/stats`

## 📁 **File Storage**

Uploaded files will be available at:
- **Images**: `https://your-service-name.onrender.com/uploads/images/filename.jpg`
- **3D Models**: `https://your-service-name.onrender.com/uploads/models/filename.glb`

## 🔧 **Frontend Configuration**

Update your frontend `.env`:
```env
REACT_APP_API_URL=https://your-service-name.onrender.com/api
```

## 🗄️ **Database (Optional)**

For production, add PostgreSQL:
1. **New +** → **"PostgreSQL"**
2. **Plan**: `Starter` ($7/month)
3. **Add DATABASE_URL** to environment variables
4. **Update server.js** to use database instead of in-memory storage

## 🚨 **Important Notes**

### **Free Tier Limitations:**
- **750 hours/month** (service sleeps after inactivity)
- **No persistent file storage** (files lost on restart)
- **No database** (in-memory storage only)

### **Starter Plan Benefits:**
- **Always-on** service
- **Persistent file storage**
- **Database support**
- **Custom domains**

## 🧪 **Testing Deployment**

### **1. Health Check**
```bash
curl https://your-service-name.onrender.com/api/health
```

### **2. Create Character**
```bash
curl -X POST https://your-service-name.onrender.com/api/characters \
  -F "characterData={\"name\":\"Test\",\"age\":25,\"height\":170,\"weight\":70,\"gender\":\"unknown\"}"
```

### **3. Get Gallery**
```bash
curl https://your-service-name.onrender.com/api/gallery
```

## 🔄 **Updates**

To update your service:
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will automatically redeploy!

## 🆘 **Troubleshooting**

### **Build Fails:**
- Check `package.json` dependencies
- Verify Node.js version (18+)
- Check build logs in Render dashboard

### **Service Won't Start:**
- Check `startCommand` is `npm start`
- Verify `PORT` environment variable
- Check server logs in Render dashboard

### **Files Not Uploading:**
- Check file size limits (10MB)
- Verify file types (images: jpg/png/gif, models: glb/gltf)
- Check upload directory permissions

---

**🎉 Once deployed, you'll have unlimited character storage and a real world gallery!**