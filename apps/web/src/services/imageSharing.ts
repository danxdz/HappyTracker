/**
 * 🖼️ Image Sharing Service
 * 
 * Converts base64 images to shareable URLs using a simple blob URL approach
 * This creates temporary URLs that work within the browser session
 */

export interface ShareableImage {
  url: string
  filename: string
  size: number
  createdAt: Date
}

export class ImageSharingService {
  private static sharedImages: Map<string, ShareableImage> = new Map()
  private static readonly MAX_SHARED_IMAGES = 50 // Limit to prevent memory leaks

  /**
   * 📤 Convert base64 image to shareable URL
   */
  static createShareableUrl(base64Data: string, filename: string = 'character.png'): string {
    try {
      // Extract the base64 data (remove data:image/...;base64, prefix)
      const base64String = base64Data.includes(',') 
        ? base64Data.split(',')[1] 
        : base64Data

      // Convert base64 to binary
      const binaryString = atob(base64String)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Create blob and URL
      const blob = new Blob([bytes], { type: 'image/png' })
      const url = URL.createObjectURL(blob)

      // Store metadata
      const shareableImage: ShareableImage = {
        url,
        filename,
        size: bytes.length,
        createdAt: new Date()
      }

      // Store in our cache
      this.sharedImages.set(url, shareableImage)

      // Clean up old images if we exceed the limit
      this.cleanupOldImages()

      console.log(`📤 Created shareable URL for ${filename}: ${url}`)
      return url

    } catch (error) {
      console.error('❌ Failed to create shareable URL:', error)
      throw new Error('Failed to create shareable URL')
    }
  }

  /**
   * 📋 Copy image URL to clipboard
   */
  static async copyToClipboard(base64Data: string, filename: string = 'character.png'): Promise<void> {
    try {
      const url = this.createShareableUrl(base64Data, filename)
      await navigator.clipboard.writeText(url)
      console.log('📋 Image URL copied to clipboard')
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error)
      throw new Error('Failed to copy to clipboard')
    }
  }

  /**
   * 💾 Download image with proper filename
   */
  static downloadImage(base64Data: string, filename: string = 'character.png'): void {
    try {
      const url = this.createShareableUrl(base64Data, filename)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()

      // Clean up the URL after download
      setTimeout(() => this.revokeUrl(url), 1000)

      console.log(`💾 Downloaded image: ${filename}`)
    } catch (error) {
      console.error('❌ Failed to download image:', error)
      throw new Error('Failed to download image')
    }
  }

  /**
   * 🗑️ Revoke a shared URL to free memory
   */
  static revokeUrl(url: string): void {
    if (this.sharedImages.has(url)) {
      URL.revokeObjectURL(url)
      this.sharedImages.delete(url)
      console.log('🗑️ Revoked shared URL:', url)
    }
  }

  /**
   * 🧹 Clean up old shared images
   */
  private static cleanupOldImages(): void {
    if (this.sharedImages.size <= this.MAX_SHARED_IMAGES) {
      return
    }

    // Sort by creation date and remove oldest
    const sortedImages = Array.from(this.sharedImages.entries())
      .sort(([, a], [, b]) => a.createdAt.getTime() - b.createdAt.getTime())

    const toRemove = sortedImages.slice(0, this.sharedImages.size - this.MAX_SHARED_IMAGES)
    
    toRemove.forEach(([url]) => {
      this.revokeUrl(url)
    })

    console.log(`🧹 Cleaned up ${toRemove.length} old shared images`)
  }

  /**
   * 📊 Get sharing statistics
   */
  static getStats(): {
    totalShared: number
    totalSize: number
    oldestImage?: Date
    newestImage?: Date
  } {
    const images = Array.from(this.sharedImages.values())
    
    if (images.length === 0) {
      return { totalShared: 0, totalSize: 0 }
    }

    const totalSize = images.reduce((sum, img) => sum + img.size, 0)
    const dates = images.map(img => img.createdAt).sort()

    return {
      totalShared: images.length,
      totalSize,
      oldestImage: dates[0],
      newestImage: dates[dates.length - 1]
    }
  }

  /**
   * 🗑️ Clean up all shared images (call on app unload)
   */
  static cleanupAll(): void {
    this.sharedImages.forEach((_, url) => {
      URL.revokeObjectURL(url)
    })
    this.sharedImages.clear()
    console.log('🗑️ Cleaned up all shared images')
  }
}

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    ImageSharingService.cleanupAll()
  })
}