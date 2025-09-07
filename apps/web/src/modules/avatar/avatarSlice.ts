import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AvatarAppearance, HealthData } from '../../types/avatar'
import { AvatarService } from '../../services/avatarService'

interface Avatar {
  id: string
  name: string
  appearance: AvatarAppearance
  wellnessScore: number
  emotions: {
    current: string
    previous: string[]
  }
  worldState: {
    garden: number
    ocean: number
    city: number
    pollution: number
  }
}

interface AvatarState {
  currentAvatar: Avatar | null
  isGenerating: boolean
  error: string | null
}

const initialState: AvatarState = {
  currentAvatar: null,
  isGenerating: false,
  error: null,
}

export const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    generateAvatarStart: (state) => {
      state.isGenerating = true
      state.error = null
    },
    generateAvatarSuccess: (state, action: PayloadAction<AvatarAppearance>) => {
      state.isGenerating = false
      state.currentAvatar = {
        id: `avatar_${Date.now()}`,
        name: AvatarService.generateAvatarName(action.payload.personality),
        appearance: action.payload,
        wellnessScore: action.payload.wellnessScore,
        emotions: {
          current: action.payload.mood,
          previous: []
        },
        worldState: {
          garden: Math.max(0, action.payload.wellnessScore - 20),
          ocean: Math.max(0, action.payload.wellnessScore - 30),
          city: Math.max(0, action.payload.wellnessScore - 40),
          pollution: Math.max(0, 100 - action.payload.wellnessScore)
        }
      }
      state.error = null
    },
    generateAvatarFailure: (state, action: PayloadAction<string>) => {
      state.isGenerating = false
      state.error = action.payload
    },
    updateAvatarFromHealth: (state, action: PayloadAction<HealthData>) => {
      if (state.currentAvatar) {
        const newAppearance = AvatarService.updateAvatar(state.currentAvatar.appearance, action.payload)
        state.currentAvatar.appearance = newAppearance
        state.currentAvatar.wellnessScore = newAppearance.wellnessScore
        state.currentAvatar.emotions.previous.push(state.currentAvatar.emotions.current)
        state.currentAvatar.emotions.current = newAppearance.mood
        
        // Update world state based on wellness
        state.currentAvatar.worldState = {
          garden: Math.max(0, newAppearance.wellnessScore - 20),
          ocean: Math.max(0, newAppearance.wellnessScore - 30),
          city: Math.max(0, newAppearance.wellnessScore - 40),
          pollution: Math.max(0, 100 - newAppearance.wellnessScore)
        }
      }
    },
    updateWellnessScore: (state, action: PayloadAction<number>) => {
      if (state.currentAvatar) {
        state.currentAvatar.wellnessScore = action.payload
      }
    },
    updateEmotion: (state, action: PayloadAction<string>) => {
      if (state.currentAvatar) {
        state.currentAvatar.emotions.previous.push(state.currentAvatar.emotions.current)
        state.currentAvatar.emotions.current = action.payload
      }
    },
    updateWorldState: (state, action: PayloadAction<Partial<Avatar['worldState']>>) => {
      if (state.currentAvatar) {
        state.currentAvatar.worldState = {
          ...state.currentAvatar.worldState,
          ...action.payload,
        }
      }
    },
  },
})

export const { 
  generateAvatarStart, 
  generateAvatarSuccess, 
  generateAvatarFailure,
  updateAvatarFromHealth,
  updateWellnessScore,
  updateEmotion,
  updateWorldState
} = avatarSlice.actions
export default avatarSlice.reducer