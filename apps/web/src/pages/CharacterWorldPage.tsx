import React from 'react'
import { motion } from 'framer-motion'
import { CharacterWorld } from '../components/CharacterWorld'

export const CharacterWorldPage: React.FC = () => {
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
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-4xl sm:text-6xl"
            >
              🌍
            </motion.div>
          </div>
          
          <h1 className="text-2xl sm:text-5xl font-bold text-white mb-3 sm:mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Your Character World
            </span>
          </h1>
          
          <p className="text-sm sm:text-xl text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-8 px-2">
            Welcome to your 3D world where your character lives! Watch your character bounce, 
            grow, and change colors based on your health choices!
          </p>
        </motion.div>
      </section>

      {/* 3D World Component */}
        <CharacterWorld />

      {/* Features Section */}
      <section className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
            Your Pop Responds to Your Health! 🎮
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto px-2">
            Every health choice you make affects your pop's appearance, mood, and animations!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🎨</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Color Changes</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Your pop's color changes based on your wellness score - green for healthy, red for unhealthy!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">📏</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Size Growth</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Healthier choices make your pop bigger and stronger! Watch them grow as you improve!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🎭</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">Mood Animations</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Your pop bounces happily when healthy, droops when unhealthy. Real emotions!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-3 sm:p-6 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">🌍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">3D World</h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Explore a beautiful 3D world with trees, flowers, and your pop living in it!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 text-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-sm rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">
            Ready to See Your Pop in Action?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
            Track your health to see your pop change colors, grow bigger, and bounce with happiness! 
            The better your choices, the happier your pop becomes!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Tracking Health! 🏥
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}