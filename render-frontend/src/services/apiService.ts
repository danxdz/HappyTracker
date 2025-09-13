/**
 * 🌐 API Service for Render.com Backend
 * 
 * Handles all API calls to the backend server
 * Replaces localStorage with server-based storage
 */

export interface Character {
  id?: number
  name: string
  age: number
  height: number
  weight: number
  gender: 'male' | 'female' | 'non-binary' | 'unknown'
  imageUrl?: string
  modelUrl?: string
  isPublic?: boolean
  userId?: string
  createdAt?: string
  updatedAt?: string
  rpgClass?: {
    name: string
    description: string
    stats: any
  }
  photoAnalysis?: any
  aiGuesses?: any
  generationPrompt?: string
  processingTime?: number
  costBreakdown?: any
}

export interface GalleryResponse {
  characters: Character[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 🌐 API Service Class
 */
export class ApiService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
  
  /**
   * 🏠 Health Check
   */
  static async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Health check failed')
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ Health check failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Health check failed' }
    }
  }
  
  /**
   * 📚 Get World Gallery
   */
  static async getGallery(page: number = 1, limit: number = 20, publicOnly: boolean = true): Promise<ApiResponse<GalleryResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        public_only: publicOnly.toString()
      })
      
      const response = await fetch(`${this.BASE_URL}/gallery?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch gallery')
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ Failed to fetch gallery:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch gallery' }
    }
  }
  
  /**
   * 👤 Get User Characters
   */
  static async getUserCharacters(userId: string): Promise<ApiResponse<Character[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/characters/${userId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user characters')
      }
      
      return { success: true, data: data.characters }
    } catch (error) {
      console.error('❌ Failed to fetch user characters:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch user characters' }
    }
  }
  
  /**
   * 🎨 Create Character
   */
  static async createCharacter(
    characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>,
    imageFile?: File,
    modelFile?: File
  ): Promise<ApiResponse<Character>> {
    try {
      const formData = new FormData()
      
      // Add character data
      formData.append('characterData', JSON.stringify(characterData))
      
      // Add files if provided
      if (imageFile) {
        formData.append('images', imageFile)
      }
      if (modelFile) {
        formData.append('models', modelFile)
      }
      
      const response = await fetch(`${this.BASE_URL}/characters`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create character')
      }
      
      return { success: true, data: data.character }
    } catch (error) {
      console.error('❌ Failed to create character:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create character' }
    }
  }
  
  /**
   * 🔄 Update Character
   */
  static async updateCharacter(
    id: number,
    characterData: Partial<Character>,
    imageFile?: File,
    modelFile?: File
  ): Promise<ApiResponse<Character>> {
    try {
      const formData = new FormData()
      
      // Add character data
      formData.append('characterData', JSON.stringify(characterData))
      
      // Add files if provided
      if (imageFile) {
        formData.append('images', imageFile)
      }
      if (modelFile) {
        formData.append('models', modelFile)
      }
      
      const response = await fetch(`${this.BASE_URL}/characters/${id}`, {
        method: 'PUT',
        body: formData
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update character')
      }
      
      return { success: true, data: data.character }
    } catch (error) {
      console.error('❌ Failed to update character:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update character' }
    }
  }
  
  /**
   * 🗑️ Delete Character
   */
  static async deleteCharacter(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.BASE_URL}/characters/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete character')
      }
      
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to delete character:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete character' }
    }
  }
  
  /**
   * 📊 Get Statistics
   */
  static async getStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.BASE_URL}/stats`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics')
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch statistics' }
    }
  }
  
  /**
   * 🔗 Get Full Image URL
   */
  static getImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'
    return `${baseUrl}${imagePath}`
  }
  
  /**
   * 🔗 Get Full Model URL
   */
  static getModelUrl(modelPath: string): string {
    if (modelPath.startsWith('http')) {
      return modelPath
    }
    
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'
    return `${baseUrl}${modelPath}`
  }
}