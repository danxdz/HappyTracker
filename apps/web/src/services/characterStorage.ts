export interface SavedCharacter {
  id: string
  name: string
  age: number
  height: number
  weight: number
  gender: 'male' | 'female' | 'non-binary' | 'unknown'
  photo?: string // Base64 or URL
  caricatureImage: string // Base64 or URL
  createdAt: Date
  generationCost?: number
  style: string
  rpgClass?: {
    name: string
    description: string
    stats: {
      strength: number
      agility: number
      intelligence: number
      wisdom: number
      charisma: number
      constitution: number
      total: number
    }
  }
  // Complete photo analysis details
  photoAnalysis?: {
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
    age: number
    height: number
    weight: number
    glasses: boolean
    facialHair: boolean
    hairColor: string
    hairStyle: string
    skinTone: 'light' | 'medium' | 'dark'
    expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious'
    faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long'
    build: 'slim' | 'average' | 'muscular' | 'heavy'
  }
  // AI guesses from photo analysis
  aiGuesses?: {
    age: number
    height: number
    weight: number
    gender: 'male' | 'female' | 'non-binary' | 'unknown'
  }
  // Generation prompt used for caricature
  generationPrompt?: string
  // Processing time and cost breakdown
  processingTime?: number
  costBreakdown?: {
    imageAnalysis: number
    caricatureGeneration: number
    total: number
  }
}

/**
 * 💾 Character Storage Service
 * 
 * Manages saving and loading character cards to/from localStorage
 * 
 * ⚠️ NETLIFY LIMITATION: localStorage has ~5-10MB limit
 * ⚠️ Base64 images quickly fill storage (only ~3-10 characters)
 * ⚠️ For production: Use Render.com with backend API + database
 * 
 * This is a temporary solution for static hosting only.
 */
export class CharacterStorage {
  private static readonly STORAGE_KEY = 'saved_characters'
  private static readonly MAX_SAVED_CHARACTERS = 50 // Limit to prevent storage bloat

  /**
   * 💾 Save Character to Gallery
   */
  static saveCharacter(character: Omit<SavedCharacter, 'id' | 'createdAt'>): SavedCharacter {
    const savedCharacter: SavedCharacter = {
      ...character,
      id: this.generateId(),
      createdAt: new Date()
    }

    const existingCharacters = this.getAllCharacters()
    
    // Add new character at the beginning (most recent first)
    const updatedCharacters = [savedCharacter, ...existingCharacters]
    
    // Limit to max characters
    if (updatedCharacters.length > this.MAX_SAVED_CHARACTERS) {
      updatedCharacters.splice(this.MAX_SAVED_CHARACTERS)
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedCharacters))
      console.log('💾 Character saved to gallery:', savedCharacter.name)
      return savedCharacter
    } catch (error) {
      console.error('❌ Failed to save character:', error)
      throw new Error('Failed to save character to gallery')
    }
  }

  /**
   * 📚 Get All Saved Characters
   */
  static getAllCharacters(): SavedCharacter[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []
      
      const characters = JSON.parse(stored) as SavedCharacter[]
      // Convert date strings back to Date objects
      return characters.map(char => ({
        ...char,
        createdAt: new Date(char.createdAt)
      }))
    } catch (error) {
      console.error('❌ Failed to load characters:', error)
      return []
    }
  }

  /**
   * 🗑️ Delete Character from Gallery
   */
  static deleteCharacter(id: string): boolean {
    try {
      const characters = this.getAllCharacters()
      const filteredCharacters = characters.filter(char => char.id !== id)
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCharacters))
      console.log('🗑️ Character deleted from gallery:', id)
      return true
    } catch (error) {
      console.error('❌ Failed to delete character:', error)
      return false
    }
  }

  /**
   * 📊 Get Gallery Stats
   */
  static getGalleryStats(): { total: number; totalCost: number; oldestDate?: Date; newestDate?: Date } {
    const characters = this.getAllCharacters()
    
    if (characters.length === 0) {
      return { total: 0, totalCost: 0 }
    }

    const totalCost = characters.reduce((sum, char) => sum + (char.generationCost || 0), 0)
    const dates = characters.map(char => char.createdAt).sort()
    
    return {
      total: characters.length,
      totalCost,
      oldestDate: dates[0],
      newestDate: dates[dates.length - 1]
    }
  }

  /**
   * 🔄 Clear All Characters
   */
  static clearAllCharacters(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log('🗑️ All characters cleared from gallery')
      return true
    } catch (error) {
      console.error('❌ Failed to clear characters:', error)
      return false
    }
  }

  /**
   * 🆔 Generate Unique ID
   */
  private static generateId(): string {
    return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 📁 Export Characters (for backup)
   */
  static exportCharacters(): string {
    const characters = this.getAllCharacters()
    const exportData = {
      characters,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 📥 Import Characters (from backup)
   */
  static importCharacters(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData)
      if (!importData.characters || !Array.isArray(importData.characters)) {
        throw new Error('Invalid import data format')
      }

      // Validate character structure
      const validCharacters = importData.characters.filter((char: any) => 
        char.name && char.age && char.height && char.weight && char.cartoonImage
      )

      if (validCharacters.length === 0) {
        throw new Error('No valid characters found in import data')
      }

      // Save imported characters
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validCharacters))
      console.log(`📥 Imported ${validCharacters.length} characters`)
      return true
    } catch (error) {
      console.error('❌ Failed to import characters:', error)
      return false
    }
  }
}