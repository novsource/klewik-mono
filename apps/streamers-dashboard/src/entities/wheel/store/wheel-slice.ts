import type { PayloadAction } from '@reduxjs/toolkit'

import type { WheelSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { validateSlotsPayload } from '../lib/react-redux'

type WheelSettings = {
  spinTime: number
}

export type WheelState = {
  rotateValue: number
  selectorTargetTitle: string
  slots: WheelSlot[]
  settings: WheelSettings
  isWheelSpinning: boolean
}

const initialState: WheelState = {
  rotateValue: 0,
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
    setRotateValue: (state, action: PayloadAction<number>) => {
      state.rotateValue = action.payload
    },
  },
  selectors: {
    getSlots: state => state.slots,
    getSettings: state => state.settings,
    getSelectorTargetTitle: state => state.selectorTargetTitle,
    getIsWheelSpinning: state => state.isWheelSpinning,
    getRotateValue: state => state.rotateValue,
  },
})

const {
  actions: wheelActions,
  selectors: wheelSelectors,
  reducer: wheelReducer,
} = wheelSlice

export { wheelActions, wheelReducer, wheelSelectors }
