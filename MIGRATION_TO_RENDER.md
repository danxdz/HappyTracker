# 🚀 Migration to Render.com

## 📋 **Migration Plan**

### **Phase 1: Backup Current Version** ✅
- [x] Create `backup_netlify` branch
- [x] Add warning comments about localStorage limitations
- [x] Document current approach

### **Phase 2: Create Render Backend** ✅
- [x] Express.js API server (`render-backend/`)
- [x] File upload handling (images + 3D models)
- [x] In-memory storage (replace with database later)
- [x] World gallery endpoints
- [x] Render.com deployment config

### **Phase 3: Update Frontend** 🔄
- [ ] Replace localStorage with API calls
- [ ] Update character creation flow
- [ ] Implement world gallery
- [ ] Add file upload components

### **Phase 4: Deploy to Render** ⏳
- [ ] Deploy backend to Render.com
- [ ] Deploy frontend to Render.com
- [ ] Test full functionality
- [ ] Add database (PostgreSQL)

## 🏗️ **New Architecture**

### **Backend (Render.com)**
```
render-backend/
├── server.js          # Express API server
├── package.json       # Dependencies
├── render.yaml        # Render deployment config
├── uploads/           # File storage
│   ├── images/        # Character images
│   └── models/        # 3D models
└── .env.example       # Environment variables
```

### **Frontend (Render.com)**
```
render-frontend/
├── src/
│   ├── services/
│   │   └── apiService.ts    # API client
│   ├── components/          # React components
│   └── pages/               # Page components
├── package.json
└── vite.config.ts
```

## 🌍 **World Gallery Features**

### **Public Gallery**
- Browse all public characters
- Pagination (20 characters per page)
- Search and filter
- Character details view

### **User Characters**
- Private character storage
- Upload images and 3D models
- Edit character details
- Make characters public/private

### **File Storage**
- **Images**: JPEG/PNG/WebP (10MB limit)
- **3D Models**: GLB/GLTF/JSON (10MB limit)
- **URLs**: Direct access via `/uploads/...`

## 💰 **Render.com Costs**

### **Free Tier** (Development)
- **Web Service**: 750 hours/month
- **Database**: Not included
- **File Storage**: Limited

### **Starter Plan** (Production)
- **Web Service**: $7/month (always-on)
- **PostgreSQL**: $7/month
- **Total**: ~$14/month

## 🔄 **Migration Benefits**

### **Before (Netlify + localStorage)**
- ❌ 5-10MB storage limit
- ❌ Only 3-10 characters max
- ❌ No world gallery
- ❌ No file persistence
- ❌ No sharing

### **After (Render.com)**
- ✅ Unlimited storage
- ✅ Unlimited characters
- ✅ World gallery
- ✅ File persistence
- ✅ Public/private sharing
- ✅ Real database
- ✅ Scalable architecture

## 🚀 **Deployment Steps**

### **1. Deploy Backend**
```bash
cd render-backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/your-repo/character-generator-backend
git push -u origin main
```

### **2. Deploy to Render**
1. Connect GitHub repo to Render
2. Select `render-backend` folder
3. Set environment variables
4. Deploy!

### **3. Deploy Frontend**
```bash
cd render-frontend
# Update API_URL to point to Render backend
npm run build
# Deploy to Render or Netlify
```

## 🔧 **Environment Variables**

### **Backend (.env)**
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
DATABASE_URL=postgresql://... (if using database)
```

### **Frontend (.env)**
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

## 📊 **API Endpoints**

### **Gallery**
- `GET /api/gallery` - World gallery
- `GET /api/gallery?page=1&limit=20` - Paginated

### **Characters**
- `GET /api/characters/:userId` - User characters
- `POST /api/characters` - Create character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### **Files**
- `POST /api/characters` - Upload with files
- `GET /uploads/images/:filename` - Serve images
- `GET /uploads/models/:filename` - Serve models

## 🎯 **Next Steps**

1. **Complete frontend migration**
2. **Deploy backend to Render**
3. **Deploy frontend to Render**
4. **Add PostgreSQL database**
5. **Implement user authentication**
6. **Add advanced gallery features**

---

**Ready to migrate?** 🚀