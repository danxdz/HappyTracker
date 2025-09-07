import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Github, Twitter, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-fun">HappyTracker</span>
            <span className="text-gray-400 text-sm">v1.0.0</span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            
            <motion.a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            
            <motion.a 
              href="mailto:hello@happytracker.com"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>
          
          <div className="text-gray-400 text-sm">
            Made with ❤️ for health heroes everywhere
          </div>
        </div>
      </div>
    </motion.footer>
  )
}