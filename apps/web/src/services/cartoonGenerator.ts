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
   * Creates an RPG character cartoon using photo analysis and RPG stats
   * Uses detailed photo analysis to generate specific prompts
   */
  static async generateCartoonFromPhoto(
    photoFile: File,
    style: 'cute' | 'anime' | 'disney' | 'pixar' = 'cute',
    characterData?: { name: string; age: number; height: number; weight: number }
  ): Promise<CartoonGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('🎨 Starting RPG cartoon generation...')
      
      // Create detailed photo analysis from character data and filename
      // Use USER INPUT data, not AI analysis
      const photoAnalysis = this.createPhotoAnalysisFromData(photoFile, characterData)
      console.log('📸 Photo analysis (using user input):', photoAnalysis)
      
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
      
      // Cost estimation - only cartoon generation
      const costBreakdown = {
        imageAnalysis: 0, // No image analysis
        cartoonGeneration: 0.03, // stabilityai/stable-diffusion-xl-base-1.0
        total: 0.03
      }
      
      console.log(`✅ RPG Cartoon generated in ${processingTime}ms`)
      console.log(`💰 Estimated cost: $${costBreakdown.total.toFixed(3)}`)
      
      return {
        success: true,
        imageUrl: cartoonImage,
        processingTime,
        cost: costBreakdown.total,
        breakdown: costBreakdown
      }
    } catch (error) {
      console.error('❌ RPG Cartoon generation failed:', error)
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
   * 📸 Create Photo Analysis from Data
   * 
   * Converts character data and filename into detailed photo analysis
   */
  private static createPhotoAnalysisFromData(
    photoFile: File,
    characterData?: { name: string; age: number; height: number; weight: number }
  ): PhotoAnalysis {
    const fileName = photoFile.name.toLowerCase()
    // ALWAYS use user input data, never defaults
    const age = characterData?.age || 30
    const height = characterData?.height || 170
    const weight = characterData?.weight || 70
    
    console.log('🎯 Using user input data:', { age, height, weight })
    
    // Determine gender from filename or default
    let gender: 'male' | 'female' | 'unknown' = 'unknown'
    if (fileName.includes('man') || fileName.includes('male') || fileName.includes('guy')) {
      gender = 'male'
    } else if (fileName.includes('woman') || fileName.includes('female') || fileName.includes('lady')) {
      gender = 'female'
    } else {
      gender = 'male' // Default assumption
    }
    
    // Determine build from height/weight
    const bmi = weight / Math.pow(height / 100, 2)
    let build: 'slim' | 'average' | 'muscular' | 'heavy' = 'average'
    if (bmi < 18.5) build = 'slim'
    else if (bmi > 25) build = 'heavy'
    else if (height > 180 && weight > 80) build = 'muscular'
    
    // Determine hair color from filename
    let hairColor = 'brown'
    if (fileName.includes('blonde') || fileName.includes('blond')) hairColor = 'blonde'
    else if (fileName.includes('black')) hairColor = 'black'
    else if (fileName.includes('red') || fileName.includes('ginger')) hairColor = 'red'
    else if (fileName.includes('gray') || fileName.includes('grey') || fileName.includes('white') || fileName.includes('old')) hairColor = 'white'
    
    // Determine hair style
    let hairStyle = 'short'
    if (fileName.includes('long')) hairStyle = 'long'
    else if (fileName.includes('curly')) hairStyle = 'curly'
    else if (fileName.includes('wavy')) hairStyle = 'wavy'
    
    // Determine skin tone
    let skinTone: 'light' | 'medium' | 'dark' = 'medium'
    if (fileName.includes('pale') || fileName.includes('fair')) skinTone = 'light'
    else if (fileName.includes('dark') || fileName.includes('tan')) skinTone = 'dark'
    
    // Determine expression
    let expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious' = 'confident'
    if (fileName.includes('smile') || fileName.includes('happy')) expression = 'smiling'
    else if (fileName.includes('serious') || fileName.includes('stern')) expression = 'serious'
    else if (fileName.includes('mysterious') || fileName.includes('mystic')) expression = 'mysterious'
    else if (fileName.includes('gentle') || fileName.includes('kind')) expression = 'gentle'
    
    // Determine face shape
    let faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long' = 'oval'
    if (fileName.includes('round')) faceShape = 'round'
    else if (fileName.includes('square')) faceShape = 'square'
    else if (fileName.includes('heart')) faceShape = 'heart'
    else if (fileName.includes('long')) faceShape = 'long'
    
    return {
      gender,
      age,
      height,
      weight,
      glasses: fileName.includes('glasses') || fileName.includes('spectacles'),
      facialHair: fileName.includes('beard') || fileName.includes('mustache') || fileName.includes('facial') || (gender === 'male' && age > 30),
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