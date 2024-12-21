import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { WheelEventsBus } from '../events'
import { WheelSlot } from '../model'
import { validateSlotsPayload } from './actions-validation'

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
})

export { wheelSlice }
