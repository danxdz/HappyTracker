/**
 * 🎮 3D Character Viewer Component
 * 
 * Displays 3D character models using Three.js
 */

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface ThreeDViewerProps {
  modelUrl?: string
  width?: number
  height?: number
  autoRotate?: boolean
  className?: string
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  modelUrl,
  width = 400,
  height = 400,
  autoRotate = true,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<any>(null)
  const animationIdRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add a simple placeholder model if no model URL provided
    if (!modelUrl) {
      createPlaceholderModel(scene)
    }

    // Mount renderer
    mountRef.current.appendChild(renderer.domElement)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (autoRotate && scene.children.length > 0) {
        // Find the main model and rotate it
        const model = scene.children.find(child => child.type === 'Group' || child.type === 'Mesh')
        if (model) {
          model.rotation.y += 0.01
        }
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [width, height, autoRotate])

  useEffect(() => {
    if (modelUrl && sceneRef.current) {
      loadModel(modelUrl)
    }
  }, [modelUrl])

  const createPlaceholderModel = (scene: THREE.Scene) => {
    // Create a simple character placeholder
    const group = new THREE.Group()

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16)
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 1.2
    head.castShadow = true
    group.add(head)

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8)
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2 })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 0.4
    body.castShadow = true
    group.add(body)

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8)
    const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac })
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.3, 0.6, 0)
    leftArm.rotation.z = Math.PI / 4
    leftArm.castShadow = true
    group.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.3, 0.6, 0)
    rightArm.rotation.z = -Math.PI / 4
    rightArm.castShadow = true
    group.add(rightArm)

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8)
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x2c3e50 })
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.1, -0.4, 0)
    leftLeg.castShadow = true
    group.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.1, -0.4, 0)
    rightLeg.castShadow = true
    group.add(rightLeg)

    scene.add(group)
    setIsLoading(false)
  }

  const loadModel = async (url: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Clear existing models
      if (sceneRef.current) {
        const models = sceneRef.current.children.filter(child => 
          child.type === 'Group' || child.type === 'Mesh'
        )
        models.forEach(model => sceneRef.current!.remove(model))
      }

      // Load model data
      const response = await fetch(url)
      const modelData = await response.json()

      // Create model from data
      const model = createModelFromData(modelData)
      if (sceneRef.current) {
        sceneRef.current.add(model)
      }

      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load 3D model:', err)
      setError('Failed to load 3D model')
      setIsLoading(false)
    }
  }

  const createModelFromData = (data: any): THREE.Group => {
    const group = new THREE.Group()

    // Create geometry from data
    const geometry = new THREE.BufferGeometry()
    if (data.geometry) {
      // For now, create a simple geometry since fromJSON is not available
      const vertices = new Float32Array([
        -1, -1, 0,  1, -1, 0,  1, 1, 0,
        -1, -1, 0,  1, 1, 0,  -1, 1, 0
      ])
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    }

    // Create material from data
    let material: THREE.Material
    if (data.material) {
      // For now, create a simple material since fromJSON is not available
      material = new THREE.MeshLambertMaterial({ color: 0x4a90e2 })
    } else {
      material = new THREE.MeshLambertMaterial({ color: 0x4a90e2 })
    }

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    group.add(mesh)
    return group
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mountRef} 
        className="rounded-lg overflow-hidden shadow-lg"
        style={{ width, height }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading 3D Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          3D Model
        </div>
      )}
    </div>
  )
}