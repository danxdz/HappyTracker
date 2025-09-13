/**
 * 🎬 Dynamic Character Creation Flow
 * 
 * Full-screen app with smooth transitions
 * Player card + popup interactions
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Ruler, Weight, Sparkles, ArrowRight, Check, Image, Box, Download } from 'lucide-react'
import { CaricatureGenerator } from '../services/cartoonGenerator'
import { CharacterStorage } from '../services/characterStorage'
import { ThreeDCharacterGenerator } from '../services/threeDCharacterGenerator'
import { Meshy3DService } from '../services/meshy3DService'
import { ThreeDViewer } from '../components/ThreeDViewer'

interface CharacterData {
  photo?: File
  name: string
  age: number
  height: number
  weight: number
  gender: 'male' | 'female' | 'non-binary' | 'unknown'
  aiGuesses: {
    age: number
    height: number
    weight: number
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
  }
}

type FlowStep = 'loading' | 'photo' | 'name' | 'gender' | 'age' | 'measures' | 'class' | 'card' | 'complete'

export const DynamicCharacterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('loading')
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    age: 25,
    height: 170,
    weight: 70,
    gender: 'unknown',
    aiGuesses: {
      age: 25,
      height: 170,
      weight: 70,
      gender: 'unknown'
    }
  })
  const [hfApiEnabled, setHfApiEnabled] = useState(true) // Always enabled for AI caricature generation
  const [caricatureGenerated, setCaricatureGenerated] = useState(false)
  const [caricatureImage, setCaricatureImage] = useState<string | null>(null)
  const [generationCost, setGenerationCost] = useState<number | null>(null)
  const [characterSaved, setCharacterSaved] = useState(false)
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
  } | null>(null)
  const [generationPrompt, setGenerationPrompt] = useState<string | null>(null)
  const [photoAnalysis, setPhotoAnalysis] = useState<{
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
    age: number
    height: number
    weight: number
    glasses: boolean
    facialHair: boolean
    hairColor: string
    hairStyle: string
    skinTone: 'light' | 'medium' | 'dark'
    expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious'
    faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long'
    build: 'slim' | 'average' | 'muscular' | 'heavy'
  } | null>(null)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)
  const [isGeneratingCaricature, setIsGeneratingCaricature] = useState(false)
  const [isGenerating3D, setIsGenerating3D] = useState(false)
  const [threeDModelUrl, setThreeDModelUrl] = useState<string | null>(null)
  const [threeDGenerationResult, setThreeDGenerationResult] = useState<any>(null)
  const [isGeneratingMeshy3D, setIsGeneratingMeshy3D] = useState(false)
  const [meshy3DResult, setMeshy3DResult] = useState<any>(null)

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
    const steps: FlowStep[] = ['loading', 'photo', 'name', 'gender', 'age', 'measures', 'class', 'card', 'complete']
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

  // Real AI photo analysis - happens immediately after photo upload
  const analyzePhoto = async (photo: File): Promise<{age: number, height: number, weight: number, gender: 'male' | 'female' | 'non-binary' | 'unknown'}> => {
    console.log('📸 Photo uploaded, starting AI analysis...')
    
    try {
           // Use the caricature generator's analysis method
           const { CaricatureGenerator } = await import('../services/cartoonGenerator')
           const photoAnalysis = await CaricatureGenerator.analyzePhotoForUI(photo)
      
      console.log('🎯 AI Analysis complete:', photoAnalysis)
      
      return {
        age: photoAnalysis.age,
        height: photoAnalysis.height,
        weight: photoAnalysis.weight,
        gender: photoAnalysis.gender
      }
    } catch (error) {
      console.error('❌ AI analysis failed, using filename fallback:', error)
      
      // Fallback to filename analysis
      const fileName = photo.name.toLowerCase()
      let guessedGender: 'male' | 'female' | 'non-binary' | 'unknown' = 'unknown'
      
      if (fileName.includes('man') || fileName.includes('male') || fileName.includes('guy') || fileName.includes('boy')) {
        guessedGender = 'male'
      } else if (fileName.includes('woman') || fileName.includes('female') || fileName.includes('lady') || fileName.includes('girl')) {
        guessedGender = 'female'
      }
      
      return {
        age: 30,
        height: 170,
        weight: 70,
        gender: guessedGender
      }
    }
  }

  const handlePhotoUpload = async (photo: File) => {
    try {
      setIsProcessingPhoto(true)
      updateCharacterData('photo', photo)
      
      // Analyze photo for AI guesses
      console.log('📸 Starting photo analysis...')
      const aiGuesses = await analyzePhoto(photo)
      console.log('🎯 AI Analysis complete:', aiGuesses)
      
      updateCharacterData('aiGuesses', aiGuesses)
      updateCharacterData('age', aiGuesses.age)
      updateCharacterData('height', aiGuesses.height)
      updateCharacterData('weight', aiGuesses.weight)
      updateCharacterData('gender', aiGuesses.gender)
      
      console.log('✅ Character data updated, moving to next step...')
      setTimeout(() => {
        setIsProcessingPhoto(false)
        nextStep()
      }, 1000) // Give time to show AI analysis
    } catch (error) {
      console.error('❌ Error in photo upload:', error)
      // Fallback to default values
      const fallbackGuesses = { age: 25, height: 170, weight: 70, gender: 'unknown' as const }
      updateCharacterData('aiGuesses', fallbackGuesses)
      updateCharacterData('age', fallbackGuesses.age)
      updateCharacterData('height', fallbackGuesses.height)
      updateCharacterData('weight', fallbackGuesses.weight)
      updateCharacterData('gender', fallbackGuesses.gender)
      setTimeout(() => {
        setIsProcessingPhoto(false)
        nextStep()
      }, 1000)
    }
  }

  const handleNameSubmit = () => {
    if (characterData.name.trim()) {
      setTimeout(nextStep, 500)
    }
  }

  const handleGenderSelect = (gender: 'male' | 'female' | 'non-binary' | 'unknown') => {
    updateCharacterData('gender', gender)
    setTimeout(nextStep, 500)
  }

  const handleAgeAdjust = () => {
    setTimeout(nextStep, 500)
  }

  const handleMeasuresComplete = async () => {
    // Generate RPG class suggestion before moving to class selection
    try {
      console.log('⚔️ Generating RPG class suggestion...')
      console.log('📊 Current character data:', characterData)
      
      const { RPGCharacterGenerator } = await import('../services/rpgCharacterGenerator')
      const rpgGenerator = new RPGCharacterGenerator()
      
      // Create photo analysis from current character data
      const photoAnalysis = {
        gender: characterData.gender,
        age: characterData.age,
        height: characterData.height,
        weight: characterData.weight,
        glasses: false,
        facialHair: false,
        hairColor: 'brown',
        hairStyle: 'short',
        skinTone: 'medium' as const,
        expression: 'confident' as const,
        faceShape: 'oval' as const,
        build: 'average' as const
      }
      
      console.log('📸 Photo analysis for RPG generation:', photoAnalysis)
      const rpgCharacter = rpgGenerator.generateRPGCharacter(photoAnalysis, characterData.name)
      const suggestedClass = {
        name: rpgCharacter.suggestedClass.name,
        description: rpgCharacter.suggestedClass.description,
        stats: rpgCharacter.stats
      }
      
      console.log('🎯 AI suggested class:', suggestedClass.name)
      console.log('📊 Class stats:', suggestedClass.stats)
      setRpgClass(suggestedClass)
      console.log('✅ RPG class set, moving to class selection step...')
    } catch (error) {
      console.error('❌ Failed to generate RPG class:', error)
    }
    
    setTimeout(() => {
      console.log('🔄 Moving to next step from measures...')
      nextStep()
    }, 500)
  }

  const handleClassSelect = (selectedClass: {
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
  }) => {
    console.log('🎯 Class selected:', selectedClass.name)
    console.log('📊 Selected class stats:', selectedClass.stats)
    setRpgClass(selectedClass)
    setTimeout(() => {
      console.log('🔄 Moving to next step from class selection...')
      nextStep()
    }, 500)
  }

  const handleCardComplete = async () => {
    try {
      console.log('🎨 Starting caricature generation...')
      setIsGeneratingCaricature(true)
      setCaricatureGenerated(true)
      
      if (!characterData.photo) {
        console.error('❌ No photo available for caricature generation')
        setTimeout(() => {
          setIsGeneratingCaricature(false)
          setCurrentStep('complete')
        }, 1000)
        return
      }
      
      // Use real Hugging Face caricature generation
      console.log('🚀 Using Hugging Face API for caricature generation...')
      const result = await CaricatureGenerator.generateCaricatureFromPhoto(
        characterData.photo,
        'cute', // You can make this selectable later
        {
          name: characterData.name,
          age: characterData.age,
          height: characterData.height,
          weight: characterData.weight,
          gender: characterData.gender
        },
        rpgClass || undefined // Pass the user-selected RPG class
      )
      
      if (result.success && result.imageUrl) {
        console.log('🎨 AI Caricature generated successfully!')
        if (result.breakdown) {
          console.log('💰 Cost breakdown:', result.breakdown)
          console.log(`📊 Total cost: $${result.cost?.toFixed(3)}`)
          setGenerationCost(result.cost || 0)
        }
        if (result.rpgClass) {
          console.log('⚔️ RPG Class generated:', result.rpgClass.name)
          setRpgClass(result.rpgClass)
        }
        if (result.generationPrompt) {
          console.log('📝 Generation prompt captured')
          setGenerationPrompt(result.generationPrompt)
        }
        if (result.photoAnalysis) {
          console.log('📸 Photo analysis captured')
          setPhotoAnalysis(result.photoAnalysis)
        }
        setCaricatureImage(result.imageUrl)
        setGenerationResult(result)
      } else {
        console.error('❌ HF Caricature generation failed:', result.error)
        
        // NO FALLBACK - if AI fails, we fail
        console.error('❌ AI caricature generation failed - no fallback available')
        alert('AI caricature generation failed. Please try again.')
        return
      }
      
      setTimeout(() => {
        setIsGeneratingCaricature(false)
        setCurrentStep('complete')
      }, 1000)
    } catch (error) {
      console.error('❌ Error generating caricature:', error)
      setTimeout(() => {
        setIsGeneratingCaricature(false)
        setCurrentStep('complete')
      }, 1000)
    }
  }

  const generateThreeDCharacter = async () => {
    try {
      console.log('🎮 Starting 3D character generation...')
      setIsGenerating3D(true)
      
      if (!caricatureImage) {
        console.error('❌ No caricature image available for 3D generation')
        alert('No caricature image available for 3D generation')
        return
      }
      
      const result = await ThreeDCharacterGenerator.generateThreeDCharacter(
        caricatureImage,
        {
          name: characterData.name,
          age: characterData.age,
          height: characterData.height,
          weight: characterData.weight,
          gender: characterData.gender
        },
        rpgClass || undefined
      )
      
      if (result.success && result.modelUrl) {
        console.log('🎮 3D Character generated successfully!')
        setThreeDModelUrl(result.modelUrl)
        setThreeDGenerationResult(result)
      } else {
        console.error('❌ 3D Character generation failed:', result.error)
        alert('3D character generation failed. Please try again.')
      }
      
      setIsGenerating3D(false)
    } catch (error) {
      console.error('❌ Error generating 3D character:', error)
      setIsGenerating3D(false)
      alert('Error generating 3D character')
    }
  }

  const generateMeshy3DCharacter = async () => {
    try {
      console.log('🎮 Starting Meshy 3D character generation...')
      setIsGeneratingMeshy3D(true)
      
      if (!caricatureImage) {
        console.error('❌ No caricature image available for Meshy 3D generation')
        alert('No caricature image available for Meshy 3D generation')
        return
      }
      
      const result = await Meshy3DService.imageToModel(caricatureImage, {
        art_style: 'cartoon',
        target_polycount: 'medium',
        auto_refine: true
      })
      
      if (result.success && result.modelUrl) {
        console.log('🎮 Meshy 3D Character generated successfully!')
        setMeshy3DResult(result)
        // Also set as the main 3D model URL for viewing
        setThreeDModelUrl(result.modelUrl)
      } else {
        console.error('❌ Meshy 3D Character generation failed:', result.error)
        alert(`Meshy 3D generation failed: ${result.error}`)
      }
      
      setIsGeneratingMeshy3D(false)
    } catch (error) {
      console.error('❌ Error generating Meshy 3D character:', error)
      setIsGeneratingMeshy3D(false)
      alert('Error generating Meshy 3D character')
    }
  }

  const saveCharacterToGallery = async () => {
    try {
      console.log('💾 Attempting to save character to gallery...')
      console.log('📊 Character data:', { name: characterData.name, caricatureImage: !!caricatureImage })
      
      if (!caricatureImage || !characterData.name) {
        console.error('❌ Cannot save: missing caricature image or name')
        alert('Cannot save character: missing caricature image or name')
        return
      }

      // Convert photo to base64 if available
      let photoBase64: string | undefined
      if (characterData.photo) {
        photoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(characterData.photo!)
        })
      }

      const savedCharacter = CharacterStorage.saveCharacter({
        name: characterData.name,
        age: characterData.age,
        height: characterData.height,
        weight: characterData.weight,
        gender: characterData.gender,
        photo: photoBase64,
        caricatureImage,
        generationCost: (generationCost || 0) + (threeDGenerationResult?.cost || 0),
        style: 'cute',
        rpgClass: rpgClass || undefined,
        photoAnalysis: photoAnalysis || undefined,
        aiGuesses: characterData.aiGuesses,
        generationPrompt: generationPrompt || undefined,
        processingTime: (generationResult?.processingTime || 0) + (threeDGenerationResult?.processingTime || 0),
        costBreakdown: generationResult?.breakdown
      })

      setCharacterSaved(true)
      console.log('💾 Character saved to gallery:', savedCharacter.name)
      
      // Show success message
      setTimeout(() => {
        alert(`Character "${characterData.name}" saved to gallery!`)
      }, 500)
    } catch (error) {
      console.error('❌ Failed to save character:', error)
      alert('Failed to save character to gallery')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      
      {/* Header with Gallery Link */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => window.location.href = '/character-gallery'}
          className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
        >
          <Image className="w-5 h-5" />
          <span>Gallery</span>
        </button>
      </div>
      
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
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-green-400 font-semibold mb-4">Character Complete!</p>
                  
                  {/* Show the generated caricature */}
                  {caricatureImage && (
                    <div className="bg-white/10 rounded-xl p-4 max-w-sm mx-auto">
                      <h4 className="text-white font-semibold mb-3 text-center">🎨 Your Caricature Character</h4>
                      <div 
                        className="w-64 h-64 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden mb-4 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setShowImageModal(true)}
                      >
                        <img 
                          src={caricatureImage} 
                          alt="Your Caricature Character" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-gray-300 text-sm text-center mb-2">Click image for fullscreen view</p>
                      
                      {/* Cost Information */}
                      {generationCost !== null && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-center mb-4">
                          <div className="text-green-400 font-semibold mb-1">💰 Generation Cost</div>
                          <div className="text-white text-sm">
                            ${generationCost.toFixed(3)} USD
                          </div>
                          <div className="text-green-300 text-xs mt-1">
                            Powered by Hugging Face AI
                          </div>
                        </div>
                      )}
                      
                      <p className="text-gray-300 text-sm text-center mb-4">
                        {characterData.name} - Age: {characterData.age}, Height: {characterData.height}cm, Weight: {characterData.weight}kg
                      </p>
                      
                      {/* RPG Class Information */}
                      {rpgClass && (
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                          <h5 className="text-purple-400 font-semibold mb-2 text-center">⚔️ RPG Class: {rpgClass.name}</h5>
                          <p className="text-gray-300 text-sm text-center mb-3">{rpgClass.description}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="text-red-400 font-semibold">STR</div>
                              <div className="text-white">{rpgClass.stats.strength}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-green-400 font-semibold">AGI</div>
                              <div className="text-white">{rpgClass.stats.agility}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 font-semibold">INT</div>
                              <div className="text-white">{rpgClass.stats.intelligence}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-yellow-400 font-semibold">WIS</div>
                              <div className="text-white">{rpgClass.stats.wisdom}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-pink-400 font-semibold">CHA</div>
                              <div className="text-white">{rpgClass.stats.charisma}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-400 font-semibold">CON</div>
                              <div className="text-white">{rpgClass.stats.constitution}</div>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <div className="text-purple-300 text-xs">Total: {rpgClass.stats.total}</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Save to Gallery Button */}
                      {!characterSaved && (
                        <button
                          onClick={() => {
                            console.log('🔘 Save button clicked!')
                            saveCharacterToGallery()
                          }}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          💾 Save to Gallery
                        </button>
                      )}
                      
                      {characterSaved && (
                        <div className="w-full bg-green-500/20 border border-green-500/30 text-green-400 font-semibold py-3 px-6 rounded-xl text-center">
                          ✅ Saved to Gallery!
                        </div>
                      )}
                      
                      {/* 3D Generation Options */}
                      <div className="mt-4 space-y-3">
                        <h5 className="text-white font-semibold text-center mb-3">🎮 Create 3D Model (Updated)</h5>
                        
                        {/* Free 3D Generation */}
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
                            '🎮 Generate Free 3D Model'
                          )}
                        </button>
                        
                        {/* Meshy 3D Generation */}
                        <button
                          onClick={generateMeshy3DCharacter}
                          disabled={isGeneratingMeshy3D}
                          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:scale-100 disabled:cursor-not-allowed"
                        >
                          {isGeneratingMeshy3D ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating Meshy 3D...
                            </div>
                          ) : (
                            '🎨 Generate Premium 3D (Meshy)'
                          )}
                        </button>
                        
                        <p className="text-gray-400 text-xs text-center">
                          Free: Basic 3D model | Premium: High-quality Meshy 3D
                        </p>
                      </div>
                    </div>
                  )}
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
                
                {/* AI Analysis Info */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <h4 className="text-white font-semibold mb-1">🤖 AI-Powered Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Real AI analysis and caricature generation
                      </p>
                      <div className="mt-2 text-xs text-green-400">
                        🟢 Using Hugging Face API
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  {/* Photo Preview */}
                  {characterData.photo ? (
                    <div className="w-32 h-32 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      <img 
                        src={URL.createObjectURL(characterData.photo)} 
                        alt="Your Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-white/20 rounded-xl mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  {/* File Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    disabled={isProcessingPhoto}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && !isProcessingPhoto) {
                        handlePhotoUpload(file)
                      }
                    }}
                    className="hidden"
                    id="photo-upload"
                  />
                  
                  {/* Camera Capture */}
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    disabled={isProcessingPhoto}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && !isProcessingPhoto) {
                        handlePhotoUpload(file)
                      }
                    }}
                    className="hidden"
                    id="photo-camera"
                  />
                  
                  <div className="space-y-3">
                    <label
                      htmlFor="photo-upload"
                      className={`block w-full py-3 text-white rounded-xl font-semibold transition-all ${
                        isProcessingPhoto 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                      }`}
                    >
                      {isProcessingPhoto ? '⏳ Processing...' : '📁 Choose from Gallery'}
                    </label>
                    
                    <label
                      htmlFor="photo-camera"
                      className={`block w-full py-3 text-white rounded-xl font-semibold transition-all ${
                        isProcessingPhoto 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                      }`}
                    >
                      {isProcessingPhoto ? '⏳ Processing...' : '📸 Take Photo'}
                    </label>
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-4">
                    {hfApiEnabled 
                      ? 'Real AI will analyze your photo and create a matching caricature character' 
                      : 'Simulated AI will analyze your photo and create a matching caricature character'
                    }
                  </p>
                  
                  {characterData.photo && (
                    <p className="text-green-400 text-sm mt-2">
                      ✅ Photo ready for analysis!
                    </p>
                  )}
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

          {/* Gender Selection Popup */}
          {currentStep === 'gender' && (
            <motion.div
              key="gender-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-white mb-2 text-center">
                  Gender Identity
                </h3>
                <p className="text-gray-300 text-center mb-6">
                  AI guessed: <span className="text-blue-400 font-semibold">
                    {characterData.aiGuesses.gender === 'unknown' ? 'Unknown' : 
                     characterData.aiGuesses.gender === 'male' ? 'Male' :
                     characterData.aiGuesses.gender === 'female' ? 'Female' : 'Non-binary'}
                  </span>
                </p>
                <div className="space-y-3">
                  {(['male', 'female', 'non-binary', 'unknown'] as const).map((gender) => (
                    <motion.button
                      key={gender}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGenderSelect(gender)}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        characterData.gender === gender
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {gender === 'unknown' ? 'Prefer not to say' : 
                       gender === 'male' ? 'Male' :
                       gender === 'female' ? 'Female' : 'Non-binary'}
                    </motion.button>
                  ))}
                </div>
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

          {/* RPG Class Selection Popup */}
          {currentStep === 'class' && (
            <motion.div
              key="class-popup"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  ⚔️ Choose Your RPG Class
                </h3>
                
                {rpgClass && (
                  <div className="mb-6">
                    <p className="text-gray-300 text-center mb-4">
                      AI Suggested: <span className="text-blue-400 font-semibold">{rpgClass.name}</span>
                    </p>
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-4">
                      <h4 className="text-blue-400 font-semibold mb-2">{rpgClass.name}</h4>
                      <p className="text-gray-300 text-sm mb-3">{rpgClass.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-red-400 font-semibold">STR</div>
                          <div className="text-white">{rpgClass.stats.strength}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">AGI</div>
                          <div className="text-white">{rpgClass.stats.agility}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">INT</div>
                          <div className="text-white">{rpgClass.stats.intelligence}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-semibold">WIS</div>
                          <div className="text-white">{rpgClass.stats.wisdom}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-pink-400 font-semibold">CHA</div>
                          <div className="text-white">{rpgClass.stats.charisma}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-400 font-semibold">CON</div>
                          <div className="text-white">{rpgClass.stats.constitution}</div>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-blue-300 text-xs">Total: {rpgClass.stats.total}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => rpgClass && handleClassSelect(rpgClass)}
                    className="w-full py-3 px-4 rounded-xl font-semibold transition-all bg-blue-500 text-white hover:bg-blue-600"
                  >
                    ✅ Accept AI Suggestion: {rpgClass?.name || 'Warrior'}
                  </motion.button>
                  
                  <div className="text-center text-gray-400 text-sm">
                    Or choose a different class:
                  </div>
                  
                  {['Warrior', 'Rogue', 'Mage', 'Cleric', 'Bard', 'Ranger'].map((className) => {
                    if (className === rpgClass?.name) return null // Don't show the suggested class again
                    
                    return (
                      <motion.button
                        key={className}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Generate stats for the selected class
                          const classStats = {
                            Warrior: { strength: 80, agility: 60, intelligence: 50, wisdom: 50, charisma: 60, constitution: 70, total: 370 },
                            Rogue: { strength: 60, agility: 80, intelligence: 70, wisdom: 60, charisma: 70, constitution: 60, total: 400 },
                            Mage: { strength: 40, agility: 50, intelligence: 90, wisdom: 80, charisma: 60, constitution: 50, total: 370 },
                            Cleric: { strength: 60, agility: 50, intelligence: 60, wisdom: 90, charisma: 70, constitution: 70, total: 400 },
                            Bard: { strength: 50, agility: 70, intelligence: 70, wisdom: 60, charisma: 90, constitution: 60, total: 400 },
                            Ranger: { strength: 70, agility: 80, intelligence: 60, wisdom: 70, charisma: 60, constitution: 70, total: 410 }
                          }
                          
                          const classDescriptions = {
                            Warrior: "Strong melee fighter with high defense",
                            Rogue: "Quick and sneaky with high dexterity", 
                            Mage: "Master of arcane magic and spells",
                            Cleric: "Holy healer and support specialist",
                            Bard: "Charismatic performer with social skills",
                            Ranger: "Nature expert with bow skills"
                          }
                          
                          handleClassSelect({
                            name: className,
                            description: classDescriptions[className as keyof typeof classDescriptions],
                            stats: classStats[className as keyof typeof classStats]
                          })
                        }}
                        className="w-full py-3 px-4 rounded-xl font-semibold transition-all bg-white/20 text-white hover:bg-white/30"
                      >
                        {className}
                      </motion.button>
                    )
                  })}
                </div>
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
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white font-medium">Gender:</span>
                          <span className="text-gray-300 ml-2">
                            {characterData.gender === 'unknown' ? 'Prefer not to say' : 
                             characterData.gender === 'male' ? 'Male' :
                             characterData.gender === 'female' ? 'Female' : 'Non-binary'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis Summary */}
                    <div className="bg-blue-500/20 rounded-xl p-4">
                      <h5 className="text-white font-semibold mb-2">🤖 AI Analysis Summary</h5>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>AI guessed: {characterData.aiGuesses.age}y, {characterData.aiGuesses.height}cm, {characterData.aiGuesses.weight}kg, {characterData.aiGuesses.gender}</div>
                        <div>Final values: {characterData.age}y, {characterData.height}cm, {characterData.weight}kg, {characterData.gender}</div>
                      </div>
                    </div>
                  </div>

                  {/* Caricature Preview */}
                  <div className="text-center">
                    <div className="bg-white/5 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-white mb-4">Caricature Preview</h4>
                      
                      {/* Original Photo */}
                      {characterData.photo && (
                        <div className="mb-4">
                          <h5 className="text-white font-medium mb-2">📸 Original Photo</h5>
                          <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden">
                            <img 
                              src={URL.createObjectURL(characterData.photo)} 
                              alt="Original Photo" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Caricature Result */}
                      {caricatureGenerated ? (
                        <motion.div 
                          className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowImageModal(true)}
                        >
                          {caricatureImage ? (
                            <img 
                              src={caricatureImage} 
                              alt="Generated Caricature" 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="text-6xl animate-spin">🎨</div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mx-auto flex items-center justify-center mb-4">
                          <div className="text-6xl">🎨</div>
                        </div>
                      )}
                      
                      <p className="text-gray-300 text-sm">
                        {caricatureGenerated 
                          ? 'Your caricature character has been generated!' 
                          : hfApiEnabled 
                            ? 'Real AI will generate your caricature character matching the photo'
                            : 'Simulated caricature will be generated based on this information'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: (caricatureGenerated || isGeneratingCaricature) ? 1 : 1.05 }}
                  whileTap={{ scale: (caricatureGenerated || isGeneratingCaricature) ? 1 : 0.95 }}
                  onClick={handleCardComplete}
                  disabled={caricatureGenerated || isGeneratingCaricature}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
                    (caricatureGenerated || isGeneratingCaricature)
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  {isGeneratingCaricature 
                    ? '⏳ Generating Caricature...' 
                    : caricatureGenerated 
                      ? '✅ Caricature Generated!' 
                      : hfApiEnabled 
                        ? '🚀 Generate Real AI Caricature' 
                        : '🎨 Generate Caricature Character'
                  }
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
            {['photo', 'name', 'gender', 'age', 'measures', 'class', 'card', 'complete'].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentStep === step || 
                  (step === 'photo' && currentStep === 'photo') ||
                  (step === 'name' && ['name', 'gender', 'age', 'measures', 'class', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'gender' && ['gender', 'age', 'measures', 'class', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'age' && ['age', 'measures', 'class', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'measures' && ['measures', 'class', 'card', 'complete'].includes(currentStep)) ||
                  (step === 'class' && ['class', 'card', 'complete'].includes(currentStep)) ||
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

      {/* Image Modal */}
      {showImageModal && caricatureImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-2xl p-4 max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Generated Character</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src={caricatureImage} 
                alt="Generated Caricature - Full Size" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600">Click outside to close</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}