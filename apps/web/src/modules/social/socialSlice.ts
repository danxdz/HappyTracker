import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Friend {
  id: string
  name: string
  avatar: string
  wellnessScore: number
  isOnline: boolean
}

interface Challenge {
  id: string
  title: string
  description: string
  participants: number
  progress: number
  endDate: string
}

interface SocialState {
  friends: Friend[]
  challenges: Challenge[]
  leaderboard: Friend[]
  isLoading: boolean
  error: string | null
}

const initialState: SocialState = {
  friends: [],
  challenges: [],
  leaderboard: [],
  isLoading: false,
  error: null,
}

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload)
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(friend => friend.id !== action.payload)
    },
    joinChallenge: (state, action: PayloadAction<Challenge>) => {
      state.challenges.push(action.payload)
    },
    updateChallengeProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const challenge = state.challenges.find(c => c.id === action.payload.id)
      if (challenge) {
        challenge.progress = action.payload.progress
      }
    },
    updateLeaderboard: (state, action: PayloadAction<Friend[]>) => {
      state.leaderboard = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { 
  addFriend, 
  removeFriend, 
  joinChallenge, 
  updateChallengeProgress,
  updateLeaderboard,
  setLoading,
  setError
} = socialSlice.actions
export default socialSlice.reducer