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

export interface MealLog {
  id: string;
  food: string;
  nutritionScore: number;
  timestamp: Date;
  image?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WaterLog {
  id: string;
  amount: number; // glasses of water
  timestamp: Date;
}

export interface SleepLog {
  id: string;
  duration: number; // hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  timestamp: Date;
}

export interface MovementLog {
  id: string;
  steps: number;
  distance?: number; // km
  calories?: number;
  activity: 'walking' | 'running' | 'cycling' | 'other';
  timestamp: Date;
}

export interface HealthData {
  meals: MealLog[];
  water: WaterLog[];
  sleep: SleepLog[];
  movement: MovementLog[];
  lastUpdated: Date;
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
  const totalWater = healthData.water.reduce((sum, log) => sum + log.amount, 0);
  const waterScore = Math.min(totalWater / 8, 1) * 20; // 8 glasses = 20 points
  score += waterScore - 10; // Center around 0
  
  // Sleep scoring (0-20 points)
  const latestSleep = healthData.sleep[healthData.sleep.length - 1];
  if (latestSleep) {
    const sleepScore = Math.min(latestSleep.duration / 8, 1) * 20; // 8 hours = 20 points
    score += sleepScore - 10; // Center around 0
  }
  
  // Movement scoring (0-10 points)
  const totalSteps = healthData.movement.reduce((sum, log) => sum + log.steps, 0);
  const movementScore = Math.min(totalSteps / 10000, 1) * 10; // 10k steps = 10 points
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