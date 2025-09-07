import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Avatar {
  id: string
  name: string
  appearance: {
    skinColor: string
    hairColor: string
    eyeColor: string
    clothing: string
  }
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
    generateAvatarSuccess: (state, action: PayloadAction<Avatar>) => {
      state.isGenerating = false
      state.currentAvatar = action.payload
      state.error = null
    },
    generateAvatarFailure: (state, action: PayloadAction<string>) => {
      state.isGenerating = false
      state.error = action.payload
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
  updateWellnessScore,
  updateEmotion,
  updateWorldState
} = avatarSlice.actions
export default avatarSlice.reducer