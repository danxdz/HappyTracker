import React from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Trophy, 
  Users, 
  Sparkles, 
  Zap, 
  Star,
  ArrowRight,
  Play,
  Camera,
  Gamepad2
} from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-block mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Heart className="w-16 h-16 text-green-400" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-fun">
              HappyTracker
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your health journey into an epic adventure! 🎮🥗✨
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            <motion.div 
              className="card-fun"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">2,847</div>
              <div className="text-gray-300">Health Heroes</div>
            </motion.div>
            
            <motion.div 
              className="card-fun"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">15,623</div>
              <div className="text-gray-300">Achievements</div>
            </motion.div>
            
            <motion.div 
              className="card-fun"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">89</div>
              <div className="text-gray-300">Day Streak</div>
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.button 
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Start Your Adventure!
            </motion.button>
            
            <motion.button 
              className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-5 h-5" />
              Create Avatar
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Your Health MMO Features 🎮
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              className="card-glow text-center"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Camera className="w-12 h-12 text-green-400 mx-auto animate-float" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Avatar Creation</h3>
              <p className="text-gray-300">
                Generate your unique health companion with AI magic! 
                Every avatar is special and reflects your personality.
              </p>
            </motion.div>
            
            <motion.div 
              className="card-glow text-center"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Heart className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Health Tracking</h3>
              <p className="text-gray-300">
                Photo-based meal logging, water tracking, sleep monitoring, 
                and movement detection - all gamified!
              </p>
            </motion.div>
            
            <motion.div 
              className="card-glow text-center"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <Users className="w-12 h-12 text-blue-400 mx-auto animate-wiggle" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Social Adventure</h3>
              <p className="text-gray-300">
                Join friends, compete in challenges, share achievements, 
                and build a healthy community together!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card-glow max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Level Up Your Health? 🚀
          </h2>
          <p className="text-gray-300 mb-8">
            Join thousands of health heroes who've transformed their lives 
            through gamification and community support!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              className="btn-fun text-lg px-8 py-4 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gamepad2 className="w-5 h-5" />
              Start Playing Now!
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
            <Star className="w-6 h-6 text-yellow-400 fill-current animate-bounce-slow" />
            <Star className="w-6 h-6 text-yellow-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.2s' }} />
            <Star className="w-6 h-6 text-yellow-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.4s' }} />
            <Star className="w-6 h-6 text-yellow-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.6s' }} />
            <Star className="w-6 h-6 text-yellow-400 fill-current animate-bounce-slow" style={{ animationDelay: '0.8s' }} />
          </div>
        </motion.div>
      </section>
    </div>
  )
}