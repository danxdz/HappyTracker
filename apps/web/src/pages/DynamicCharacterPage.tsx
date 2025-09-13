import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, ArrowRight, ArrowLeft, Check, Upload, User, Calendar, Ruler, Weight, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CaricatureGenerator } from '../services/cartoonGenerator'
import { CharacterStorage } from '../services/characterStorage'
import { ThreeDCharacterGenerator } from '../services/threeDCharacterGenerator'

interface CharacterData {
  photo?: File
  name: string
  age: number
  height: number
  weight: number
  gender: 'male' | 'female' | 'non-binary' | 'unknown'
  aiGuesses?: {
    age: number
    height: number
    weight: number
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
  }
}

type FlowStep = 'photo' | 'name' | 'gender' | 'age' | 'measures' | 'class' | 'card' | 'complete'

const DynamicCharacterPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<FlowStep>('photo')
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    gender: 'unknown'
  })
  
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)
  const [isGeneratingCaricature, setIsGeneratingCaricature] = useState(false)
  const [caricatureImage, setCaricatureImage] = useState<string | null>(null)
  const [generationCost, setGenerationCost] = useState<number | null>(null)
  const [characterSaved, setCharacterSaved] = useState(false)
  const [isSavingCharacter, setIsSavingCharacter] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [rpgClass, setRpgClass] = useState<{
    name: string
    description: string
    stats: {
      strength: number
      agility: number
      intelligence: number
      wisdom: number
      charisma: number
      constitution: number
      total: number
    }
  } | undefined>(undefined)
  const [photoAnalysis, setPhotoAnalysis] = useState<any>(null)
  const [generationPrompt, setGenerationPrompt] = useState<string | null>(null)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [isGenerating3D, setIsGenerating3D] = useState(false)
  const [threeDModelUrl, setThreeDModelUrl] = useState<string | null>(null)

  const steps: FlowStep[] = ['photo', 'name', 'gender', 'age', 'measures', 'class', 'card', 'complete']
  const currentStepIndex = steps.indexOf(currentStep)

  const updateCharacterData = (updates: Partial<CharacterData>) => {
    console.log('📝 Updating character data:', updates)
    setCharacterData(prev => ({ ...prev, ...updates }))
  }

  const moveToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      console.log('➡️ Moving to next step:', steps[nextIndex])
      setCurrentStep(steps[nextIndex])
    }
  }

  const moveToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      console.log('⬅️ Moving to previous step:', steps[prevIndex])
      setCurrentStep(steps[prevIndex])
    }
  }

  const handlePhotoUpload = async (file: File) => {
    console.log('📸 Starting photo analysis...')
    setIsProcessingPhoto(true)
    
    try {
      // Simulate photo analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock AI analysis results
      const aiGuesses = {
        age: Math.floor(Math.random() * 50) + 20,
        height: Math.floor(Math.random() * 30) + 160,
        weight: Math.floor(Math.random() * 40) + 60,
        gender: ['male', 'female'][Math.floor(Math.random() * 2)] as 'male' | 'female'
      }
      
      console.log('🎯 AI Analysis complete:', aiGuesses)
      updateCharacterData({ photo: file, aiGuesses })
      
      setTimeout(() => {
        setIsProcessingPhoto(false)
        moveToNextStep()
      }, 1000)
    } catch (error) {
      console.error('❌ Photo analysis failed:', error)
      setIsProcessingPhoto(false)
    }
  }

  const generateCaricature = async () => {
    console.log('🎨 Starting caricature generation...')
    setIsGeneratingCaricature(true)
    
    try {
      const result = await CaricatureGenerator.generateCaricatureFromPhoto(
        characterData.photo!,
        'cute',
        {
          name: characterData.name,
          age: characterData.age,
          height: characterData.height,
          weight: characterData.weight,
          gender: characterData.gender
        },
        rpgClass
      )
      
      if (result.success && result.imageUrl) {
        console.log('🎨 AI Caricature generated successfully!')
        setCaricatureImage(result.imageUrl)
        setGenerationCost(result.cost || 0)
        setGenerationResult(result)
        
        if (result.rpgClass) {
          setRpgClass(result.rpgClass)
        }
        if (result.generationPrompt) {
          setGenerationPrompt(result.generationPrompt)
        }
        if (result.photoAnalysis) {
          setPhotoAnalysis(result.photoAnalysis)
        }
        
        setTimeout(() => {
          setIsGeneratingCaricature(false)
          setCurrentStep('complete')
        }, 1000)
      } else {
        console.error('❌ Caricature generation failed:', result.error)
        setIsGeneratingCaricature(false)
        alert('Caricature generation failed. Please try again.')
      }
    } catch (error) {
      console.error('❌ Error generating caricature:', error)
      setIsGeneratingCaricature(false)
      alert('Error generating caricature. Please try again.')
    }
  }

  const generateThreeDCharacter = async () => {
    console.log('🎮 Starting 3D character generation...')
    setIsGenerating3D(true)
    
    try {
      const result = await ThreeDCharacterGenerator.generateThreeDCharacter(
        caricatureImage!,
        characterData,
        rpgClass
      )
      console.log('🎮 3D Character generated successfully!')
      setThreeDModelUrl(result.modelUrl || null)
    } catch (error) {
      console.error('❌ 3D Character generation failed:', error)
    } finally {
      setIsGenerating3D(false)
    }
  }

  const saveCharacterToGallery = async () => {
    if (isSavingCharacter || characterSaved) {
      console.log('⏳ Already saving or saved, ignoring duplicate request')
      return
    }

    try {
      setIsSavingCharacter(true)
      console.log('💾 Attempting to save character to gallery...')
      
      if (!caricatureImage || !characterData.name) {
        console.error('❌ Cannot save: missing caricature image or name')
        alert('Cannot save character: missing caricature image or name')
        setIsSavingCharacter(false)
        return
      }

      const savedCharacter = CharacterStorage.saveCharacter({
        name: characterData.name,
        age: characterData.age,
        height: characterData.height,
        weight: characterData.weight,
        gender: characterData.gender,
        caricatureImage,
        generationCost: generationCost || 0,
        style: 'cute',
        rpgClass: rpgClass || undefined,
        photoAnalysis: photoAnalysis || undefined,
        aiGuesses: characterData.aiGuesses,
        generationPrompt: generationPrompt || undefined,
        processingTime: generationResult?.processingTime || 0,
        costBreakdown: generationResult?.breakdown
      })

      setCharacterSaved(true)
      console.log('💾 Character saved to gallery:', savedCharacter.name)
      
      setTimeout(() => {
        alert(`Character "${characterData.name}" saved to gallery!`)
      }, 500)
    } catch (error) {
      console.error('❌ Failed to save character:', error)
      alert('Failed to save character to gallery')
    } finally {
      setIsSavingCharacter(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'photo':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Upload Your Photo</h2>
            <p className="text-gray-300 mb-8">Let our AI analyze your photo to create a personalized character</p>
            
            <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
              </label>
            </div>
            
            {isProcessingPhoto && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white">Analyzing photo...</span>
              </div>
            )}
          </motion.div>
        )

      case 'name':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">What's Your Name?</h2>
            <p className="text-gray-300 mb-8">Give your character a unique name</p>
            
            <input
              type="text"
              value={characterData.name}
              onChange={(e) => updateCharacterData({ name: e.target.value })}
              placeholder="Enter your character's name"
              className="w-full max-w-md mx-auto bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            {characterData.name && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={moveToNextStep}
                className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </motion.div>
        )

      case 'gender':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Choose Gender</h2>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {['male', 'female'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    updateCharacterData({ gender: gender as 'male' | 'female' })
                    moveToNextStep()
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    characterData.gender === gender
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {gender === 'male' ? '👨' : '👩'}
                  </div>
                  <div className="capitalize font-semibold">{gender}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'age':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">How Old Are You?</h2>
            <p className="text-gray-300 mb-8">This helps create an age-appropriate character</p>
            
            <div className="max-w-md mx-auto">
              <input
                type="range"
                min="18"
                max="80"
                value={characterData.age}
                onChange={(e) => updateCharacterData({ age: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-3xl font-bold text-white mt-4">{characterData.age} years old</div>
            </div>
            
            <motion.button
              onClick={moveToNextStep}
              className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )

      case 'measures':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Physical Measurements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">Height (cm)</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="200"
                  value={characterData.height}
                  onChange={(e) => updateCharacterData({ height: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xl font-bold text-white mt-2">{characterData.height} cm</div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Weight className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">Weight (kg)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={characterData.weight}
                  onChange={(e) => updateCharacterData({ weight: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xl font-bold text-white mt-2">{characterData.weight} kg</div>
              </div>
            </div>
            
            <motion.button
              onClick={moveToNextStep}
              className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )

      case 'class':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Choose Your RPG Class</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { name: 'Warrior', icon: '⚔️', color: 'from-red-500 to-orange-500' },
                { name: 'Mage', icon: '🧙', color: 'from-blue-500 to-purple-500' },
                { name: 'Rogue', icon: '🗡️', color: 'from-green-500 to-teal-500' },
                { name: 'Cleric', icon: '⛑️', color: 'from-yellow-500 to-orange-500' },
                { name: 'Ranger', icon: '🏹', color: 'from-emerald-500 to-green-500' },
                { name: 'Paladin', icon: '🛡️', color: 'from-purple-500 to-pink-500' }
              ].map((cls) => (
                <button
                  key={cls.name}
                  onClick={() => {
                    setRpgClass({
                      name: cls.name,
                      description: `A ${cls.name.toLowerCase()} character`,
                      stats: {
                        strength: Math.floor(Math.random() * 30) + 50,
                        agility: Math.floor(Math.random() * 30) + 50,
                        intelligence: Math.floor(Math.random() * 30) + 50,
                        wisdom: Math.floor(Math.random() * 30) + 50,
                        charisma: Math.floor(Math.random() * 30) + 50,
                        constitution: Math.floor(Math.random() * 30) + 50,
                        total: 300
                      }
                    })
                    moveToNextStep()
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    rpgClass?.name === cls.name
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="text-3xl mb-2">{cls.icon}</div>
                  <div className="font-semibold">{cls.name}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'card':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-8">Ready to Create?</h2>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-md mx-auto mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Character Summary</h3>
              <div className="space-y-2 text-gray-300">
                <div><strong>Name:</strong> {characterData.name}</div>
                <div><strong>Age:</strong> {characterData.age}</div>
                <div><strong>Gender:</strong> {characterData.gender}</div>
                <div><strong>Height:</strong> {characterData.height} cm</div>
                <div><strong>Weight:</strong> {characterData.weight} kg</div>
                <div><strong>Class:</strong> {rpgClass?.name}</div>
              </div>
            </div>
            
            <motion.button
              onClick={generateCaricature}
              disabled={isGeneratingCaricature}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGeneratingCaricature ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating Character...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create My Character
                </>
              )}
            </motion.button>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Character Created!</h2>
            
            {caricatureImage && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-sm mx-auto mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Character</h3>
                <div 
                  className="w-48 h-48 bg-white rounded-xl mx-auto flex items-center justify-center overflow-hidden mb-4 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowImageModal(true)}
                >
                  <img 
                    src={caricatureImage} 
                    alt="Your Character" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-300 text-sm mb-4">Click image for fullscreen view</p>
                
                {generationCost !== null && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                    <div className="text-green-400 font-semibold">💰 Generation Cost</div>
                    <div className="text-white text-sm">${generationCost.toFixed(3)} USD</div>
                  </div>
                )}
                
                <div className="text-gray-300 text-sm mb-4">
                  {characterData.name} - {characterData.age} years old, {characterData.height}cm, {characterData.weight}kg
                </div>
                
                {rpgClass && (
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                    <h4 className="text-purple-400 font-semibold mb-2">⚔️ RPG Class: {rpgClass.name}</h4>
                    <p className="text-gray-300 text-sm">{rpgClass.description}</p>
                  </div>
                )}
                
                {!characterSaved && (
                  <button
                    onClick={saveCharacterToGallery}
                    disabled={isSavingCharacter}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 mb-4"
                  >
                    {isSavingCharacter ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      '💾 Save to Gallery'
                    )}
                  </button>
                )}
                
                {characterSaved && (
                  <div className="w-full bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-3 px-6 rounded-xl text-center mb-4">
                    ✅ Saved to Gallery!
                  </div>
                )}
                
                {/* Simple 3D Generation */}
                <div className="mb-4">
                  <button
                    onClick={generateThreeDCharacter}
                    disabled={isGenerating3D}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {isGenerating3D ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating 3D Model...
                      </div>
                    ) : (
                      '🎮 Generate 3D Model'
                    )}
                  </button>
                  
                  {threeDModelUrl && (
                    <div className="mt-4 bg-white/10 rounded-xl p-4">
                      <h5 className="text-white font-semibold mb-3 text-center">🎮 Your 3D Model</h5>
                      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                        <div className="text-center">
                          <div className="text-green-400 text-2xl mb-1">🎮</div>
                          <p className="text-white text-sm">3D Model Ready!</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = threeDModelUrl
                          link.download = `${characterData.name}-3d-model.glb`
                          link.click()
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        📥 Download 3D Model
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/character-gallery')}
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-200"
                  >
                    View Gallery
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep('photo')
                      setCharacterData({ name: '', age: 25, height: 170, weight: 70, gender: 'unknown' })
                      setCaricatureImage(null)
                      setCharacterSaved(false)
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className="text-white text-sm">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl">
          {renderStep()}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && caricatureImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={caricatureImage} 
              alt="Your Character" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DynamicCharacterPage