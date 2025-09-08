import React, { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Sphere, Box } from '@react-three/drei'
import { useSelector } from 'react-redux'
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

// Star Field Component
function StarField({ galaxyType }: { galaxyType: GalaxyType }) {
  const meshRef = useRef<THREE.Points>(null!)
  const config = GALAXY_TYPES[galaxyType]
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const starCount = 5000
    const positions = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount; i++) {
      // Create spiral galaxy pattern
      const radius = Math.random() * 50 + 10
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 10
      
      // Spiral arm effect
      const spiralFactor = radius * 0.1
      const spiralAngle = angle + spiralFactor
      
      positions[i * 3] = Math.cos(spiralAngle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(spiralAngle) * radius
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: config.starColor,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    })
  }, [config.starColor])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })
  
  return (
    <points ref={meshRef} geometry={starGeometry} material={starMaterial} />
  )
}

// Central Sun Component
function CentralSun({ galaxyType, healthEnergy }: { galaxyType: GalaxyType, healthEnergy: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const config = GALAXY_TYPES[galaxyType]
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation based on health energy
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      const scale = 1 + (healthEnergy / 100) * 0.5 + pulse * 0.2
      meshRef.current.scale.setScalar(scale)
      
      // Rotation
      meshRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <group>
      {/* Main Sun */}
      <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={config.color}
          emissive={config.color}
          emissiveIntensity={healthEnergy / 100}
        />
      </Sphere>
      
      {/* Energy Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 4, 32]} />
        <meshBasicMaterial 
          color={config.nebulaColor}
          transparent
          opacity={healthEnergy / 200}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Energy Particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[
          Math.cos(i * 0.3) * 4,
          Math.sin(i * 0.3) * 4,
          Math.sin(i * 0.5) * 2
        ]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color={config.starColor}
            transparent
            opacity={healthEnergy / 150}
          />
        </mesh>
      ))}
    </group>
  )
}

// Nebula Effect Component
function NebulaEffect({ galaxyType }: { galaxyType: GalaxyType }) {
  const config = GALAXY_TYPES[galaxyType]
  
  return (
    <group>
      {/* Background Nebula */}
      <mesh position={[0, 0, -20]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color={config.nebulaColor}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Floating Nebula Clouds */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40
        ]}>
          <sphereGeometry args={[Math.random() * 5 + 2, 16, 16]} />
          <meshBasicMaterial 
            color={config.nebulaColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Galaxy Selection UI
function GalaxySelector({ 
  selectedGalaxy, 
  onGalaxyChange 
}: { 
  selectedGalaxy: GalaxyType
  onGalaxyChange: (galaxy: GalaxyType) => void 
}) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-white font-bold text-lg mb-3">Choose Your Galaxy 🌌</h3>
      <div className="space-y-2">
        {Object.entries(GALAXY_TYPES).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onGalaxyChange(key as GalaxyType)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedGalaxy === key
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/15'
            }`}
          >
            <span className="text-lg mr-2">{config.emoji}</span>
            <span className="font-medium">{config.name}</span>
            <div className="text-xs text-gray-400">{config.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Main Galaxy System Component
export const GalaxySystem: React.FC = () => {
  const { currentAvatar } = useSelector((state: RootState) => state.avatar)
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyType>('bright')
  
  // Calculate health energy from avatar
  const healthEnergy = currentAvatar?.wellnessScore || 50
  
  const config = GALAXY_TYPES[selectedGalaxy]
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Galaxy Selection UI */}
      <GalaxySelector 
        selectedGalaxy={selectedGalaxy}
        onGalaxyChange={setSelectedGalaxy}
      />
      
      {/* Galaxy Info */}
      <div className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white font-bold text-lg mb-2">{config.emoji} {config.name}</h3>
        <p className="text-white text-sm mb-2">{config.description}</p>
        <div className="text-white text-sm">
          <div>Health Energy: {healthEnergy}/100</div>
          <div>Sun Brightness: {Math.round(healthEnergy)}%</div>
        </div>
      </div>
      
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={healthEnergy / 50} color={config.color} />
          
          {/* Galaxy Components */}
          <StarField galaxyType={selectedGalaxy} />
          <CentralSun galaxyType={selectedGalaxy} healthEnergy={healthEnergy} />
          <NebulaEffect galaxyType={selectedGalaxy} />
          
          {/* Galaxy Title */}
          <Text
            position={[0, 8, 0]}
            fontSize={2}
            color={config.starColor}
            anchorX="center"
            anchorY="middle"
          >
            {config.name}
          </Text>
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            touches={{
              ONE: 2, // Single finger for rotation
              TWO: 1  // Two fingers for zoom
            }}
          />
        </Suspense>
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-4">
        <p className="text-white text-center text-sm">
          🌌 Touch to rotate, pinch to zoom, drag to explore your galaxy! 
          Feed the sun with healthy choices to make it brighter! ☀️
        </p>
      </div>
    </div>
  )
}