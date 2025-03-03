import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AuctionSlot } from '../model'

type AuctionSlotsState = {
  slots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
  slotsPointsSum: number
}

const initialState: AuctionSlotsState = {
  slots: [],
  dropoutSlots: [],
  slotsPointsSum: 0,
}

const slice = createSlice({
  name: 'auctionSlots',
  initialState,
  reducers: {
    addSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter(
        (slot) => !payload.find((item) => slot.id === item.id)
      )

      if (filtredSlots.length === state.slots.length) {
        state.slotsPointsSum += payload.reduce((a, slot) => a + slot.points, 0)
      } else {
        state.slotsPointsSum =
          filtredSlots.reduce((a, b) => a + b.points, 0) +
          payload.reduce((a, b) => a + b.points, 0)
      }

      state.slots = [...filtredSlots, ...payload]
    },
    updateSlot(state, action: PayloadAction<AuctionSlot>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter((slot) => payload.id !== slot.id)

      state.slots = [...filtredSlots, payload]
    },
    deleteSlot(state, action: PayloadAction<{ id: AuctionSlot['id'] }>) {
      const payload = action.payload

      state.slots = state.slots.filter((slot) => slot.id !== payload.id)
    },
  },
  selectors: {
    getSlots(state) {
      return state.slots
    },
    getDropoutSlots(state) {
      return state.dropoutSlots
    },
    getSlotsPointsSum(state) {
      return state.slotsPointsSum
    },
  },
})

const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice

export { auctionSlotsActions, auctionSlotsSelectors, auctionSlotsReducer }
