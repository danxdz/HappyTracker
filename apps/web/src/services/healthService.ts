// Health tracking service
import { 
  HealthData, 
  MealLog, 
  WaterLog, 
  SleepLog, 
  MovementLog, 
  DailyGoals, 
  HealthSummary,
  calculateNutritionScore,
  DEFAULT_GOALS
} from '../types/health';

export class HealthService {
  // Generate unique ID
  private static generateId(): string {
    return `health_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Meal logging
  static logMeal(food: string, category: MealLog['category'], image?: string): MealLog {
    return {
      id: this.generateId(),
      food,
      nutritionScore: calculateNutritionScore(food),
      timestamp: new Date(),
      image,
      category,
      calories: this.estimateCalories(food)
    };
  }

  // Water logging
  static logWater(amount: number): WaterLog {
    return {
      id: this.generateId(),
      amount,
      timestamp: new Date()
    };
  }

  // Sleep logging
  static logSleep(duration: number, quality: SleepLog['quality'], bedtime?: Date, wakeTime?: Date): SleepLog {
    return {
      id: this.generateId(),
      duration,
      quality,
      timestamp: new Date(),
      bedtime,
      wakeTime
    };
  }

  // Movement logging
  static logMovement(steps: number, activity: MovementLog['activity'], distance?: number): MovementLog {
    return {
      id: this.generateId(),
      steps,
      distance,
      calories: this.estimateCaloriesFromSteps(steps),
      activity,
      timestamp: new Date()
    };
  }

  // Calculate daily wellness score
  static calculateDailyWellnessScore(healthData: HealthData, goals: DailyGoals = DEFAULT_GOALS): number {
    let score = 50; // Base score

    // Water scoring (0-20 points)
    const totalWater = healthData.water.reduce((sum, log) => sum + log.amount, 0);
    const waterScore = Math.min(totalWater / goals.water, 1) * 20;
    score += waterScore - 10;

    // Sleep scoring (0-20 points)
    const latestSleep = healthData.sleep[healthData.sleep.length - 1];
    if (latestSleep) {
      const sleepScore = Math.min(latestSleep.duration / goals.sleep, 1) * 20;
      score += sleepScore - 10;
    }

    // Steps scoring (0-20 points)
    const totalSteps = healthData.movement.reduce((sum, log) => sum + log.steps, 0);
    const stepsScore = Math.min(totalSteps / goals.steps, 1) * 20;
    score += stepsScore - 10;

    // Nutrition scoring (0-30 points)
    if (healthData.meals.length > 0) {
      const avgNutrition = healthData.meals.reduce((sum, meal) => sum + meal.nutritionScore, 0) / healthData.meals.length;
      const nutritionScore = (avgNutrition / 100) * 30;
      score += nutritionScore - 15;
    }

    // Meal frequency bonus (0-10 points)
    const mealFrequencyScore = Math.min(healthData.meals.length / goals.meals, 1) * 10;
    score += mealFrequencyScore - 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Generate health summary for a day
  static generateHealthSummary(healthData: HealthData, goals: DailyGoals = DEFAULT_GOALS): HealthSummary {
    const wellnessScore = this.calculateDailyWellnessScore(healthData, goals);
    const today = new Date().toISOString().split('T')[0];

    // Calculate streaks (simplified - in real app would check consecutive days)
    const streaks = {
      water: healthData.water.length > 0 ? 1 : 0,
      sleep: healthData.sleep.length > 0 ? 1 : 0,
      steps: healthData.movement.length > 0 ? 1 : 0,
      meals: healthData.meals.length > 0 ? 1 : 0
    };

    // Generate achievements
    const achievements: string[] = [];
    if (wellnessScore >= 90) achievements.push('🌟 Wellness Master!');
    if (healthData.water.length >= goals.water) achievements.push('💧 Hydration Hero!');
    if (healthData.meals.length >= goals.meals) achievements.push('🍽️ Meal Champion!');
    if (healthData.movement.length > 0 && healthData.movement[0].steps >= goals.steps) {
      achievements.push('🚶‍♂️ Step Star!');
    }

    return {
      date: today,
      wellnessScore,
      goals,
      achievements,
      streaks
    };
  }

  // Get health tips based on current data
  static getHealthTips(healthData: HealthData, goals: DailyGoals = DEFAULT_GOALS): string[] {
    const tips: string[] = [];
    const totalWater = healthData.water.reduce((sum, log) => sum + log.amount, 0);
    const totalSteps = healthData.movement.reduce((sum, log) => sum + log.steps, 0);
    const avgNutrition = healthData.meals.length > 0 
      ? healthData.meals.reduce((sum, meal) => sum + meal.nutritionScore, 0) / healthData.meals.length 
      : 0;

    if (totalWater < goals.water) {
      tips.push(`💧 Drink ${goals.water - totalWater} more glasses of water today!`);
    }
    if (totalSteps < goals.steps) {
      tips.push(`🚶‍♂️ Take ${goals.steps - totalSteps} more steps to reach your goal!`);
    }
    if (avgNutrition < goals.nutritionScore) {
      tips.push(`🥗 Try adding more vegetables to your next meal!`);
    }
    if (healthData.meals.length < goals.meals) {
      tips.push(`🍽️ Don't forget to eat ${goals.meals - healthData.meals.length} more meal(s) today!`);
    }
    if (tips.length === 0) {
      tips.push('🎉 You\'re doing great! Keep up the excellent work!');
    }

    return tips;
  }

  // Estimate calories for food (simplified)
  private static estimateCalories(food: string): number {
    const lowerFood = food.toLowerCase();
    if (lowerFood.includes('salad')) return 150;
    if (lowerFood.includes('pizza')) return 300;
    if (lowerFood.includes('burger')) return 500;
    if (lowerFood.includes('pasta')) return 400;
    if (lowerFood.includes('chicken')) return 250;
    if (lowerFood.includes('fish')) return 200;
    if (lowerFood.includes('vegetable')) return 100;
    if (lowerFood.includes('fruit')) return 80;
    return 200; // Default
  }

  // Estimate calories burned from steps
  private static estimateCaloriesFromSteps(steps: number): number {
    return Math.round(steps * 0.04); // Rough estimate: 0.04 calories per step
  }

  // Get motivational message based on wellness score
  static getMotivationalMessage(wellnessScore: number): string {
    if (wellnessScore >= 90) return '🌟 Incredible! You\'re a wellness superstar!';
    if (wellnessScore >= 75) return '💪 Excellent work! You\'re doing amazing!';
    if (wellnessScore >= 60) return '😊 Great job! Keep up the good work!';
    if (wellnessScore >= 40) return '👍 Good progress! You\'re getting there!';
    return '💙 Every step counts! You\'ve got this!';
  }
}