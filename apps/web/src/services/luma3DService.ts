/**
 * 🎮 Luma AI Genie 3D Generation Service
 * 
 * Free text-to-3D generation using Luma AI's Genie model
 * Alternative to Meshy for free 3D generation
 */

export interface Luma3DResult {
  success: boolean
  modelUrl?: string
  taskId?: string
  status?: 'pending' | 'processing' | 'succeeded' | 'failed'
  progress?: number
  error?: string
}

export class Luma3DService {
  private static readonly LUMA_API_URL = 'https://api.lumalabs.ai/v1/generate'

  /**
   * Generate 3D model from text prompt using Luma AI Genie
   */
  static async textToModel(prompt: string): Promise<Luma3DResult> {
    try {
      console.log('🎮 Starting Luma AI Genie 3D generation...')
      console.log('📝 Prompt:', prompt)

      const response = await fetch(this.LUMA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'genie',
          quality: 'standard'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Luma API error:', response.status, errorText)
        return {
          success: false,
          error: `Luma API error: ${response.status} - ${errorText}`
        }
      }

      const result = await response.json()
      console.log('✅ Luma 3D generation successful:', result)

      return {
        success: true,
        modelUrl: result.model_url,
        taskId: result.task_id,
        status: result.status,
        progress: result.progress
      }

    } catch (error) {
      console.error('❌ Error generating Luma 3D model:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate 3D model from character description
   */
  static async generateCharacterModel(characterData: {
    name: string
    age: number
    gender: string
    rpgClass?: { name: string; description: string }
  }): Promise<Luma3DResult> {
    const prompt = `A 3D character model of ${characterData.name}, a ${characterData.age}-year-old ${characterData.gender} ${
      characterData.rpgClass ? characterData.rpgClass.name : 'adventurer'
    }. ${characterData.rpgClass?.description || ''} Stylized 3D game character, clean topology, game-ready model.`

    return this.textToModel(prompt)
  }
}