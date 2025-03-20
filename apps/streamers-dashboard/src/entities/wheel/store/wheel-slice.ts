import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { validateSlotsPayload } from '../lib/react-redux'
import { WheelSlot } from '../model'

type WheelSettings = {
  spinTime: number
}

export type WheelState = {
  selectorTargetTitle: string
  slots: WheelSlot[]
  settings: WheelSettings
  isWheelSpinning: boolean
}

const initialState: WheelState = {
  selectorTargetTitle: 'Ожидание прокрутки колеса...',
  slots: [],
  settings: {
    spinTime: 2,
  },
  isWheelSpinning: false,
}

const wheelSlice = createSlice({
  name: 'wheel',
  initialState,
  reducers: {
    addSlots: {
      reducer: (state, action: PayloadAction<WheelSlot | WheelSlot[]>) => {
        const payload = action.payload

        state.slots = Array.isArray(payload)
          ? [...state.slots, ...payload]
          : [...state.slots, payload]
      },
      prepare: (payload: WheelSlot | WheelSlot[]) => ({
        payload: validateSlotsPayload(payload),
      }),
    },
    setSlots: {
      reducer: (state, action: PayloadAction<WheelSlot | WheelSlot[]>) => {
        const payload = action.payload

        state.slots = Array.isArray(payload) ? payload : [payload]
      },
      prepare: (payload: WheelSlot | WheelSlot[]) => ({
        payload: validateSlotsPayload(payload),
      }),
    },
    setSelectorTitleName: (state, action: PayloadAction<string>) => {
      state.selectorTargetTitle = action.payload
    },
    setIsWheelSpinning: (state, action: PayloadAction<boolean>) => {
      state.isWheelSpinning = action.payload
    },
    setSettings: (state, action: PayloadAction<Partial<WheelSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
  },
  selectors: {
    getSlots: (state) => {
      return state.slots
    },
    getSettings: (state) => {
      return state.settings
    },
    getSelectorTargetTitle: (state) => {
      return state.selectorTargetTitle
    },
    getIsWheelSpinning: (state) => {
      return state.isWheelSpinning
    },
  },
})

const {
  actions: wheelActions,
  selectors: wheelSelectors,
  reducer: wheelReducer,
} = wheelSlice

export { wheelActions, wheelSelectors, wheelReducer }
