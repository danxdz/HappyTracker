const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const charactersDir = path.join(uploadsDir, 'characters');
const photosDir = path.join(uploadsDir, 'photos');

[uploadsDir, charactersDir, photosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    const dest = file.fieldname === 'character' ? charactersDir : photosDir;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${uniqueId}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uploads: {
      charactersCount: fs.readdirSync(charactersDir).length,
      photosCount: fs.readdirSync(photosDir).length
    }
  });
});

// Upload user photo
app.post('/api/upload/photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/photos/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: `/uploads/photos/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload photo' 
    });
  }
});

// Upload generated character image
app.post('/api/upload/character', upload.single('character'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/characters/${req.file.filename}`;
    
    // Save character metadata if provided
    const metadata = req.body;
    if (metadata && Object.keys(metadata).length > 0) {
      const metadataPath = path.join(charactersDir, `${path.parse(req.file.filename).name}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
    
    res.json({
      success: true,
      message: 'Character uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: `/uploads/characters/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload character' 
    });
  }
});

// Save character from base64 (for AI-generated images)
app.post('/api/save/character', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { imageData, metadata } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate filename
    const filename = `${uuidv4()}.png`;
    const filepath = path.join(charactersDir, filename);
    
    // Save image
    fs.writeFileSync(filepath, buffer);
    
    // Save metadata if provided
    if (metadata) {
      const metadataPath = path.join(charactersDir, `${path.parse(filename).name}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/characters/${filename}`;
    
    res.json({
      success: true,
      message: 'Character saved successfully',
      file: {
        filename: filename,
        url: fileUrl,
        path: `/uploads/characters/${filename}`,
        metadata: metadata
      }
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save character' 
    });
  }
});

// Get all characters
app.get('/api/characters', (req, res) => {
  try {
    const files = fs.readdirSync(charactersDir);
    const characters = [];
    
    files.forEach(file => {
      if (file.endsWith('.json')) return; // Skip metadata files
      
      const fileStats = fs.statSync(path.join(charactersDir, file));
      const metadataPath = path.join(charactersDir, `${path.parse(file).name}.json`);
      let metadata = {};
      
      if (fs.existsSync(metadataPath)) {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      }
      
      characters.push({
        filename: file,
        url: `${req.protocol}://${req.get('host')}/uploads/characters/${file}`,
        path: `/uploads/characters/${file}`,
        size: fileStats.size,
        created: fileStats.birthtime,
        metadata: metadata
      });
    });
    
    res.json({
      success: true,
      count: characters.length,
      characters: characters.sort((a, b) => b.created - a.created)
    });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get characters' 
    });
  }
});

// Delete character
app.delete('/api/characters/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(charactersDir, filename);
    const metadataPath = path.join(charactersDir, `${path.parse(filename).name}.json`);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    // Delete image file
    fs.unlinkSync(filepath);
    
    // Delete metadata if exists
    if (fs.existsSync(metadataPath)) {
      fs.unlinkSync(metadataPath);
    }
    
    res.json({
      success: true,
      message: 'Character deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete character' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🖼️ Characters: ${fs.readdirSync(charactersDir).length} files`);
  console.log(`📷 Photos: ${fs.readdirSync(photosDir).length} files`);
});