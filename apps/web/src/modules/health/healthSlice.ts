import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HealthLog {
  id: string
  type: 'meal' | 'water' | 'sleep' | 'movement'
  value: any
  timestamp: string
  score: number
}

interface HealthState {
  logs: HealthLog[]
  dailyGoals: {
    meals: number
    water: number
    sleep: number
    movement: number
  }
  wellnessScore: number
  isLoading: boolean
  error: string | null
}

const initialState: HealthState = {
  logs: [],
  dailyGoals: {
    meals: 3,
    water: 8,
    sleep: 8,
    movement: 10000,
  },
  wellnessScore: 50,
  isLoading: false,
  error: null,
}

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    logMeal: (state, action: PayloadAction<{ food: string; score: number }>) => {
      const newLog: HealthLog = {
        id: Date.now().toString(),
        type: 'meal',
        value: action.payload.food,
        timestamp: new Date().toISOString(),
        score: action.payload.score,
      }
      state.logs.push(newLog)
      state.wellnessScore = Math.min(100, state.wellnessScore + action.payload.score)
    },
    logWater: (state, action: PayloadAction<number>) => {
      const newLog: HealthLog = {
        id: Date.now().toString(),
        type: 'water',
        value: action.payload,
        timestamp: new Date().toISOString(),
        score: 5,
      }
      state.logs.push(newLog)
      state.wellnessScore = Math.min(100, state.wellnessScore + 5)
    },
    logSleep: (state, action: PayloadAction<number>) => {
      const newLog: HealthLog = {
        id: Date.now().toString(),
        type: 'sleep',
        value: action.payload,
        timestamp: new Date().toISOString(),
        score: action.payload >= 7 ? 10 : 5,
      }
      state.logs.push(newLog)
      state.wellnessScore = Math.min(100, state.wellnessScore + newLog.score)
    },
    logMovement: (state, action: PayloadAction<number>) => {
      const newLog: HealthLog = {
        id: Date.now().toString(),
        type: 'movement',
        value: action.payload,
        timestamp: new Date().toISOString(),
        score: action.payload >= 10000 ? 15 : 10,
      }
      state.logs.push(newLog)
      state.wellnessScore = Math.min(100, state.wellnessScore + newLog.score)
    },
    setWellnessScore: (state, action: PayloadAction<number>) => {
      state.wellnessScore = Math.max(0, Math.min(100, action.payload))
    },
    clearLogs: (state) => {
      state.logs = []
      state.wellnessScore = 50
    },
  },
})

export const { 
  logMeal, 
  logWater, 
  logSleep, 
  logMovement, 
  setWellnessScore,
  clearLogs 
} = healthSlice.actions
export default healthSlice.reducer