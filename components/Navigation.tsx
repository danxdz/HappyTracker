'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Palette, 
  Trophy, 
  Users, 
  Share2,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'draw', label: 'Draw', icon: Palette, href: '/draw' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { id: 'community', label: 'Community', icon: Users, href: '/community' },
  ]

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-lg border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  DrawTogether
                </span>
              </h1>
              <p className="text-xs text-gray-400">Viral Drawing App</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-semibold">{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>

          {/* Viral Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-semibold">1.2K</span>
              <span className="text-gray-400 text-sm">Online</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-white font-semibold">89</span>
              <span className="text-gray-400 text-sm">Trending</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}