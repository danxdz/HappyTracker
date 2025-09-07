import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './modules/auth/authSlice'
import { avatarSlice } from './modules/avatar/avatarSlice'
import { healthSlice } from './modules/health/healthSlice'
import { socialSlice } from './modules/social/socialSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    avatar: avatarSlice.reducer,
    health: healthSlice.reducer,
    social: socialSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch