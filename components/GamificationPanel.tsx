'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Award,
  TrendingUp,
  Medal,
  Flame,
  Sparkles,
  Users,
  Heart,
  Share2
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  reward: string
}

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  avatar: string
  badges: string[]
  isCurrentUser?: boolean
}

export default function GamificationPanel() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-drawing',
      title: 'First Stroke',
      description: 'Create your first drawing',
      icon: '🎨',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      reward: '+100 XP'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Get 10 likes on a single drawing',
      icon: '🦋',
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      reward: '+500 XP'
    },
    {
      id: 'viral-sensation',
      title: 'Viral Sensation',
      description: 'Get 100 shares on a drawing',
      icon: '🚀',
      unlocked: false,
      progress: 47,
      maxProgress: 100,
      reward: '+2000 XP'
    },
    {
      id: 'collaboration-master',
      title: 'Collaboration Master',
      description: 'Draw with 50 different people',
      icon: '👥',
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      reward: '+1500 XP'
    },
    {
      id: 'trending-artist',
      title: 'Trending Artist',
      description: 'Be featured on trending page',
      icon: '⭐',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: '+3000 XP'
    }
  ])

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, username: 'artmaster99', score: 15420, avatar: '👑', badges: ['trending', 'viral'], isCurrentUser: false },
    { rank: 2, username: 'paintpro', score: 12890, avatar: '🎨', badges: ['collaborator'], isCurrentUser: false },
    { rank: 3, username: 'sketchqueen', score: 11200, avatar: '👸', badges: ['social'], isCurrentUser: false },
    { rank: 4, username: 'You', score: 8940, avatar: '🌟', badges: ['rising'], isCurrentUser: true },
    { rank: 5, username: 'drawmaster', score: 7650, avatar: '🎯', badges: [], isCurrentUser: false },
    { rank: 6, username: 'creative456', score: 6890, avatar: '✨', badges: [], isCurrentUser: false },
    { rank: 7, username: 'artist123', score: 5430, avatar: '🎭', badges: [], isCurrentUser: false },
  ])

  const [currentLevel, setCurrentLevel] = useState(12)
  const [currentXP, setCurrentXP] = useState(2340)
  const [nextLevelXP, setNextLevelXP] = useState(3000)
  const [showAchievement, setShowAchievement] = useState<string | null>(null)

  // Simulate XP gains
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const xpGain = Math.floor(Math.random() * 50) + 10
        setCurrentXP(prev => {
          const newXP = prev + xpGain
          if (newXP >= nextLevelXP) {
            setCurrentLevel(prev => prev + 1)
            setNextLevelXP(prev => prev + 1000)
            return newXP - nextLevelXP
          }
          return newXP
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [nextLevelXP])

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'trending': return <TrendingUp className="w-4 h-4 text-orange-400" />
      case 'viral': return <Flame className="w-4 h-4 text-red-400" />
      case 'collaborator': return <Users className="w-4 h-4 text-blue-400" />
      case 'social': return <Heart className="w-4 h-4 text-pink-400" />
      case 'rising': return <Zap className="w-4 h-4 text-yellow-400" />
      default: return <Star className="w-4 h-4 text-gray-400" />
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-orange-400" />
      default: return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{currentLevel}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Level {currentLevel}</h3>
              <p className="text-purple-100">Artist</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentXP.toLocaleString()} XP</div>
            <div className="text-purple-100">Next: {nextLevelXP.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3">
          <motion.div 
            className="bg-white rounded-full h-3"
            initial={{ width: 0 }}
            animate={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
      >
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </h3>
        
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border transition-all ${
                achievement.unlocked 
                  ? 'bg-green-500/20 border-green-400' 
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? 'text-green-400' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </h4>
                    {achievement.unlocked && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full h-2"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {achievement.reward}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
      >
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Global Leaderboard
        </h3>
        
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg transition-all ${
                entry.isCurrentUser 
                  ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="text-2xl">{entry.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      entry.isCurrentUser ? 'text-purple-300' : 'text-white'
                    }`}>
                      {entry.username}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                        YOU
                      </span>
                    )}
                    <div className="flex gap-1">
                      {entry.badges.map((badge, i) => (
                        <div key={i}>{getBadgeIcon(badge)}</div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {entry.score.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white"
      >
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Daily Challenge
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Draw 5 collaborative pieces</span>
            <span className="text-sm font-bold">3/5</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: '60%' }} />
          </div>
          <div className="text-xs text-orange-100">Reward: +500 XP + Special Badge</div>
        </div>
      </motion.div>
    </div>
  )
}