import React from 'react'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '../components/AvatarDisplay'

export const AvatarPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Avatar! ✨
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Generate a unique avatar that reflects your personality and responds to your health choices. 
          Your avatar will grow happier and healthier as you make better lifestyle decisions!
        </p>
      </motion.div>

      {/* Working Avatar Component */}
      <AvatarDisplay />

      {/* Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-4xl mb-4">🎭</div>
          <h3 className="text-xl font-semibold text-white mb-2">Personality Traits</h3>
          <p className="text-gray-300">
            Your avatar gets a unique personality based on your preferences and health patterns.
          </p>
        </div>

        <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-4xl mb-4">💪</div>
          <h3 className="text-xl font-semibold text-white mb-2">Health Response</h3>
          <p className="text-gray-300">
            Your avatar's appearance and mood change based on your wellness score and health choices.
          </p>
        </div>

        <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-white mb-2">World Building</h3>
          <p className="text-gray-300">
            Your avatar lives in a world that reflects your health journey - gardens, oceans, and cities.
          </p>
        </div>
      </motion.div>
    </div>
  )
}