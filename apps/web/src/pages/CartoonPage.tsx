/**
 * 🎨 Cartoon Generation Page
 * 
 * Main page for photo-to-cartoon generation
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoUpload } from '../components/PhotoUpload'
import { CaricatureDisplay } from '../components/CartoonDisplay'
import { CaricatureGenerator, CaricatureGenerationResult } from '../services/cartoonGenerator'

export const CartoonPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<CaricatureGenerationResult | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<'cute' | 'anime' | 'disney' | 'pixar'>('cute')

  const handlePhotoSelect = async (file: File) => {
    setSelectedFile(file)
    setResult(null)
    
    // Auto-generate cartoon
    await generateCartoon(file)
  }

  const handlePhotoRemove = () => {
    setSelectedFile(null)
    setResult(null)
  }

  const generateCartoon = async (file?: File) => {
    const photoFile = file || selectedFile
    if (!photoFile) return

    setIsProcessing(true)
    setResult(null)

    try {
      const cartoonResult = await CaricatureGenerator.generateCaricatureFromPhoto(photoFile, selectedStyle)
      setResult(cartoonResult)
    } catch (error) {
      console.error('Cartoon generation failed:', error)
      setResult({
        success: false,
        error: 'Failed to generate cartoon character'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRegenerate = () => {
    generateCartoon()
  }

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a')
      link.href = result.imageUrl
      link.download = `cartoon-character-${Date.now()}.png`
      link.click()
    }
  }

  const handleShare = () => {
    if (result?.imageUrl && navigator.share) {
      navigator.share({
        title: 'My Cartoon Character',
        text: 'Check out my cartoon character!',
        url: result.imageUrl
      })
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(result?.imageUrl || '')
      alert('Image URL copied to clipboard!')
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
            Photo to Cartoon
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Transform your photos into amazing cartoon characters with AI
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column - Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  📸 Upload Your Photo
                </h2>
                <PhotoUpload
                  onPhotoSelect={handlePhotoSelect}
                  onPhotoRemove={handlePhotoRemove}
                  selectedFile={selectedFile}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Style Selection */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4">
                    🎨 Choose Style
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'cute', label: 'Cute', emoji: '😊' },
                      { key: 'anime', label: 'Anime', emoji: '🎌' },
                      { key: 'disney', label: 'Disney', emoji: '🏰' },
                      { key: 'pixar', label: 'Pixar', emoji: '🎬' }
                    ].map((style) => (
                      <motion.button
                        key={style.key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedStyle(style.key as any)}
                        className={`
                          p-4 rounded-xl text-center transition-all
                          ${selectedStyle === style.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/20 text-gray-300 hover:bg-white/30'
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">{style.emoji}</div>
                        <div className="font-medium">{style.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Result */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎨 Your Caricature Character
                </h2>
                
                {result ? (
                  <CaricatureDisplay
                    result={result}
                    onRegenerate={handleRegenerate}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <p className="text-gray-300">
                      {selectedFile 
                        ? 'Click "Generate" to create your cartoon character'
                        : 'Upload a photo to get started'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  ✨ Features
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    One-shot AI generation
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Low-cost inference
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Multiple cartoon styles
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    High-quality output
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}