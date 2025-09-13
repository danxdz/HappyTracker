import React from 'react'
import { motion } from 'framer-motion'
import { 
  Camera,
  ArrowRight,
  Image,
  Sparkles,
  Zap,
  Users,
  Star,
  Download,
  Share2,
  Heart,
  Gamepad2,
  Palette,
  Wand2
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const handleCreateCharacter = () => {
    window.location.href = '/dynamic-character'
  }

  const handleViewGallery = () => {
    window.location.href = '/character-gallery'
  }

  const features = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI-Powered",
      description: "Advanced AI analyzes your photo and creates unique caricatures"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Multiple Styles",
      description: "Choose from cartoon, 3D, and artistic styles"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "RPG Characters",
      description: "Transform into fantasy characters with stats and equipment"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Share & Download",
      description: "Save and share your creations with friends"
    }
  ]

  const stats = [
    { number: "10K+", label: "Characters Created" },
    { number: "5K+", label: "Happy Users" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "AI Processing" }
  ]

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

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                HappyTracker
              </span>
              <br />
              <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                AI Character Creator
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your photos into amazing AI-generated characters! Create caricatures, 
              3D models, and RPG characters with just one click. 🎨✨🎮
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.button 
                onClick={handleCreateCharacter}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-xl px-12 py-6 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-6 h-6" />
                Create Your Character
                <ArrowRight className="w-6 h-6" />
              </motion.button>
              
              <motion.button 
                onClick={handleViewGallery}
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-xl px-12 py-6 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image className="w-6 h-6" />
                View Gallery
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">HappyTracker</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of AI-powered character creation with our cutting-edge technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-purple-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Character</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their photos into amazing AI characters!
            </p>
            
            <motion.button 
              onClick={handleCreateCharacter}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-xl px-16 py-6 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-500/25 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-6 h-6" />
              Start Creating Now
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}