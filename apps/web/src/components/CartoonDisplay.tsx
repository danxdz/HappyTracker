/**
 * 🎨 Caricature Display Component
 * 
 * Beautiful display for generated caricature characters
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, RefreshCw, Heart, Sparkles, X, Check } from 'lucide-react'
import { CaricatureGenerationResult } from '../services/cartoonGenerator'

export interface CaricatureDisplayProps {
  result: CaricatureGenerationResult
  onRegenerate?: () => void
  onDownload?: () => void
  onShare?: () => void
}

export const CaricatureDisplay: React.FC<CaricatureDisplayProps> = ({
  result,
  onRegenerate,
  onDownload,
  onShare
}) => {
  const handleDownload = () => {
    if (result.imageUrl && onDownload) {
      onDownload()
    } else if (result.imageUrl) {
      // Default download behavior
      const link = document.createElement('a')
      link.href = result.imageUrl
      link.download = 'cartoon-character.png'
      link.click()
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else if (result.imageUrl && navigator.share) {
      // Use native share API if available
      navigator.share({
        title: 'My Cartoon Character',
        text: 'Check out my cartoon character!',
        url: result.imageUrl
      })
    }
  }

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            Generation Failed
          </h3>
          <p className="text-red-600 mb-4">
            {result.error || 'Something went wrong'}
          </p>
          {onRegenerate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegenerate}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Cartoon Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 p-4">
        <div className="relative">
          <img
            src={result.imageUrl}
            alt="Generated cartoon character"
            className="w-full h-auto rounded-xl shadow-lg"
          />
          
          {/* Success badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute top-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex space-x-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </motion.button>

        {onRegenerate && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegenerate}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </motion.button>
        )}
      </motion.div>

      {/* Generation Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 bg-gray-50 rounded-xl"
      >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {result.processingTime && (
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                <span>{result.processingTime}ms</span>
              </div>
            )}
            {result.cost && (
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span>${result.cost.toFixed(3)}</span>
              </div>
            )}
          </div>
          <div className="text-green-600 font-medium">
            ✓ Generated Successfully
          </div>
        </div>
      </motion.div>

      {/* Style Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-4"
      >
        <h4 className="text-sm font-medium text-gray-700 mb-2">Try Different Styles:</h4>
        <div className="flex space-x-2">
          {['cute', 'anime', 'disney', 'pixar'].map((style) => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors capitalize"
            >
              {style}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}