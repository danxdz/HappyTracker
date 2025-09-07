import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, Camera, Download } from 'lucide-react'

export const AvatarPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Avatar! ✨
          </span>
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="card-glow"
            whileHover={{ scale: 1.05 }}
          >
            <Wand2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">AI Generation</h2>
            <p className="text-gray-300 mb-6">
              Let our AI create a unique avatar based on your personality and health goals!
            </p>
            <button className="btn-primary w-full">
              Generate My Avatar 🎨
            </button>
          </motion.div>
          
          <motion.div 
            className="card-glow"
            whileHover={{ scale: 1.05 }}
          >
            <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Upload Your Own</h2>
            <p className="text-gray-300 mb-6">
              Upload your own AI-generated character and we'll bring it to life!
            </p>
            <button className="btn-secondary w-full">
              Upload Image 📸
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12 card-fun max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Your Avatar Will:</h3>
          <div className="grid grid-cols-2 gap-4 text-gray-300">
            <div>✨ Reflect your health progress</div>
            <div>🎮 Show emotions and reactions</div>
            <div>🌱 Grow with your wellness journey</div>
            <div>👥 Interact with friends' avatars</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}