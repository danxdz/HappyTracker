/**
 * 🎮 Local 3D Generation Service
 * 
 * Connects to the local Point-E 3D generation server
 */

export interface Local3DGenerationRequest {
  prompt: string
  resolution?: number
  steps?: number
}

export interface Local3DGenerationResponse {
  success: boolean
  status: string
  files: {
    ply: string
    obj: string
  }
  download_urls: {
    ply: string
    obj: string
  }
}

export interface Local3DModel {
  id: string
  prompt: string
  createdAt: Date
  plyUrl: string
  objUrl: string
  thumbnail?: string
  status: 'generating' | 'completed' | 'failed'
}

class Local3DService {
  private static readonly API_BASE_URL = 'http://localhost:8001'
  private static readonly DOWNLOAD_BASE_URL = 'http://localhost:8001/download'

  /**
   * Check if the local 3D server is available
   */
  static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`)
      const data = await response.json()
      return data.status === 'healthy' && data.models_loaded
    } catch (error) {
      console.warn('Local 3D server not available:', error)
      return false
    }
  }

  /**
   * Generate 3D model from text prompt
   */
  static async generate3DModel(request: Local3DGenerationRequest): Promise<Local3DGenerationResponse> {
    const response = await fetch(`${this.API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        resolution: request.resolution || 64,
        steps: request.steps || 20,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || '3D generation failed')
    }

    return await response.json()
  }

  /**
   * Download 3D model file
   */
  static async downloadModel(filename: string): Promise<Blob> {
    const response = await fetch(`${this.DOWNLOAD_BASE_URL}/${filename}`)
    
    if (!response.ok) {
      throw new Error('Download failed')
    }

    return await response.blob()
  }

  /**
   * Get download URL for a model file
   */
  static getDownloadUrl(filename: string): string {
    return `${this.DOWNLOAD_BASE_URL}/${filename}`
  }

  /**
   * Save 3D model to local storage
   */
  static saveModelToStorage(model: Local3DModel): void {
    const models = this.getStoredModels()
    models.push(model)
    localStorage.setItem('local3d_models', JSON.stringify(models))
  }

  /**
   * Get stored 3D models from local storage
   */
  static getStoredModels(): Local3DModel[] {
    try {
      const stored = localStorage.getItem('local3d_models')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading stored models:', error)
      return []
    }
  }

  /**
   * Delete 3D model from storage
   */
  static deleteModelFromStorage(modelId: string): void {
    const models = this.getStoredModels()
    const filtered = models.filter(model => model.id !== modelId)
    localStorage.setItem('local3d_models', JSON.stringify(filtered))
  }

  /**
   * Generate a thumbnail from PLY file (placeholder)
   */
  static async generateThumbnail(plyUrl: string): Promise<string> {
    // For now, return a placeholder
    // In a real implementation, you'd use Three.js to render the PLY file
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjNEIE1vZGVsPC90ZXh0Pjwvc3ZnPg=='
  }

  /**
   * Create a new 3D model entry
   */
  static createModelEntry(prompt: string, response: Local3DGenerationResponse): Local3DModel {
    const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      id: modelId,
      prompt,
      createdAt: new Date(),
      plyUrl: response.download_urls.ply,
      objUrl: response.download_urls.obj,
      status: 'completed',
    }
  }
}

export default Local3DService
