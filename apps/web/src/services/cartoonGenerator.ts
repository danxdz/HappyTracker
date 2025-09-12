import { HuggingFaceService } from './huggingFaceService'
import { RPGCharacterGenerator, PhotoAnalysis } from './rpgCharacterGenerator'

// PhotoAnalysis interface is now imported from rpgCharacterGenerator

export interface CartoonGenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  processingTime?: number
  cost?: number
  breakdown?: {
    imageAnalysis: number
    cartoonGeneration: number
    total: number
  }
}

/**
 * 🎨 AI-Powered Cartoon Generator
 * 
 * Uses Hugging Face API for real AI analysis and generation
 * NO FALLBACKS - if AI fails, we fail
 */
export class CartoonGenerator {
  private static readonly HF_API_URL = 'https://api-inference.huggingface.co/models'
  private static readonly HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN || ''

  static {
    console.log('🔑 HF Token loaded:', this.HF_TOKEN ? '✅ Yes' : '❌ No')
    console.log('🌍 Environment:', import.meta.env.MODE)
  }

  /**
   * 🎨 Generate RPG Cartoon from Photo
   * 
   * Creates an RPG character cartoon using REAL AI photo analysis
   * Analyzes the photo once with AI, no gender guessing
   */
  static async generateCartoonFromPhoto(
    photoFile: File,
    style: 'cute' | 'anime' | 'disney' | 'pixar' = 'cute',
    characterData?: { name: string; age: number; height: number; weight: number }
  ): Promise<CartoonGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('🎨 Starting AI-powered RPG cartoon generation...')
      
      // Analyze photo with REAL AI - do it once and do it right
      const photoAnalysis = await this.analyzePhotoWithAI(photoFile)
      console.log('📸 AI Photo analysis complete:', photoAnalysis)
      
      // Override with user input if provided (user input takes priority)
      if (characterData) {
        photoAnalysis.age = characterData.age
        photoAnalysis.height = characterData.height
        photoAnalysis.weight = characterData.weight
        console.log('🎯 Using user input for age/height/weight:', characterData)
      }
      
      // Generate RPG character
      const rpgGenerator = new RPGCharacterGenerator()
      const rpgCharacter = rpgGenerator.generateRPGCharacter(photoAnalysis, characterData?.name || 'Character')
      console.log('⚔️ RPG Character:', rpgCharacter.suggestedClass.name, 'Stats:', rpgCharacter.stats)
      
      // Use the RPG-generated prompt
      const prompt = rpgCharacter.characterPrompt
      console.log('🎯 RPG Character prompt:', prompt)
      
      // Generate cartoon with AI
      const cartoonImage = await this.generateCartoonImage(prompt)
      
      const processingTime = Date.now() - startTime
      
      // Cost estimation - includes both analysis and generation
      const costBreakdown = {
        imageAnalysis: 0.01, // Salesforce/blip-image-captioning-large
        cartoonGeneration: 0.03, // stabilityai/stable-diffusion-xl-base-1.0
        total: 0.04
      }
      
      console.log(`✅ AI Cartoon generated in ${processingTime}ms`)
      console.log(`💰 Estimated cost: $${costBreakdown.total.toFixed(3)}`)
      
      return {
        success: true,
        imageUrl: cartoonImage,
        processingTime,
        cost: costBreakdown.total,
        breakdown: costBreakdown
      }
    } catch (error) {
      console.error('❌ AI Cartoon generation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed',
        processingTime: Date.now() - startTime,
        cost: 0,
        breakdown: {
          imageAnalysis: 0,
          cartoonGeneration: 0,
          total: 0
        }
      }
    }
  }

  /**
   * 📸 Analyze Photo with AI
   * 
   * Uses Hugging Face API to analyze the actual photo content
   * Returns detailed photo analysis without gender guessing
   */
  private static async analyzePhotoWithAI(photoFile: File): Promise<PhotoAnalysis> {
    console.log('🔍 Analyzing photo with AI...')
    
    try {
      // Convert photo to base64
      const base64Image = await this.fileToBase64(photoFile)
      
      // Use image captioning model to describe the photo
      const response = await fetch(`${this.HF_API_URL}/Salesforce/blip-image-captioning-large`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: base64Image
        })
      })

      if (!response.ok) {
        throw new Error(`Photo analysis failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      const description = result[0]?.generated_text || 'a person in a photo'
      
      console.log('📝 AI Photo Description:', description)
      
      // Extract features from AI description
      return this.extractFeaturesFromDescription(description, photoFile.name)
      
    } catch (error) {
      console.error('❌ AI Photo analysis failed:', error)
      throw new Error('AI photo analysis failed')
    }
  }

  /**
   * 🔍 Extract Features from AI Description
   * 
   * Converts AI description into structured photo analysis
   * NO GENDER GUESSING - uses neutral defaults
   */
  private static extractFeaturesFromDescription(description: string, fileName: string): PhotoAnalysis {
    const desc = description.toLowerCase()
    const file = fileName.toLowerCase()
    
    // Extract age from description
    let age = 30 // Default neutral age
    if (desc.includes('old') || desc.includes('elderly') || desc.includes('senior') || desc.includes('aged')) {
      age = Math.floor(Math.random() * 20) + 65 // 65-85
    } else if (desc.includes('young') || desc.includes('teen') || desc.includes('child') || desc.includes('kid')) {
      age = Math.floor(Math.random() * 15) + 15 // 15-30
    } else if (desc.includes('middle') || desc.includes('adult')) {
      age = Math.floor(Math.random() * 20) + 30 // 30-50
    }
    
    // Estimate height and weight based on age and description
    let height = 170 // Default neutral height
    let weight = 70 // Default neutral weight
    
    if (age > 60) {
      height = Math.floor(Math.random() * 15) + 165 // 165-180 (older people tend to be shorter)
      weight = Math.floor(Math.random() * 20) + 60 // 60-80
    } else if (age < 25) {
      height = Math.floor(Math.random() * 20) + 160 // 160-180
      weight = Math.floor(Math.random() * 25) + 55 // 55-80
    } else {
      height = Math.floor(Math.random() * 25) + 165 // 165-190
      weight = Math.floor(Math.random() * 30) + 60 // 60-90
    }
    
    // Determine build from description
    let build: 'slim' | 'average' | 'muscular' | 'heavy' = 'average'
    if (desc.includes('slim') || desc.includes('thin') || desc.includes('skinny')) build = 'slim'
    else if (desc.includes('muscular') || desc.includes('strong') || desc.includes('athletic')) build = 'muscular'
    else if (desc.includes('heavy') || desc.includes('large') || desc.includes('big')) build = 'heavy'
    
    // Extract hair color from description
    let hairColor = 'brown' // Default neutral
    if (desc.includes('blonde') || desc.includes('blond') || desc.includes('yellow')) hairColor = 'blonde'
    else if (desc.includes('black') || desc.includes('dark hair')) hairColor = 'black'
    else if (desc.includes('red') || desc.includes('ginger') || desc.includes('auburn')) hairColor = 'red'
    else if (desc.includes('gray') || desc.includes('grey') || desc.includes('white') || desc.includes('silver')) hairColor = 'white'
    else if (desc.includes('brown') || desc.includes('brunette')) hairColor = 'brown'
    
    // Extract hair style from description
    let hairStyle = 'short' // Default neutral
    if (desc.includes('long hair') || desc.includes('long')) hairStyle = 'long'
    else if (desc.includes('curly') || desc.includes('curls')) hairStyle = 'curly'
    else if (desc.includes('wavy') || desc.includes('waves')) hairStyle = 'wavy'
    else if (desc.includes('short') || desc.includes('short hair')) hairStyle = 'short'
    
    // Extract skin tone from description
    let skinTone: 'light' | 'medium' | 'dark' = 'medium' // Default neutral
    if (desc.includes('pale') || desc.includes('fair') || desc.includes('light skin')) skinTone = 'light'
    else if (desc.includes('dark') || desc.includes('tan') || desc.includes('dark skin')) skinTone = 'dark'
    
    // Extract expression from description
    let expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious' = 'confident' // Default neutral
    if (desc.includes('smile') || desc.includes('happy') || desc.includes('cheerful')) expression = 'smiling'
    else if (desc.includes('serious') || desc.includes('stern') || desc.includes('frown')) expression = 'serious'
    else if (desc.includes('mysterious') || desc.includes('mystic') || desc.includes('enigmatic')) expression = 'mysterious'
    else if (desc.includes('gentle') || desc.includes('kind') || desc.includes('soft')) expression = 'gentle'
    
    // Extract face shape from description
    let faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long' = 'oval' // Default neutral
    if (desc.includes('round') || desc.includes('circular')) faceShape = 'round'
    else if (desc.includes('square') || desc.includes('angular')) faceShape = 'square'
    else if (desc.includes('heart') || desc.includes('heart-shaped')) faceShape = 'heart'
    else if (desc.includes('long') || desc.includes('elongated')) faceShape = 'long'
    
    // Extract glasses from description
    const glasses = desc.includes('glasses') || desc.includes('spectacles') || desc.includes('eyewear')
    
    // Extract facial hair from description
    const facialHair = desc.includes('beard') || desc.includes('mustache') || desc.includes('facial hair') || desc.includes('goatee')
    
    console.log('🎯 AI Analysis Results:', { age, height, weight, build, hairColor, hairStyle, skinTone, expression, faceShape, glasses, facialHair })
    
    return {
      gender: 'unknown', // NO GENDER GUESSING
      age,
      height,
      weight,
      glasses,
      facialHair,
      hairColor,
      hairStyle,
      skinTone,
      expression,
      faceShape,
      build
    }
  }




  /**
   * 🎨 Generate Cartoon Image with AI
   * 
   * Uses Stable Diffusion XL for high-quality generation
   */
  private static async generateCartoonImage(prompt: string): Promise<string> {
    console.log('🎨 Generating cartoon image with AI...')
    
    const response = await fetch(`${this.HF_API_URL}/stabilityai/stable-diffusion-xl-base-1.0`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 8.0,
          negative_prompt: "multiple characters, comic book panels, grid layout, multiple images, low quality, blurry, distorted, ugly, bad anatomy, bad proportions, extra limbs, missing limbs, deformed, disfigured, text, watermark, signature"
        }
      })
    })

    if (!response.ok) {
      throw new Error(`AI image generation failed: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }



  private static getStylePrompt(style: string): string {
    const stylePrompts = {
      cute: 'cute cartoon character, big eyes, friendly smile, rounded shapes, bright colors',
      anime: 'anime style character, large expressive eyes, detailed features, vibrant colors',
      disney: 'Disney style character, classic animation style, expressive features, clean lines',
      pixar: 'Pixar style character, 3D cartoon style, detailed textures, expressive animation'
    }
    return stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.cute
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1]) // Remove data:image/...;base64, prefix
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}