/**
 * 🎯 3D Character Generation Page
 * 
 * Complete workflow: Identity Card → 6 T-Pose Views → 3D Character
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { IdentityCard, CharacterIdentity } from '../components/IdentityCard'
import { Character3DGenerator, Character3DResult } from '../services/character3DGenerator'
import { Download, Share2, RefreshCw, Eye, Users, Sparkles, Settings } from 'lucide-react'

export const Character3DPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'identity' | 'generating' | 'result'>('identity')
  const [identity, setIdentity] = useState<CharacterIdentity | null>(null)
  const [result, setResult] = useState<Character3DResult | null>(null)
  const [selectedView, setSelectedView] = useState<keyof Character3DResult['views']>('front')

  const handleIdentitySubmit = async (identityData: CharacterIdentity) => {
    setIdentity(identityData)
    setCurrentStep('generating')
    
    try {
      const characterResult = await Character3DGenerator.generate3DCharacter(identityData)
      setResult(characterResult)
      setCurrentStep('result')
    } catch (error) {
      console.error('Character generation failed:', error)
      setCurrentStep('result')
    }
  }

  const handleRegenerate = () => {
    if (identity) {
      handleIdentitySubmit(identity)
    }
  }

  const handleDownload = (viewName: string) => {
    if (result?.views[viewName as keyof Character3DResult['views']]) {
      const link = document.createElement('a')
      link.href = result.views[viewName as keyof Character3DResult['views']]
      link.download = `${identity?.name || 'character'}-${viewName}-view.png`
      link.click()
    }
  }

  const handleDownloadAll = () => {
    if (result?.views) {
      Object.entries(result.views).forEach(([viewName, imageUrl]) => {
        if (imageUrl) {
          setTimeout(() => {
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = `${identity?.name || 'character'}-${viewName}-view.png`
            link.click()
          }, 100 * Object.keys(result.views).indexOf(viewName))
        }
      })
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
            3D Character Creator
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
          Create photo-realistic 3D characters with 6 T-pose views for animation
        </p>
        
        {/* Mode Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            Current Mode: 
            <span className={`ml-1 font-semibold ${
              Character3DGenerator.getCurrentMode() === 'hf' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {Character3DGenerator.getCurrentMode() === 'hf' ? '🤖 HF API' : '🎨 Canvas Only'}
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep === 'identity' ? 'text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'identity' ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="ml-2 font-medium">Identity</span>
              </div>
              
              <div className={`w-16 h-1 rounded ${currentStep === 'generating' || currentStep === 'result' ? 'bg-blue-500' : 'bg-gray-600'}`} />
              
              <div className={`flex items-center ${currentStep === 'generating' ? 'text-blue-400' : currentStep === 'result' ? 'text-green-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'generating' ? 'bg-blue-500' : currentStep === 'result' ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="ml-2 font-medium">Generate</span>
              </div>
              
              <div className={`w-16 h-1 rounded ${currentStep === 'result' ? 'bg-green-500' : 'bg-gray-600'}`} />
              
              <div className={`flex items-center ${currentStep === 'result' ? 'text-green-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'result' ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <Eye className="w-4 h-4" />
                </div>
                <span className="ml-2 font-medium">Result</span>
              </div>
            </div>
          </motion.div>

          {/* Step Content */}
          {currentStep === 'identity' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <IdentityCard
                onIdentitySubmit={handleIdentitySubmit}
                isProcessing={false}
              />
            </motion.div>
          )}

          {currentStep === 'generating' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Creating Your 3D Character
              </h2>
              <p className="text-gray-300 text-lg">
                Generating 6 T-pose views with photo-realistic head...
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
                {['front', 'back', 'left', 'right', 'top', 'bottom'].map((view) => (
                  <div key={view} className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse" />
                    <div className="text-sm text-white capitalize">{view}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'result' && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Character Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎯 {identity?.name}'s 3D Character
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Character Details</h3>
                    <div className="space-y-2 text-gray-300">
                      <div><strong>Name:</strong> {identity?.name}</div>
                      <div><strong>Age:</strong> {identity?.age} years old</div>
                      <div><strong>Height:</strong> {identity?.height} cm</div>
                      <div><strong>Weight:</strong> {identity?.weight} kg</div>
                      <div><strong>Body Type:</strong> {identity?.bodyType}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Head Features</h3>
                    <div className="space-y-2 text-gray-300">
                      <div><strong>Face Shape:</strong> {result.characterData.headFeatures.faceShape}</div>
                      <div><strong>Hair:</strong> {result.characterData.headFeatures.hairColor} {result.characterData.headFeatures.hairStyle}</div>
                      <div><strong>Eyes:</strong> {result.characterData.headFeatures.eyeColor}</div>
                      <div><strong>Skin:</strong> {result.characterData.headFeatures.skinTone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 T-Pose Views */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    📸 6 T-Pose Views
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(result.views).map(([viewName, imageUrl]) => (
                    <motion.div
                      key={viewName}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * Object.keys(result.views).indexOf(viewName) }}
                      className={`relative bg-white/5 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedView === viewName ? 'ring-2 ring-blue-500' : 'hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedView(viewName as keyof Character3DResult['views'])}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${viewName} view`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                          <div className="text-gray-400 text-sm">No image</div>
                        </div>
                      )}
                      <div className="mt-2 text-center">
                        <div className="text-white font-medium capitalize">{viewName}</div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(viewName)
                          }}
                          className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                        >
                          Download
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors flex items-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Regenerate
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('identity')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Create New Character
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}