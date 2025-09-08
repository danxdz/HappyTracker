import React from 'react'
import { motion } from 'framer-motion'
import { GalaxySystem } from '../components/GalaxySystem'

export const GalaxyPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 sm:mb-8"
        >
          <div className="inline-block mb-3 sm:mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="text-4xl sm:text-6xl"
            >
              🌌
            </motion.div>
          </div>
          
          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Galaxy Awaits
            </span>
          </h1>
          
          <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-8 px-2">
            Choose your galaxy type and watch your central sun grow brighter as you make healthy choices! 
            Every healthy decision feeds the sun and powers your entire galaxy! ☀️
          </p>
        </motion.div>
      </section>

      {/* Galaxy System Component */}
      <GalaxySystem />

      {/* Features Section */}
      <section className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
            Cooperative Galaxy System 🌟
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-2">
            All galaxies work together to feed the central sun! No enemies, only cooperation and beauty!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🌟</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Bright Galaxy</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Vibrant and energetic - perfect for active, healthy lifestyles!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">✨</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Mystical Galaxy</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Magical and ethereal - for those who love wonder and mystery!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">💎</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Crystal Galaxy</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Sparkly and elegant - for those who appreciate beauty and refinement!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🌌</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Cosmic Galaxy</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Deep space and peaceful - for those who love tranquility and depth!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cooperation Section */}
      <section className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-purple-400/20 to-blue-400/20 backdrop-blur-sm rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">
            🌟 All Galaxies Work Together! 🌟
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            Every healthy choice you make feeds the central sun, which powers ALL galaxies! 
            We're building a cooperative universe where everyone helps everyone thrive!
          </p>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">☀️</div>
              <div className="text-xs sm:text-sm text-gray-300">Central Sun</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">🤝</div>
              <div className="text-xs sm:text-sm text-gray-300">Cooperation</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}