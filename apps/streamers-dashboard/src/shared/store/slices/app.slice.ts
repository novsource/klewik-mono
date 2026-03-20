import type { PayloadAction } from '@reduxjs/toolkit'

import type { AppStoreState, TimerSettings } from '../model'

import { createSlice } from '@reduxjs/toolkit'

const initialState: AppStoreState = {
  timerSettings: {
    addedTimeValue: 10,
    decreaseTimeValue: 10,
    initial: {
      minutes: 10,
      seconds: 0,
    },
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTimerSettings(state, action: PayloadAction<Partial<TimerSettings>>) {
      state.timerSettings = { ...state.timerSettings, ...action.payload }
    },
  },
  selectors: {
    getTimerSettings: (state) => {
      return state.timerSettings
    },
  },
})

export const {
  reducer: appReducer,
  actions: appActions,
  selectors: appSelectors,
} = appSlice
