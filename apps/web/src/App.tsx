import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HomePage } from './pages/HomePage'
import { AvatarPage } from './pages/AvatarPage'
import { HealthPage } from './pages/HealthPage'
import { SocialPage } from './pages/SocialPage'
import { CharacterWorldPage } from './pages/CharacterWorldPage'
import { GalaxyPage } from './pages/GalaxyPage'
import { PhotoToPopPage } from './pages/PhotoToPopPage'
import { CartoonPage } from './pages/CartoonPage'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <Routes>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HomePage />
            </motion.div>
          } 
        />
        <Route 
          path="/avatar" 
          element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AvatarPage />
            </motion.div>
          } 
        />
        <Route 
          path="/health" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HealthPage />
            </motion.div>
          } 
        />
        <Route 
          path="/social" 
          element={
            <motion.div
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SocialPage />
            </motion.div>
          } 
        />
        <Route 
          path="/character-world" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CharacterWorldPage />
            </motion.div>
          } 
        />
        <Route 
          path="/galaxy" 
          element={<GalaxyPage />}
        />
        <Route 
          path="/photo-to-pop" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PhotoToPopPage />
            </motion.div>
          } 
        />
        <Route 
          path="/cartoon" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CartoonPage />
            </motion.div>
          } 
        />
      </Routes>
      
      {/* Conditional Navigation and Footer - not shown on galaxy page */}
      <Routes>
        <Route path="/galaxy" element={null} />
        <Route path="*" element={
          <>
            <Navigation />
            <Footer />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App