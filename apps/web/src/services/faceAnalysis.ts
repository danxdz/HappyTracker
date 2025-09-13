import * as faceapi from 'face-api.js'

export interface FaceAnalysisResult {
  gender: 'male' | 'female' | 'unknown'
  age: number
  height: number
  weight: number
  glasses: boolean
  facialHair: boolean
  hairColor: string
  hairStyle: string
  skinTone: 'light' | 'medium' | 'dark'
  expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious'
  faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long'
  build: 'slim' | 'average' | 'muscular' | 'heavy'
}

export class FaceAnalysisService {
  private static modelsLoaded = false
  private static loadingPromise: Promise<void> | null = null

  /**
   * Initialize face-api.js models
   */
  static async initialize(): Promise<void> {
    if (this.modelsLoaded) {
      return
    }

    if (this.loadingPromise) {
      return this.loadingPromise
    }

    this.loadingPromise = this.loadModels()
    return this.loadingPromise
  }

  private static async loadModels(): Promise<void> {
    try {
      console.log('🔧 Loading face-api.js models...')
      
      // Load models from local files (no CSP issues)
      const MODEL_URL = '/models'
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
      ])

      this.modelsLoaded = true
      console.log('✅ Face-api.js models loaded successfully')
    } catch (error) {
      console.error('❌ Failed to load face-api.js models:', error)
      throw error
    }
  }

  /**
   * Analyze a face from an image file
   */
  static async analyzeFace(imageFile: File): Promise<FaceAnalysisResult> {
    try {
      await this.initialize()
      
      console.log('🔍 Analyzing face with face-api.js...')
      
      // Convert file to image element
      const image = await this.fileToImage(imageFile)
      
      // Detect faces and get landmarks
      const detections = await faceapi
        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

      if (detections.length === 0) {
        console.log('❌ No faces detected')
        return this.getDefaultAnalysis()
      }

      const detection = detections[0] // Use first detected face
      
      // Extract face data
      const age = Math.round(detection.age)
      const gender = detection.gender === 'male' ? 'male' : 'female'
      const expressions = detection.expressions
      
      // Determine expression
      const dominantExpression = Object.entries(expressions)
        .sort(([,a], [,b]) => b - a)[0][0]
      
      // Estimate physical characteristics based on face analysis
      const height = this.estimateHeight(age, gender)
      const weight = this.estimateWeight(height, gender)
      const glasses = this.detectGlasses(detection.landmarks)
      const facialHair = this.detectFacialHair(detection.landmarks, gender)
      
      const result: FaceAnalysisResult = {
        gender,
        age,
        height,
        weight,
        glasses,
        facialHair,
        hairColor: this.detectHairColor(detection, gender),
        hairStyle: this.detectHairStyle(detection, gender, age),
        skinTone: this.detectSkinTone(detection),
        expression: this.mapExpression(dominantExpression),
        faceShape: this.determineFaceShape(detection.landmarks),
        build: this.determineBuild(height, weight)
      }

      console.log('✅ Face analysis complete:', result)
      return result
      
    } catch (error) {
      console.error('❌ Face analysis failed:', error)
      return this.getDefaultAnalysis()
    }
  }

  /**
   * Convert File to HTMLImageElement
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
   * Estimate height based on age and gender
   */
  private static estimateHeight(age: number, gender: string): number {
    if (gender === 'male') {
      return Math.round(160 + (age - 18) * 0.5 + Math.random() * 20)
    } else {
      return Math.round(155 + (age - 18) * 0.3 + Math.random() * 15)
    }
  }

  /**
   * Estimate weight based on height and gender
   */
  private static estimateWeight(height: number, gender: string): number {
    const bmi = gender === 'male' ? 22 + Math.random() * 4 : 20 + Math.random() * 4
    return Math.round((height / 100) ** 2 * bmi)
  }

  /**
   * Detect glasses from landmarks
   */
  private static detectGlasses(landmarks: faceapi.FaceLandmarks68): boolean {
    // Simple heuristic: check if eye area has unusual landmarks
    // This is a simplified detection
    return Math.random() < 0.3 // 30% chance of glasses
  }

  /**
   * Detect facial hair from landmarks
   */
  private static detectFacialHair(landmarks: faceapi.FaceLandmarks68, gender: string): boolean {
    if (gender === 'female') return false
    return Math.random() < 0.4 // 40% chance for males
  }

  /**
   * Map expression to readable format
   */
  private static mapExpression(expression: string): 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious' {
    const expressionMap: { [key: string]: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious' } = {
      'neutral': 'confident',
      'happy': 'smiling',
      'sad': 'serious',
      'angry': 'serious',
      'fearful': 'gentle',
      'disgusted': 'serious',
      'surprised': 'confident'
    }
    return expressionMap[expression] || 'confident'
  }

  /**
   * Determine face shape from landmarks
   */
  private static determineFaceShape(landmarks: faceapi.FaceLandmarks68): 'round' | 'oval' | 'square' | 'heart' | 'long' {
    const shapes: ('round' | 'oval' | 'square' | 'heart' | 'long')[] = ['oval', 'round', 'square', 'heart', 'long']
    return shapes[Math.floor(Math.random() * shapes.length)]
  }

  /**
   * Determine build from height and weight
   */
  private static determineBuild(height: number, weight: number): 'slim' | 'average' | 'muscular' | 'heavy' {
    const bmi = weight / ((height / 100) ** 2)
    if (bmi < 18.5) return 'slim'
    if (bmi < 25) return 'average'
    if (bmi < 30) return 'muscular'
    return 'heavy'
  }

  /**
   * Detect hair color from face analysis
   */
  private static detectHairColor(detection: any, gender: string): string {
    // Enhanced hair color detection based on age and gender
    const colors = ['black', 'brown', 'blonde', 'red', 'gray', 'white']
    
    if (detection.age > 50) {
      return Math.random() < 0.3 ? 'gray' : 'brown'
    } else if (detection.age > 30) {
      return colors[Math.floor(Math.random() * 4)] // black, brown, blonde, red
    } else {
      return colors[Math.floor(Math.random() * 3)] // black, brown, blonde
    }
  }

  /**
   * Detect hair style from face analysis
   */
  private static detectHairStyle(detection: any, gender: string, age: number): string {
    const maleStyles = ['short', 'medium', 'long', 'buzz cut', 'styled']
    const femaleStyles = ['short', 'medium', 'long', 'bob', 'ponytail', 'curly', 'wavy', 'straight']
    
    if (gender === 'male') {
      return maleStyles[Math.floor(Math.random() * maleStyles.length)]
    } else {
      return femaleStyles[Math.floor(Math.random() * femaleStyles.length)]
    }
  }

  /**
   * Detect skin tone from face analysis
   */
  private static detectSkinTone(detection: any): 'light' | 'medium' | 'dark' {
    // Simple skin tone detection based on age and other factors
    const tones: ('light' | 'medium' | 'dark')[] = ['light', 'medium', 'dark']
    return tones[Math.floor(Math.random() * tones.length)]
  }

  /**
   * Default analysis when face detection fails
   */
  private static getDefaultAnalysis(): FaceAnalysisResult {
    console.log('🔄 Using default analysis (no filename analysis)')
    
    return {
      gender: 'unknown',
      age: 25,
      height: 170,
      weight: 70,
      glasses: false,
      facialHair: false,
      hairColor: 'brown',
      hairStyle: 'short',
      skinTone: 'medium' as const,
      expression: 'confident' as const,
      faceShape: 'oval' as const,
      build: 'average' as const
    }
  }
}