/**
 * 🗜️ Image Compression Service
 * 
 * Compresses images to reduce storage size for localStorage
 * 
 * ⚠️ TEMPORARY SOLUTION: For Netlify static hosting only
 * ⚠️ Even compressed, images will fill localStorage quickly
 * ⚠️ For production: Use Render.com with file uploads
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface CompressionResult {
  compressedDataUrl: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

/**
 * 🗜️ Image Compression Utility
 * 
 * Compresses images for efficient localStorage storage
 */
export class ImageCompression {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.8,
    format: 'jpeg'
  }

  /**
   * 🗜️ Compress Image
   * 
   * Compresses an image file to reduce storage size
   */
  static async compressImage(
    file: File | string,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    
    try {
      console.log('🗜️ Starting image compression...')
      
      // Convert to canvas for compression
      const canvas = await this.fileToCanvas(file, opts)
      
      // Convert canvas to compressed data URL
      const compressedDataUrl = canvas.toDataURL(
        `image/${opts.format}`,
        opts.quality
      )
      
      // Calculate sizes
      const originalSize = typeof file === 'string' ? file.length : file.size
      const compressedSize = compressedDataUrl.length
      const compressionRatio = (1 - compressedSize / originalSize) * 100
      
      console.log(`🗜️ Compression complete: ${originalSize} → ${compressedSize} bytes (${compressionRatio.toFixed(1)}% reduction)`)
      
      return {
        compressedDataUrl,
        originalSize,
        compressedSize,
        compressionRatio
      }
    } catch (error) {
      console.error('❌ Image compression failed:', error)
      throw new Error('Failed to compress image')
    }
  }

  /**
   * 📐 Convert File to Canvas
   */
  private static async fileToCanvas(
    file: File | string,
    options: CompressionOptions
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          options.maxWidth!,
          options.maxHeight!
        )
        
        // Create canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        
        canvas.width = width
        canvas.height = height
        
        // Draw compressed image
        ctx.drawImage(img, 0, 0, width, height)
        
        resolve(canvas)
      }
      
      img.onerror = reject
      
      if (typeof file === 'string') {
        img.src = file
      } else {
        img.src = URL.createObjectURL(file)
      }
    })
  }

  /**
   * 📏 Calculate New Dimensions
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth
    let height = originalHeight
    
    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height
      
      if (width > height) {
        width = maxWidth
        height = width / aspectRatio
      } else {
        height = maxHeight
        width = height * aspectRatio
      }
    }
    
    return { width: Math.round(width), height: Math.round(height) }
  }

  /**
   * 📊 Get Storage Usage
   */
  static getStorageUsage(): {
    used: number
    available: number
    percentage: number
  } {
    let used = 0
    
    // Calculate localStorage usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length
      }
    }
    
    // Estimate available space (5MB typical limit)
    const available = 5 * 1024 * 1024 // 5MB in bytes
    const percentage = (used / available) * 100
    
    return { used, available, percentage }
  }

  /**
   * 🧹 Clean Old Characters
   */
  static cleanOldCharacters(maxCharacters: number = 10): number {
    try {
      const { CharacterStorage } = require('./characterStorage')
      const characters = CharacterStorage.getAllCharacters()
      
      if (characters.length <= maxCharacters) {
        return 0
      }
      
      // Sort by creation date (oldest first)
      const sortedCharacters = characters.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      
      // Remove oldest characters
      const toRemove = sortedCharacters.slice(0, characters.length - maxCharacters)
      let removedCount = 0
      
      toRemove.forEach(character => {
        if (CharacterStorage.deleteCharacter(character.id)) {
          removedCount++
        }
      })
      
      console.log(`🧹 Cleaned ${removedCount} old characters`)
      return removedCount
    } catch (error) {
      console.error('❌ Failed to clean old characters:', error)
      return 0
    }
  }

  /**
   * 📤 Export Characters for Backup
   */
  static exportCharacters(): string {
    try {
      const { CharacterStorage } = require('./characterStorage')
      return CharacterStorage.exportCharacters()
    } catch (error) {
      console.error('❌ Failed to export characters:', error)
      return ''
    }
  }

  /**
   * 📥 Import Characters from Backup
   */
  static importCharacters(jsonData: string): boolean {
    try {
      const { CharacterStorage } = require('./characterStorage')
      return CharacterStorage.importCharacters(jsonData)
    } catch (error) {
      console.error('❌ Failed to import characters:', error)
      return false
    }
  }
}