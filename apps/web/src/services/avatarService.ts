// Avatar generation service
import { AvatarPersonality, PERSONALITY_TRAITS, calculateWellnessScore, getAvatarMood, getAvatarAccessories, getAvatarBackground, AvatarAppearance, HealthData } from '../types/avatar';

export class AvatarService {
  // Generate random personality trait
  static generatePersonality(): AvatarPersonality {
    const randomIndex = Math.floor(Math.random() * PERSONALITY_TRAITS.length);
    return PERSONALITY_TRAITS[randomIndex];
  }

  // Create avatar appearance based on health data
  static createAvatarAppearance(healthData: HealthData, personality?: AvatarPersonality): AvatarAppearance {
    const wellnessScore = calculateWellnessScore(healthData);
    const selectedPersonality = personality || this.generatePersonality();
    
    return {
      personality: selectedPersonality,
      wellnessScore,
      mood: getAvatarMood(wellnessScore),
      accessories: getAvatarAccessories(wellnessScore),
      background: getAvatarBackground(wellnessScore)
    };
  }

  // Update avatar based on new health data
  static updateAvatar(currentAppearance: AvatarAppearance, newHealthData: HealthData): AvatarAppearance {
    return this.createAvatarAppearance(newHealthData, currentAppearance.personality);
  }

  // Generate avatar name based on personality
  static generateAvatarName(personality: AvatarPersonality): string {
    const names = {
      "Energetic": ["Spark", "Bolt", "Zap", "Flash"],
      "Calm": ["Zen", "Peace", "Serene", "Tranquil"],
      "Playful": ["Joy", "Fun", "Giggle", "Bounce"],
      "Wise": ["Sage", "Oracle", "Wise", "Thinker"],
      "Brave": ["Hero", "Courage", "Bold", "Fearless"]
    };
    
    const personalityNames = names[personality.trait as keyof typeof names] || ["Friend"];
    const randomName = personalityNames[Math.floor(Math.random() * personalityNames.length)];
    
    return `${randomName} the ${personality.trait}`;
  }

  // Get avatar animation based on wellness
  static getAvatarAnimation(wellnessScore: number): string {
    if (wellnessScore >= 80) return "bounce";
    if (wellnessScore >= 60) return "pulse";
    if (wellnessScore >= 40) return "wiggle";
    return "shake";
  }

  // Get motivational message based on wellness
  static getMotivationalMessage(wellnessScore: number): string {
    const messages = {
      high: [
        "You're absolutely crushing it! 🌟",
        "Amazing work! Keep it up! 💪",
        "You're a health superstar! ⭐",
        "Incredible! You're inspiring! 🎉"
      ],
      medium: [
        "Good progress! You're doing great! 😊",
        "Nice work! Keep going! 👍",
        "You're on the right track! 🎯",
        "Great job! Almost there! 🚀"
      ],
      low: [
        "Don't worry, we've got this! 💪",
        "Every step counts! You can do it! 🌱",
        "Small changes make big differences! ✨",
        "You're stronger than you think! 💙"
      ]
    };

    let category: keyof typeof messages;
    if (wellnessScore >= 60) category = "high";
    else if (wellnessScore >= 30) category = "medium";
    else category = "low";

    const categoryMessages = messages[category];
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
  }
}