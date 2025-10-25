import type { PayloadAction } from '@reduxjs/toolkit'

import type { WheelSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { validateSlotsPayload } from '../lib/react-redux'

type WheelSettings = {
  spinTime: number
}

type WheelSpinStatus = 'idle' | 'prepare' | 'spinning'

type WheelRotateValues = {
  current: number
  final: number
}

export type WheelState = {
  highlightedSlotId: NullablePossible<number>
  wheelSpinStatus: WheelSpinStatus
  rotateValue: WheelRotateValues
  selectorTargetTitle: string
  slots: WheelSlot[]
  settings: WheelSettings
}

const initialState: WheelState = {
  wheelSpinStatus: 'idle',
  highlightedSlotId: null,
  rotateValue: {
    current: 0,
    final: 0,
  },
  selectorTargetTitle: 'Ожидание прокрутки колеса...',
  slots: [],
  settings: {
    spinTime: 2,
  },
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
    setWheelStatus: (state, action: PayloadAction<WheelSpinStatus>) => {
      state.wheelSpinStatus = action.payload
    },
    setSettings: (state, action: PayloadAction<Partial<WheelSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    setRotateValue: (state, action: PayloadAction<WheelRotateValues>) => {
      state.rotateValue = action.payload
    },
    setHighlightedSlotId: (state, action: PayloadAction<NullablePossible<number>>) => {
      state.highlightedSlotId = action.payload
    },
  },
  selectors: {
    getSlots: state => state.slots,
    getSettings: state => state.settings,
    getSelectorTargetTitle: state => state.selectorTargetTitle,
    getIsWheelSpinning: state => state.wheelSpinStatus === 'spinning',
    getRotateValue: state => state.rotateValue,
    getWheelStatus: state => state.wheelSpinStatus,
    getHighlightedSlotId: state => state.highlightedSlotId,
  },
})

const {
  actions: wheelActions,
  selectors: wheelSelectors,
  reducer: wheelReducer,
} = wheelSlice

export { wheelActions, wheelReducer, wheelSelectors }
