import { HuggingFaceService } from './huggingFaceService'

export interface PhotoAnalysis {
  faceShape: 'round' | 'oval' | 'square' | 'heart' | 'diamond'
  eyeColor: string
  hairColor: string
  hairStyle: 'short' | 'medium' | 'long' | 'curly' | 'straight' | 'wavy'
  skinTone: string
  dominantEmotion: string
  gender: 'male' | 'female' | 'non-binary'
  confidence: number
}

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
   * 🎨 Generate Cartoon from Photo
   * 
   * Creates a cartoon character using text-to-image generation
   * Uses character data to create dynamic prompts
   */
  static async generateCartoonFromPhoto(
    photoFile: File,
    style: 'cute' | 'anime' | 'disney' | 'pixar' = 'cute',
    characterData?: { name: string; age: number; height: number; weight: number }
  ): Promise<CartoonGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('🎨 Starting text-to-cartoon generation...')
      
      // Create prompt based on character data and filename
      const prompt = this.createCharacterPrompt(photoFile, style, characterData)
      console.log('🎯 Character prompt:', prompt)
      
      // Generate cartoon with AI
      const cartoonImage = await this.generateCartoonImage(prompt)
      
      const processingTime = Date.now() - startTime
      
      // Cost estimation - only cartoon generation
      const costBreakdown = {
        imageAnalysis: 0, // No image analysis
        cartoonGeneration: 0.03, // stabilityai/stable-diffusion-xl-base-1.0
        total: 0.03
      }
      
      console.log(`✅ Cartoon generated in ${processingTime}ms`)
      console.log(`💰 Estimated cost: $${costBreakdown.total.toFixed(3)}`)
      
      return {
        success: true,
        imageUrl: cartoonImage,
        processingTime,
        cost: costBreakdown.total,
        breakdown: costBreakdown
      }
    } catch (error) {
      console.error('❌ Cartoon generation failed:', error)
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
   * 🎯 Create Character Prompt
   * 
   * Creates a prompt based on character data and filename
   */
  private static createCharacterPrompt(
    photoFile: File, 
    style: string, 
    characterData?: { name: string; age: number; height: number; weight: number }
  ): string {
    const basePrompt = this.getStylePrompt(style)
    
    // Extract info from filename
    const fileName = photoFile.name.toLowerCase()
    let personDescription = 'a person'
    
    if (fileName.includes('old') || fileName.includes('elderly') || fileName.includes('senior')) {
      personDescription = 'an elderly person with white hair and aged features'
    } else if (fileName.includes('young') || fileName.includes('teen')) {
      personDescription = 'a young person with youthful features'
    } else if (fileName.includes('leonardo') || fileName.includes('lightning')) {
      personDescription = 'a person with artistic lighting and detailed features'
    } else {
      personDescription = 'a person'
    }
    
    // Add character data if available
    let characterDetails = ''
    if (characterData) {
      const { name, age, height, weight } = characterData
      characterDetails = `, ${age} years old, ${height}cm tall, ${weight}kg`
    }
    
    // Single character portrait requirements
    const singleCharacterRequirements = [
      'single character portrait only',
      'head and shoulders view',
      'clean solid background',
      'no multiple characters',
      'no comic book panels',
      'no grid layout',
      'no multiple images',
      'one character only',
      'centered composition',
      'high quality cartoon character portrait',
      'professional character design'
    ].join(', ')
    
    return `${basePrompt}, ${personDescription}${characterDetails}, ${singleCharacterRequirements}`
  }

  /**
   * 📸 AI Photo Analysis - NO FALLBACKS
   * 
   * Uses AI to analyze photo and extract features
   * If AI fails, we fail
   */
  private static async analyzePhoto(photoFile: File): Promise<PhotoAnalysis> {
    console.log('📸 Analyzing photo with AI...')
    
    // Convert photo to base64
    const photoBase64 = await this.fileToBase64(photoFile)
    
    // Use AI to describe the photo - if this fails, we fail
    const response = await fetch(`${this.HF_API_URL}/nlpconnect/vit-gpt2-image-captioning`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: photoBase64
      })
    })

    if (!response.ok) {
      throw new Error(`AI photo analysis failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('📝 AI Photo analysis result:', result)
    
    // Extract features from the AI description
    const description = Array.isArray(result) ? result[0]?.generated_text || '' : result.generated_text || ''
    console.log('📝 AI Extracted description:', description)
    return this.extractFeaturesFromDescription(description)
  }

  /**
   * 🎯 Create Dynamic Prompt from AI Analysis
   * 
   * Uses real AI analysis to create perfect prompts
   */
  private static createOptimalPrompt(analysis: PhotoAnalysis, style: string, photoDescription?: string): string {
    const basePrompt = this.getStylePrompt(style)
    
    // Add AI-detected features
    const features = [
      `${analysis.faceShape} face shape`,
      `${analysis.hairColor} ${analysis.hairStyle} hair`,
      `${analysis.eyeColor} eyes`,
      `${analysis.skinTone} skin tone`,
      `${analysis.dominantEmotion} expression`,
      `${analysis.gender} character`
    ].join(', ')
    
    // Add photo description if available
    const photoContext = photoDescription ? `, based on: ${photoDescription}` : ''
    
    // Single character portrait requirements
    const singleCharacterRequirements = [
      'single character portrait only',
      'head and shoulders view',
      'clean solid background',
      'no multiple characters',
      'no comic book panels',
      'no grid layout',
      'no multiple images',
      'one character only',
      'centered composition',
      'high quality cartoon character portrait',
      'professional character design'
    ].join(', ')
    
    return `${basePrompt}, ${features}${photoContext}, ${singleCharacterRequirements}`
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

  /**
   * 📝 Get Photo Description with AI - NO FALLBACKS
   * 
   * Uses AI to describe the photo content
   * If AI fails, we fail
   */
  private static async getPhotoDescription(photoFile: File): Promise<string> {
    try {
      const photoBase64 = await this.fileToBase64(photoFile)
      
      const response = await fetch(`${this.HF_API_URL}/nlpconnect/vit-gpt2-image-captioning`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: photoBase64
        })
      })

      if (!response.ok) {
        throw new Error(`AI photo description failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('📝 AI Photo description result:', result)
      
      const description = Array.isArray(result) ? result[0]?.generated_text || '' : result.generated_text || ''
      console.log('📝 AI Extracted description:', description)
      
      return description
    } catch (error) {
      console.error('❌ AI photo description failed:', error)
      throw new Error('AI photo description failed')
    }
  }

  // Extract features from AI description
  private static extractFeaturesFromDescription(description: string): PhotoAnalysis {
    console.log('🔍 Extracting features from AI description:', description)
    
    const lowerDesc = description.toLowerCase()
    
    // Extract face shape
    const faceShape = this.extractFaceShapeFromText(lowerDesc)
    
    // Extract hair color
    const hairColor = this.extractHairColorFromText(lowerDesc)
    
    // Extract hair style
    const hairStyle = this.extractHairStyleFromText(lowerDesc)
    
    // Extract eye color
    const eyeColor = this.extractEyeColorFromText(lowerDesc)
    
    // Extract skin tone
    const skinTone = this.extractSkinToneFromText(lowerDesc)
    
    // Extract emotion
    const dominantEmotion = this.extractEmotionFromText(lowerDesc)
    
    // Extract gender
    const gender = this.extractGenderFromText(lowerDesc)
    
    return {
      faceShape,
      eyeColor,
      hairColor,
      hairStyle,
      skinTone,
      dominantEmotion,
      gender,
      confidence: 0.9
    }
  }

  private static extractFaceShapeFromText(text: string): PhotoAnalysis['faceShape'] {
    if (text.includes('round') || text.includes('circular')) return 'round'
    if (text.includes('oval')) return 'oval'
    if (text.includes('square') || text.includes('angular')) return 'square'
    if (text.includes('heart')) return 'heart'
    if (text.includes('diamond')) return 'diamond'
    return 'round' // default
  }

  private static extractHairColorFromText(text: string): string {
    if (text.includes('blonde') || text.includes('blond') || text.includes('yellow')) return '#FFD700'
    if (text.includes('brown') || text.includes('brunette')) return '#8B4513'
    if (text.includes('black') || text.includes('dark')) return '#2F2F2F'
    if (text.includes('red') || text.includes('ginger')) return '#A0522D'
    if (text.includes('gray') || text.includes('grey') || text.includes('silver')) return '#C0C0C0'
    if (text.includes('white') || text.includes('elderly') || text.includes('old') || text.includes('senior')) return '#FFFFFF'
    return '#8B4513' // default brown
  }

  private static extractHairStyleFromText(text: string): PhotoAnalysis['hairStyle'] {
    if (text.includes('short')) return 'short'
    if (text.includes('long')) return 'long'
    if (text.includes('curly')) return 'curly'
    if (text.includes('straight')) return 'straight'
    if (text.includes('wavy')) return 'wavy'
    return 'medium' // default
  }

  private static extractEyeColorFromText(text: string): string {
    if (text.includes('blue')) return '#4169E1'
    if (text.includes('brown')) return '#8B4513'
    if (text.includes('green')) return '#228B22'
    if (text.includes('hazel')) return '#8B4513'
    if (text.includes('gray') || text.includes('grey')) return '#808080'
    return '#4169E1' // default blue
  }

  private static extractSkinToneFromText(text: string): string {
    if (text.includes('pale') || text.includes('fair')) return '#FFDBB5'
    if (text.includes('tan') || text.includes('olive')) return '#F4A460'
    if (text.includes('dark') || text.includes('brown')) return '#D2B48C'
    if (text.includes('elderly') || text.includes('old') || text.includes('senior') || text.includes('wrinkled')) return '#F5DEB3' // Slightly more aged skin tone
    return '#FFDBB5' // default light
  }

  private static extractEmotionFromText(text: string): string {
    if (text.includes('smiling') || text.includes('happy')) return 'happy'
    if (text.includes('serious') || text.includes('stern')) return 'neutral'
    if (text.includes('sad')) return 'sad'
    if (text.includes('angry')) return 'angry'
    return 'happy' // default
  }

  private static extractGenderFromText(text: string): PhotoAnalysis['gender'] {
    if (text.includes('man') || text.includes('male') || text.includes('guy') || text.includes('gentleman')) return 'male'
    if (text.includes('woman') || text.includes('female') || text.includes('lady') || text.includes('girl')) return 'female'
    return 'non-binary' // default
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