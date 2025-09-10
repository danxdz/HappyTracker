import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, User, Heart, Users, Globe, Sparkles, Camera } from 'lucide-react'

export const Navigation: React.FC = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/avatar', label: 'Avatar', icon: User },
    { path: '/health', label: 'Health', icon: Heart },
    { path: '/photo-to-pop', label: 'Photo to Pop', icon: Camera },
    { path: '/character-world', label: 'Character World', icon: Globe },
    { path: '/galaxy', label: 'Galaxy', icon: Sparkles },
    { path: '/social', label: 'Social', icon: Users },
  ]
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-1 sm:gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
              <Heart className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-sm sm:text-xl font-bold text-white text-fun">HappyTracker</span>
          </motion.div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden md:block font-medium text-xs sm:text-sm">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}