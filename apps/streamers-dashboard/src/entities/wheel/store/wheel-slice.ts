import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { WheelEventsBus } from '../events'
import { validateSlotsPayload } from '../lib/react-redux'
import { WheelSlot } from '../model'

export type WheelState = {
  slots: WheelSlot[]
  emitter: WheelEventsBus
  settings: {}
}

const initialState: WheelState = {
  slots: [],
  emitter: new WheelEventsBus(),
  settings: {},
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
  },
  selectors: {
    getSlots: (state) => {
      return state.slots
    },
    getSettings: (state) => {
      return state.settings
    },
    getEventBus: (state) => {
      return state.emitter
    },
  },
})

const {
  actions: wheelActions,
  selectors: wheelSelectors,
  reducer: wheelReducer,
} = wheelSlice

export { wheelActions, wheelSelectors, wheelReducer }
