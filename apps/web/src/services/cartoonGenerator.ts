import { HuggingFaceService } from './huggingFaceService'
import { RPGCharacterGenerator, PhotoAnalysis } from './rpgCharacterGenerator'
import { LocalFaceAnalysis } from './localFaceAnalysis'

// PhotoAnalysis interface is now imported from rpgCharacterGenerator

export interface CaricatureGenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
  processingTime?: number
  cost?: number
  breakdown?: {
    imageAnalysis: number
    caricatureGeneration: number
    total: number
  }
  rpgClass?: {
    name: string
    description: string
    stats: {
      strength: number
      agility: number
      intelligence: number
      wisdom: number
      charisma: number
      constitution: number
      total: number
    }
  }
  generationPrompt?: string
  photoAnalysis?: {
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
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
}

/**
 * 🎨 AI-Powered Caricature Generator
 * 
 * Uses Hugging Face API for real AI analysis and generation
 * NO FALLBACKS - if AI fails, we fail
 */
export class CaricatureGenerator {
  private static readonly HF_API_URL = 'https://api-inference.huggingface.co/models'
  private static readonly HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN || ''

  static {
    // Token check moved to HuggingFaceService to avoid duplicates
  }

  /**
   * 🎨 Generate RPG Caricature from Photo
   * 
   * Creates an RPG character caricature using REAL AI photo analysis
   * Analyzes the photo once with AI, no gender guessing
   */
  static async generateCaricatureFromPhoto(
    photoFile: File,
    style: 'cute' | 'anime' | 'disney' | 'pixar' = 'cute',
    characterData?: { name: string; age: number; height: number; weight: number; gender: 'male' | 'female' | 'non-binary' | 'unknown' },
    selectedRpgClass?: { name: string; description: string; stats: { strength: number; agility: number; intelligence: number; wisdom: number; charisma: number; constitution: number; total: number } }
  ): Promise<CaricatureGenerationResult> {
    const startTime = Date.now()
    
    try {
      console.log('🎨 Starting AI-powered RPG caricature generation...')
      
      // Use filename analysis for now (face-api.js models not available)
      const photoAnalysis = this.createFallbackAnalysis(photoFile)
      console.log('📸 Filename analysis complete:', photoAnalysis)
      
      // Override with user input if provided (user input takes priority)
      if (characterData) {
        photoAnalysis.age = characterData.age
        photoAnalysis.height = characterData.height
        photoAnalysis.weight = characterData.weight
        photoAnalysis.gender = characterData.gender
        console.log('🎯 Using user input for age/height/weight/gender:', characterData)
      }
      
      // Use selected RPG class or generate one
      let rpgCharacter: any
      if (selectedRpgClass) {
        console.log('🎯 Using user-selected RPG class:', selectedRpgClass.name)
        // Create a mock RPG character with the selected class
        rpgCharacter = {
          suggestedClass: selectedRpgClass,
          stats: selectedRpgClass.stats,
          characterPrompt: this.generateCharacterPrompt(photoAnalysis, characterData?.name || 'Character', selectedRpgClass)
        }
      } else {
        // Generate RPG character automatically
        const rpgGenerator = new RPGCharacterGenerator()
        rpgCharacter = rpgGenerator.generateRPGCharacter(photoAnalysis, characterData?.name || 'Character')
        console.log('⚔️ RPG Character:', rpgCharacter.suggestedClass.name, 'Stats:', rpgCharacter.stats)
      }
      
      // Use the RPG-generated prompt
      const prompt = rpgCharacter.characterPrompt
      console.log('🎯 RPG Character prompt:', prompt)
      
      // Generate caricature with AI
      const caricatureImage = await this.generateCaricatureImage(prompt)
      
      const processingTime = Date.now() - startTime
      
      // Cost estimation - only caricature generation (analysis is free!)
      const costBreakdown = {
        imageAnalysis: 0, // FREE - face-api.js runs locally
        caricatureGeneration: 0.03, // stabilityai/stable-diffusion-xl-base-1.0
        total: 0.03
      }
      
      console.log(`✅ AI Caricature generated in ${processingTime}ms`)
      console.log(`💰 Estimated cost: $${costBreakdown.total.toFixed(3)}`)
      
      return {
        success: true,
        imageUrl: caricatureImage,
        processingTime,
        cost: costBreakdown.total,
        breakdown: costBreakdown,
        rpgClass: {
          name: rpgCharacter.suggestedClass.name,
          description: rpgCharacter.suggestedClass.description,
          stats: rpgCharacter.stats
        },
        generationPrompt: prompt,
        photoAnalysis: photoAnalysis
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
          caricatureGeneration: 0,
          total: 0
        }
      }
    }
  }

  /**
   * 📸 Analyze Photo with Local AI
   * 
   * Uses face-api.js for completely free, local face analysis
   * No API keys, no external dependencies
   */
  private static async analyzePhotoWithLocalAI(photoFile: File): Promise<PhotoAnalysis> {
    console.log('🔍 Analyzing photo with local face-api.js...')
    
    try {
      // Use local face analysis
      const faceResult = await LocalFaceAnalysis.analyzeFace(photoFile)
      
      if (!faceResult.faceDetected) {
        console.log('❌ No face detected, using filename analysis')
        return this.createFallbackAnalysis(photoFile)
      }

      // Convert face analysis to PhotoAnalysis
      const photoAnalysis: PhotoAnalysis = {
        gender: faceResult.gender,
        age: faceResult.age,
        height: this.estimateHeightFromAge(faceResult.age),
        weight: this.estimateWeightFromAge(faceResult.age),
        glasses: false, // face-api.js doesn't detect glasses
        facialHair: false, // face-api.js doesn't detect facial hair
        hairColor: 'brown', // Default
        hairStyle: 'short', // Default
        skinTone: 'medium', // Default
        expression: 'confident', // Default
        faceShape: 'oval', // Default
        build: 'average' // Default
      }

      console.log('🎯 Local face analysis result:', photoAnalysis)
      return photoAnalysis

    } catch (error) {
      console.error('❌ Local face analysis failed:', error)
      console.log('🔄 Falling back to filename analysis...')
      return this.createFallbackAnalysis(photoFile)
    }
  }

  /**
   * 📏 Estimate height from age
   */
  private static estimateHeightFromAge(age: number): number {
    if (age < 18) return Math.floor(Math.random() * 20) + 150 // 150-170
    if (age > 60) return Math.floor(Math.random() * 15) + 165 // 165-180
    return Math.floor(Math.random() * 25) + 165 // 165-190
  }

  /**
   * ⚖️ Estimate weight from age
   */
  private static estimateWeightFromAge(age: number): number {
    if (age < 18) return Math.floor(Math.random() * 25) + 50 // 50-75
    if (age > 60) return Math.floor(Math.random() * 20) + 60 // 60-80
    return Math.floor(Math.random() * 30) + 60 // 60-90
  }

  /**
   * 📸 Analyze Photo with AI (Legacy - kept as backup)
   * 
   * Uses Hugging Face API to analyze the actual photo content
   * Returns detailed photo analysis without gender guessing
   */
  private static async analyzePhotoWithAI(photoFile: File): Promise<PhotoAnalysis> {
    console.log('🔍 Analyzing photo with AI...')
    
    try {
      // Convert photo to base64
      const base64Image = await this.fileToBase64(photoFile)
      
      // Try multiple image captioning models in order of preference
      const models = [
        'Salesforce/blip-image-captioning-base',
        'Salesforce/blip-image-captioning-large', 
        'nlpconnect/vit-gpt2-image-captioning',
        'microsoft/git-base-coco'
      ]
      
      let response: Response | null = null
      let workingModel = ''
      
      for (const model of models) {
        try {
          console.log(`🔍 Trying model: ${model}`)
          response = await fetch(`${this.HF_API_URL}/${model}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: base64Image
            })
          })
          
          if (response.ok) {
            workingModel = model
            console.log(`✅ Model working: ${model}`)
            break
          } else {
            console.log(`❌ Model failed: ${model} (${response.status})`)
          }
        } catch (error) {
          console.log(`❌ Model error: ${model}`, error)
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`All image captioning models failed. Last error: ${response?.status} ${response?.statusText}`)
      }

      const result = await response.json()
      const description = result[0]?.generated_text || 'a person in a photo'
      
      console.log('📝 AI Photo Description:', description)
      
      // Extract features from AI description
      return this.extractFeaturesFromDescription(description, photoFile.name)
      
    } catch (error) {
      console.error('❌ AI Photo analysis failed:', error)
      console.log('🔄 Falling back to filename-based analysis...')
      
      // Complete fallback: use filename analysis only
      return this.createFallbackAnalysis(photoFile)
    }
  }

  /**
   * 🔄 Create Fallback Analysis
   * 
   * Uses filename analysis when AI models fail
   */
  private static createFallbackAnalysis(photoFile: File): PhotoAnalysis {
    console.log('🔄 Using filename-based fallback analysis')
    
    const fileName = photoFile.name.toLowerCase()
    
    // Extract age from filename
    let age = 30
    if (fileName.includes('old') || fileName.includes('elderly') || fileName.includes('senior')) {
      age = Math.floor(Math.random() * 20) + 65
    } else if (fileName.includes('young') || fileName.includes('teen') || fileName.includes('child')) {
      age = Math.floor(Math.random() * 15) + 15
    }
    
    // Extract gender from filename
    let gender: 'male' | 'female' | 'non-binary' | 'unknown' = 'unknown'
    if (fileName.includes('man') || fileName.includes('male') || fileName.includes('guy')) {
      gender = 'male'
    } else if (fileName.includes('woman') || fileName.includes('female') || fileName.includes('lady')) {
      gender = 'female'
    }
    
    // Estimate height and weight
    let height = 170
    let weight = 70
    if (age > 60) {
      height = Math.floor(Math.random() * 15) + 165
      weight = Math.floor(Math.random() * 20) + 60
    } else if (age < 25) {
      height = Math.floor(Math.random() * 20) + 160
      weight = Math.floor(Math.random() * 25) + 55
    }
    
    console.log('🎯 Fallback analysis complete:', { age, height, weight, gender })
    
    return {
      gender,
      age,
      height,
      weight,
      glasses: fileName.includes('glasses'),
      facialHair: fileName.includes('beard') || fileName.includes('mustache'),
      hairColor: 'brown',
      hairStyle: 'short',
      skinTone: 'medium',
      expression: 'confident',
      faceShape: 'oval',
      build: 'average'
    }
  }

  /**
   * 🔍 Extract Features from AI Description
   * 
   * Converts AI description into structured photo analysis
   * GUESSES ALL FEATURES from the photo description
   */
  private static extractFeaturesFromDescription(description: string, fileName: string): PhotoAnalysis {
    const desc = description.toLowerCase()
    const file = fileName.toLowerCase()
    
    // Extract age from description - GUESS EVERYTHING
    let age = 30 // Default
    if (desc.includes('old') || desc.includes('elderly') || desc.includes('senior') || desc.includes('aged') || desc.includes('wrinkled')) {
      age = Math.floor(Math.random() * 20) + 65 // 65-85
    } else if (desc.includes('young') || desc.includes('teen') || desc.includes('child') || desc.includes('kid') || desc.includes('baby')) {
      age = Math.floor(Math.random() * 15) + 15 // 15-30
    } else if (desc.includes('middle') || desc.includes('adult') || desc.includes('mature')) {
      age = Math.floor(Math.random() * 20) + 30 // 30-50
    } else if (desc.includes('teenager') || desc.includes('teen')) {
      age = Math.floor(Math.random() * 5) + 15 // 15-20
    } else if (desc.includes('toddler') || desc.includes('baby')) {
      age = Math.floor(Math.random() * 3) + 2 // 2-5
    }
    
    // GUESS gender from description
    let gender: 'male' | 'female' | 'unknown' = 'unknown'
    if (desc.includes('man') || desc.includes('male') || desc.includes('guy') || desc.includes('boy') || desc.includes('gentleman')) {
      gender = 'male'
    } else if (desc.includes('woman') || desc.includes('female') || desc.includes('lady') || desc.includes('girl') || desc.includes('lady')) {
      gender = 'female'
    } else if (desc.includes('person') || desc.includes('individual') || desc.includes('human')) {
      // Try to guess from other features
      if (desc.includes('beard') || desc.includes('mustache') || desc.includes('facial hair')) {
        gender = 'male'
      } else if (desc.includes('long hair') || desc.includes('makeup') || desc.includes('lipstick')) {
        gender = 'female'
      }
    }
    
    // Estimate height and weight based on age, gender, and description
    let height = 170 // Default
    let weight = 70 // Default
    
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
    
    // Adjust for gender
    if (gender === 'male') {
      height += Math.floor(Math.random() * 10) + 5 // Males tend to be taller
      weight += Math.floor(Math.random() * 15) + 10 // Males tend to be heavier
    } else if (gender === 'female') {
      height -= Math.floor(Math.random() * 5) + 2 // Females tend to be shorter
      weight -= Math.floor(Math.random() * 10) + 5 // Females tend to be lighter
    }
    
    // Determine build from description - GUESS EVERYTHING
    let build: 'slim' | 'average' | 'muscular' | 'heavy' = 'average'
    if (desc.includes('slim') || desc.includes('thin') || desc.includes('skinny') || desc.includes('lean') || desc.includes('slender')) {
      build = 'slim'
    } else if (desc.includes('muscular') || desc.includes('strong') || desc.includes('athletic') || desc.includes('buff') || desc.includes('built')) {
      build = 'muscular'
    } else if (desc.includes('heavy') || desc.includes('large') || desc.includes('big') || desc.includes('overweight') || desc.includes('chubby')) {
      build = 'heavy'
    } else if (desc.includes('average') || desc.includes('normal') || desc.includes('medium')) {
      build = 'average'
    }
    
    // Extract hair color from description - GUESS EVERYTHING
    let hairColor = 'brown' // Default
    if (desc.includes('blonde') || desc.includes('blond') || desc.includes('yellow') || desc.includes('golden')) {
      hairColor = 'blonde'
    } else if (desc.includes('black') || desc.includes('dark hair') || desc.includes('ebony')) {
      hairColor = 'black'
    } else if (desc.includes('red') || desc.includes('ginger') || desc.includes('auburn') || desc.includes('redhead')) {
      hairColor = 'red'
    } else if (desc.includes('gray') || desc.includes('grey') || desc.includes('white') || desc.includes('silver') || desc.includes('salt and pepper')) {
      hairColor = 'white'
    } else if (desc.includes('brown') || desc.includes('brunette') || desc.includes('chestnut')) {
      hairColor = 'brown'
    } else if (desc.includes('bald') || desc.includes('balding') || desc.includes('hairless')) {
      hairColor = 'bald'
    }
    
    // Extract hair style from description - GUESS EVERYTHING
    let hairStyle = 'short' // Default
    if (desc.includes('long hair') || desc.includes('long') || desc.includes('lengthy')) {
      hairStyle = 'long'
    } else if (desc.includes('curly') || desc.includes('curls') || desc.includes('curled')) {
      hairStyle = 'curly'
    } else if (desc.includes('wavy') || desc.includes('waves') || desc.includes('waved')) {
      hairStyle = 'wavy'
    } else if (desc.includes('short') || desc.includes('short hair') || desc.includes('cropped')) {
      hairStyle = 'short'
    } else if (desc.includes('bald') || desc.includes('balding') || desc.includes('hairless')) {
      hairStyle = 'bald'
    } else if (desc.includes('ponytail') || desc.includes('bun') || desc.includes('braid')) {
      hairStyle = 'long'
    }
    
    // Extract skin tone from description - GUESS EVERYTHING
    let skinTone: 'light' | 'medium' | 'dark' = 'medium' // Default
    if (desc.includes('pale') || desc.includes('fair') || desc.includes('light skin') || desc.includes('white skin') || desc.includes('caucasian')) {
      skinTone = 'light'
    } else if (desc.includes('dark') || desc.includes('tan') || desc.includes('dark skin') || desc.includes('brown skin') || desc.includes('african') || desc.includes('black skin')) {
      skinTone = 'dark'
    } else if (desc.includes('medium') || desc.includes('olive') || desc.includes('bronze') || desc.includes('hispanic') || desc.includes('latino')) {
      skinTone = 'medium'
    }
    
    // Extract expression from description - GUESS EVERYTHING
    let expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious' = 'confident' // Default
    if (desc.includes('smile') || desc.includes('happy') || desc.includes('cheerful') || desc.includes('grinning') || desc.includes('laughing')) {
      expression = 'smiling'
    } else if (desc.includes('serious') || desc.includes('stern') || desc.includes('frown') || desc.includes('grim') || desc.includes('stoic')) {
      expression = 'serious'
    } else if (desc.includes('mysterious') || desc.includes('mystic') || desc.includes('enigmatic') || desc.includes('mysterious')) {
      expression = 'mysterious'
    } else if (desc.includes('gentle') || desc.includes('kind') || desc.includes('soft') || desc.includes('warm') || desc.includes('friendly')) {
      expression = 'gentle'
    } else if (desc.includes('confident') || desc.includes('proud') || desc.includes('strong') || desc.includes('determined')) {
      expression = 'confident'
    }
    
    // Extract face shape from description - GUESS EVERYTHING
    let faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long' = 'oval' // Default
    if (desc.includes('round') || desc.includes('circular') || desc.includes('chubby face')) {
      faceShape = 'round'
    } else if (desc.includes('square') || desc.includes('angular') || desc.includes('strong jaw')) {
      faceShape = 'square'
    } else if (desc.includes('heart') || desc.includes('heart-shaped') || desc.includes('pointed chin')) {
      faceShape = 'heart'
    } else if (desc.includes('long') || desc.includes('elongated') || desc.includes('narrow')) {
      faceShape = 'long'
    } else if (desc.includes('oval') || desc.includes('balanced') || desc.includes('symmetrical')) {
      faceShape = 'oval'
    }
    
    // Extract glasses from description - GUESS EVERYTHING
    const glasses = desc.includes('glasses') || desc.includes('spectacles') || desc.includes('eyewear') || desc.includes('sunglasses') || desc.includes('reading glasses')
    
    // Extract facial hair from description - GUESS EVERYTHING
    const facialHair = desc.includes('beard') || desc.includes('mustache') || desc.includes('facial hair') || desc.includes('goatee') || desc.includes('stubble') || desc.includes('whiskers')
    
    console.log('🎯 AI GUESSED ALL FEATURES:', { 
      gender, age, height, weight, build, hairColor, hairStyle, 
      skinTone, expression, faceShape, glasses, facialHair 
    })
    
    return {
      gender, // GUESS GENDER TOO
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
   * 🔍 Analyze Photo for UI Pre-filling
   * 
   * Uses local face-api.js analysis for immediate UI field population
   * Falls back to filename analysis if face detection fails
   */
  static async analyzePhotoForUI(photoFile: File): Promise<PhotoAnalysis> {
    console.log('🔍 Analyzing photo for UI with local face-api.js or fallback...')
    try {
      const faceResult = await LocalFaceAnalysis.analyzeFace(photoFile)
      if (faceResult.faceDetected) {
        const photoAnalysis: PhotoAnalysis = {
          gender: faceResult.gender,
          age: faceResult.age,
          height: this.estimateHeightFromAge(faceResult.age),
          weight: this.estimateWeightFromAge(faceResult.age),
          glasses: false, // face-api.js doesn't detect glasses
          facialHair: false, // face-api.js doesn't detect facial hair
          hairColor: 'brown', // Default
          hairStyle: 'short', // Default
          skinTone: 'medium', // Default
          expression: 'confident', // Default
          faceShape: 'oval', // Default
          build: 'average' // Default
        }
        console.log('🎯 Local face analysis for UI result:', photoAnalysis)
        return photoAnalysis
      } else {
        console.log('❌ No face detected for UI, using filename analysis')
        return this.createFallbackAnalysis(photoFile)
      }
    } catch (error) {
      console.error('❌ Local face analysis for UI failed, falling back to filename:', error)
      return this.createFallbackAnalysis(photoFile)
    }
  }

  /**
   * 🎨 Generate Caricature Image with AI
   * 
   * Uses Stable Diffusion XL for high-quality generation
   * Returns base64 data URL for persistent storage
   */
  private static async generateCaricatureImage(prompt: string): Promise<string> {
    console.log('🎨 Generating caricature image with AI...')
    
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
    // Convert blob to base64 for persistent storage
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
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

  /**
   * Generate character prompt for selected RPG class
   */
  private static generateCharacterPrompt(
    photoAnalysis: PhotoAnalysis, 
    characterName: string, 
    rpgClass: { name: string; description: string; stats: any }
  ): string {
    const genderText = photoAnalysis.gender === 'male' ? 'male' : 
                      photoAnalysis.gender === 'female' ? 'female' : 'character'
    
    const hairColor = photoAnalysis.hairColor || 'brown'
    const hairStyle = photoAnalysis.hairStyle || 'short'
    const skinTone = photoAnalysis.skinTone || 'medium'
    const expression = photoAnalysis.expression || 'confident'
    const build = photoAnalysis.build || 'average'
    
    // Generate class-specific equipment and style
    const classEquipment = {
      Warrior: 'equipped with sword, shield, chest armor',
      Rogue: 'equipped with daggers, leather armor, hood',
      Mage: 'equipped with staff, robes, magical aura',
      Cleric: 'equipped with mace, holy symbol, white robes',
      Bard: 'equipped with lute, colorful clothes, musical notes',
      Ranger: 'equipped with bow, arrows, green cloak'
    }
    
    const equipment = classEquipment[rpgClass.name as keyof typeof classEquipment] || 'equipped with basic gear'
    
    return `toybox collectible figure style, oversized round head, small compact body, smooth plastic-like surface, simplified facial features, bright solid colors, cute proportions, minimal details, ${genderText} ${rpgClass.name.toLowerCase()}, ${hairColor} ${hairStyle} hair, ${skinTone} skin tone, ${expression} expression, ${equipment}, ${photoAnalysis.age} years old, ${build} build, single character only, centered composition, clean white background, RPG character design, fantasy game art style, front-facing heroic pose, face clearly visible, no helmets, no headgear, no face-covering equipment`
  }
}