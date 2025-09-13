/**
 * 🎮 Shap-E 3D Generation Service
 * 
 * Free image-to-3D generation using Hugging Face's Shap-E model
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
  private static readonly HF_API_URL = 'https://api-inference.huggingface.co/models/openai/shap-e-img2img'
  private static readonly HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN || ''

  /**
   * Generate 3D model from image using Shap-E via Hugging Face
   */
  static async imageToModel(imageData: string, prompt?: string): Promise<ShapEResult> {
    try {
      console.log('🎮 Starting Shap-E 3D generation via Hugging Face...')
      console.log('🖼️ Image data length:', imageData.length)

      if (!this.HF_TOKEN) {
        return {
          success: false,
          error: 'Hugging Face token required for Shap-E generation'
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
            prompt: prompt || 'A 3D character model, game-ready, clean topology'
          }
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

      // Shap-E returns a 3D model file (usually .ply or .obj)
      // We'll create a data URL for the model
      const modelBlob = new Blob([result], { type: 'application/octet-stream' })
      const modelUrl = URL.createObjectURL(modelBlob)

      return {
        success: true,
        modelUrl: modelUrl,
        taskId: Date.now().toString(),
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
    const prompt = `A 3D character model of ${characterData.name}, a ${characterData.rpgClass?.name || 'character'}. Game-ready 3D character with clean topology, stylized design.`

    return this.imageToModel(imageData, prompt)
  }
}