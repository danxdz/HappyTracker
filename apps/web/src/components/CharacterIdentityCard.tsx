import React from 'react'
import { motion } from 'framer-motion'
import { User, Shield, Zap, Heart, Brain, Star, Calendar, MapPin } from 'lucide-react'

interface CharacterIdentityCardProps {
  character: {
    characteristics: any
    gameCriteria?: any
    previewImage?: string
    originalImage?: string
    processingTime?: number
    modelUsed?: string
  }
  className?: string
}

export const CharacterIdentityCard: React.FC<CharacterIdentityCardProps> = ({ 
  character, 
  className = "" 
}) => {
  const { characteristics, previewImage, originalImage, processingTime, modelUsed } = character
  
  if (!characteristics) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Character data not available</p>
        </div>
      </div>
    )
  }

  const { personality, visualStyle, gameCriteria } = characteristics
  const { characterClass, gameAttributes, specialAbilities } = gameCriteria || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-xl border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Character Identity</h2>
            <p className="text-blue-100">HappyTracker Game Character</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Generated</div>
            <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Character Image */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Character Preview */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Character Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-center mt-2">
              <div className="text-sm font-semibold text-gray-700">{characterClass}</div>
              <div className="text-xs text-gray-500">Character Class</div>
            </div>
          </div>

          {/* Character Details */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Physical Traits */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Physical Traits
                </h3>
                <div className="text-sm space-y-1">
                  <div><span className="font-medium">Face:</span> {visualStyle?.faceShape || 'Unknown'}</div>
                  <div><span className="font-medium">Eyes:</span> {visualStyle?.eyeColor || 'Unknown'}</div>
                  <div><span className="font-medium">Hair:</span> {visualStyle?.hairColor || 'Unknown'} {visualStyle?.hairStyle || ''}</div>
                  <div><span className="font-medium">Skin:</span> {visualStyle?.skinTone || 'Unknown'}</div>
                </div>
              </div>

              {/* Personality */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Personality
                </h3>
                <div className="text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Energy:</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${personality?.energy || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{personality?.energy || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Friendliness:</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${personality?.friendliness || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{personality?.friendliness || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Creativity:</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-purple-500 rounded-full" 
                          style={{ width: `${personality?.creativity || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{personality?.creativity || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Confidence:</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-orange-500 rounded-full" 
                          style={{ width: `${personality?.confidence || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{personality?.confidence || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Attributes */}
      <div className="px-6 pb-4">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Game Attributes
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Health Potential:</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-red-500 rounded-full" 
                    style={{ width: `${gameAttributes?.healthPotential || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{gameAttributes?.healthPotential || 0}/100</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Social Skills:</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${gameAttributes?.socialSkills || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{gameAttributes?.socialSkills || 0}/100</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Learning Ability:</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: `${gameAttributes?.learningAbility || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{gameAttributes?.learningAbility || 0}/100</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Adaptability:</span>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-purple-500 rounded-full" 
                    style={{ width: `${gameAttributes?.adaptability || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{gameAttributes?.adaptability || 0}/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Abilities */}
      <div className="px-6 pb-4">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Special Abilities
        </h3>
        <div className="flex flex-wrap gap-2">
          {(specialAbilities || []).map((ability: string, index: number) => (
            <span
              key={index}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {ability}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Generated: {new Date().toLocaleString()}
          </div>
          <div className="flex items-center">
            <Brain className="w-4 h-4 mr-1" />
            {modelUsed || 'AI Generated'}
          </div>
        </div>
        {processingTime && (
          <div className="text-xs text-gray-500 mt-1 text-center">
            Processing time: {(processingTime / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </motion.div>
  )
}