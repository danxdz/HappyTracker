import React, { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Sphere, Box } from '@react-three/drei'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '../store'
import * as THREE from 'three'

// Galaxy Types
export type GalaxyType = 'bright' | 'mystical' | 'crystal' | 'cosmic'

interface GalaxyConfig {
  name: string
  color: string
  starColor: string
  nebulaColor: string
  description: string
  emoji: string
}

export const GALAXY_TYPES: Record<GalaxyType, GalaxyConfig> = {
  bright: {
    name: 'Bright Galaxy',
    color: '#60a5fa',
    starColor: '#fbbf24',
    nebulaColor: '#a78bfa',
    description: 'Vibrant and energetic',
    emoji: '🌟'
  },
  mystical: {
    name: 'Mystical Galaxy',
    color: '#c084fc',
    starColor: '#ec4899',
    nebulaColor: '#8b5cf6',
    description: 'Magical and ethereal',
    emoji: '✨'
  },
  crystal: {
    name: 'Crystal Galaxy',
    color: '#06b6d4',
    starColor: '#ffffff',
    nebulaColor: '#67e8f9',
    description: 'Sparkly and elegant',
    emoji: '💎'
  },
  cosmic: {
    name: 'Cosmic Galaxy',
    color: '#1e293b',
    starColor: '#64748b',
    nebulaColor: '#475569',
    description: 'Deep space and peaceful',
    emoji: '🌌'
  }
}

// Realistic Star Field Component
function StarField({ galaxyType }: { galaxyType: GalaxyType }) {
  const groupRef = useRef<THREE.Group>(null!)
  const config = GALAXY_TYPES[galaxyType]
  
  const stars = useMemo(() => {
    const starCount = 2000
    const starArray = []
    
    for (let i = 0; i < starCount; i++) {
      // Create spiral galaxy pattern
      const radius = Math.random() * 60 + 15
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 15
      
      // Spiral arm effect
      const spiralFactor = radius * 0.08
      const spiralAngle = angle + spiralFactor
      
      const x = Math.cos(spiralAngle) * radius
      const y = height
      const z = Math.sin(spiralAngle) * radius
      
      // Star size variation
      const size = Math.random() * 0.3 + 0.1
      const brightness = Math.random() * 0.5 + 0.5
      
      starArray.push({
        position: [x, y, z] as [number, number, number],
        size,
        brightness,
        color: config.starColor
      })
    }
    
    return starArray
  }, [config.starColor])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
    }
  })
  
  return (
    <group ref={groupRef}>
      {stars.map((star, index) => (
        <mesh key={index} position={star.position}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial 
            color={star.color}
            transparent
            opacity={star.brightness}
          />
        </mesh>
      ))}
    </group>
  )
}

// Realistic Central Sun Component
function CentralSun({ galaxyType, healthEnergy }: { galaxyType: GalaxyType, healthEnergy: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const coronaRef = useRef<THREE.Mesh>(null!)
  const config = GALAXY_TYPES[galaxyType]
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation based on health energy
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.15 + 1
      const scale = 1 + (healthEnergy / 100) * 0.3 + pulse * 0.1
      meshRef.current.scale.setScalar(scale)
      
      // Rotation
      meshRef.current.rotation.y += 0.005
    }
    
    if (coronaRef.current) {
      // Corona rotation
      coronaRef.current.rotation.y += 0.002
      coronaRef.current.rotation.z += 0.001
    }
  })
  
  return (
    <group>
      {/* Sun Corona - Outer glow */}
      <Sphere ref={coronaRef} args={[3.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color={config.color}
          transparent
          opacity={healthEnergy / 300}
        />
      </Sphere>
      
      {/* Main Sun Core */}
      <Sphere ref={meshRef} args={[2.5, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={config.color}
          emissive={config.color}
          emissiveIntensity={healthEnergy / 80}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Solar Flares */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[
          Math.cos(i * 0.785) * 4,
          Math.sin(i * 0.785) * 4,
          (Math.random() - 0.5) * 2
        ]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color={config.starColor}
            transparent
            opacity={healthEnergy / 200}
          />
        </mesh>
      ))}
      
      {/* Energy Rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3 + i * 1.5, 3.5 + i * 1.5, 64]} />
          <meshBasicMaterial 
            color={config.nebulaColor}
            transparent
            opacity={healthEnergy / (250 + i * 100)}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// Realistic Nebula Landscape Component
function NebulaEffect({ galaxyType }: { galaxyType: GalaxyType }) {
  const config = GALAXY_TYPES[galaxyType]
  
  return (
    <group>
      {/* Distant Galaxy Background */}
      <mesh position={[0, 0, -80]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial 
          color={config.nebulaColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Nebula Clouds with realistic shapes */}
      {Array.from({ length: 12 }, (_, i) => {
        const size = Math.random() * 8 + 3
        const opacity = Math.random() * 0.3 + 0.1
        const x = (Math.random() - 0.5) * 100
        const y = (Math.random() - 0.5) * 100
        const z = (Math.random() - 0.5) * 60 - 20
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshBasicMaterial 
              color={config.nebulaColor}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}
      
      {/* Gas Clouds */}
      {Array.from({ length: 8 }, (_, i) => {
        const size = Math.random() * 4 + 1
        const opacity = Math.random() * 0.4 + 0.2
        const x = (Math.random() - 0.5) * 80
        const y = (Math.random() - 0.5) * 80
        const z = (Math.random() - 0.5) * 40
        
        return (
          <mesh key={`gas-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[size, 24, 24]} />
            <meshBasicMaterial 
              color={config.starColor}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}
      
      {/* Dust Clouds */}
      {Array.from({ length: 15 }, (_, i) => {
        const size = Math.random() * 2 + 0.5
        const opacity = Math.random() * 0.2 + 0.05
        const x = (Math.random() - 0.5) * 120
        const y = (Math.random() - 0.5) * 120
        const z = (Math.random() - 0.5) * 80
        
        return (
          <mesh key={`dust-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial 
              color={config.color}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Modern Touch Menu Component
function ModernTouchMenu({ 
  selectedGalaxy, 
  onGalaxyChange,
  isOpen,
  onToggle
}: { 
  selectedGalaxy: GalaxyType
  onGalaxyChange: (galaxy: GalaxyType) => void
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg backdrop-blur-sm border border-white/20 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white text-xl"
        >
          ⚡
        </motion.div>
      </motion.button>

      {/* Full Screen Menu Overlay */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        
        {/* Menu Content */}
        <div className="relative h-full flex items-center justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          >
            <h2 className="text-white font-bold text-2xl mb-6 text-center">
              🌌 Choose Your Galaxy
            </h2>
            
            <div className="space-y-4">
              {Object.entries(GALAXY_TYPES).map(([key, config]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onGalaxyChange(key as GalaxyType)
                    onToggle()
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                    selectedGalaxy === key
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{config.emoji}</div>
                    <div>
                      <div className="text-white font-semibold text-lg">{config.name}</div>
                      <div className="text-gray-300 text-sm">{config.description}</div>
                    </div>
                    {selectedGalaxy === key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-yellow-400 text-xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-300 text-sm">
                🌟 Your galaxy choice affects the entire universe!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

// Galaxy Info Panel Component
function GalaxyInfoPanel({ config, healthEnergy }: { config: GalaxyConfig, healthEnergy: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-30 bg-gradient-to-br from-black/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-2xl">{config.emoji}</div>
        <div>
          <h3 className="text-white font-bold text-lg">{config.name}</h3>
          <p className="text-gray-300 text-sm">{config.description}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Health Energy:</span>
          <span className="text-yellow-400 font-semibold">{healthEnergy}/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Sun Brightness:</span>
          <span className="text-orange-400 font-semibold">{Math.round(healthEnergy)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">Galaxy Power:</span>
          <span className="text-purple-400 font-semibold">{Math.round(healthEnergy * 0.8)}%</span>
        </div>
      </div>
      
      {/* Health Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthEnergy}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}

// Touch Controls Overlay
function TouchControlsOverlay({ isVisible, onHide }: { isVisible: boolean, onHide: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 50
      }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-4 left-4 right-4 z-30 bg-gradient-to-r from-black/40 to-purple-900/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={onHide}
    >
      <div className="text-center">
        <h4 className="text-white font-semibold text-lg mb-2">🌌 Galaxy Controls</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-1">👆</div>
            <div className="text-gray-300 text-xs">Touch to Rotate</div>
          </div>
          <div>
            <div className="text-2xl mb-1">🤏</div>
            <div className="text-gray-300 text-xs">Pinch to Zoom</div>
          </div>
          <div>
            <div className="text-2xl mb-1">👋</div>
            <div className="text-gray-300 text-xs">Drag to Pan</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm mt-3">
          ☀️ Feed the sun with healthy choices to make it brighter!
        </p>
        <p className="text-gray-400 text-xs mt-2">
          👆 Tap to hide • 👆👆 Double-click to show
        </p>
      </div>
    </motion.div>
  )
}

// Main Galaxy System Component
export const GalaxySystem: React.FC = () => {
  const { currentAvatar } = useSelector((state: RootState) => state.avatar)
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyType>('bright')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  // Calculate health energy from avatar
  const healthEnergy = currentAvatar?.wellnessScore || 50
  
  const config = GALAXY_TYPES[selectedGalaxy]
  
  // Auto-hide controls after 2 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Show controls when galaxy changes
  React.useEffect(() => {
    setShowControls(true)
    const timer = setTimeout(() => {
      setShowControls(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [selectedGalaxy])
  
  const handleHideControls = () => {
    setShowControls(false)
  }
  
  const handleDoubleClick = () => {
    setShowControls(true)
    // Auto-hide after 2 seconds
    setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }
  
  return (
    <div 
      className="fixed inset-0 w-full h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      {/* Modern Touch Menu */}
      <ModernTouchMenu 
        selectedGalaxy={selectedGalaxy}
        onGalaxyChange={setSelectedGalaxy}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      {/* Galaxy Info Panel */}
      <GalaxyInfoPanel config={config} healthEnergy={healthEnergy} />
      
      {/* Full Screen 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ 
          background: 'transparent',
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      >
        <Suspense fallback={null}>
          {/* Realistic Lighting System */}
          <ambientLight intensity={0.1} color="#1a1a2e" />
          <directionalLight 
            position={[20, 20, 10]} 
            intensity={0.4} 
            color="#ffffff"
            castShadow
          />
          <pointLight 
            position={[0, 0, 0]} 
            intensity={healthEnergy / 20} 
            color={config.color}
            distance={50}
            decay={2}
          />
          <pointLight 
            position={[10, 10, 10]} 
            intensity={healthEnergy / 40} 
            color={config.starColor}
            distance={30}
            decay={1.5}
          />
          <pointLight 
            position={[-10, -10, -10]} 
            intensity={healthEnergy / 60} 
            color={config.nebulaColor}
            distance={25}
            decay={2}
          />
          <hemisphereLight 
            args={["#0f0f23", "#1a1a2e", 0.3]}
          />
          
          {/* Galaxy Components */}
          <StarField galaxyType={selectedGalaxy} />
          <CentralSun galaxyType={selectedGalaxy} healthEnergy={healthEnergy} />
          <NebulaEffect galaxyType={selectedGalaxy} />
          
          {/* Enhanced Galaxy Title */}
          <Text
            position={[0, 10, 0]}
            fontSize={3}
            color={config.starColor}
            anchorX="center"
            anchorY="middle"
          >
            {config.name}
          </Text>
          
          {/* Subtitle */}
          <Text
            position={[0, 7, 0]}
            fontSize={1}
            color={config.nebulaColor}
            anchorX="center"
            anchorY="middle"
          >
            Health Energy: {healthEnergy}%
          </Text>
          
          {/* Enhanced Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={80}
            autoRotate={false}
            autoRotateSpeed={0.5}
            touches={{
              ONE: 2, // Single finger for rotation
              TWO: 1  // Two fingers for zoom
            }}
          />
        </Suspense>
      </Canvas>
      
      {/* Touch Controls Overlay */}
      <TouchControlsOverlay 
        isVisible={showControls}
        onHide={handleHideControls}
      />
    </div>
  )
}