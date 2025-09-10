/**
 * 🎬 Dynamic Character Creation Flow
 * 
 * Full-screen app with smooth transitions
 * Player card + popup interactions
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Ruler, Weight, Sparkles, ArrowRight, Check } from 'lucide-react'

interface CharacterData {
  name: string
  birthDate: Date | null
  height: number
  weight: number
  age: number
}

type FlowStep = 'loading' | 'name' | 'birthdate' | 'measures' | 'complete'

export const DynamicCharacterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('loading')
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    birthDate: null,
    height: 170,
    weight: 70,
    age: 25
  })

  // Auto-progress through loading
  useEffect(() => {
    if (currentStep === 'loading') {
      const timer = setTimeout(() => {
        setCurrentStep('name')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const updateCharacterData = (field: keyof CharacterData, value: any) => {
    setCharacterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    const steps: FlowStep[] = ['loading', 'name', 'birthdate', 'measures', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const calculateAge = (birthDate: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleBirthDateChange = (date: Date) => {
    updateCharacterData('birthDate', date)
    updateCharacterData('age', calculateAge(date))
    setTimeout(nextStep, 500)
  }

  const handleNameSubmit = () => {
    if (characterData.name.trim()) {
      setTimeout(nextStep, 500)
    }
  }

  const handleMeasuresComplete = () => {
    setTimeout(nextStep, 500)
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
              {characterData.birthDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <p className="text-gray-300 text-lg">
                    {characterData.age} years old
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
                  </p>
                  <p className="text-gray-300">
                    {characterData.weight} kg
                  </p>
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

          {/* Birth Date Popup */}
          {currentStep === 'birthdate' && (
            <motion.div
              key="birthdate-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  When were you born?
                </h3>
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <input
                    type="date"
                    onChange={(e) => handleBirthDateChange(new Date(e.target.value))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:border-blue-400 text-center text-lg"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
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
                  Configure Your Character
                </h3>
                
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

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-2">
            {['name', 'birthdate', 'measures', 'complete'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step || 
                  (step === 'name' && currentStep === 'name') ||
                  (step === 'birthdate' && ['birthdate', 'measures', 'complete'].includes(currentStep)) ||
                  (step === 'measures' && ['measures', 'complete'].includes(currentStep)) ||
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