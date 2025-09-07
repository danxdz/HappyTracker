// Health tracking types and interfaces
export interface MealLog {
  id: string;
  food: string;
  nutritionScore: number; // 0-100
  timestamp: Date;
  image?: string;
  calories?: number;
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
  bedtime?: Date;
  wakeTime?: Date;
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

export interface DailyGoals {
  water: number; // glasses per day
  sleep: number; // hours per night
  steps: number; // steps per day
  meals: number; // meals per day
  nutritionScore: number; // average nutrition score
}

export interface HealthSummary {
  date: string;
  wellnessScore: number;
  goals: DailyGoals;
  achievements: string[];
  streaks: {
    water: number;
    sleep: number;
    steps: number;
    meals: number;
  };
}

// Nutrition scoring system
export const NUTRITION_SCORES = {
  // Excellent (90-100)
  'salad': 95,
  'vegetables': 90,
  'fruits': 92,
  'nuts': 88,
  'fish': 85,
  'chicken': 80,
  'eggs': 82,
  'yogurt': 78,
  'quinoa': 85,
  'brown rice': 80,
  
  // Good (70-89)
  'pasta': 75,
  'bread': 70,
  'cheese': 72,
  'milk': 75,
  'pork': 70,
  'beef': 68,
  'potato': 75,
  
  // Fair (50-69)
  'pizza': 60,
  'burger': 55,
  'fries': 50,
  'ice cream': 45,
  'cake': 40,
  'candy': 30,
  'soda': 20,
  'chips': 35,
  
  // Poor (0-49)
  'fast food': 25,
  'fried food': 30,
  'processed food': 20,
  'sugary drinks': 15,
  'alcohol': 10
};

// Calculate nutrition score for food
export const calculateNutritionScore = (food: string): number => {
  const lowerFood = food.toLowerCase();
  
  // Check for exact matches first
  for (const [key, score] of Object.entries(NUTRITION_SCORES)) {
    if (lowerFood.includes(key)) {
      return score;
    }
  }
  
  // Default scoring based on keywords
  if (lowerFood.includes('vegetable') || lowerFood.includes('green')) return 90;
  if (lowerFood.includes('fruit') || lowerFood.includes('berry')) return 85;
  if (lowerFood.includes('protein') || lowerFood.includes('lean')) return 80;
  if (lowerFood.includes('whole') || lowerFood.includes('organic')) return 85;
  if (lowerFood.includes('fried') || lowerFood.includes('deep')) return 30;
  if (lowerFood.includes('sugar') || lowerFood.includes('sweet')) return 40;
  if (lowerFood.includes('processed') || lowerFood.includes('packaged')) return 25;
  
  // Default score for unknown foods
  return 60;
};

// Default daily goals
export const DEFAULT_GOALS: DailyGoals = {
  water: 8, // 8 glasses
  sleep: 8, // 8 hours
  steps: 10000, // 10k steps
  meals: 3, // 3 meals
  nutritionScore: 75 // 75 average nutrition score
};