import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Zap, Brain, Shield, Sparkles, Star } from 'lucide-react'
import { GeneratedPop, PopGenerationService } from '../services/popGenerationService'

interface PopDisplayProps {
  pop: GeneratedPop
  onClose?: () => void
}

export const PopDisplay: React.FC<PopDisplayProps> = ({ pop, onClose }) => {
  const personalityDescription = PopGenerationService.getPersonalityDescription(pop.characteristics)
  
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
          
          <h2 className="text-white font-bold text-2xl mb-2">Meet Your Pop!</h2>
          <p className="text-gray-300 text-lg">✨ {pop.name} ✨</p>
        </div>

        {/* Pop Image */}
        <div className="relative mb-6">
          <img
            src={pop.imageUrl}
            alt={`${pop.name} pop character`}
            className="w-full h-64 object-cover rounded-2xl border border-white/20"
          />
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

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

          {/* Health Connection */}
          <div className="bg-white/5 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-lg mb-3">💚 Health Connection</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{pop.healthConnection.wellnessScore}</div>
                <div className="text-gray-300 text-xs">Wellness Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400 capitalize">{pop.healthConnection.mood}</div>
                <div className="text-gray-300 text-xs">Current Mood</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{pop.healthConnection.energyLevel}</div>
                <div className="text-gray-300 text-xs">Energy Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
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
      </motion.div>
    </div>
  )
}