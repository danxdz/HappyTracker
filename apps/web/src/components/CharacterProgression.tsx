import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Award, Lock, Sparkles } from 'lucide-react'
import { CharacterProgressionSystem } from '../services/characterProgressionSystem'

interface CharacterProgressionProps {
  currentLevel: number
  currentXP: number
  characterClass: string
  onLevelUp?: (newLevel: number) => void
}

export const CharacterProgression: React.FC<CharacterProgressionProps> = ({
  currentLevel,
  currentXP,
  characterClass,
  onLevelUp
}) => {
  const levelData = CharacterProgressionSystem.getLevelData(currentLevel)
  const nextLevelXP = CharacterProgressionSystem.getXPForNextLevel(currentLevel)
  const xpProgress = (currentXP / nextLevelXP) * 100
  const previews = CharacterProgressionSystem.getEvolutionPreview(currentLevel)

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-6">
      {/* Current Level Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Level {currentLevel}
          </h3>
          <p className="text-purple-300">{levelData.title}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Class</p>
          <p className="text-lg font-semibold text-white">{characterClass}</p>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-center text-gray-400 mt-1">
          {Math.floor(xpProgress)}% to Level {currentLevel + 1}
        </p>
      </div>

      {/* Current Equipment Tier */}
      <div className="bg-black/30 rounded-xl p-4 mb-6">
        <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Current Equipment Tier
        </h4>
        <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
          levelData.equipmentTier === 'legendary' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
          levelData.equipmentTier === 'epic' ? 'bg-purple-600 text-white' :
          levelData.equipmentTier === 'rare' ? 'bg-blue-600 text-white' :
          levelData.equipmentTier === 'common' ? 'bg-green-600 text-white' :
          'bg-gray-600 text-white'
        }`}>
          {levelData.equipmentTier.toUpperCase()}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Complexity: {levelData.complexity}
        </p>
      </div>

      {/* Unlocked Items */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-2">Recently Unlocked</h4>
        <div className="flex flex-wrap gap-2">
          {levelData.unlocks.map((item, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-lg"
            >
              ✅ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Future Unlocks Preview */}
      {previews.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Coming Next
          </h4>
          <div className="space-y-2">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-black/20 rounded-lg p-2"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Level {preview.unlocksAt}: {preview.next}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {preview.unlocksAt - currentLevel} levels away
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Preview */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl">
        <p className="text-center text-sm text-gray-300">
          Your character will evolve from
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-white font-medium">Simple Gear</span>
          <span className="text-gray-400">→</span>
          <span className="text-yellow-400 font-medium">Legendary Equipment</span>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Keep playing to unlock amazing upgrades!
        </p>
      </div>
    </div>
  )
}

export default CharacterProgression