/**
 * 🎮 Hunyuan3D 3D Generation Service
 * 
 * Free 3D generation using Tencent's Hunyuan3D model
 * High-quality image-to-3D and text-to-3D generation
 */

export interface Hunyuan3DResult {
  success: boolean
  modelUrl?: string
  taskId?: string
  status?: 'pending' | 'processing' | 'succeeded' | 'failed'
  progress?: number
  error?: string
}

export class Hunyuan3DService {
  private static readonly HF_API_URL = 'https://api-inference.huggingface.co/models/Tencent/Hunyuan3D'
  private static readonly HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN || ''

  /**
   * Generate 3D model from image using Hunyuan3D via Hugging Face
   */
  static async imageToModel(imageData: string, prompt?: string): Promise<Hunyuan3DResult> {
    try {
      console.log('🎮 Starting Hunyuan3D 3D generation via Hugging Face...')
      console.log('🖼️ Image data length:', imageData.length)

      if (!this.HF_TOKEN) {
        return {
          success: false,
          error: 'Hugging Face token required for Hunyuan3D generation'
        }
      }

      const response = await fetch(this.HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            image: imageData,
            prompt: prompt || 'A detailed 3D character model, high quality, game-ready'
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Hunyuan3D API error:', response.status, errorText)
        return {
          success: false,
          error: `Hunyuan3D API error: ${response.status} - ${errorText}`
        }
      }

      const result = await response.json()
      console.log('✅ Hunyuan3D 3D generation successful:', result)

      // Hunyuan3D returns a high-quality 3D model file
      const modelBlob = new Blob([result], { type: 'application/octet-stream' })
      const modelUrl = URL.createObjectURL(modelBlob)

      return {
        success: true,
        modelUrl: modelUrl,
        taskId: Date.now().toString(),
        status: 'succeeded'
      }

    } catch (error) {
      console.error('❌ Error generating Hunyuan3D 3D model:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate 3D model from text prompt using Hunyuan3D
   */
  static async textToModel(prompt: string): Promise<Hunyuan3DResult> {
    try {
      console.log('🎮 Starting Hunyuan3D text-to-3D generation...')
      console.log('📝 Prompt:', prompt)

      if (!this.HF_TOKEN) {
        return {
          success: false,
          error: 'Hugging Face token required for Hunyuan3D generation'
        }
      }

      const response = await fetch(this.HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            prompt: prompt
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Hunyuan3D API error:', response.status, errorText)
        return {
          success: false,
          error: `Hunyuan3D API error: ${response.status} - ${errorText}`
        }
      }

      const result = await response.json()
      console.log('✅ Hunyuan3D text-to-3D generation successful:', result)

      const modelBlob = new Blob([result], { type: 'application/octet-stream' })
      const modelUrl = URL.createObjectURL(modelBlob)

      return {
        success: true,
        modelUrl: modelUrl,
        taskId: Date.now().toString(),
        status: 'succeeded'
      }

    } catch (error) {
      console.error('❌ Error generating Hunyuan3D text-to-3D model:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate 3D model from character image
   */
  static async generateCharacterModel(imageData: string, characterData: {
    name: string
    rpgClass?: { name: string }
  }): Promise<Hunyuan3DResult> {
    const prompt = `A high-quality 3D character model of ${characterData.name}, a ${characterData.rpgClass?.name || 'character'}. Detailed geometry, realistic textures, game-ready 3D model with clean topology.`

    return this.imageToModel(imageData, prompt)
  }

  /**
   * Generate 3D model from character description
   */
  static async generateCharacterFromDescription(characterData: {
    name: string
    age: number
    gender: string
    rpgClass?: { name: string; description: string }
  }): Promise<Hunyuan3DResult> {
    const prompt = `A detailed 3D character model of ${characterData.name}, a ${characterData.age}-year-old ${characterData.gender} ${
      characterData.rpgClass ? characterData.rpgClass.name : 'adventurer'
    }. ${characterData.rpgClass?.description || ''} High-quality 3D model with realistic textures and detailed geometry.`

    return this.textToModel(prompt)
  }
}