'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Heart, 
  Users, 
  TrendingUp, 
  Crown, 
  Sparkles,
  X,
  Copy,
  Twitter,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-react'

interface ViralModalProps {
  isOpen: boolean
  onClose: () => void
  likes: number
  shares: number
  views: number
  viralScore: number
}

export default function ViralModal({ isOpen, onClose, likes, shares, views, viralScore }: ViralModalProps) {
  const [copied, setCopied] = useState(false)
  const [shareText, setShareText] = useState('')

  useEffect(() => {
    if (isOpen) {
      setShareText(`🎨 Just created something AMAZING on DrawTogether! ${likes} likes and counting! 🔥 Check it out: ${window.location.href}`)
    }
  }, [isOpen, likes])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(shareText)
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy the text
        copyToClipboard()
        alert('Text copied! Paste it in your Instagram story or post.')
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">🔥 GOING VIRAL! 🔥</h2>
                <p className="text-purple-200">Your art is trending!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Viral Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{likes}</div>
              <div className="text-purple-200 text-sm">Likes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <Share2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{shares}</div>
              <div className="text-purple-200 text-sm">Shares</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
              <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{views}</div>
              <div className="text-purple-200 text-sm">Views</div>
            </div>
          </motion.div>

          {/* Viral Score */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Viral Score</span>
              <span className="text-yellow-400 font-bold">{viralScore}/100</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-4">
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full h-4"
                initial={{ width: 0 }}
                animate={{ width: `${viralScore}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-purple-200 text-sm mt-2">
              {viralScore > 90 ? '🚀 MEGA VIRAL!' : viralScore > 70 ? '🔥 Trending!' : '📈 Growing!'}
            </p>
          </motion.div>

          {/* Share Options */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-white font-bold text-lg">Share Your Success!</h3>
            
            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareToSocial('twitter')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Twitter className="w-5 h-5" />
                Tweet It
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareToSocial('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Facebook className="w-5 h-5" />
                Share on FB
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => shareToSocial('instagram')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Instagram Story
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {copied ? 'Copied!' : 'Copy Link'}
              </motion.button>
            </div>

            {/* Custom Message */}
            <div className="mt-4">
              <label className="block text-white font-semibold mb-2">Custom Message</label>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                placeholder="Write your viral message..."
              />
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-purple-200 mb-4">
              Keep the momentum going! Share with friends and watch your art spread! 🚀
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Share & Go Even More Viral!
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}