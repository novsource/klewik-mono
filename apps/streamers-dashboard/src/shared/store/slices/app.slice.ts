import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppStoreState, SlotsSortingOptions, TimerSettings } from '../model'

const initialState: AppStoreState = {
  slotsSortOptions: {
    field: 'points',
    type: 'descending',
  },
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
    setSlotsSortOptions(state, action: PayloadAction<SlotsSortingOptions>) {
      state.slotsSortOptions = action.payload
    },
    setTimerSettings(state, action: PayloadAction<Partial<TimerSettings>>) {
      state.timerSettings = { ...state.timerSettings, ...action.payload }
    },
  },
  selectors: {
    getSlotsSortOptions: (state) => {
      return state.slotsSortOptions
    },
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
