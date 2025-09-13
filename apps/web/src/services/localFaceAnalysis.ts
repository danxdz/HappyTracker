import * as faceapi from 'face-api.js'
import * as tf from '@tensorflow/tfjs'

export interface FaceAnalysisResult {
  age: number
  gender: 'male' | 'female' | 'unknown'
  confidence: number
  faceDetected: boolean
}

/**
 * 🎯 Local Face Analysis Service
 * 
 * Uses face-api.js for completely free, local face analysis
 * No API keys, no external dependencies, runs in browser
 */
export class LocalFaceAnalysis {
  private static modelsLoaded = false
  private static loadingPromise: Promise<void> | null = null
  private static tfInitialized = false

  /**
   * 🔧 Initialize TensorFlow.js and face-api.js models
   */
  static async initialize(): Promise<void> {
    if (this.modelsLoaded) return
    if (this.loadingPromise) return this.loadingPromise

    console.log('🔧 Initializing TensorFlow.js and face-api.js models...')
    
    this.loadingPromise = this.initializeWithErrorHandling()
    await this.loadingPromise
    
    this.modelsLoaded = true
    console.log('✅ Face-api.js models loaded successfully')
  }

  /**
   * 🔧 Initialize with proper error handling
   */
  private static async initializeWithErrorHandling(): Promise<void> {
    try {
      // Initialize TensorFlow.js with proper backend
      await this.initializeTensorFlow()
      
      // Load face-api.js models
      await this.loadModels()
      
    } catch (error) {
      console.error('❌ Initialization failed:', error)
      throw new Error('Failed to initialize face analysis')
    }
  }

  /**
   * 🔧 Initialize TensorFlow.js with proper backend handling
   */
  private static async initializeTensorFlow(): Promise<void> {
    if (this.tfInitialized) return

    try {
      console.log('🔧 Initializing TensorFlow.js backend...')
      
      // Try to initialize WebGL backend first
      try {
        await tf.ready()
        console.log('✅ TensorFlow.js WebGL backend ready')
      } catch (webglError) {
        console.warn('⚠️ WebGL backend failed, trying CPU backend:', webglError)
        
        // Fallback to CPU backend
        await tf.setBackend('cpu')
        await tf.ready()
        console.log('✅ TensorFlow.js CPU backend ready')
      }
      
      this.tfInitialized = true
    } catch (error) {
      console.error('❌ TensorFlow.js initialization failed:', error)
      throw error
    }
  }

  /**
   * 📥 Load face-api.js models
   */
  private static async loadModels(): Promise<void> {
    try {
      // Load models from local public directory
      const MODEL_URL = '/models'
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
      ])
      
      console.log('📥 All face-api.js models loaded from local directory')
    } catch (error) {
      console.error('❌ Failed to load face-api.js models:', error)
      throw new Error('Failed to load face analysis models')
    }
  }

  /**
   * 🔍 Analyze face in image with robust error handling
   */
  static async analyzeFace(imageFile: File): Promise<FaceAnalysisResult> {
    try {
      await this.initialize()
      
      console.log('🔍 Analyzing face with face-api.js...')
      
      // Convert file to HTMLImageElement
      const image = await this.fileToImage(imageFile)
      
      // Detect faces with age and gender estimation
      const detections = await faceapi
        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withAgeAndGender()
      
      if (detections.length === 0) {
        console.log('❌ No faces detected')
        return {
          age: 30,
          gender: 'unknown',
          confidence: 0,
          faceDetected: false
        }
      }

      // Use the largest face (most likely the main subject)
      const mainFace = detections.reduce((largest, current) => 
        current.detection.box.area > largest.detection.box.area ? current : largest
      )

      const age = Math.round(mainFace.age)
      const gender = mainFace.gender === 'male' ? 'male' : 'female'
      const confidence = mainFace.detection.score

      console.log('🎯 Face analysis result:', { age, gender, confidence })

      return {
        age,
        gender,
        confidence,
        faceDetected: true
      }

    } catch (error) {
      console.error('❌ Face analysis failed:', error)
      
      // Check if it's a TensorFlow.js specific error
      if (error instanceof Error && error.message && error.message.includes('backend')) {
        console.warn('⚠️ TensorFlow.js backend error, using fallback analysis')
        return this.getFallbackAnalysis(imageFile)
      }
      
      return {
        age: 30,
        gender: 'unknown',
        confidence: 0,
        faceDetected: false
      }
    }
  }

  /**
   * 🔄 Fallback analysis when Face.js fails
   */
  private static async getFallbackAnalysis(imageFile: File): Promise<FaceAnalysisResult> {
    console.log('🔄 Using fallback analysis...')
    
    try {
      // Simple filename-based analysis as fallback
      const filename = imageFile.name.toLowerCase()
      
      // Basic age estimation based on filename patterns
      let estimatedAge = 30
      if (filename.includes('young') || filename.includes('teen')) {
        estimatedAge = 20
      } else if (filename.includes('old') || filename.includes('senior')) {
        estimatedAge = 50
      }
      
      // Basic gender estimation (very simple)
      let estimatedGender: 'male' | 'female' | 'unknown' = 'unknown'
      if (filename.includes('male') || filename.includes('man') || filename.includes('boy')) {
        estimatedGender = 'male'
      } else if (filename.includes('female') || filename.includes('woman') || filename.includes('girl')) {
        estimatedGender = 'female'
      }
      
      return {
        age: estimatedAge,
        gender: estimatedGender,
        confidence: 0.3, // Low confidence for fallback
        faceDetected: false
      }
    } catch (error) {
      console.error('❌ Fallback analysis also failed:', error)
      return {
        age: 30,
        gender: 'unknown',
        confidence: 0,
        faceDetected: false
      }
    }
  }

  /**
   * 🖼️ Convert File to HTMLImageElement
   */
  private static fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 🧹 Clean up TensorFlow.js resources and object URLs
   */
  static cleanup(): void {
    try {
      // Dispose of TensorFlow.js memory
      if (this.tfInitialized) {
        tf.disposeVariables()
        console.log('🧹 TensorFlow.js memory disposed')
      }
      
      // Reset initialization flags
      this.modelsLoaded = false
      this.tfInitialized = false
      this.loadingPromise = null
      
      console.log('🧹 Face analysis cleanup complete')
    } catch (error) {
      console.warn('⚠️ Cleanup warning:', error)
    }
  }
}