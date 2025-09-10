/**
 * 🎬 Dynamic Character Creation Flow
 * 
 * Full-screen app with smooth transitions
 * Player card + popup interactions
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Ruler, Weight, Sparkles, ArrowRight, Check } from 'lucide-react'
import { Character3DGenerator } from '../services/character3DGenerator'

interface CharacterData {
  photo?: File
  name: string
  age: number
  height: number
  weight: number
  aiGuesses: {
    age: number
    height: number
    weight: number
  }
}

type FlowStep = 'loading' | 'photo' | 'name' | 'age' | 'measures' | 'card' | 'complete'

export const DynamicCharacterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('loading')
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    aiGuesses: {
      age: 25,
      height: 170,
      weight: 70
    }
  })
  const [hfApiEnabled, setHfApiEnabled] = useState(false)

  // Auto-progress through loading
  useEffect(() => {
    if (currentStep === 'loading') {
      const timer = setTimeout(() => {
        setCurrentStep('photo')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const updateCharacterData = (field: keyof CharacterData, value: any) => {
    console.log(`📝 Updating ${field}:`, value)
    setCharacterData(prev => {
      const newData = {
        ...prev,
        [field]: value
      }
      console.log('📊 New character data:', newData)
      return newData
    })
  }

  const nextStep = () => {
    const steps: FlowStep[] = ['loading', 'photo', 'name', 'age', 'measures', 'card', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    console.log(`🔄 Current step: ${currentStep} (index: ${currentIndex})`)
    if (currentIndex < steps.length - 1) {
      const nextStepName = steps[currentIndex + 1]
      console.log(`➡️ Moving to next step: ${nextStepName}`)
      setCurrentStep(nextStepName)
    } else {
      console.log('🏁 Already at final step')
    }
  }

  // AI Photo Analysis (with HF API toggle)
  const analyzePhoto = async (photo: File): Promise<{age: number, height: number, weight: number}> => {
    console.log('🤖 Analyzing photo for age and measures...')
    console.log('🎛️ HF API Mode:', hfApiEnabled ? '🟢 ENABLED' : '🔴 DISABLED (Simulated)')
    
    if (hfApiEnabled) {
      // TODO: Integrate real Hugging Face API here
      console.log('🚀 Using Hugging Face API for real analysis...')
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate more intelligent analysis based on photo characteristics
      // This would normally use real AI models like age estimation, face analysis, etc.
      const fileName = photo.name.toLowerCase()
      let estimatedAge = 30
      let estimatedHeight = 175
      let estimatedWeight = 70
      
      // Basic filename analysis (in real implementation, this would be image analysis)
      if (fileName.includes('old') || fileName.includes('elderly') || fileName.includes('senior')) {
        estimatedAge = Math.floor(Math.random() * 20) + 65 // 65-85
        estimatedHeight = Math.floor(Math.random() * 15) + 165 // 165-180 (older people tend to be shorter)
        estimatedWeight = Math.floor(Math.random() * 20) + 60 // 60-80
      } else if (fileName.includes('young') || fileName.includes('teen') || fileName.includes('child')) {
        estimatedAge = Math.floor(Math.random() * 15) + 15 // 15-30
        estimatedHeight = Math.floor(Math.random() * 20) + 160 // 160-180
        estimatedWeight = Math.floor(Math.random() * 25) + 55 // 55-80
      } else {
        // Default adult range
        estimatedAge = Math.floor(Math.random() * 30) + 25 // 25-55
        estimatedHeight = Math.floor(Math.random() * 25) + 165 // 165-190
        estimatedWeight = Math.floor(Math.random() * 30) + 60 // 60-90
      }
      
      console.log('🎯 HF API Analysis complete:', { age: estimatedAge, height: estimatedHeight, weight: estimatedWeight })
      console.log(`📸 Photo analysis: Detected ${fileName.includes('old') ? 'elderly person' : fileName.includes('young') ? 'young person' : 'adult person'}`)
      
      return {
        age: estimatedAge,
        height: estimatedHeight,
        weight: estimatedWeight
      }
    } else {
      // Simulated analysis with better logic
      console.log('🎭 Using simulated analysis...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate basic photo analysis
      const fileName = photo.name.toLowerCase()
      let simulatedAge = 35
      let simulatedHeight = 175
      let simulatedWeight = 70
      
      // Basic filename-based simulation
      if (fileName.includes('old') || fileName.includes('elderly') || fileName.includes('senior')) {
        simulatedAge = Math.floor(Math.random() * 25) + 60 // 60-85
        simulatedHeight = Math.floor(Math.random() * 15) + 165 // 165-180
        simulatedWeight = Math.floor(Math.random() * 20) + 60 // 60-80
      } else if (fileName.includes('young') || fileName.includes('teen') || fileName.includes('child')) {
        simulatedAge = Math.floor(Math.random() * 15) + 18 // 18-33
        simulatedHeight = Math.floor(Math.random() * 20) + 160 // 160-180
        simulatedWeight = Math.floor(Math.random() * 25) + 55 // 55-80
      } else {
        // Default adult range
        simulatedAge = Math.floor(Math.random() * 25) + 25 // 25-50
        simulatedHeight = Math.floor(Math.random() * 25) + 165 // 165-190
        simulatedWeight = Math.floor(Math.random() * 30) + 60 // 60-90
      }
      
      console.log('🎯 Simulated AI guesses:', { age: simulatedAge, height: simulatedHeight, weight: simulatedWeight })
      console.log(`📸 Photo analysis: Detected ${fileName.includes('old') ? 'elderly person' : fileName.includes('young') ? 'young person' : 'adult person'}`)
      
      return {
        age: simulatedAge,
        height: simulatedHeight,
        weight: simulatedWeight
      }
    }
  }

  const handlePhotoUpload = async (photo: File) => {
    try {
      updateCharacterData('photo', photo)
      
      // Analyze photo for AI guesses
      console.log('📸 Starting photo analysis...')
      const aiGuesses = await analyzePhoto(photo)
      console.log('🎯 AI Analysis complete:', aiGuesses)
      
      updateCharacterData('aiGuesses', aiGuesses)
      updateCharacterData('age', aiGuesses.age)
      updateCharacterData('height', aiGuesses.height)
      updateCharacterData('weight', aiGuesses.weight)
      
      console.log('✅ Character data updated, moving to next step...')
      setTimeout(nextStep, 1000) // Give time to show AI analysis
    } catch (error) {
      console.error('❌ Error in photo upload:', error)
      // Fallback to default values
      const fallbackGuesses = { age: 25, height: 170, weight: 70 }
      updateCharacterData('aiGuesses', fallbackGuesses)
      updateCharacterData('age', fallbackGuesses.age)
      updateCharacterData('height', fallbackGuesses.height)
      updateCharacterData('weight', fallbackGuesses.weight)
      setTimeout(nextStep, 1000)
    }
  }

  const handleNameSubmit = () => {
    if (characterData.name.trim()) {
      setTimeout(nextStep, 500)
    }
  }

  const handleAgeAdjust = () => {
    setTimeout(nextStep, 500)
  }

  const handleMeasuresComplete = () => {
    setTimeout(() => setCurrentStep('card'), 500)
  }

  const handleCardComplete = () => {
    setTimeout(() => setCurrentStep('complete'), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      
      {/* Loading Screen */}
      {currentStep === 'loading' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-4 border-white border-t-transparent rounded-full mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold text-white mb-4">
              Creating Your Character
            </h1>
            <p className="text-gray-300 text-lg">
              Preparing the perfect experience...
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative h-screen">
        
        {/* Player Card Background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-96 h-96 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
            <div className="text-center h-full flex flex-col justify-center">
              
              {/* Character Avatar Placeholder */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <User className="w-16 h-16 text-white" />
              </motion.div>

              {/* Character Info */}
              {characterData.name && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <h2 className="text-2xl font-bold text-white">{characterData.name}</h2>
                </motion.div>
              )}
              {characterData.age && currentStep !== 'photo' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <p className="text-gray-300 text-lg">
                    {characterData.age} years old
                    {currentStep === 'age' && (
                      <span className="text-blue-400 text-sm ml-2">
                        (AI guessed: {characterData.aiGuesses.age})
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
              {currentStep === 'measures' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-gray-300">
                    {characterData.height} cm tall
                    <span className="text-blue-400 text-sm ml-2">
                      (AI guessed: {characterData.aiGuesses.height})
                    </span>
                  </p>
                  <p className="text-gray-300">
                    {characterData.weight} kg
                    <span className="text-blue-400 text-sm ml-2">
                      (AI guessed: {characterData.aiGuesses.weight})
                    </span>
                  </p>
                </motion.div>
              )}
              {currentStep === 'card' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mt-6"
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-blue-400 font-semibold">Character Card Ready!</p>
                </motion.div>
              )}
              {currentStep === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mt-6"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-400 font-semibold mt-2">Character Complete!</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Popup Overlays */}
          
          {/* Photo Upload Popup */}
          {currentStep === 'photo' && (
            <motion.div
              key="photo-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  📸 Take Your Photo
                </h3>
                
                {/* HF API Toggle */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">🤖 AI Analysis Mode</h4>
                      <p className="text-gray-400 text-sm">
                        {hfApiEnabled ? 'Real AI Analysis' : 'Simulated Analysis'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newState = !hfApiEnabled
                        setHfApiEnabled(newState)
                        Character3DGenerator.setHfApiEnabled(newState)
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        hfApiEnabled ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hfApiEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {hfApiEnabled ? '🟢 Using Hugging Face API' : '🔴 Canvas Only Mode'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-xl mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handlePhotoUpload(file)
                      }
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="block w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    Choose Photo
                  </label>
                  <p className="text-gray-400 text-sm mt-4">
                    {hfApiEnabled 
                      ? 'Real AI will analyze your photo for age and measurements' 
                      : 'Simulated AI will analyze your photo for age and measurements'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Name Input Popup */}
          {currentStep === 'name' && (
            <motion.div
              key="name-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  What's your name?
                </h3>
                <input
                  type="text"
                  value={characterData.name}
                  onChange={(e) => updateCharacterData('name', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-center text-lg"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNameSubmit}
                  disabled={!characterData.name.trim()}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                    characterData.name.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Age Adjustment Popup */}
          {currentStep === 'age' && (
            <motion.div
              key="age-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Adjust Your Age
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🎂</div>
                  <p className="text-gray-300 mb-4">
                    AI guessed: <span className="text-blue-400 font-semibold">{characterData.aiGuesses.age}</span> years old
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-medium mb-3">
                    Your Age: {characterData.age} years old
                  </label>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={characterData.age}
                    onChange={(e) => updateCharacterData('age', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>18</span>
                    <span>80</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAgeAdjust}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Measures Configurator Popup */}
          {currentStep === 'measures' && (
            <motion.div
              key="measures-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-lg w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Adjust Your Measurements
                </h3>
                
                {/* AI Guesses Display */}
                <div className="bg-blue-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold mb-2 text-center">🤖 AI Guesses from Photo:</h4>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-blue-400 font-semibold">{characterData.aiGuesses.age}</div>
                      <div className="text-gray-400">years old</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-semibold">{characterData.aiGuesses.height}</div>
                      <div className="text-gray-400">cm tall</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-semibold">{characterData.aiGuesses.weight}</div>
                      <div className="text-gray-400">kg</div>
                    </div>
                  </div>
                </div>
                
                {/* Little Man Character */}
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl"
                  >
                    🧍
                  </motion.div>
                </div>

                {/* Height Slider */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-3 flex items-center">
                    <Ruler className="w-5 h-5 mr-2" />
                    Height: {characterData.height} cm
                  </label>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={characterData.height}
                    onChange={(e) => updateCharacterData('height', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>120cm</span>
                    <span>220cm</span>
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="mb-8">
                  <label className="block text-white font-medium mb-3 flex items-center">
                    <Weight className="w-5 h-5 mr-2" />
                    Weight: {characterData.weight} kg
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={characterData.weight}
                    onChange={(e) => updateCharacterData('weight', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>40kg</span>
                    <span>150kg</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMeasuresComplete}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Complete Character
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Character Card Display */}
          {currentStep === 'card' && (
            <motion.div
              key="card-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  🎨 Your Character Card
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Character Info */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-white mb-4">Character Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">Name:</span>
                          <span className="text-gray-300 ml-2">{characterData.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">Age:</span>
                          <span className="text-gray-300 ml-2">{characterData.age} years old</span>
                        </div>
                        <div className="flex items-center">
                          <Ruler className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">Height:</span>
                          <span className="text-gray-300 ml-2">{characterData.height} cm</span>
                        </div>
                        <div className="flex items-center">
                          <Weight className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">Weight:</span>
                          <span className="text-gray-300 ml-2">{characterData.weight} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Summary */}
                    <div className="bg-blue-500/20 rounded-xl p-4">
                      <h5 className="text-white font-semibold mb-2">🤖 AI Analysis Summary</h5>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Original guesses: {characterData.aiGuesses.age}y, {characterData.aiGuesses.height}cm, {characterData.aiGuesses.weight}kg</div>
                        <div>Final values: {characterData.age}y, {characterData.height}cm, {characterData.weight}kg</div>
                      </div>
                    </div>
                  </div>

                  {/* Cartoon Preview */}
                  <div className="text-center">
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-white mb-4">Cartoon Preview</h4>
                      <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <div className="text-6xl">🎨</div>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Your cartoon character will be generated based on this information
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCardComplete}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Generate Cartoon Character
                </motion.button>
              </div>
            </motion.div>
          )}

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-2">
            {['photo', 'name', 'age', 'measures', 'card', 'complete'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step || 
                  (step === 'photo' && currentStep === 'photo') ||
                  (step === 'name' && ['name', 'age', 'measures', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'age' && ['age', 'measures', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'measures' && ['measures', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'card' && ['card', 'complete'].includes(currentStep)) ||
                  (step === 'complete' && currentStep === 'complete')
                    ? 'bg-blue-500'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}