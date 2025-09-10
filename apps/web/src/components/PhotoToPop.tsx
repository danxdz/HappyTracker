import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, Sparkles, User, Brain, Zap } from 'lucide-react'
import { HuggingFaceService, PopGenerationResult } from '../services/huggingFaceService'
import { StepByStepProgress, PHOTO_TO_POP_STEPS } from './StepByStepProgress'

interface PhotoToPopProps {
  onPhotoProcessed?: (result: PopGenerationResult) => void
  onClose?: () => void
}

export const PhotoToPop: React.FC<PhotoToPopProps> = ({ onPhotoProcessed, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null)
  const [currentSteps, setCurrentSteps] = useState(PHOTO_TO_POP_STEPS.map(step => ({ ...step, status: 'pending' as 'pending' | 'active' | 'completed' })))
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check HF token availability on component mount
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        // Try to access the token through the service
        const token = (import.meta as any).env?.VITE_HUGGINGFACE_TOKEN
        setHasValidToken(!!token && token.length > 0)
      } catch (error) {
        console.error('Token check error:', error)
        setHasValidToken(false)
      }
    }
    checkToken()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // For now, we'll simulate camera access
    // In a real app, we'd use getUserMedia API
    alert('Camera integration coming soon! For now, please upload a photo.')
  }

  const updateStepStatus = (stepId: string, status: 'pending' | 'active' | 'completed', data?: any) => {
    setCurrentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, data }
        : step
    ))
  }

  const processPhoto = async () => {
    if (!selectedPhoto) return

    setIsProcessing(true)
    setCurrentSteps(PHOTO_TO_POP_STEPS.map(step => ({ ...step, status: 'pending' as const })))
    
    try {
      // Call AI service with step-by-step processing
      const result = await HuggingFaceService.generate3DPop(selectedPhoto, (step, data) => {
        setProcessingStep(step)
        
        // Map service steps to our step IDs
        if (step.includes('Analyzing face')) {
          updateStepStatus('face-analysis', 'active')
        } else if (step.includes('Face analysis complete')) {
          updateStepStatus('face-analysis', 'completed', data)
        } else if (step.includes('Creating character criteria')) {
          updateStepStatus('character-criteria', 'active')
        } else if (step.includes('Character criteria ready')) {
          updateStepStatus('character-criteria', 'completed', data)
        } else if (step.includes('Creating 3D in-game character')) {
          updateStepStatus('3d-character', 'active')
        } else if (step.includes('3D character model ready')) {
          updateStepStatus('3d-character', 'completed', data)
        } else if (step.includes('Creating character preview')) {
          updateStepStatus('character-preview', 'active')
        } else if (step.includes('Character preview ready')) {
          updateStepStatus('character-preview', 'completed', data)
        }
        
        if (data) {
          console.log('Step data:', data)
        }
      })
      
      setIsProcessing(false)
      setProcessingStep('')
      onPhotoProcessed?.(result)
      
    } catch (error) {
      console.error('AI processing error:', error)
      setIsProcessing(false)
      setProcessingStep('')
      
      // Log error without showing alert
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'AI processing failed. Please check your API tokens and try again.'
      
      console.error(`❌ ${errorMessage}`)
    }
  }

  const resetPhoto = () => {
    setSelectedPhoto(null)
    setIsProcessing(false)
    setProcessingStep('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Photo to Pop</h2>
              <p className="text-gray-300 text-sm">Create your unique pop character!</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Token Verification Warning */}
        {hasValidToken === false && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <X className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-red-300 font-semibold text-sm mb-1">
                  AI Processing Disabled
                </h3>
                <p className="text-red-200 text-xs mb-2">
                  Hugging Face token not configured. Photo-to-Pop will use simulation mode.
                </p>
                <p className="text-red-200 text-xs">
                  To enable real AI: Add VITE_HUGGINGFACE_TOKEN to your environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Token Success Message */}
        {hasValidToken === true && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-green-300 font-semibold text-sm">
                  Real AI Processing Enabled
                </h3>
                <p className="text-green-200 text-xs">
                  Your photos will be processed with Hugging Face AI models
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Photo Upload Area */}
        {!selectedPhoto && !isProcessing && (
          <div className="space-y-4">
            {/* Upload Methods */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-200 border border-white/20"
              >
                <Upload className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-white font-semibold">Upload Photo</div>
                <div className="text-gray-300 text-sm">Choose from gallery</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCameraCapture}
                className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 text-center transition-all duration-200 border border-white/20"
              >
                <Camera className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="text-white font-semibold">Take Photo</div>
                <div className="text-gray-300 text-sm">Use camera</div>
              </motion.button>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-2">📸 Photo Tips</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Face the camera directly</li>
                <li>• Good lighting works best</li>
                <li>• Clear, high-quality photos</li>
                <li>• Your pop will reflect your features!</li>
              </ul>
            </div>
          </div>
        )}

        {/* Selected Photo Preview */}
        {selectedPhoto && !isProcessing && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedPhoto}
                alt="Selected photo"
                className="w-full h-64 object-cover rounded-2xl"
              />
              <button
                onClick={resetPhoto}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={processPhoto}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Create My Pop!</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetPhoto}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200"
              >
                Change Photo
              </motion.button>
            </div>
          </div>
        )}

        {/* Step-by-Step Processing */}
        {isProcessing && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
              </div>
              
              <h3 className="text-white font-bold text-lg mb-2">Creating Your Pop Character</h3>
              <p className="text-gray-300 text-sm">{processingStep}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs">Powered by AI</span>
              </div>
            </div>

            {/* Step-by-Step Progress */}
            <div className="max-h-96 overflow-y-auto">
              <StepByStepProgress 
                steps={currentSteps}
                currentStep={processingStep}
                onStepComplete={(stepId, data) => {
                  console.log(`Step ${stepId} completed:`, data)
                }}
              />
            </div>

            {/* AI Processing Status Notice */}
            {hasValidToken === true ? (
              <div className="mt-4 p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                <p className="text-green-300 text-xs text-center">
                  🤖 Real AI processing enabled! Using Hugging Face models
                </p>
              </div>
            ) : hasValidToken === false ? (
              <div className="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                <p className="text-red-300 text-xs text-center">
                  ⚠️ Simulation mode - Add VITE_HUGGINGFACE_TOKEN for real AI
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                <p className="text-yellow-300 text-xs text-center">
                  🔄 Checking AI configuration...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </div>
  )
}