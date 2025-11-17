import type { PayloadAction } from '@reduxjs/toolkit'

import type { WheelSlot } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { validateWheelSlotsPayload } from '../lib/react-redux'

type WheelSettings = {
  spinTime: number
}

type SpinStatus = 'idle' | 'prepare' | 'spinning'

type RotateValues = {
  current: number
  final: number
}

export type WheelState = {
  spinTarget: NullablePossible<WheelSlot>
  highlightedSlotId: NullablePossible<number>
  spinStatus: SpinStatus
  rotateValue: RotateValues
  selectorTargetTitle: string
  slots: WheelSlot[]
  settings: WheelSettings
}

const initialState: WheelState = {
  spinTarget: null,
  spinStatus: 'idle',
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
      prepare: (payload: WheelSlot | WheelSlot[]) => {
        return { payload: validateWheelSlotsPayload(payload) }
      },
    },
    setSlots: {
      reducer: (state, action: PayloadAction<WheelSlot | WheelSlot[]>) => {
        const payload = action.payload

        state.slots = Array.isArray(payload) ? payload : [payload]
      },
      prepare: (payload: WheelSlot | WheelSlot[]) => {
        const validatedPayload = validateWheelSlotsPayload(payload)

        return { payload: validatedPayload }
      },
    },
    setSelectorTitleName: (state, action: PayloadAction<string>) => {
      state.selectorTargetTitle = action.payload
    },
    setWheelStatus: (state, action: PayloadAction<SpinStatus>) => {
      state.spinStatus = action.payload
    },
    setSettings: (state, action: PayloadAction<Partial<WheelSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    setRotateValue: (state, action: PayloadAction<RotateValues>) => {
      state.rotateValue = action.payload
    },
    setHighlightedSlotId: (state, action: PayloadAction<NullablePossible<number>>) => {
      state.highlightedSlotId = action.payload
    },
    setSpinTarget: (state, action: PayloadAction<NullablePossible<WheelSlot>>) => {
      state.spinTarget = action.payload
    },
  },
  selectors: {
    getSlots: state => state.slots,
    getSettings: state => state.settings,
    getSelectorTargetTitle: state => state.selectorTargetTitle,
    getIsWheelSpinning: state => state.spinStatus === 'spinning',
    getRotateValue: state => state.rotateValue,
    getSpinTarget: state => state.spinTarget,
    getWheelStatus: state => state.spinStatus,
    getHighlightedSlotId: state => state.highlightedSlotId,
  },
})

const {
  actions: wheelActions,
  selectors: wheelSelectors,
  reducer: wheelReducer,
} = wheelSlice

export { wheelActions, wheelReducer, wheelSelectors }
