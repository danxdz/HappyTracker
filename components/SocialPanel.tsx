'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Zap,
  Crown,
  Trophy,
  Star,
  TrendingUp,
  Eye,
  ThumbsUp,
  Sparkles
} from 'lucide-react'

interface User {
  id: string
  username: string
  avatar?: string
  isOnline: boolean
}

interface Comment {
  id: number
  userId: string
  username: string
  text: string
  timestamp: number
}

interface Reaction {
  userId: string
  username: string
  reaction: string
  timestamp: number
}

export default function SocialPanel() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'artist123', isOnline: true },
    { id: '2', username: 'creative456', isOnline: true },
    { id: '3', username: 'drawmaster789', isOnline: false },
    { id: '4', username: 'paintpro', isOnline: true },
    { id: '5', username: 'sketchqueen', isOnline: true },
  ])
  
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, userId: '1', username: 'artist123', text: 'Amazing work! 🔥', timestamp: Date.now() - 300000 },
    { id: 2, userId: '2', username: 'creative456', text: 'Love the colors!', timestamp: Date.now() - 180000 },
    { id: 3, userId: '4', username: 'paintpro', text: 'This is going viral!', timestamp: Date.now() - 120000 },
  ])
  
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [newComment, setNewComment] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [likes, setLikes] = useState(247)
  const [shares, setShares] = useState(89)
  const [views, setViews] = useState(1234)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add reactions
      if (Math.random() > 0.7) {
        const reactions = ['🔥', '❤️', '👏', '🎨', '✨', '🚀']
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]
        const randomUser = users[Math.floor(Math.random() * users.length)]
        
        setReactions(prev => [...prev, {
          userId: randomUser.id,
          username: randomUser.username,
          reaction: randomReaction,
          timestamp: Date.now()
        }])
        
        // Remove old reactions
        setTimeout(() => {
          setReactions(prev => prev.slice(1))
        }, 3000)
      }
      
      // Randomly update stats
      if (Math.random() > 0.8) {
        setLikes(prev => prev + Math.floor(Math.random() * 3))
        setViews(prev => prev + Math.floor(Math.random() * 5))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [users])

  const addComment = () => {
    if (!newComment.trim()) return
    
    const comment: Comment = {
      id: Date.now(),
      userId: 'current-user',
      username: 'You',
      text: newComment,
      timestamp: Date.now()
    }
    
    setComments(prev => [comment, ...prev])
    setNewComment('')
    setIsTyping(false)
  }

  const sendReaction = (reaction: string) => {
    setReactions(prev => [...prev, {
      userId: 'current-user',
      username: 'You',
      reaction,
      timestamp: Date.now()
    }])
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5" />
            <span className="font-semibold">Likes</span>
          </div>
          <div className="text-2xl font-bold">{likes}</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5" />
            <span className="font-semibold">Views</span>
          </div>
          <div className="text-2xl font-bold">{views.toLocaleString()}</div>
        </div>
      </motion.div>

      {/* Online Users */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Online Artists ({users.filter(u => u.isOnline).length})
        </h3>
        <div className="space-y-2">
          {users.filter(u => u.isOnline).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-300">{user.username}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reactions */}
      <AnimatePresence>
        {reactions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative h-20 overflow-hidden"
          >
            {reactions.map((reaction, index) => (
              <motion.div
                key={`${reaction.timestamp}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0 }}
                className="absolute top-0 left-0 w-full flex items-center gap-2"
              >
                <span className="text-2xl">{reaction.reaction}</span>
                <span className="text-white font-semibold">{reaction.username}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Reactions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
      >
        <h3 className="text-white font-bold mb-3">Quick Reactions</h3>
        <div className="flex gap-2">
          {['🔥', '❤️', '👏', '🎨', '✨', '🚀'].map((reaction) => (
            <motion.button
              key={reaction}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sendReaction(reaction)}
              className="text-2xl hover:bg-white/20 rounded-lg p-2 transition-all"
            >
              {reaction}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Comments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
      >
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </h3>
        
        <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm">{comment.username}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(comment.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{comment.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value)
              setIsTyping(e.target.value.length > 0)
            }}
            placeholder="Add a comment..."
            className="flex-1 bg-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addComment}
            disabled={!newComment.trim()}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Send
          </motion.button>
        </div>
      </motion.div>

      {/* Viral Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <button
          onClick={() => setLikes(prev => prev + 1)}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Like & Go Viral! 🔥
        </button>
        
        <button
          onClick={() => setShares(prev => prev + 1)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Masterpiece
        </button>
      </motion.div>
    </div>
  )
}