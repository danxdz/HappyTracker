// Avatar types and interfaces
export interface AvatarPersonality {
  trait: string;
  description: string;
  color: string;
  emoji: string;
}

export interface AvatarAppearance {
  personality: AvatarPersonality;
  wellnessScore: number;
  mood: string;
  accessories: string[];
  background: string;
}

export interface HealthData {
  meals: MealLog[];
  water: number;
  sleep: number;
  movement: number;
  lastUpdated: Date;
}

export interface MealLog {
  id: string;
  food: string;
  nutritionScore: number;
  timestamp: Date;
  image?: string;
}

// Avatar personality traits
export const PERSONALITY_TRAITS: AvatarPersonality[] = [
  {
    trait: "Energetic",
    description: "Always ready for adventure!",
    color: "from-yellow-400 to-orange-400",
    emoji: "⚡"
  },
  {
    trait: "Calm",
    description: "Peaceful and zen-like",
    color: "from-blue-400 to-cyan-400", 
    emoji: "🧘"
  },
  {
    trait: "Playful",
    description: "Loves games and fun!",
    color: "from-pink-400 to-purple-400",
    emoji: "🎮"
  },
  {
    trait: "Wise",
    description: "Thoughtful and intelligent",
    color: "from-green-400 to-emerald-400",
    emoji: "🧠"
  },
  {
    trait: "Brave",
    description: "Fearless and bold",
    color: "from-red-400 to-rose-400",
    emoji: "🦸"
  }
];

// Wellness score calculation
export const calculateWellnessScore = (healthData: HealthData): number => {
  let score = 50; // Base score
  
  // Meal scoring (0-30 points)
  if (healthData.meals.length > 0) {
    const avgNutrition = healthData.meals.reduce((sum, meal) => sum + meal.nutritionScore, 0) / healthData.meals.length;
    score += (avgNutrition - 50) * 0.3; // Scale nutrition score
  }
  
  // Water scoring (0-20 points)
  const waterScore = Math.min(healthData.water / 8, 1) * 20; // 8 glasses = 20 points
  score += waterScore - 10; // Center around 0
  
  // Sleep scoring (0-20 points)
  const sleepScore = Math.min(healthData.sleep / 8, 1) * 20; // 8 hours = 20 points
  score += sleepScore - 10; // Center around 0
  
  // Movement scoring (0-10 points)
  const movementScore = Math.min(healthData.movement / 10000, 1) * 10; // 10k steps = 10 points
  score += movementScore - 5; // Center around 0
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Avatar mood based on wellness score
export const getAvatarMood = (wellnessScore: number): string => {
  if (wellnessScore >= 80) return "Excellent! 🌟";
  if (wellnessScore >= 60) return "Great! 😊";
  if (wellnessScore >= 40) return "Good! 🙂";
  if (wellnessScore >= 20) return "Okay... 😐";
  return "Needs help! 😔";
};

// Avatar accessories based on wellness
export const getAvatarAccessories = (wellnessScore: number): string[] => {
  const accessories: string[] = [];
  
  if (wellnessScore >= 80) {
    accessories.push("👑", "✨", "🌟");
  } else if (wellnessScore >= 60) {
    accessories.push("😊", "💪");
  } else if (wellnessScore >= 40) {
    accessories.push("🤔");
  } else {
    accessories.push("😴", "💊");
  }
  
  return accessories;
};

// Background based on wellness
export const getAvatarBackground = (wellnessScore: number): string => {
  if (wellnessScore >= 80) return "from-yellow-400 via-pink-400 to-purple-400";
  if (wellnessScore >= 60) return "from-green-400 via-blue-400 to-purple-400";
  if (wellnessScore >= 40) return "from-blue-400 via-purple-400 to-pink-400";
  return "from-gray-400 via-slate-400 to-gray-600";
};