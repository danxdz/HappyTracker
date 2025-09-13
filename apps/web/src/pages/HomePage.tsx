import React from 'react'
import { motion } from 'framer-motion'
import { Camera, ArrowRight, Image, Sparkles, Zap, Users, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateCharacter = () => {
    navigate('/dynamic-character')
  }

  const handleViewGallery = () => {
    navigate('/character-gallery')
  }

  // Check API keys on component mount (without logging sensitive data)
  React.useEffect(() => {
    const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN
    const meshyKey = import.meta.env.VITE_MESHY_API_KEY
    const apiUrl = import.meta.env.VITE_API_URL
    
    console.log('🔑 API Keys Status Check:')
    console.log(`Hugging Face: ${hfToken ? '✅ Set' : '❌ Missing'}`)
    console.log(`Meshy: ${meshyKey ? '✅ Set' : '❌ Missing'}`)
    console.log(`Backend URL: ${apiUrl ? '✅ Set' : '❌ Missing'}`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* AI Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Powered by Advanced AI</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
            >
              Transform Your Health Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                Epic Adventures
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-10"
            >
              Create unique AI-powered characters, track your wellness journey, and turn your health goals into an engaging RPG experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
            >
              <motion.button 
                onClick={handleCreateCharacter}
                className="group bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Create Your Character
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                onClick={handleViewGallery}
                className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image className="w-6 h-6 group-hover:scale-110 transition-transform" />
                View Gallery
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Create Your AI Character
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload your photo and let AI create a unique character that represents you. Generate variants with different expressions and clothing styles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Creation</h3>
              <p className="text-gray-300">
                Advanced AI analyzes your photos and creates unique, personalized characters with realistic features and expressions.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Character Gallery</h3>
              <p className="text-gray-300">
                View all your created characters and their variants in a beautiful gallery. Download and share your favorites.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Character Variants</h3>
              <p className="text-gray-300">
                Generate multiple variants of your character with different expressions, moods, and clothing styles.
              </p>
            </motion.div>
          </div>
        </div>
      </div>


      {/* Final CTA */}
      <div className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your Adventure?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-10"
          >
            Start your journey of transforming your health with fun, engaging, and personalized character creation.
          </motion.p>
          <motion.button 
            onClick={handleCreateCharacter}
            className="group bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold text-xl px-12 py-6 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Start Your Epic Journey Now!
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to create your AI character and start your journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Your Photo</h3>
              <p className="text-gray-300">
                Take a clear selfie or upload a photo of yourself. The AI will analyze your features and create a unique character.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI Creates Your Character</h3>
              <p className="text-gray-300">
                Our advanced AI processes your photo and generates a personalized character with realistic features and expressions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Generate Variants</h3>
              <p className="text-gray-300">
                Create different expressions, moods, and clothing styles for your character. Download and share your favorites.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-12 bg-gray-900/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Create Your Character?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the fun and create your unique AI character today. No signup required, just upload your photo and start creating!
            </p>
            <motion.button 
              onClick={handleCreateCharacter}
              className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Create My Character Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HomePage