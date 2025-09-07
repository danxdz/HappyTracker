'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Eraser, 
  Download, 
  Share2, 
  Users, 
  Heart,
  MessageCircle,
  Settings,
  Undo,
  Redo,
  Sparkles,
  Zap,
  Crown,
  Trophy
} from 'lucide-react'
import SocialPanel from '../../components/SocialPanel'
import GamificationPanel from '../../components/GamificationPanel'
import ViralModal from '../../components/ViralModal'

interface Point {
  x: number
  y: number
  color: string
  size: number
  tool: 'pen' | 'eraser'
}

interface DrawingData {
  points: Point[]
  userId: string
  timestamp: number
}

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen')
  const [currentColor, setCurrentColor] = useState('#ff6b6b')
  const [brushSize, setBrushSize] = useState(5)
  const [onlineUsers, setOnlineUsers] = useState(12)
  const [likes, setLikes] = useState(47)
  const [comments, setComments] = useState(8)
  const [drawingHistory, setDrawingHistory] = useState<Point[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSocial, setShowSocial] = useState(true)
  const [showGamification, setShowGamification] = useState(true)
  const [viralScore, setViralScore] = useState(89)
  const [trending, setTrending] = useState(false)
  const [showViralModal, setShowViralModal] = useState(false)
  const [shares, setShares] = useState(23)

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Set initial styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  // Simulate viral growth
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLikes(prev => prev + Math.floor(Math.random() * 3) + 1)
        setOnlineUsers(prev => prev + Math.floor(Math.random() * 2))
        setViralScore(prev => Math.min(100, prev + Math.floor(Math.random() * 2)))
        
        if (viralScore > 95 && !trending) {
          setTrending(true)
          setShowViralModal(true)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [viralScore, trending])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const point: Point = {
      x,
      y,
      color: currentTool === 'pen' ? currentColor : '#ffffff',
      size: currentTool === 'eraser' ? brushSize * 2 : brushSize,
      tool: currentTool
    }

    drawPoint(point)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const point: Point = {
      x,
      y,
      color: currentTool === 'pen' ? currentColor : '#ffffff',
      size: currentTool === 'eraser' ? brushSize * 2 : brushSize,
      tool: currentTool
    }

    drawPoint(point)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const drawPoint = (point: Point) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = point.tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = point.color
    ctx.lineWidth = point.size

    ctx.beginPath()
    ctx.arc(point.x, point.y, point.size / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'drawtogether-masterpiece.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const shareDrawing = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my DrawTogether masterpiece!',
        text: 'I just created something amazing on DrawTogether!',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-white">
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              DrawTogether
            </span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-white font-semibold">{onlineUsers}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-white font-semibold">{likes}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold">{comments}</span>
            </div>
          </div>
        </motion.div>

        {/* Viral Status Bar */}
        {trending && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-xl mb-6 flex items-center justify-center gap-2"
          >
            <Crown className="w-6 h-6" />
            🔥 TRENDING NOW! Your drawing is going viral! 🔥
            <Crown className="w-6 h-6" />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Tools Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Tools
            </h3>

            {/* Tool Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentTool('pen')}
                className={`p-3 rounded-lg transition-all ${
                  currentTool === 'pen' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                <Palette className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTool('eraser')}
                className={`p-3 rounded-lg transition-all ${
                  currentTool === 'eraser' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white/20 text-gray-300 hover:bg-white/30'
                }`}
              >
                <Eraser className="w-5 h-5" />
              </button>
            </div>

            {/* Color Palette */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      currentColor === color ? 'border-white scale-110' : 'border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Size</h4>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-gray-300 mt-2">{brushSize}px</div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={clearCanvas}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              >
                Clear Canvas
              </button>
              <button
                onClick={downloadDrawing}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={shareDrawing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>

          {/* Canvas */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="canvas-container">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>
          </motion.div>

          {/* Social Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Live Activity</h3>
              <button
                onClick={() => setShowSocial(!showSocial)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            {showSocial ? (
              <SocialPanel />
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Social features disabled</p>
              </div>
            )}
          </motion.div>

          {/* Gamification Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Achievements</h3>
              <button
                onClick={() => setShowGamification(!showGamification)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            {showGamification ? (
              <GamificationPanel />
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gamification disabled</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Viral Modal */}
        <ViralModal
          isOpen={showViralModal}
          onClose={() => setShowViralModal(false)}
          likes={likes}
          shares={shares}
          views={onlineUsers * 100}
          viralScore={viralScore}
        />
      </div>
    </div>
  )
}