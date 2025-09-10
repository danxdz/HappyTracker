/**
 * 🆔 Identity Card Component
 * 
 * Collects character information for 3D generation
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, Ruler, Weight, Camera, Sparkles } from 'lucide-react'

export interface CharacterIdentity {
  name: string
  age: number
  height: number // in cm
  weight: number // in kg
  photo?: File
  bodyType: 'thin' | 'normal' | 'large'
  personality: string
}

export interface IdentityCardProps {
  onIdentitySubmit: (identity: CharacterIdentity) => void
  isProcessing?: boolean
}

export const IdentityCard: React.FC<IdentityCardProps> = ({
  onIdentitySubmit,
  isProcessing = false
}) => {
  const [identity, setIdentity] = useState<CharacterIdentity>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    bodyType: 'normal',
    personality: 'friendly'
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handleInputChange = (field: keyof CharacterIdentity, value: any) => {
    setIdentity(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
        handleInputChange('photo', file)
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateBodyType = (height: number, weight: number): 'thin' | 'normal' | 'large' => {
    const bmi = weight / ((height / 100) ** 2)
    if (bmi < 18.5) return 'thin'
    if (bmi > 25) return 'large'
    return 'normal'
  }

  const handleSubmit = () => {
    const bodyType = calculateBodyType(identity.height, identity.weight)
    const finalIdentity = {
      ...identity,
      bodyType
    }
    onIdentitySubmit(finalIdentity)
  }

  const isFormValid = identity.name.trim() && identity.age > 0 && identity.height > 0 && identity.weight > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">
          🆔 Character Identity Card
        </h2>
        <p className="text-gray-300">
          Tell us about your character for perfect 3D generation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Character Photo
            </h3>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="block cursor-pointer"
              >
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Character preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Change Photo</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center hover:border-blue-400 transition-colors">
                    <div className="text-center text-gray-400">
                      <Camera className="w-12 h-12 mx-auto mb-4" />
                      <div className="text-lg font-medium">Upload Photo</div>
                      <div className="text-sm">Click to select image</div>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Name */}
          <div className="bg-white/5 rounded-xl p-6">
            <label className="block text-white font-medium mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={identity.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter character name..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Age */}
          <div className="bg-white/5 rounded-xl p-6">
            <label className="block text-white font-medium mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Age
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={identity.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-6">
              <label className="block text-white font-medium mb-2 flex items-center">
                <Ruler className="w-4 h-4 mr-2" />
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={identity.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <label className="block text-white font-medium mb-2 flex items-center">
                <Weight className="w-4 h-4 mr-2" />
                Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                value={identity.weight}
                onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Body Type Preview */}
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-white font-medium mb-3">Body Type Preview</h4>
            <div className="flex items-center justify-center space-x-4">
              {['thin', 'normal', 'large'].map((type) => (
                <div
                  key={type}
                  className={`text-center p-3 rounded-lg transition-all ${
                    calculateBodyType(identity.height, identity.weight) === type
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {type === 'thin' ? '🏃' : type === 'normal' ? '🚶' : '🏋️'}
                  </div>
                  <div className="text-sm font-medium capitalize">{type}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-gray-400">
              BMI: {(identity.weight / ((identity.height / 100) ** 2)).toFixed(1)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!isFormValid || isProcessing}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg transition-all
            ${isFormValid && !isProcessing
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              Creating Character...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Create 3D Character
            </div>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}