import React from 'react'
import { motion } from 'framer-motion'
import { Camera, ArrowRight, Image, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateCharacter = () => {
    navigate('/dynamic-character')
  }

  const handleViewGallery = () => {
    navigate('/character-gallery')
  }

  // Test API keys on component mount
  React.useEffect(() => {
    const hfToken = import.meta.env.VITE_HUGGINGFACE_TOKEN
    const meshyKey = import.meta.env.VITE_MESHY_API_KEY
    const apiUrl = import.meta.env.VITE_API_URL
    
    console.log('🔑 API Keys Status Check:')
    console.log(`Hugging Face: ${hfToken ? '✅ Set' : '❌ Missing'}`)
    console.log(`Meshy: ${meshyKey ? '✅ Set' : '❌ Missing'}`)
    console.log(`Backend URL: ${apiUrl ? '✅ Set' : '❌ Missing'}`)
    
    if (hfToken) {
      console.log(`HF Token: ${hfToken.substring(0, 10)}...`)
    }
    if (meshyKey) {
      console.log(`Meshy Key: ${meshyKey.substring(0, 10)}...`)
    }
    console.log(`Backend: ${apiUrl || 'Not found'}`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold text-white mb-6"
            >
              🎮 HappyTracker
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Transform your health journey into an epic adventure! Create your avatar, track your wellness, and go viral with AI-powered character generation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={handleCreateCharacter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Camera className="w-6 h-6" />
                Create Your Character
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={handleViewGallery}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Image className="w-6 h-6" />
                View Gallery
              </motion.button>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose HappyTracker?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of health tracking with AI-powered character creation and RPG-style progression.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎨",
                title: "AI-Powered",
                description: "Advanced AI analyzes your photo and creates unique caricatures"
              },
              {
                icon: "🎮",
                title: "RPG Style",
                description: "Transform into fantasy characters with stats and equipment"
              },
              {
                icon: "📱",
                title: "Easy Sharing",
                description: "Save and share your creations with friends instantly"
              },
              {
                icon: "⚡",
                title: "Fast Generation",
                description: "Create characters in seconds with our optimized AI"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who have transformed their health journey into an epic RPG adventure!
            </p>
            <motion.button
              onClick={handleCreateCharacter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 rounded-xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Camera className="w-6 h-6" />
              Create Your Character Now
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}