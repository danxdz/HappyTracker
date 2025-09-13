/**
 * 🎮 Meshy 3D Generation Service
 * 
 * Converts 2D character images to 3D models using Meshy API
 * Perfect for turning caricatures into interactive 3D characters
 */

const MESHY_API_KEY = import.meta.env.VITE_MESHY_API_KEY || ''
const MESHY_API_URL = 'https://api.meshy.ai'

export interface Meshy3DResult {
  success: boolean
  modelUrl?: string
  taskId?: string
  status?: 'pending' | 'processing' | 'succeeded' | 'failed'
  progress?: number
  error?: string
  credits_used?: number
}

export class Meshy3DService {
  /**
   * 🖼️ Convert 2D Image to 3D Model
   * Uses Meshy's Image-to-3D API
   */
  static async imageToModel(
    imageUrl: string,
    options?: {
      art_style?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture'
      target_polycount?: 'high' | 'medium' | 'low'
      auto_refine?: boolean
    }
  ): Promise<Meshy3DResult> {
    if (!MESHY_API_KEY) {
      console.warn('⚠️ Meshy API key not configured')
      return {
        success: false,
        error: 'Meshy API key not configured'
      }
    }

    try {
      // Step 1: Create image-to-3D task
      const createResponse = await fetch(`${MESHY_API_URL}/v1/image-to-3d`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: imageUrl,
          enable_pbr: true,
          art_style: options?.art_style || 'cartoon',
          target_polycount: options?.target_polycount || 'medium',
          auto_refine: options?.auto_refine ?? true,
          generate_texture: true
        })
      })

      if (!createResponse.ok) {
        throw new Error(`Meshy API error: ${createResponse.status}`)
      }

      const createData = await createResponse.json()
      console.log('🎮 3D generation task created:', createData.result)

      // Return task ID for polling
      return {
        success: true,
        taskId: createData.result,
        status: 'pending',
        progress: 0
      }
    } catch (error) {
      console.error('❌ Failed to create 3D model:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create 3D model'
      }
    }
  }

  /**
   * 📊 Check 3D Generation Progress
   * Poll this to get the status and final model URL
   */
  static async checkProgress(taskId: string): Promise<Meshy3DResult> {
    if (!MESHY_API_KEY) {
      return {
        success: false,
        error: 'Meshy API key not configured'
      }
    }

    try {
      const response = await fetch(`${MESHY_API_URL}/v1/image-to-3d/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`Meshy API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Check status
      if (data.status === 'SUCCEEDED') {
        console.log('✅ 3D model ready:', data.model_urls?.glb)
        return {
          success: true,
          taskId,
          status: 'succeeded',
          modelUrl: data.model_urls?.glb,
          progress: 100,
          credits_used: data.credits_used
        }
      } else if (data.status === 'FAILED') {
        return {
          success: false,
          taskId,
          status: 'failed',
          error: data.task_error?.message || 'Generation failed'
        }
      } else {
        // Still processing
        return {
          success: true,
          taskId,
          status: data.status === 'PENDING' ? 'pending' : 'processing',
          progress: data.progress || 0
        }
      }
    } catch (error) {
      console.error('❌ Failed to check progress:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check progress'
      }
    }
  }

  /**
   * 🔄 Wait for 3D Model (with polling)
   * Convenience method that polls until complete
   */
  static async waitForModel(
    taskId: string,
    options?: {
      maxWaitTime?: number // milliseconds
      pollInterval?: number // milliseconds
      onProgress?: (progress: number) => void
    }
  ): Promise<Meshy3DResult> {
    const maxWait = options?.maxWaitTime || 300000 // 5 minutes default
    const pollInterval = options?.pollInterval || 3000 // 3 seconds default
    const startTime = Date.now()

    while (Date.now() - startTime < maxWait) {
      const result = await this.checkProgress(taskId)
      
      if (result.status === 'succeeded' || result.status === 'failed') {
        return result
      }

      if (options?.onProgress && result.progress) {
        options.onProgress(result.progress)
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval))
    }

    return {
      success: false,
      error: 'Timeout waiting for 3D model'
    }
  }

  /**
   * 🎨 Text to 3D Model
   * Generate 3D model from text description
   */
  static async textToModel(
    prompt: string,
    options?: {
      art_style?: 'realistic' | 'cartoon' | 'low-poly' | 'sculpture'
      negative_prompt?: string
    }
  ): Promise<Meshy3DResult> {
    if (!MESHY_API_KEY) {
      console.warn('⚠️ Meshy API key not configured')
      return {
        success: false,
        error: 'Meshy API key not configured'
      }
    }

    try {
      const response = await fetch(`${MESHY_API_URL}/v2/text-to-3d`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'preview',
          prompt: prompt,
          art_style: options?.art_style || 'cartoon',
          negative_prompt: options?.negative_prompt || 'low quality, low resolution, ugly'
        })
      })

      if (!response.ok) {
        throw new Error(`Meshy API error: ${response.status}`)
      }

      const data = await response.json()
      console.log('🎮 Text-to-3D task created:', data.result)

      return {
        success: true,
        taskId: data.result,
        status: 'pending',
        progress: 0
      }
    } catch (error) {
      console.error('❌ Failed to create 3D model from text:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create 3D model'
      }
    }
  }

  /**
   * 💰 Get API Usage/Credits
   */
  static async getUsage(): Promise<{
    credits_remaining?: number
    credits_used?: number
    error?: string
  }> {
    if (!MESHY_API_KEY) {
      return { error: 'Meshy API key not configured' }
    }

    try {
      const response = await fetch(`${MESHY_API_URL}/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MESHY_API_KEY}`
        }
      })

      if (!response.ok) {
        throw new Error(`Meshy API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        credits_remaining: data.credits?.remaining,
        credits_used: data.credits?.used
      }
    } catch (error) {
      console.error('❌ Failed to get usage:', error)
      return {
        error: error instanceof Error ? error.message : 'Failed to get usage'
      }
    }
  }

  /**
   * 🔧 Check if Meshy is configured
   */
  static isConfigured(): boolean {
    return MESHY_API_KEY.length > 0
  }
}