/**
 * 📤 Upload Service
 * 
 * Handles uploading images to the backend server
 * Supports both user photos and generated characters
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export interface UploadResponse {
  success: boolean
  message?: string
  error?: string
  file?: {
    filename: string
    originalName?: string
    size?: number
    mimetype?: string
    url: string
    path: string
  }
}

export interface CharacterData {
  name: string
  class: string
  stats?: Record<string, number>
  createdAt: string
  style?: string
  gender?: string
  age?: number
}

export class UploadService {
  /**
   * 📷 Upload user photo to server
   */
  static async uploadPhoto(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const response = await fetch(`${API_URL}/upload/photo`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      console.log('📷 Photo uploaded successfully:', data.file?.url)
      return data
    } catch (error) {
      console.error('❌ Photo upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * 🎨 Upload generated character image to server
   */
  static async uploadCharacter(file: File, metadata?: CharacterData): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append('character', file)
      
      // Add metadata fields
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      const response = await fetch(`${API_URL}/upload/character`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      console.log('🎨 Character uploaded successfully:', data.file?.url)
      return data
    } catch (error) {
      console.error('❌ Character upload failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  /**
   * 💾 Save base64 character image to server
   */
  static async saveCharacterFromBase64(
    imageData: string, 
    metadata?: CharacterData
  ): Promise<UploadResponse> {
    try {
      const response = await fetch(`${API_URL}/save/character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData,
          metadata
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Save failed')
      }

      console.log('💾 Character saved to server:', data.file?.url)
      return data
    } catch (error) {
      console.error('❌ Character save failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Save failed'
      }
    }
  }

  /**
   * 📋 Get all characters from server
   */
  static async getAllCharacters(): Promise<{
    success: boolean
    count?: number
    characters?: Array<{
      filename: string
      url: string
      path: string
      size: number
      created: string
      metadata: CharacterData
    }>
    error?: string
  }> {
    try {
      const response = await fetch(`${API_URL}/characters`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get characters')
      }

      console.log(`📋 Retrieved ${data.count} characters from server`)
      return data
    } catch (error) {
      console.error('❌ Failed to get characters:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get characters'
      }
    }
  }

  /**
   * 🗑️ Delete character from server
   */
  static async deleteCharacter(filename: string): Promise<{
    success: boolean
    message?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${API_URL}/characters/${filename}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Delete failed')
      }

      console.log('🗑️ Character deleted from server:', filename)
      return data
    } catch (error) {
      console.error('❌ Character delete failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }

  /**
   * 🏥 Check server health
   */
  static async checkHealth(): Promise<{
    status: string
    timestamp?: string
    uploads?: {
      charactersCount: number
      photosCount: number
    }
    error?: string
  }> {
    try {
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error('Server unhealthy')
      }

      console.log('🏥 Server health:', data.status)
      return data
    } catch (error) {
      console.error('❌ Health check failed:', error)
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Health check failed'
      }
    }
  }

  /**
   * 🖼️ Convert blob URL to File
   */
  static async blobUrlToFile(blobUrl: string, filename: string): Promise<File> {
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  /**
   * 📸 Convert base64 to File
   */
  static base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    
    return new File([u8arr], filename, { type: mime })
  }
}