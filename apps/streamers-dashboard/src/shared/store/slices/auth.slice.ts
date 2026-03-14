import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type AuthSliceState = {
  isAuth: boolean
  lastRefreshTimestamp: number
}

const initialState: AuthSliceState = {
  isAuth: false,
  lastRefreshTimestamp: 0,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload
    },
    setLastRefreshTimestamp(state, action: PayloadAction<number>) {
      state.lastRefreshTimestamp = action.payload
    },
  },
})

export const { actions: authSliceActions, selectors: authSliceSelectors, reducer: authSliceReducer } = authSlice
