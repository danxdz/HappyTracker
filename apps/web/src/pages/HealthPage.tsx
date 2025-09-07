import React from 'react'
import { motion } from 'framer-motion'
import { HealthTracking } from '../components/HealthTracking'

export const HealthPage: React.FC = () => {
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
              className="text-6xl"
            >
              🏥
            </motion.div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Health Tracking
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Track your meals, water intake, sleep, and movement. Watch your avatar respond 
            to your health choices in real-time!
          </p>
        </motion.div>
      </section>

      {/* Health Tracking Component */}
      <HealthTracking />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Track Your Health?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Every health choice you make affects your avatar and helps you build better habits!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Nutrition</h3>
            <p className="text-gray-300">
              Get instant nutrition scores for your meals and see how they affect your avatar!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">💧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Hydration Goals</h3>
            <p className="text-gray-300">
              Track your daily water intake and keep your avatar hydrated and happy!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">😴</div>
            <h3 className="text-xl font-semibold text-white mb-2">Sleep Quality</h3>
            <p className="text-gray-300">
              Log your sleep duration and quality to help your avatar rest and recharge!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm"
          >
            <div className="text-4xl mb-4">🚶‍♂️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Active Living</h3>
            <p className="text-gray-300">
              Track your steps and movement to keep your avatar energetic and active!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-gray-300 mb-6">
            Create your avatar and start tracking your health today. Every choice you make 
            will help your digital companion grow stronger and happier!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create Your Avatar Now! ✨
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}