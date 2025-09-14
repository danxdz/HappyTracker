/**
 * 🎮 Local 3D Generation Page
 * 
 * Generate 3D models using the local Point-E server
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, RefreshCw, Eye, Sparkles, Settings, Trash2, Plus, Grid3X3 } from 'lucide-react'
import Local3DService, { Local3DModel } from '../services/local3DService'

export const Local3DPage: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [serverAvailable, setServerAvailable] = useState(false)
  const [generatedModel, setGeneratedModel] = useState<Local3DModel | null>(null)
  const [storedModels, setStoredModels] = useState<Local3DModel[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [resolution, setResolution] = useState(64)
  const [steps, setSteps] = useState(20)

  // Check server availability on mount
  useEffect(() => {
    checkServerHealth()
    loadStoredModels()
  }, [])

  const checkServerHealth = async () => {
    const available = await Local3DService.checkServerHealth()
    setServerAvailable(available)
  }

  const loadStoredModels = () => {
    const models = Local3DService.getStoredModels()
    setStoredModels(models)
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || !serverAvailable) return

    setIsGenerating(true)
    try {
      const response = await Local3DService.generate3DModel({
        prompt: prompt.trim(),
        resolution,
        steps,
      })

      const model = Local3DService.createModelEntry(prompt.trim(), response)
      Local3DService.saveModelToStorage(model)
      
      setGeneratedModel(model)
      loadStoredModels()
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Generation failed: ' + (error as Error).message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (model: Local3DModel, format: 'ply' | 'obj') => {
    try {
      const filename = format === 'ply' ? model.plyUrl.split('/').pop() : model.objUrl.split('/').pop()
      if (!filename) return

      const blob = await Local3DService.downloadModel(filename)
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${model.prompt.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`
      link.click()
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed')
    }
  }

  const handleDeleteModel = (modelId: string) => {
    Local3DService.deleteModelFromStorage(modelId)
    loadStoredModels()
    if (generatedModel?.id === modelId) {
      setGeneratedModel(null)
    }
  }

  const handleRegenerate = () => {
    if (prompt.trim()) {
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎮 Local 3D Generator
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
          Generate 3D models from text using your local Point-E server
        </p>
        
        {/* Server Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <div className={`w-3 h-3 rounded-full ${serverAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-sm text-gray-400">
            Local Server: 
            <span className={`ml-1 font-semibold ${
              serverAvailable ? 'text-green-400' : 'text-red-400'
            }`}>
              {serverAvailable ? '🟢 Online' : '🔴 Offline'}
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Generation Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">🎨 Generate 3D Model</h2>
            
            <div className="space-y-4">
              {/* Prompt Input */}
              <div>
                <label className="block text-white font-medium mb-2">Text Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate... (e.g., 'a red sports car', 'cute robot', 'medieval castle')"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  disabled={!serverAvailable || isGenerating}
                />
              </div>

              {/* Settings */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value={64}>64x64 (Fast)</option>
                    <option value={128}>128x128 (Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Steps</label>
                  <select
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  >
                    <option value={10}>10 (Very Fast)</option>
                    <option value={20}>20 (Fast)</option>
                    <option value={50}>50 (Quality)</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || !serverAvailable || isGenerating}
                  className={`px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 ${
                    !prompt.trim() || !serverAvailable || isGenerating
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate 3D Model</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Generated Model Preview */}
          {generatedModel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">🎯 Generated Model</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Model Info</h3>
                  <div className="space-y-2 text-gray-300">
                    <div><strong>Prompt:</strong> {generatedModel.prompt}</div>
                    <div><strong>Created:</strong> {generatedModel.createdAt.toLocaleString()}</div>
                    <div><strong>Status:</strong> <span className="text-green-400">✅ Completed</span></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">3D Preview</h3>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-400 text-sm">3D Model Preview</p>
                    <p className="text-gray-500 text-xs mt-1">PLY/OBJ files ready for download</p>
                  </div>
                </div>
              </div>

              {/* Download Actions */}
              <div className="flex justify-center space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(generatedModel, 'ply')}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PLY
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(generatedModel, 'obj')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download OBJ
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Regenerate
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Gallery Toggle */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGallery(!showGallery)}
              className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center"
            >
              <Grid3X3 className="w-5 h-5 mr-2" />
              {showGallery ? 'Hide Gallery' : 'Show Gallery'} ({storedModels.length})
            </motion.button>
          </div>

          {/* Gallery */}
          {showGallery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">🖼️ Model Gallery</h2>
              
              {storedModels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg">No models generated yet</p>
                  <p className="text-gray-500 text-sm">Create your first 3D model above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storedModels.map((model) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-3 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-white font-medium truncate">{model.prompt}</h3>
                        <p className="text-gray-400 text-sm">{model.createdAt.toLocaleDateString()}</p>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(model, 'ply')}
                            className="flex-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          >
                            PLY
                          </button>
                          <button
                            onClick={() => handleDownload(model, 'obj')}
                            className="flex-1 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          >
                            OBJ
                          </button>
                          <button
                            onClick={() => handleDeleteModel(model.id)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
