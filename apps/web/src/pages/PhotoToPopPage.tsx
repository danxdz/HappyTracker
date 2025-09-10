import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoToPop } from '../components/PhotoToPop'
import { CharacterDisplay } from '../components/CharacterDisplay'
import { PopGenerationResult } from '../services/huggingFaceService'

export const PhotoToPopPage: React.FC = () => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [generatedPop, setGeneratedPop] = useState<PopGenerationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePhotoProcessed = async (result: PopGenerationResult) => {
    setGeneratedPop(result)
  }

  const handleClosePop = () => {
    setGeneratedPop(null)
  }

  const handleAddToPopWorld = () => {
    // In a real implementation, this would:
    // 1. Save the pop to the user's collection
    // 2. Navigate to the pop world
    // 3. Show the pop in the 3D world
    alert('Character added to your Character World! 🌟')
    setGeneratedPop(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-6xl"
            >
              📸
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Photo to Pop
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Transform your selfie into a unique pop character! Our AI analyzes your photo 
            and creates a personalized pop with your facial features, personality traits, 
            and unique style. 🌟
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPhotoUpload(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-200"
          >
            Create My Pop! ✨
          </motion.button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            How Photo-to-Pop Works 🎭
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our advanced AI technology analyzes your photo and creates a unique pop character 
            that reflects your personality and features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-white mb-3">1. Upload Photo</h3>
            <p className="text-gray-300">
              Take a selfie or upload a clear photo of yourself. Our AI works best with 
              well-lit, front-facing photos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-3">2. AI Analysis</h3>
            <p className="text-gray-300">
              Our AI analyzes your facial features, expressions, and style to understand 
              your unique characteristics and personality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-3">3. Pop Creation</h3>
            <p className="text-gray-300">
              We generate your unique pop character with personalized features, 
              personality traits, and style that reflects you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Why Create Your Pop? 🌟
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎭</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Personalized Character</h3>
                  <p className="text-gray-300 text-sm">
                    Your pop reflects your unique features, personality, and style.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💚</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Health Connection</h3>
                  <p className="text-gray-300 text-sm">
                    Your pop's mood and energy change based on your real health choices.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🌌</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Galaxy Integration</h3>
                  <p className="text-gray-300 text-sm">
                    Your pop lives in your galaxy and grows with your wellness journey.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🤝</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Social Sharing</h3>
                  <p className="text-gray-300 text-sm">
                    Share your pop with friends and see their unique characters too.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎮</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Gamification</h3>
                  <p className="text-gray-300 text-sm">
                    Make health choices fun by seeing how they affect your pop.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📱</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Mobile Ready</h3>
                  <p className="text-gray-300 text-sm">
                    Take selfies anytime and update your pop on the go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Meet Your Pop? 🎉
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already created their unique pop characters 
            and started their wellness journey!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPhotoUpload(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-200"
          >
            Create My Pop Now! ✨
          </motion.button>
        </motion.div>
      </section>

      {/* Modals */}
      {showPhotoUpload && (
        <PhotoToPop
          onPhotoProcessed={handlePhotoProcessed}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}

      {generatedPop && (
        <CharacterDisplay
          pop={generatedPop}
          onClose={handleClosePop}
        />
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">✨</span>
            </motion.div>
            <h3 className="text-white font-bold text-xl mb-2">Creating Your Pop...</h3>
            <p className="text-gray-300">This may take a few moments</p>
          </motion.div>
        </div>
      )}
    </div>
  )
}