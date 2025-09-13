/**
 * 🎮 Shap-E 3D Generation Service
 * 
 * Free image-to-3D generation using OpenAI's Shap-E model
 * Alternative to Meshy for free 3D generation
 */

export interface ShapEResult {
  success: boolean
  modelUrl?: string
  taskId?: string
  status?: 'pending' | 'processing' | 'succeeded' | 'failed'
  progress?: number
  error?: string
}

export class ShapEService {
  private static readonly SHAPE_API_URL = 'https://api.openai.com/v1/images/generations'

  /**
   * Generate 3D model from image using Shap-E
   */
  static async imageToModel(imageData: string, prompt?: string): Promise<ShapEResult> {
    try {
      console.log('🎮 Starting Shap-E 3D generation...')
      console.log('🖼️ Image data length:', imageData.length)

      // For now, we'll use a placeholder since Shap-E API access is limited
      // In a real implementation, you'd need OpenAI API access
      const response = await fetch(this.SHAPE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
        },
        body: JSON.stringify({
          model: 'shap-e',
          image: imageData,
          prompt: prompt || 'Generate a 3D model from this image',
          n: 1,
          size: '1024x1024'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Shap-E API error:', response.status, errorText)
        return {
          success: false,
          error: `Shap-E API error: ${response.status} - ${errorText}`
        }
      }

      const result = await response.json()
      console.log('✅ Shap-E 3D generation successful:', result)

      return {
        success: true,
        modelUrl: result.data?.[0]?.url,
        taskId: result.id,
        status: 'succeeded'
      }

    } catch (error) {
      console.error('❌ Error generating Shap-E 3D model:', error)
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
  }): Promise<ShapEResult> {
    const prompt = `Create a 3D model of ${characterData.name}, a ${characterData.rpgClass?.name || 'character'}. Game-ready 3D character model with clean topology.`

    return this.imageToModel(imageData, prompt)
  }
}