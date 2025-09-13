/**
 * 🎭 Expression-Based Prompt Generator
 * 
 * Creates different character styles based on facial expressions
 * Cute for happy, badass for serious, punk for angry, etc.
 */

import { FaceAnalysisResult } from './localFaceAnalysis'

export interface CharacterStyle {
  name: string
  basePrompt: string
  meshyStyle: 'cartoon' | 'realistic' | 'low-poly' | 'sculpture'
  colors: string
  accessories: string[]
}

export class ExpressionPromptGenerator {
  /**
   * 🎨 Generate character style based on expression
   */
  static getStyleFromExpression(analysis: FaceAnalysisResult): CharacterStyle {
    const expression = analysis.expression || 'neutral'
    const mouthOpen = analysis.mouthOpen || false
    const teethShowing = analysis.teethShowing || false
    
    // Happy/Smiling = Cute Chibi Style (PicPop-like)
    if (expression === 'happy') {
      return {
        name: 'Kawaii Chibi',
        basePrompt: 'super cute chibi character, oversized head, tiny body, huge sparkling eyes, rosy cheeks, kawaii style, pastel colors, soft features, adorable, picpop style, big smile',
        meshyStyle: 'cartoon',
        colors: 'pastel pink, baby blue, soft yellow, mint green',
        accessories: ['cute bow', 'heart decorations', 'sparkles', 'rainbow']
      }
    }
    
    // Serious/Grimace = Badass Style
    if (expression === 'serious' || (expression === 'neutral' && !mouthOpen)) {
      return {
        name: 'Cool Badass',
        basePrompt: 'cool badass character, tough expression, strong features, confident pose, street style, urban warrior, serious face, intimidating look',
        meshyStyle: 'realistic',
        colors: 'dark colors, black, steel gray, deep red',
        accessories: ['sunglasses', 'leather jacket', 'chains', 'tattoos']
      }
    }
    
    // Angry/Teeth Showing = Punk/Rebel Style
    if (expression === 'angry' || teethShowing) {
      return {
        name: 'Punk Rebel',
        basePrompt: 'punk rock character, rebellious expression, mohawk hairstyle, fierce look, grunge aesthetic, angry face, showing teeth, aggressive pose',
        meshyStyle: 'low-poly',
        colors: 'neon colors, electric blue, hot pink, acid green',
        accessories: ['spikes', 'piercings', 'punk jacket', 'combat boots']
      }
    }
    
    // Surprised/Mouth Open = Shocked Anime Style
    if (expression === 'surprised' || mouthOpen) {
      return {
        name: 'Anime Shocked',
        basePrompt: 'anime character with shocked expression, huge eyes, mouth wide open, exaggerated surprise, manga style, dynamic pose, action lines',
        meshyStyle: 'cartoon',
        colors: 'vibrant colors, bright orange, electric yellow',
        accessories: ['sweat drops', 'shock effects', 'speed lines']
      }
    }
    
    // Sad = Emo/Gothic Style
    if (expression === 'sad') {
      return {
        name: 'Gothic Emo',
        basePrompt: 'emo gothic character, melancholic expression, dark aesthetic, sad eyes, moody atmosphere, artistic style',
        meshyStyle: 'sculpture',
        colors: 'dark purple, midnight blue, black, silver',
        accessories: ['hood', 'dark makeup', 'chains', 'roses']
      }
    }
    
    // Default/Neutral = Balanced Style
    return {
      name: 'Balanced Hero',
      basePrompt: 'stylized character, balanced proportions, neutral expression, versatile design, game character style',
      meshyStyle: 'cartoon',
      colors: 'balanced colors, natural tones',
      accessories: ['simple outfit', 'basic gear']
    }
  }

  /**
   * 🎮 Generate RPG class based on expression
   */
  static getClassFromExpression(expression: string): string {
    const classMap: Record<string, string> = {
      'happy': 'Bard',      // Happy = Entertainer
      'serious': 'Warrior', // Serious = Fighter
      'angry': 'Berserker', // Angry = Rage fighter
      'surprised': 'Mage',  // Surprised = Magic user
      'sad': 'Cleric',      // Sad = Healer/Support
      'neutral': 'Ranger'   // Neutral = Balanced
    }
    
    return classMap[expression] || 'Warrior'
  }

  /**
   * 🌈 Generate complete prompt with all details
   */
  static generateFullPrompt(
    analysis: FaceAnalysisResult,
    style: CharacterStyle,
    userPreferences?: {
      gender?: string
      age?: number
      additionalDetails?: string
    }
  ): string {
    const gender = userPreferences?.gender || analysis.gender || 'person'
    const age = userPreferences?.age || analysis.age || 25
    
    // Build age descriptor
    let ageDescriptor = 'adult'
    if (age < 18) ageDescriptor = 'young'
    else if (age > 50) ageDescriptor = 'mature'
    else if (age > 30) ageDescriptor = 'adult'
    
    // Combine all elements
    const parts = [
      style.basePrompt,
      `${ageDescriptor} ${gender}`,
      style.colors,
      ...style.accessories,
      userPreferences?.additionalDetails || ''
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  /**
   * 🎭 Get expression emoji
   */
  static getExpressionEmoji(expression: string): string {
    const emojiMap: Record<string, string> = {
      'happy': '😊',
      'serious': '😐',
      'angry': '😠',
      'surprised': '😮',
      'sad': '😢',
      'neutral': '😊'
    }
    
    return emojiMap[expression] || '😊'
  }

  /**
   * 💬 Get character personality from expression
   */
  static getPersonality(analysis: FaceAnalysisResult): {
    traits: string[]
    quote: string
    mood: string
  } {
    const expression = analysis.expression || 'neutral'
    
    const personalities: Record<string, any> = {
      'happy': {
        traits: ['cheerful', 'optimistic', 'friendly', 'energetic'],
        quote: "Life is awesome! Let's have fun!",
        mood: 'Joyful'
      },
      'serious': {
        traits: ['focused', 'determined', 'professional', 'stoic'],
        quote: "I get the job done. No nonsense.",
        mood: 'Focused'
      },
      'angry': {
        traits: ['fierce', 'rebellious', 'passionate', 'intense'],
        quote: "Don't mess with me!",
        mood: 'Fierce'
      },
      'surprised': {
        traits: ['curious', 'excitable', 'reactive', 'expressive'],
        quote: "Whoa! Did you see that?!",
        mood: 'Shocked'
      },
      'sad': {
        traits: ['thoughtful', 'introspective', 'artistic', 'deep'],
        quote: "Sometimes the shadows speak louder...",
        mood: 'Melancholic'
      },
      'neutral': {
        traits: ['balanced', 'adaptable', 'mysterious', 'calm'],
        quote: "Ready for anything.",
        mood: 'Calm'
      }
    }
    
    return personalities[expression] || personalities['neutral']
  }
}