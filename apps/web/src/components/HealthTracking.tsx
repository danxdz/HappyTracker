import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { updateAvatarFromHealth } from '../modules/avatar/avatarSlice'
import { HealthService } from '../services/healthService'
import { HealthData, MealLog, WaterLog, SleepLog, MovementLog } from '../types/health'
import { Plus, Droplets, Moon, Activity, Check } from 'lucide-react'

export const HealthTracking: React.FC = () => {
  const dispatch = useDispatch()
  const { currentAvatar } = useSelector((state: RootState) => state.avatar)
  
  const [activeTab, setActiveTab] = useState<'meal' | 'water' | 'sleep' | 'movement'>('meal')
  const [healthData, setHealthData] = useState<HealthData>({
    meals: [],
    water: [],
    sleep: [],
    movement: [],
    lastUpdated: new Date()
  })

  // Form states
  const [mealForm, setMealForm] = useState({ food: '', category: 'breakfast' as const })
  const [waterForm, setWaterForm] = useState({ amount: 1 })
  const [sleepForm, setSleepForm] = useState({ duration: 8, quality: 'good' as const })
  const [movementForm, setMovementForm] = useState({ steps: 0, activity: 'walking' as const })

  const handleLogMeal = () => {
    if (!mealForm.food.trim()) return
    
    const newMeal = HealthService.logMeal(mealForm.food, mealForm.category)
    const updatedData = {
      ...healthData,
      meals: [...healthData.meals, newMeal],
      lastUpdated: new Date()
    }
    
    setHealthData(updatedData)
    dispatch(updateAvatarFromHealth(updatedData))
    setMealForm({ food: '', category: 'breakfast' })
  }

  const handleLogWater = () => {
    const newWater = HealthService.logWater(waterForm.amount)
    const updatedData = {
      ...healthData,
      water: [...healthData.water, newWater],
      lastUpdated: new Date()
    }
    
    setHealthData(updatedData)
    dispatch(updateAvatarFromHealth(updatedData))
  }

  const handleLogSleep = () => {
    const newSleep = HealthService.logSleep(sleepForm.duration, sleepForm.quality)
    const updatedData = {
      ...healthData,
      sleep: [...healthData.sleep, newSleep],
      lastUpdated: new Date()
    }
    
    setHealthData(updatedData)
    dispatch(updateAvatarFromHealth(updatedData))
  }

  const handleLogMovement = () => {
    if (movementForm.steps <= 0) return
    
    const newMovement = HealthService.logMovement(movementForm.steps, movementForm.activity)
    const updatedData = {
      ...healthData,
      movement: [...healthData.movement, newMovement],
      lastUpdated: new Date()
    }
    
    setHealthData(updatedData)
    dispatch(updateAvatarFromHealth(updatedData))
    setMovementForm({ steps: 0, activity: 'walking' })
  }

  const tabs = [
    { id: 'meal', label: 'Meals', icon: '🍽️', color: 'from-orange-400 to-red-400' },
    { id: 'water', label: 'Water', icon: '💧', color: 'from-blue-400 to-cyan-400' },
    { id: 'sleep', label: 'Sleep', icon: '😴', color: 'from-purple-400 to-indigo-400' },
    { id: 'movement', label: 'Steps', icon: '🚶‍♂️', color: 'from-green-400 to-emerald-400' }
  ] as const

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Track Your Health! 📊
          </span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Log your meals, water, sleep, and movement to see your avatar respond in real-time!
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto"
      >
        {/* Meal Logging */}
        {activeTab === 'meal' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🍽️</span>
              Log Your Meal
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What did you eat?
                </label>
                <input
                  type="text"
                  value={mealForm.food}
                  onChange={(e) => setMealForm({ ...mealForm, food: e.target.value })}
                  placeholder="e.g., Salad, Pizza, Chicken..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meal Type
                </label>
                <select
                  value={mealForm.category}
                  onChange={(e) => setMealForm({ ...mealForm, category: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogMeal}
                disabled={!mealForm.food.trim()}
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Meal <Plus className="inline ml-2" size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Water Logging */}
        {activeTab === 'water' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">💧</span>
              Log Water Intake
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Glasses of Water
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setWaterForm({ amount: Math.max(1, waterForm.amount - 1) })}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                    {waterForm.amount}
                  </span>
                  <button
                    onClick={() => setWaterForm({ amount: waterForm.amount + 1 })}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogWater}
                className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white py-3 rounded-lg font-semibold"
              >
                Log Water <Droplets className="inline ml-2" size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Sleep Logging */}
        {activeTab === 'sleep' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">😴</span>
              Log Sleep
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hours of Sleep
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  value={sleepForm.duration}
                  onChange={(e) => setSleepForm({ ...sleepForm, duration: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sleep Quality
                </label>
                <select
                  value={sleepForm.quality}
                  onChange={(e) => setSleepForm({ ...sleepForm, quality: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogSleep}
                className="w-full bg-gradient-to-r from-purple-400 to-indigo-400 text-white py-3 rounded-lg font-semibold"
              >
                Log Sleep <Moon className="inline ml-2" size={20} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Movement Logging */}
        {activeTab === 'movement' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🚶‍♂️</span>
              Log Movement
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Steps Taken
                </label>
                <input
                  type="number"
                  min="0"
                  value={movementForm.steps}
                  onChange={(e) => setMovementForm({ ...movementForm, steps: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Activity Type
                </label>
                <select
                  value={movementForm.activity}
                  onChange={(e) => setMovementForm({ ...movementForm, activity: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="walking">Walking</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogMovement}
                disabled={movementForm.steps <= 0}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Movement <Activity className="inline ml-2" size={20} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Health Summary */}
      {currentAvatar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Today's Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-400">{healthData.meals.length}</div>
                <div className="text-sm text-gray-300">Meals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {healthData.water.reduce((sum, log) => sum + log.amount, 0)}
                </div>
                <div className="text-sm text-gray-300">Glasses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {healthData.sleep.length > 0 ? healthData.sleep[healthData.sleep.length - 1].duration : 0}h
                </div>
                <div className="text-sm text-gray-300">Sleep</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {healthData.movement.reduce((sum, log) => sum + log.steps, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Steps</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-lg font-semibold text-white">
                Wellness Score: {currentAvatar.wellnessScore}/100
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {currentAvatar.emotions.current}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}