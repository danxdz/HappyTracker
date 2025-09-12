import React from 'react'
import { motion } from 'framer-motion'
import { 
  Camera,
  ArrowRight,
  Image
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const handleCreateCharacter = () => {
    window.location.href = '/dynamic-character'
  }

  const handleViewGallery = () => {
    window.location.href = '/character-gallery'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Caricature
          </span>
          <br />
          <span className="text-4xl md:text-6xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Creator
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Upload your photo and watch AI transform you into a unique caricature character! 🎨✨
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button 
            onClick={handleCreateCharacter}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-xl px-12 py-6 rounded-xl flex items-center gap-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-6 h-6" />
            Create Your Caricature
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
      </motion.div>
    </div>
  )
}