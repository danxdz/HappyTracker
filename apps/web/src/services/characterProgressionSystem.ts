/**
 * ⚔️ Character Progression System
 * 
 * Characters start simple and evolve with better equipment over time
 * Maintains consistent style while adding complexity with levels
 */

export interface CharacterLevel {
  level: number
  title: string
  equipmentTier: 'basic' | 'common' | 'rare' | 'epic' | 'legendary'
  complexity: 'simple' | 'moderate' | 'detailed' | 'complex' | 'masterwork'
  unlocks: string[]
  requiredXP: number
}

export interface CharacterProgression {
  currentLevel: number
  experience: number
  totalPlayTime: number // minutes
  achievementsUnlocked: string[]
  equipmentUnlocked: string[]
  styleConsistency: CharacterStyleBase
}

export interface CharacterStyleBase {
  // Core identity - NEVER changes
  baseBodyType: string // chibi, realistic, stylized
  colorPalette: string[] // personal colors
  faceFeatures: string // user's actual features
  personality: string // from expression
  
  // Evolving elements - changes with level
  clothing: string[]
  accessories: string[]
  weapons: string[]
  effects: string[]
}

export class CharacterProgressionSystem {
  /**
   * 📊 Level definitions with progressive complexity
   */
  static readonly LEVELS: CharacterLevel[] = [
    {
      level: 1,
      title: 'Newcomer',
      equipmentTier: 'basic',
      complexity: 'simple',
      unlocks: ['simple tunic', 'basic pants', 'cloth shoes'],
      requiredXP: 0
    },
    {
      level: 5,
      title: 'Apprentice',
      equipmentTier: 'common',
      complexity: 'simple',
      unlocks: ['leather vest', 'belt', 'simple weapon'],
      requiredXP: 100
    },
    {
      level: 10,
      title: 'Adventurer',
      equipmentTier: 'common',
      complexity: 'moderate',
      unlocks: ['shoulder pads', 'better boots', 'class emblem'],
      requiredXP: 300
    },
    {
      level: 15,
      title: 'Veteran',
      equipmentTier: 'rare',
      complexity: 'moderate',
      unlocks: ['cape', 'gauntlets', 'enchanted weapon'],
      requiredXP: 600
    },
    {
      level: 20,
      title: 'Expert',
      equipmentTier: 'rare',
      complexity: 'detailed',
      unlocks: ['armor pieces', 'helmet option', 'magical effects'],
      requiredXP: 1000
    },
    {
      level: 30,
      title: 'Master',
      equipmentTier: 'epic',
      complexity: 'detailed',
      unlocks: ['full armor set', 'wings/aura', 'legendary weapon'],
      requiredXP: 2000
    },
    {
      level: 40,
      title: 'Champion',
      equipmentTier: 'epic',
      complexity: 'complex',
      unlocks: ['ornate armor', 'particle effects', 'companion pet'],
      requiredXP: 4000
    },
    {
      level: 50,
      title: 'Legend',
      equipmentTier: 'legendary',
      complexity: 'masterwork',
      unlocks: ['godlike armor', 'divine aura', 'mythic weapons', 'transformation'],
      requiredXP: 8000
    }
  ]

  /**
   * 🎨 Generate consistent prompt based on level
   */
  static generateLeveledPrompt(
    baseCharacter: {
      expression: string
      gender: string
      age: number
      class: string
      hairColor: string
      skinTone: string
      faceFeatures: string
    },
    level: number = 1,
    stylePreference: 'cute' | 'cool' | 'realistic' = 'cute'
  ): string {
    const levelData = this.getLevelData(level)
    
    // Base style that NEVER changes (consistency)
    const consistentBase = [
      `${stylePreference === 'cute' ? 'chibi' : stylePreference} character`,
      `${baseCharacter.gender} ${baseCharacter.class}`,
      `${baseCharacter.hairColor} hair`,
      `${baseCharacter.skinTone} skin`,
      baseCharacter.faceFeatures,
      `age ${baseCharacter.age}`
    ].join(', ')
    
    // Equipment based on level (progression)
    const equipment = this.getEquipmentForLevel(baseCharacter.class, level)
    
    // Complexity based on level
    const detailLevel = this.getDetailLevel(levelData.complexity)
    
    // Combine for final prompt
    return `${consistentBase}, ${equipment}, ${detailLevel}, consistent character design, same person at level ${level}`
  }

  /**
   * 🛡️ Get equipment description for class and level
   */
  static getEquipmentForLevel(className: string, level: number): string {
    const levelData = this.getLevelData(level)
    
    // Class-specific equipment progression
    const classEquipment: Record<string, Record<string, string[]>> = {
      'Warrior': {
        'basic': ['simple sword', 'wooden shield', 'cloth tunic'],
        'common': ['iron sword', 'leather armor', 'metal bracers'],
        'rare': ['steel sword', 'chainmail', 'plate shoulders'],
        'epic': ['enchanted blade', 'full plate armor', 'horned helmet'],
        'legendary': ['flaming greatsword', 'dragon scale armor', 'divine crown']
      },
      'Mage': {
        'basic': ['wooden staff', 'simple robe', 'cloth hood'],
        'common': ['crystal staff', 'apprentice robes', 'leather gloves'],
        'rare': ['enchanted staff', 'mystic robes', 'wizard hat'],
        'epic': ['arcane scepter', 'flowing magical robes', 'levitating orbs'],
        'legendary': ['staff of cosmos', 'ethereal robes', 'crown of stars', 'floating runes']
      },
      'Rogue': {
        'basic': ['simple dagger', 'cloth vest', 'soft boots'],
        'common': ['dual daggers', 'leather armor', 'hood'],
        'rare': ['poisoned blades', 'shadow cloak', 'mask'],
        'epic': ['ethereal daggers', 'assassin suit', 'smoke effects'],
        'legendary': ['void daggers', 'phantom armor', 'shadow wings']
      },
      'Cleric': {
        'basic': ['wooden mace', 'simple robes', 'prayer beads'],
        'common': ['blessed mace', 'clerical vestments', 'holy symbol'],
        'rare': ['sacred hammer', 'ornate robes', 'glowing aura'],
        'epic': ['divine scepter', 'angelic robes', 'healing light'],
        'legendary': ['hammer of gods', 'celestial armor', 'angel wings', 'divine halo']
      },
      'Ranger': {
        'basic': ['short bow', 'simple tunic', 'leather boots'],
        'common': ['hunting bow', 'ranger vest', 'quiver'],
        'rare': ['longbow', 'forest armor', 'animal companion'],
        'epic': ['enchanted bow', 'nature armor', 'eagle companion'],
        'legendary': ['bow of the wild', 'living armor', 'spirit animals']
      },
      'Bard': {
        'basic': ['simple lute', 'colorful shirt', 'soft shoes'],
        'common': ['decorated lute', 'performer outfit', 'feathered hat'],
        'rare': ['magical instrument', 'elegant costume', 'cape'],
        'epic': ['enchanted harp', 'noble attire', 'musical notes aura'],
        'legendary': ['instrument of creation', 'cosmic outfit', 'reality-bending music']
      }
    }
    
    const defaultEquipment = {
      'basic': ['simple clothes', 'basic weapon'],
      'common': ['leather armor', 'decent weapon'],
      'rare': ['metal armor', 'good weapon'],
      'epic': ['ornate armor', 'magical weapon'],
      'legendary': ['godlike armor', 'mythic weapon']
    }
    
    const equipment = classEquipment[className]?.[levelData.equipmentTier] || 
                     defaultEquipment[levelData.equipmentTier]
    
    return equipment.join(', ')
  }

  /**
   * 📈 Get detail level description
   */
  static getDetailLevel(complexity: string): string {
    const detailMap: Record<string, string> = {
      'simple': 'simple design, minimal details, clean look',
      'moderate': 'some details, nice textures, good quality',
      'detailed': 'detailed design, intricate patterns, high quality',
      'complex': 'very detailed, complex patterns, premium quality',
      'masterwork': 'extremely detailed, masterpiece quality, incredible complexity'
    }
    
    return detailMap[complexity] || detailMap['simple']
  }

  /**
   * 🎯 Get level data
   */
  static getLevelData(level: number): CharacterLevel {
    // Find the appropriate level tier
    let appropriateLevel = this.LEVELS[0]
    
    for (const levelData of this.LEVELS) {
      if (level >= levelData.level) {
        appropriateLevel = levelData
      } else {
        break
      }
    }
    
    return appropriateLevel
  }

  /**
   * 🏆 Calculate XP needed for next level
   */
  static getXPForNextLevel(currentLevel: number): number {
    const nextLevelIndex = this.LEVELS.findIndex(l => l.level > currentLevel)
    if (nextLevelIndex === -1) return 999999 // Max level
    
    return this.LEVELS[nextLevelIndex].requiredXP
  }

  /**
   * 🎮 Calculate level from XP
   */
  static getLevelFromXP(xp: number): number {
    let level = 1
    
    for (const levelData of this.LEVELS) {
      if (xp >= levelData.requiredXP) {
        level = levelData.level
      } else {
        break
      }
    }
    
    return level
  }

  /**
   * ⏰ Award XP based on time played
   */
  static calculateTimeXP(minutesPlayed: number): number {
    // 1 XP per minute, bonus every 10 minutes
    const baseXP = minutesPlayed
    const bonusXP = Math.floor(minutesPlayed / 10) * 5
    return baseXP + bonusXP
  }

  /**
   * 🎯 Award XP for actions
   */
  static getActionXP(action: string): number {
    const xpRewards: Record<string, number> = {
      'character_created': 10,
      'photo_uploaded': 5,
      'class_selected': 5,
      'character_saved': 10,
      '3d_generated': 20,
      'shared_character': 15,
      'daily_login': 5,
      'week_streak': 50,
      'month_streak': 200
    }
    
    return xpRewards[action] || 0
  }

  /**
   * 💾 Save progression to localStorage
   */
  static saveProgression(characterId: string, progression: CharacterProgression): void {
    const key = `character_progression_${characterId}`
    localStorage.setItem(key, JSON.stringify(progression))
  }

  /**
   * 📖 Load progression from localStorage
   */
  static loadProgression(characterId: string): CharacterProgression | null {
    const key = `character_progression_${characterId}`
    const data = localStorage.getItem(key)
    
    if (!data) return null
    
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  /**
   * 🎨 Generate evolution preview
   */
  static getEvolutionPreview(currentLevel: number): {
    current: string
    next: string
    unlocksAt: number
  }[] {
    const previews = []
    const currentLevelData = this.getLevelData(currentLevel)
    
    // Show next 3 unlocks
    for (const level of this.LEVELS) {
      if (level.level > currentLevel && previews.length < 3) {
        previews.push({
          current: currentLevelData.title,
          next: level.title,
          unlocksAt: level.level
        })
      }
    }
    
    return previews
  }
}