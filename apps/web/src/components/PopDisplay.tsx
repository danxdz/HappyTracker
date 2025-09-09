import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Zap, Brain, Shield, Sparkles, Star, Download, Eye, Camera, Box } from 'lucide-react'
import { PopGenerationResult } from '../services/huggingFaceService'
import { Model3DViewer } from './Model3DViewer'

interface PopDisplayProps {
  pop: PopGenerationResult
  onClose?: () => void
}

// Helper function to generate personality description
const getPersonalityDescription = (characteristics: PopGenerationResult['characteristics']): string => {
  const { personality } = characteristics
  
  let description = 'Your pop is '
  
  if (personality.energy > 70) description += 'high-energy and lively, '
  else if (personality.energy < 30) description += 'calm and peaceful, '
  else description += 'balanced and steady, '
  
  if (personality.friendliness > 70) description += 'very social and outgoing, '
  else if (personality.friendliness < 30) description += 'thoughtful and introspective, '
  else description += 'friendly and approachable, '
  
  if (personality.creativity > 70) description += 'highly creative and imaginative, '
  else if (personality.creativity < 30) description += 'practical and logical, '
  else description += 'balanced between creative and practical, '
  
  if (personality.confidence > 70) description += 'confident and bold.'
  else if (personality.confidence < 30) description += 'humble and gentle.'
  else description += 'confident but not overbearing.'
  
  return description
}

export const PopDisplay: React.FC<PopDisplayProps> = ({ pop, onClose }) => {
  const personalityDescription = getPersonalityDescription(pop.characteristics)
  
  const getPersonalityIcon = (trait: string, value: number) => {
    const icons = {
      energy: Zap,
      friendliness: Heart,
      creativity: Brain,
      confidence: Shield
    }
    
    const Icon = icons[trait as keyof typeof icons] || Star
    const color = value > 70 ? '#10B981' : value > 40 ? '#F59E0B' : '#EF4444'
    
    return (
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-white text-sm capitalize">{trait}</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        <span className="text-white text-sm font-semibold w-8">{value}</span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-white font-bold text-2xl mb-2">Meet Your AI-Generated Pop!</h2>
          <p className="text-gray-300 text-lg">✨ Created with Hugging Face AI ✨</p>
        </div>

        {/* Character Profile Header */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {/* Original Photo */}
            <div className="relative">
              <img
                src={pop.originalImage}
                alt="Original photo"
                className="w-20 h-20 object-cover rounded-full border-2 border-white/20"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            
            {/* Character Info */}
            <div className="flex-1">
              <h3 className="text-white font-bold text-xl mb-1">Character Profile</h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: pop.characteristics.eyeColor }}
                  />
                  <span className="text-gray-300">Eyes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: pop.characteristics.hairColor }}
                  />
                  <span className="text-gray-300">Hair</span>
                </div>
                <span className="text-gray-300 capitalize">{pop.characteristics.faceShape} face</span>
              </div>
            </div>
          </div>
          
          {/* Character Preview */}
          <div className="relative">
            <img
              src={pop.popImageUrl || '/placeholder-pop.jpg'}
              alt="AI-generated pop character"
              className="w-full h-48 object-cover rounded-xl border border-white/20"
            />
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white">2D Character Preview</span>
            </div>
          </div>
        </div>

        {/* T-Pose Views for 3D Modeling */}
        {pop.tPoseViews && (
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-400" />
              6 T-Pose Views (3D Modeling Reference)
            </h3>
            <p className="text-gray-400 text-sm mb-4">These views are used to create the 3D model. All views show the same character in T-pose (arms extended horizontally).</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(pop.tPoseViews).map(([view, imageUrl]) => (
                <div key={view} className="text-center bg-white/5 rounded-lg p-2">
                  <img
                    src={imageUrl as string}
                    alt={`${view} T-pose view`}
                    className="w-full h-20 object-cover rounded-lg border border-white/20"
                  />
                  <p className="text-xs text-gray-300 mt-1 capitalize">{view.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D Model Viewer */}
        {(pop.modelData || pop.modelUrl) && (
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
              <Box className="w-5 h-5 mr-2 text-green-400" />
              3D Full-Body Model
            </h3>
            <Model3DViewer 
              modelUrl={pop.modelUrl}
              modelData={pop.modelData}
              className="w-full h-80"
            />
            <div className="mt-3 flex space-x-3">
              {pop.modelData && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = pop.modelData!
                    link.download = 'pop-character.glb'
                    link.click()
                  }}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 3D Model</span>
                </motion.button>
              )}
              {pop.modelUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(pop.modelUrl, '_blank')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View 3D Model</span>
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Final Game Avatar */}
        {pop.avatar && (
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Final Game Avatar
            </h3>
            <p className="text-gray-400 text-sm mb-4">Your character as it will appear in games - optimized icon style.</p>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={pop.avatar}
                  alt="Final game avatar"
                  className="w-32 h-32 object-cover rounded-2xl border-2 border-yellow-400/50 shadow-lg"
                />
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                  <Star className="w-4 h-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pop Characteristics */}
        <div className="space-y-6">
          {/* Physical Features */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">🎭 Physical Features</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Face Shape:</span>
                <span className="text-white font-medium capitalize">{pop.characteristics.faceShape}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hair Style:</span>
                <span className="text-white font-medium capitalize">{pop.characteristics.hairStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Eye Color:</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: pop.characteristics.eyeColor }}
                  />
                  <span className="text-white font-medium">Custom</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Hair Color:</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: pop.characteristics.hairColor }}
                  />
                  <span className="text-white font-medium">Custom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">🧠 Personality Traits</h3>
            <div className="space-y-3">
              {getPersonalityIcon('energy', pop.characteristics.personality.energy)}
              {getPersonalityIcon('friendliness', pop.characteristics.personality.friendliness)}
              {getPersonalityIcon('creativity', pop.characteristics.personality.creativity)}
              {getPersonalityIcon('confidence', pop.characteristics.personality.confidence)}
            </div>
            
            <div className="mt-4 p-3 bg-white/5 rounded-xl">
              <p className="text-gray-300 text-sm italic">"{personalityDescription}"</p>
            </div>
          </div>

          {/* Style & Accessories */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">✨ Style & Features</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300 text-sm">Style:</span>
                <span className="text-white font-medium ml-2 capitalize">{pop.characteristics.style}</span>
              </div>
              
              {pop.characteristics.accessories.length > 0 && (
                <div>
                  <span className="text-gray-300 text-sm">Accessories:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pop.characteristics.accessories.map((accessory, index) => (
                      <span
                        key={index}
                        className="bg-white/10 text-white text-xs px-2 py-1 rounded-full capitalize"
                      >
                        {accessory}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {pop.characteristics.specialFeatures.length > 0 && (
                <div>
                  <span className="text-gray-300 text-sm">Special Features:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pop.characteristics.specialFeatures.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3D Model Info */}
          {pop.modelUrl && (
            <div className="bg-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-lg mb-3">🎮 3D Model</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Model Generated:</span>
                  <span className="text-green-400 text-sm font-medium">✅ Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Format:</span>
                  <span className="text-white text-sm font-medium">GLB/GLTF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">AI Model:</span>
                  <span className="text-purple-400 text-sm font-medium">{pop.modelUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Processing Time:</span>
                  <span className="text-blue-400 text-sm font-medium">{pop.processingTime}ms</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Processing Info */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">🤖 AI Processing Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">AI Service:</span>
                <span className="text-purple-400 text-sm font-medium">Hugging Face</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Models Used:</span>
                <span className="text-blue-400 text-sm font-medium">Face Detection + 3D Generation</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Processing Time:</span>
                <span className="text-green-400 text-sm font-medium">{pop.processingTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Model:</span>
                <span className="text-yellow-400 text-sm font-medium">{pop.modelUsed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-6">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200"
            >
              Add to Pop World
            </motion.button>
            
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Close
              </motion.button>
            )}
          </div>
          
          {pop.modelUrl && (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (pop.modelUrl) {
                    // Create a temporary link to download the 3D model
                    const link = document.createElement('a')
                    link.href = pop.modelUrl
                    link.download = `pop-3d-model-${Date.now()}.glb`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  } else {
                    alert('3D model not available yet. This feature is coming soon!')
                  }
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download 3D Model</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (pop.modelUrl) {
                    // Open 3D model in a new tab (for now, just show the URL)
                    window.open(pop.modelUrl, '_blank')
                  } else {
                    alert('3D model not available yet. This feature is coming soon!')
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View 3D</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}