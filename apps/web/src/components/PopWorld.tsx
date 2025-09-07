import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Text, Box, Sphere, Cylinder } from '@react-three/drei'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import * as THREE from 'three'

// 3D Pop Character Component
function PopCharacter({ healthData }: { healthData: any }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  // Calculate wellness score for animations
  const wellnessScore = healthData?.wellnessScore || 50
  
  useFrame((state) => {
    if (meshRef.current) {
      // Bounce animation based on wellness score
      const bounceHeight = wellnessScore / 100 * 0.5
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * bounceHeight + 1
      
      // Rotation animation
      meshRef.current.rotation.y += 0.01
      
      // Scale based on wellness (healthier = bigger)
      const scale = 0.8 + (wellnessScore / 100) * 0.4
      meshRef.current.scale.setScalar(scale)
    }
  })

  // Color based on wellness score
  const getPopColor = () => {
    if (wellnessScore >= 80) return '#4ade80' // Green - Excellent
    if (wellnessScore >= 60) return '#60a5fa' // Blue - Good
    if (wellnessScore >= 40) return '#fbbf24' // Yellow - Fair
    return '#f87171' // Red - Poor
  }

  return (
    <group>
      {/* Main Pop Body */}
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        position={[0, 1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={getPopColor()} 
          emissive={hovered ? '#ffffff' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.1, 16, 16]} position={[-0.15, 1.1, 0.4]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.1, 16, 16]} position={[0.15, 1.1, 0.4]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      
      {/* Pupils */}
      <Sphere args={[0.05, 16, 16]} position={[-0.15, 1.1, 0.45]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.05, 16, 16]} position={[0.15, 1.1, 0.45]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      
      {/* Smile */}
      <Cylinder args={[0.2, 0.2, 0.05, 16]} position={[0, 0.8, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#000000" />
      </Cylinder>
      
      {/* Arms */}
      <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color={getPopColor()} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.6, 8]} position={[0.4, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color={getPopColor()} />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder args={[0.05, 0.05, 0.4, 8]} position={[-0.15, 0.2, 0]}>
        <meshStandardMaterial color={getPopColor()} />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.4, 8]} position={[0.15, 0.2, 0]}>
        <meshStandardMaterial color={getPopColor()} />
      </Cylinder>
    </group>
  )
}

// 3D World Environment
function WorldEnvironment() {
  return (
    <>
      {/* Ground */}
      <Box args={[20, 0.1, 20]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#4ade80" />
      </Box>
      
      {/* Trees */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 15,
          0,
          (Math.random() - 0.5) * 15
        ]}>
          <Cylinder args={[0.2, 0.2, 2, 8]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Sphere args={[1, 16, 16]} position={[0, 2.5, 0]}>
            <meshStandardMaterial color="#22c55e" />
          </Sphere>
        </group>
      ))}
      
      {/* Flowers */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={i} position={[
          (Math.random() - 0.5) * 18,
          0.1,
          (Math.random() - 0.5) * 18
        ]}>
          <Cylinder args={[0.02, 0.02, 0.3, 8]} position={[0, 0.15, 0]}>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Sphere args={[0.1, 8, 8]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][i % 4]} />
          </Sphere>
        </group>
      ))}
      
      {/* Health Status Text */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Your Pop World! 🌟
      </Text>
    </>
  )
}

// Main 3D World Component
export const PopWorld: React.FC = () => {
  const { currentAvatar } = useSelector((state: RootState) => state.avatar)
  
  // Create sample health data for the pop
  const sampleHealthData = {
    wellnessScore: currentAvatar?.wellnessScore || 50,
    mood: currentAvatar?.emotions?.current || 'neutral'
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-400 to-green-400">
      <div className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm rounded-lg p-4">
        <h2 className="text-white font-bold text-lg mb-2">Your Pop World 🌍</h2>
        <p className="text-white text-sm">
          Wellness Score: {sampleHealthData.wellnessScore}/100
        </p>
        <p className="text-white text-sm">
          Mood: {sampleHealthData.mood}
        </p>
      </div>
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* World */}
          <WorldEnvironment />
          
          {/* Pop Character */}
          <PopCharacter healthData={sampleHealthData} />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-lg p-4">
        <p className="text-white text-center text-sm">
          🎮 Use mouse to rotate, scroll to zoom, drag to pan around your pop world!
        </p>
      </div>
    </div>
  )
}