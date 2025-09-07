import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Droplets, Moon, Activity } from 'lucide-react'

export const HealthPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-8">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Track Your Health! 🥗
          </span>
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Meals</h3>
            <p className="text-gray-300 text-sm">Photo-based tracking</p>
            <div className="text-2xl font-bold text-green-400 mt-2">85%</div>
          </motion.div>
          
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Droplets className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Water</h3>
            <p className="text-gray-300 text-sm">Hydration goals</p>
            <div className="text-2xl font-bold text-blue-400 mt-2">6/8</div>
          </motion.div>
          
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Moon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sleep</h3>
            <p className="text-gray-300 text-sm">Rest quality</p>
            <div className="text-2xl font-bold text-purple-400 mt-2">7.5h</div>
          </motion.div>
          
          <motion.div 
            className="card-glow text-center"
            whileHover={{ scale: 1.05 }}
          >
            <Activity className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Activity</h3>
            <p className="text-gray-300 text-sm">Daily movement</p>
            <div className="text-2xl font-bold text-orange-400 mt-2">8,500</div>
          </motion.div>
        </div>
        
        <motion.div 
          className="card-fun max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Today's Wellness Score</h3>
          <div className="text-6xl font-bold text-green-400 mb-4">87</div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <p className="text-gray-300">Excellent! Keep up the great work! 🎉</p>
        </motion.div>
      </motion.div>
    </div>
  )
}