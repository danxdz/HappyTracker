import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Group } from 'three'

interface Model3DViewerProps {
  modelUrl?: string
  modelData?: string // Base64 GLB data
  className?: string
}

// Component to load and display GLB model
function Model({ modelData }: { modelData: string }) {
  const groupRef = useRef<Group>(null)
  
  // Check if this is fallback data (not a real GLB model)
  const isFallbackData = React.useMemo(() => {
    if (!modelData || typeof modelData !== 'string') return true
    
    // Check if it's a very small base64 string (likely fallback)
    let base64Data = modelData
    if (modelData.includes(',')) {
      base64Data = modelData.split(',')[1]
    } else if (modelData.startsWith('data:')) {
      base64Data = modelData.split(',')[1]
    }
    
    // If it's very small, it's probably fallback data
    return base64Data.length < 1000
  }, [modelData])
  
  // Convert base64 to blob URL for GLB loading
  const blob = React.useMemo(() => {
    if (isFallbackData) return null
    
    try {
      // Handle different base64 formats
      let base64Data = modelData
      if (modelData.includes(',')) {
        base64Data = modelData.split(',')[1]
      } else if (modelData.startsWith('data:')) {
        base64Data = modelData.split(',')[1]
      }
      
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      return new Blob([byteArray], { type: 'model/gltf-binary' })
    } catch (error) {
      console.error('Error converting base64 to blob:', error)
      return null
    }
  }, [modelData, isFallbackData])

  const objectUrl = React.useMemo(() => {
    if (!blob) return null
    return URL.createObjectURL(blob)
  }, [blob])

  // Only try to load GLB if we have a real model
  let scene = null
  try {
    if (objectUrl) {
      const gltfResult = useGLTF(objectUrl)
      scene = gltfResult.scene
    }
  } catch (error) {
    console.warn('Failed to load GLB model:', error)
    scene = null
  }

  // Auto-rotate the model
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  React.useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [objectUrl])

  // If we have fallback data or no valid object URL, show placeholder
  if (isFallbackData || !objectUrl) {
    return (
      <group ref={groupRef}>
        {/* Animal Crossing style placeholder character */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.6, 0.4]} />
          <meshStandardMaterial color="#FFB6C1" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.6]} />
          <meshStandardMaterial color="#FFDBB5" />
        </mesh>
        <mesh position={[-0.3, 1.2, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        <mesh position={[0.3, 1.2, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef}>
      {scene && <primitive object={scene} scale={[1, 1, 1]} />}
    </group>
  )
}

// Fallback component when no model is available
function PlaceholderModel() {
  const meshRef = useRef<Group>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>
    </group>
  )
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ 
  modelUrl, 
  modelData, 
  className = "w-full h-64" 
}) => {
  const hasModel = modelUrl || modelData

  return (
    <div className={`${className} bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          // Handle WebGL context lost
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            console.warn('WebGL context lost, preventing default')
            event.preventDefault()
          })
          
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored')
          })
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Model or Placeholder */}
          {hasModel ? (
            <Model modelData={modelData || ''} />
          ) : (
            <PlaceholderModel />
          )}
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading indicator */}
      {!hasModel && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">No 3D model available</p>
          </div>
        </div>
      )}
      
      {/* Controls info */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}