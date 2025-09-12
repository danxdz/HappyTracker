import React from 'react'
import { motion } from 'framer-motion'
import { 
  Camera,
  Sparkles, 
  ArrowRight,
  Image,
  Wand2,
  Users,
  Star
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const handleCreateCharacter = () => {
    window.location.href = '/character-creation'
  }

  const handleViewGallery = () => {
    window.location.href = '/character-gallery'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Wand2 className="w-16 h-16 text-purple-400" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              RPG Character
            </span>
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Creator
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Upload your photo and watch AI transform you into an epic RPG character! 🎮✨
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">AI Powered</div>
              <div className="text-gray-300">Real photo analysis</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">RPG Stats</div>
              <div className="text-gray-300">Classes & abilities</div>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">Gallery</div>
              <div className="text-gray-300">Save & share</div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.button 
              onClick={handleCreateCharacter}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-5 h-5" />
              Create Your Character
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button 
              onClick={handleViewGallery}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-5 h-5" />
              View Gallery
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            How It Works 🎯
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Camera className="w-12 h-12 text-purple-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Upload Photo</h3>
              <p className="text-gray-300">
                Take a selfie or upload any photo. Our AI analyzes your features 
                to understand your appearance and personality.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Sparkles className="w-12 h-12 text-blue-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. AI Analysis</h3>
              <p className="text-gray-300">
                Advanced AI analyzes your photo and generates RPG stats, 
                suggests character classes, and creates detailed prompts.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Wand2 className="w-12 h-12 text-indigo-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Generate Character</h3>
              <p className="text-gray-300">
                Watch as AI creates your unique RPG character with custom 
                appearance, stats, and class abilities!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your RPG Character? 🚀
          </h2>
          <p className="text-gray-300 mb-8">
            Join the adventure! Upload your photo and discover what kind of RPG hero you are. 
            Each character is unique and powered by real AI analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              onClick={handleCreateCharacter}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-5 h-5" />
              Create Character Now!
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Star className="w-6 h-6 text-purple-400 fill-current animate-bounce-slow" />
            <Star className="w-6 h-6 text-blue-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.2s' }} />
            <Star className="w-6 h-6 text-indigo-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.4s' }} />
            <Star className="w-6 h-6 text-blue-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.6s' }} />
            <Star className="w-6 h-6 text-purple-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.8s' }} />
          </div>
        </motion.div>
      </section>
    </div>
  )
}