export interface PhotoAnalysis {
  gender: 'male' | 'female' | 'unknown';
  age: number;
  height: number;
  weight: number;
  glasses: boolean;
  facialHair: boolean;
  hairColor: string;
  hairStyle: string;
  skinTone: 'light' | 'medium' | 'dark';
  expression: 'serious' | 'smiling' | 'confident' | 'gentle' | 'mysterious';
  faceShape: 'round' | 'oval' | 'square' | 'heart' | 'long';
  build: 'slim' | 'average' | 'muscular' | 'heavy';
}

export interface RPGStats {
  strength: number;      // 1-100
  agility: number;       // 1-100  
  intelligence: number;  // 1-100
  wisdom: number;        // 1-100
  charisma: number;      // 1-100
  constitution: number;  // 1-100
  total: number;
}

export interface RPGClass {
  name: string;
  description: string;
  primaryStat: keyof RPGStats;
  bonuses: Partial<RPGStats>;
  equipment: string[];
  abilities: string[];
}

export class RPGCharacterGenerator {
  
  // Define RPG classes
  private classes: Record<string, RPGClass> = {
    warrior: {
      name: "Warrior",
      description: "Strong melee fighter with high defense",
      primaryStat: "strength",
      bonuses: { strength: 15, constitution: 10 },
      equipment: ["sword", "shield", "armor"],
      abilities: ["Shield Bash", "Power Strike", "Intimidate"]
    },
    
    rogue: {
      name: "Rogue", 
      description: "Quick and sneaky with high dexterity",
      primaryStat: "agility",
      bonuses: { agility: 15, intelligence: 5 },
      equipment: ["daggers", "lockpicks", "cloak"],
      abilities: ["Stealth", "Backstab", "Pickpocket"]
    },
    
    mage: {
      name: "Mage",
      description: "Master of arcane magic and spells",
      primaryStat: "intelligence", 
      bonuses: { intelligence: 20, wisdom: 5 },
      equipment: ["staff", "spellbook", "robes"],
      abilities: ["Fireball", "Magic Shield", "Teleport"]
    },
    
    cleric: {
      name: "Cleric",
      description: "Holy healer and support specialist",
      primaryStat: "wisdom",
      bonuses: { wisdom: 15, charisma: 10 },
      equipment: ["mace", "holy symbol", "chainmail"],
      abilities: ["Heal", "Bless", "Turn Undead"]
    },
    
    bard: {
      name: "Bard",
      description: "Charismatic performer with social skills",
      primaryStat: "charisma",
      bonuses: { charisma: 15, intelligence: 10 },
      equipment: ["lute", "sword", "leather armor"],
      abilities: ["Inspire", "Charm", "Song of Power"]
    },
    
    ranger: {
      name: "Ranger",
      description: "Nature expert with bow skills",
      primaryStat: "agility",
      bonuses: { agility: 10, wisdom: 10, constitution: 5 },
      equipment: ["bow", "arrows", "hunting knife"],
      abilities: ["Track", "Animal Speech", "Precise Shot"]
    }
  };

  generateRPGCharacter(photoAnalysis: PhotoAnalysis, name: string): {
    name: string;
    stats: RPGStats;
    suggestedClass: RPGClass;
    allClasses: RPGClass[];
    characterPrompt: string;
  } {
    
    // Generate base stats from photo analysis
    const baseStats = this.calculateStatsFromPhoto(photoAnalysis);
    
    // Determine best class based on stats
    const suggestedClass = this.suggestClass(baseStats);
    
    // Generate character appearance prompt
    const characterPrompt = this.generateCharacterPrompt(photoAnalysis, suggestedClass, name);
    
    return {
      name,
      stats: baseStats,
      suggestedClass,
      allClasses: Object.values(this.classes),
      characterPrompt
    };
  }

  private calculateStatsFromPhoto(analysis: PhotoAnalysis): RPGStats {
    let strength = 50; // Base 50
    let agility = 50;
    let intelligence = 50;
    let wisdom = 50;
    let charisma = 50;
    let constitution = 50;

    // Age affects stats
    if (analysis.age < 25) {
      agility += 15;
      constitution += 10;
      wisdom -= 5;
    } else if (analysis.age > 50) {
      wisdom += 20;
      intelligence += 10;
      agility -= 10;
      strength -= 5;
    } else { // Middle-aged
      intelligence += 10;
      wisdom += 10;
      strength += 5;
    }

    // Build affects physical stats
    switch (analysis.build) {
      case 'muscular':
        strength += 20;
        constitution += 15;
        agility -= 5;
        break;
      case 'slim':
        agility += 15;
        constitution -= 10;
        intelligence += 5;
        break;
      case 'heavy':
        constitution += 20;
        strength += 10;
        agility -= 15;
        break;
      default: // average
        // No major changes
        break;
    }

    // Height affects some stats
    if (analysis.height > 180) {
      strength += 10;
      constitution += 5;
    } else if (analysis.height < 160) {
      agility += 10;
      intelligence += 5;
    }

    // Glasses = intelligence boost
    if (analysis.glasses) {
      intelligence += 15;
      wisdom += 10;
    }

    // Facial hair = wisdom/charisma (depends on style)
    if (analysis.facialHair) {
      wisdom += 10;
      charisma += 5;
    }

    // Expression affects charisma
    switch (analysis.expression) {
      case 'smiling':
        charisma += 15;
        break;
      case 'confident':
        charisma += 10;
        strength += 5;
        break;
      case 'serious':
        wisdom += 10;
        intelligence += 5;
        break;
      case 'mysterious':
        intelligence += 10;
        agility += 5;
        break;
      case 'gentle':
        wisdom += 15;
        charisma += 10;
        break;
    }

    // Face shape affects stats (fun stereotypes)
    switch (analysis.faceShape) {
      case 'square':
        strength += 10;
        constitution += 5;
        break;
      case 'round':
        charisma += 10;
        constitution += 5;
        break;
      case 'heart':
        charisma += 15;
        break;
      case 'long':
        intelligence += 10;
        wisdom += 5;
        break;
      case 'oval':
        // Balanced - small bonus to all
        strength += 2;
        agility += 2;
        intelligence += 2;
        wisdom += 2;
        charisma += 2;
        constitution += 2;
        break;
    }

    // Ensure stats are in valid range (20-100)
    const clamp = (val: number) => Math.max(20, Math.min(100, val));
    
    const stats: RPGStats = {
      strength: clamp(strength),
      agility: clamp(agility),
      intelligence: clamp(intelligence),
      wisdom: clamp(wisdom), 
      charisma: clamp(charisma),
      constitution: clamp(constitution),
      total: 0
    };
    
    stats.total = stats.strength + stats.agility + stats.intelligence + 
                  stats.wisdom + stats.charisma + stats.constitution;

    return stats;
  }

  private suggestClass(stats: RPGStats): RPGClass {
    // Find the highest stat
    const statEntries = Object.entries(stats) as [keyof RPGStats, number][];
    const highestStat = statEntries
      .filter(([key]) => key !== 'total')
      .reduce((max, current) => current[1] > max[1] ? current : max);
    
    // Find class that matches the highest stat
    const matchingClass = Object.values(this.classes)
      .find(cls => cls.primaryStat === highestStat[0]);
    
    return matchingClass || this.classes.warrior;
  }

  private generateCharacterPrompt(analysis: PhotoAnalysis, rpgClass: RPGClass, name: string): string {
    // Use "Toybox" style as the main aesthetic
    const baseStyle = "toybox collectible figure style, oversized round head, small compact body, smooth plastic-like surface, simplified facial features, bright solid colors, cute proportions, minimal details";
    
    // Character description
    const character = [
      `${analysis.gender} ${rpgClass.name.toLowerCase()}`,
      `${analysis.hairColor} ${analysis.hairStyle} hair`,
      analysis.glasses ? 'wearing glasses' : null,
      analysis.facialHair ? 'with facial hair' : null,
      `${analysis.skinTone} skin tone`,
      `${analysis.expression} expression`
    ].filter(Boolean).join(', ');
    
    // Class-specific equipment
    const equipment = `equipped with ${rpgClass.equipment.join(', ')}`;
    
    // Age and build
    const physicalTraits = `${analysis.age} years old, ${analysis.build} build`;
    
    // Technical requirements
    const requirements = "single character only, centered composition, clean white background, RPG character design, fantasy game art style, front-facing heroic pose";
    
    return [baseStyle, character, equipment, physicalTraits, requirements].join(', ');
  }

  // Get class by name
  getClass(className: string): RPGClass | null {
    return this.classes[className.toLowerCase()] || null;
  }
  
  // Apply class bonuses to base stats
  applyClassBonuses(baseStats: RPGStats, rpgClass: RPGClass): RPGStats {
    const enhancedStats = { ...baseStats };
    
    Object.entries(rpgClass.bonuses).forEach(([stat, bonus]) => {
      if (stat in enhancedStats && typeof bonus === 'number') {
        (enhancedStats as any)[stat] = Math.min(100, enhancedStats[stat as keyof RPGStats] + bonus);
      }
    });
    
    // Recalculate total
    enhancedStats.total = enhancedStats.strength + enhancedStats.agility + 
                         enhancedStats.intelligence + enhancedStats.wisdom + 
                         enhancedStats.charisma + enhancedStats.constitution;
    
    return enhancedStats;
  }
}