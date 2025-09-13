/**
 * 🚀 Character Generator Backend API
 * 
 * Express.js server for Render.com deployment
 * Handles character storage, image uploads, and world gallery
 */

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads', file.fieldname)
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      'images': /jpeg|jpg|png|gif|webp/,
      'models': /glb|gltf|json/
    }
    
    const fieldType = file.fieldname
    if (allowedTypes[fieldType] && allowedTypes[fieldType].test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type for ${fieldType}`), false)
    }
  }
})

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// In-memory storage (replace with database in production)
let characters = []
let nextId = 1

// Routes

/**
 * 🏠 Root Route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'HappyTracker Backend API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/api/health',
      gallery: '/api/gallery',
      characters: '/api/characters',
      stats: '/api/stats'
    },
    documentation: 'Visit /api/health for health check'
  })
})

/**
 * 🏠 Health Check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

/**
 * 📚 Get World Gallery
 */
app.get('/api/gallery', (req, res) => {
  try {
    const { page = 1, limit = 20, public_only = true } = req.query
    
    let filteredCharacters = characters
    
    if (public_only === 'true') {
      filteredCharacters = characters.filter(char => char.isPublic)
    }
    
    // Sort by creation date (newest first)
    filteredCharacters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex)
    
    res.json({
      characters: paginatedCharacters,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredCharacters.length,
        pages: Math.ceil(filteredCharacters.length / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching gallery:', error)
    res.status(500).json({ error: 'Failed to fetch gallery' })
  }
})

/**
 * 👤 Get User Characters
 */
app.get('/api/characters/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const userCharacters = characters.filter(char => char.userId === userId)
    
    res.json({
      characters: userCharacters,
      count: userCharacters.length
    })
  } catch (error) {
    console.error('❌ Error fetching user characters:', error)
    res.status(500).json({ error: 'Failed to fetch user characters' })
  }
})

/**
 * 🎨 Create Character
 */
app.post('/api/characters', upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'models', maxCount: 1 }
]), (req, res) => {
  try {
    const characterData = JSON.parse(req.body.characterData)
    const files = req.files
    
    // Build file URLs
    const imageUrl = files.images ? `/uploads/images/${files.images[0].filename}` : null
    const modelUrl = files.models ? `/uploads/models/${files.models[0].filename}` : null
    
    const character = {
      id: nextId++,
      ...characterData,
      imageUrl,
      modelUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    characters.push(character)
    
    console.log(`✅ Character created: ${character.name} (ID: ${character.id})`)
    
    res.status(201).json({
      success: true,
      character: character
    })
  } catch (error) {
    console.error('❌ Error creating character:', error)
    res.status(500).json({ error: 'Failed to create character' })
  }
})

/**
 * 🔄 Update Character
 */
app.put('/api/characters/:id', upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'models', maxCount: 1 }
]), (req, res) => {
  try {
    const { id } = req.params
    const characterData = JSON.parse(req.body.characterData)
    const files = req.files
    
    const characterIndex = characters.findIndex(char => char.id === parseInt(id))
    if (characterIndex === -1) {
      return res.status(404).json({ error: 'Character not found' })
    }
    
    // Update character data
    const updatedCharacter = {
      ...characters[characterIndex],
      ...characterData,
      updatedAt: new Date().toISOString()
    }
    
    // Update file URLs if new files uploaded
    if (files.images) {
      updatedCharacter.imageUrl = `/uploads/images/${files.images[0].filename}`
    }
    if (files.models) {
      updatedCharacter.modelUrl = `/uploads/models/${files.models[0].filename}`
    }
    
    characters[characterIndex] = updatedCharacter
    
    console.log(`✅ Character updated: ${updatedCharacter.name} (ID: ${id})`)
    
    res.json({
      success: true,
      character: updatedCharacter
    })
  } catch (error) {
    console.error('❌ Error updating character:', error)
    res.status(500).json({ error: 'Failed to update character' })
  }
})

/**
 * 🗑️ Delete Character
 */
app.delete('/api/characters/:id', (req, res) => {
  try {
    const { id } = req.params
    const characterIndex = characters.findIndex(char => char.id === parseInt(id))
    
    if (characterIndex === -1) {
      return res.status(404).json({ error: 'Character not found' })
    }
    
    const character = characters[characterIndex]
    
    // Delete associated files
    if (character.imageUrl) {
      const imagePath = path.join(__dirname, character.imageUrl)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }
    
    if (character.modelUrl) {
      const modelPath = path.join(__dirname, character.modelUrl)
      if (fs.existsSync(modelPath)) {
        fs.unlinkSync(modelPath)
      }
    }
    
    characters.splice(characterIndex, 1)
    
    console.log(`🗑️ Character deleted: ${character.name} (ID: ${id})`)
    
    res.json({
      success: true,
      message: 'Character deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting character:', error)
    res.status(500).json({ error: 'Failed to delete character' })
  }
})

/**
 * 📊 Get Statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const totalCharacters = characters.length
    const publicCharacters = characters.filter(char => char.isPublic).length
    const totalSize = characters.reduce((sum, char) => {
      // Estimate file sizes (this would be calculated from actual files in production)
      return sum + (char.imageUrl ? 500000 : 0) + (char.modelUrl ? 1000000 : 0)
    }, 0)
    
    res.json({
      totalCharacters,
      publicCharacters,
      privateCharacters: totalCharacters - publicCharacters,
      totalStorageSize: totalSize,
      averageSize: totalCharacters > 0 ? Math.round(totalSize / totalCharacters) : 0
    })
  } catch (error) {
    console.error('❌ Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error)
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
  }
  
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`)
})

module.exports = app