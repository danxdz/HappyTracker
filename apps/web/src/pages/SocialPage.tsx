import React from 'react'
import { motion } from 'framer-motion'
import { Users, Trophy, MessageCircle, Share2 } from 'lucide-react'

export const SocialPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Social Adventure! 👥
          </span>
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Friends</h2>
            <p className="text-gray-300 mb-6">
              Connect with health heroes and support each other's journey!
            </p>
            <button className="btn-primary w-full">
              Add Friends 👥
            </button>
          </motion.div>
          
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Challenges</h2>
            <p className="text-gray-300 mb-6">
              Join weekly challenges and compete with friends for glory!
            </p>
            <button className="btn-secondary w-full">
              Join Challenge 🏆
            </button>
          </motion.div>
          
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <MessageCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Community</h2>
            <p className="text-gray-300 mb-6">
              Share achievements and get encouragement from the community!
            </p>
            <button className="btn-fun w-full">
              Share Success 🎉
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="card-fun max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Leaderboard</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((rank) => (
              <motion.div 
                key={rank}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-yellow-400">#{rank}</div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <div>
                    <div className="text-white font-bold">HealthHero{rank}</div>
                    <div className="text-gray-400 text-sm">Level {rank * 5}</div>
                  </div>
                </div>
                <div className="text-green-400 font-bold">{100 - rank * 10} pts</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}