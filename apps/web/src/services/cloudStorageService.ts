/**
 * ☁️ Cloud Storage Service
 * 
 * Handles image uploads to cloud services that work with Netlify
 * Supports multiple providers: ImgBB (free), Cloudinary (free tier)
 */

// ImgBB - Free image hosting, no account needed for basic usage
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY'
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

// Cloudinary - Free tier available, more features
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'YOUR_PRESET'

export interface CloudUploadResponse {
  success: boolean
  url?: string
  deleteUrl?: string
  provider?: 'imgbb' | 'cloudinary' | 'local'
  error?: string
}

export class CloudStorageService {
  /**
   * 📤 Upload image to cloud storage
   * Tries multiple providers in order of preference
   */
  static async uploadImage(
    imageData: string | File,
    name?: string
  ): Promise<CloudUploadResponse> {
    // Try ImgBB first (simplest, no account needed)
    if (IMGBB_API_KEY && IMGBB_API_KEY !== 'YOUR_IMGBB_API_KEY') {
      const imgbbResult = await this.uploadToImgBB(imageData, name)
      if (imgbbResult.success) return imgbbResult
    }

    // Try Cloudinary (more features, free tier)
    if (CLOUDINARY_CLOUD_NAME !== 'YOUR_CLOUD_NAME') {
      const cloudinaryResult = await this.uploadToCloudinary(imageData, name)
      if (cloudinaryResult.success) return cloudinaryResult
    }

    // Fallback to local storage (browser only)
    return this.saveToLocalStorage(imageData, name)
  }

  /**
   * 🖼️ Upload to ImgBB (Free, no account needed)
   * Get API key from: https://api.imgbb.com/
   */
  private static async uploadToImgBB(
    imageData: string | File,
    name?: string
  ): Promise<CloudUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('key', IMGBB_API_KEY)
      
      if (imageData instanceof File) {
        formData.append('image', imageData)
      } else {
        // Remove data URL prefix if present
        const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
        formData.append('image', base64)
      }
      
      if (name) {
        formData.append('name', name)
      }

      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Image uploaded to ImgBB:', data.data.url)
        return {
          success: true,
          url: data.data.url,
          deleteUrl: data.data.delete_url,
          provider: 'imgbb'
        }
      } else {
        throw new Error(data.error?.message || 'ImgBB upload failed')
      }
    } catch (error) {
      console.error('❌ ImgBB upload failed:', error)
      return {
        success: false,
        provider: 'imgbb',
        error: error instanceof Error ? error.message : 'ImgBB upload failed'
      }
    }
  }

  /**
   * ☁️ Upload to Cloudinary (Free tier: 25GB storage, 25GB bandwidth/month)
   * Setup: https://cloudinary.com/documentation/upload_images#unsigned_upload
   */
  private static async uploadToCloudinary(
    imageData: string | File,
    name?: string
  ): Promise<CloudUploadResponse> {
    try {
      const formData = new FormData()
      
      if (imageData instanceof File) {
        formData.append('file', imageData)
      } else {
        formData.append('file', imageData)
      }
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      
      if (name) {
        formData.append('public_id', name.replace(/\.[^/.]+$/, '')) // Remove extension
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (data.secure_url) {
        console.log('✅ Image uploaded to Cloudinary:', data.secure_url)
        return {
          success: true,
          url: data.secure_url,
          provider: 'cloudinary'
        }
      } else {
        throw new Error(data.error?.message || 'Cloudinary upload failed')
      }
    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error)
      return {
        success: false,
        provider: 'cloudinary',
        error: error instanceof Error ? error.message : 'Cloudinary upload failed'
      }
    }
  }

  /**
   * 💾 Save to browser's local storage (fallback)
   * Limited by browser storage quota (~5-10MB typically)
   */
  private static saveToLocalStorage(
    imageData: string | File,
    name?: string
  ): Promise<CloudUploadResponse> {
    return new Promise((resolve) => {
      try {
        let dataUrl: string
        
        if (imageData instanceof File) {
          const reader = new FileReader()
          reader.onload = () => {
            dataUrl = reader.result as string
            this.storeInLocal(dataUrl, name)
            resolve({
              success: true,
              url: dataUrl,
              provider: 'local'
            })
          }
          reader.readAsDataURL(imageData)
        } else {
          dataUrl = imageData
          this.storeInLocal(dataUrl, name)
          resolve({
            success: true,
            url: dataUrl,
            provider: 'local'
          })
        }
      } catch (error) {
        console.error('❌ Local storage save failed:', error)
        resolve({
          success: false,
          provider: 'local',
          error: 'Local storage save failed'
        })
      }
    })
  }

  /**
   * 📦 Store image in localStorage with size management
   */
  private static storeInLocal(dataUrl: string, name?: string): void {
    const key = `character_${name || Date.now()}`
    
    try {
      // Check if we're approaching storage limit
      const currentSize = new Blob([JSON.stringify(localStorage)]).size
      const imageSize = new Blob([dataUrl]).size
      
      // If over 4MB total, clean up old images
      if (currentSize + imageSize > 4 * 1024 * 1024) {
        this.cleanupOldLocalImages()
      }
      
      localStorage.setItem(key, dataUrl)
      
      // Keep track of stored images
      const storedImages = JSON.parse(localStorage.getItem('stored_images') || '[]')
      storedImages.push({ key, timestamp: Date.now(), name })
      localStorage.setItem('stored_images', JSON.stringify(storedImages))
      
      console.log('💾 Image saved to local storage:', key)
    } catch (error) {
      console.error('❌ localStorage quota exceeded:', error)
      throw error
    }
  }

  /**
   * 🧹 Clean up old images from localStorage
   */
  private static cleanupOldLocalImages(): void {
    try {
      const storedImages = JSON.parse(localStorage.getItem('stored_images') || '[]')
      
      // Sort by timestamp and remove oldest half
      storedImages.sort((a: any, b: any) => a.timestamp - b.timestamp)
      const toRemove = storedImages.slice(0, Math.floor(storedImages.length / 2))
      
      toRemove.forEach((img: any) => {
        localStorage.removeItem(img.key)
      })
      
      const remaining = storedImages.slice(Math.floor(storedImages.length / 2))
      localStorage.setItem('stored_images', JSON.stringify(remaining))
      
      console.log(`🧹 Cleaned up ${toRemove.length} old images from localStorage`)
    } catch (error) {
      console.error('❌ Cleanup failed:', error)
    }
  }

  /**
   * 📋 Get all locally stored images
   */
  static getLocalImages(): Array<{ key: string; url: string; name?: string; timestamp: number }> {
    try {
      const storedImages = JSON.parse(localStorage.getItem('stored_images') || '[]')
      
      return storedImages.map((img: any) => ({
        key: img.key,
        url: localStorage.getItem(img.key) || '',
        name: img.name,
        timestamp: img.timestamp
      })).filter((img: any) => img.url)
    } catch (error) {
      console.error('❌ Failed to get local images:', error)
      return []
    }
  }

  /**
   * 🗑️ Delete image from local storage
   */
  static deleteLocalImage(key: string): boolean {
    try {
      localStorage.removeItem(key)
      
      const storedImages = JSON.parse(localStorage.getItem('stored_images') || '[]')
      const filtered = storedImages.filter((img: any) => img.key !== key)
      localStorage.setItem('stored_images', JSON.stringify(filtered))
      
      console.log('🗑️ Deleted local image:', key)
      return true
    } catch (error) {
      console.error('❌ Failed to delete local image:', error)
      return false
    }
  }
}