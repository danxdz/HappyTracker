import React from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { generateAvatarStart, generateAvatarSuccess } from '../modules/avatar/avatarSlice'
import { AvatarService } from '../services/avatarService'
import { HealthData } from '../types/avatar'

export const AvatarDisplay: React.FC = () => {
  const dispatch = useDispatch()
  const { currentAvatar, isGenerating } = useSelector((state: RootState) => state.avatar)

  const handleGenerateAvatar = () => {
    dispatch(generateAvatarStart())
    
    // Simulate avatar generation with sample health data
    const sampleHealthData: HealthData = {
      meals: [
        { id: '1', food: 'Salad', nutritionScore: 85, timestamp: new Date() },
        { id: '2', food: 'Apple', nutritionScore: 90, timestamp: new Date() }
      ],
      water: 6, // 6 glasses
      sleep: 7.5, // 7.5 hours
      movement: 8000, // 8000 steps
      lastUpdated: new Date()
    }

    setTimeout(() => {
      const avatarAppearance = AvatarService.createAvatarAppearance(sampleHealthData)
      dispatch(generateAvatarSuccess(avatarAppearance))
    }, 2000) // 2 second delay for dramatic effect
  }

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">Creating Your Avatar...</h3>
        <p className="text-gray-300 text-center">
          Analyzing your personality and health data to create the perfect companion!
        </p>
      </motion.div>
    )
  }

  if (!currentAvatar) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8"
      >
        <div className="text-8xl mb-6">🎮</div>
        <h3 className="text-2xl font-bold text-white mb-4">Create Your Avatar!</h3>
        <p className="text-gray-300 text-center mb-6 max-w-md">
          Generate a unique avatar that reflects your personality and responds to your health choices.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerateAvatar}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Generate Avatar ✨
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center p-6"
    >
      {/* Avatar Name */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-white mb-2"
      >
        {currentAvatar.name}
      </motion.h2>

      {/* Personality Trait */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r ${currentAvatar.appearance.personality.color} text-white`}
      >
        {currentAvatar.appearance.personality.emoji} {currentAvatar.appearance.personality.trait}
      </motion.div>

      {/* Avatar Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className={`relative w-48 h-48 rounded-full mb-6 bg-gradient-to-br ${currentAvatar.appearance.background} flex items-center justify-center shadow-2xl`}
      >
        {/* Avatar Face */}
        <div className="text-6xl mb-2">
          {currentAvatar.appearance.personality.emoji}
        </div>
        
        {/* Accessories */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {currentAvatar.appearance.accessories.map((accessory: string, index: number) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-2xl"
            >
              {accessory}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Wellness Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-4"
      >
        <div className="text-2xl font-bold text-white mb-2">
          Wellness Score: {currentAvatar.wellnessScore}/100
        </div>
        <div className="w-64 bg-gray-700 rounded-full h-3 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentAvatar.wellnessScore}%` }}
            transition={{ delay: 0.8, duration: 1 }}
            className={`h-3 rounded-full bg-gradient-to-r ${
              currentAvatar.wellnessScore >= 80 ? 'from-green-400 to-emerald-400' :
              currentAvatar.wellnessScore >= 60 ? 'from-yellow-400 to-orange-400' :
              currentAvatar.wellnessScore >= 40 ? 'from-orange-400 to-red-400' :
              'from-red-400 to-red-600'
            }`}
          />
        </div>
      </motion.div>

      {/* Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center mb-4"
      >
        <div className="text-lg text-white">
          <span className="font-semibold">Mood:</span> {currentAvatar.appearance.mood}
        </div>
        <div className="text-sm text-gray-300 mt-1">
          {currentAvatar.appearance.personality.description}
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md">
          <p className="text-white font-medium">
            {AvatarService.getMotivationalMessage(currentAvatar.wellnessScore)}
          </p>
        </div>
      </motion.div>

      {/* Regenerate Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerateAvatar}
        className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Generate New Avatar 🔄
      </motion.button>
    </motion.div>
  )
}