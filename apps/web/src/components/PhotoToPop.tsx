import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, Sparkles, User, Brain, Zap } from 'lucide-react'
import { HuggingFaceService, PopGenerationResult } from '../services/huggingFaceService'

interface PhotoToPopProps {
  onPhotoProcessed?: (result: PopGenerationResult) => void
  onClose?: () => void
}

export const PhotoToPop: React.FC<PhotoToPopProps> = ({ onPhotoProcessed, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const processPhoto = async () => {
    if (!selectedPhoto) return

    setIsProcessing(true)
    
    try {
      // AI processing steps (simulated until HF token is added)
      const steps = [
        '📸 Uploading photo to AI...',
        '🔍 Analyzing facial features...',
        '🧠 Detecting emotions and personality...',
        '🎨 Generating 3D model...',
        '✨ Creating pop characteristics...',
        '🌟 Finalizing your unique pop!'
      ]

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i])
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      // Call AI service (simulated until HF token is added)
      setProcessingStep('🤖 Processing with AI models...')
      const result = await HuggingFaceService.generate3DPop(selectedPhoto)
      
      setIsProcessing(false)
      setProcessingStep('')
      onPhotoProcessed?.(result)
      
    } catch (error) {
      console.error('AI processing error:', error)
      setIsProcessing(false)
      setProcessingStep('')
      alert('AI processing failed. Please try again.')
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

        {/* Real AI Processing Animation */}
        {isProcessing && (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-16 h-16 text-white" />
                </motion.div>
              </div>
              
              {/* AI Processing rings */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-purple-400/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 border-2 border-blue-400/20 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute inset-0 border-2 border-cyan-400/10 rounded-full"
              />
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-2">AI Processing...</h3>
              <p className="text-gray-300 text-sm">{processingStep}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs">Powered by Hugging Face AI</span>
              </div>
            </div>

            {/* AI Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "easeOut" }}
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-3 rounded-full"
              />
            </div>
            
            {/* AI Models indicator */}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span>🧠 Face Detection</span>
              <span>🎭 Emotion Analysis</span>
              <span>🎨 3D Generation</span>
            </div>
            
            {/* Hugging Face Token Notice */}
            <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-300 text-xs text-center">
                💡 Add your Hugging Face token for real AI processing!
                <br />
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="underline">
                  Get your token here
                </a>
              </p>
            </div>
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