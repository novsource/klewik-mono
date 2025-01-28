import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AuctionSlot } from '../model'

type AuctionSlotsState = {
  slots: AuctionSlot[]
  dropoutSlots: AuctionSlot[]
}

const initialState: AuctionSlotsState = {
  slots: [],
  dropoutSlots: [],
}

const slice = createSlice({
  name: 'auctionSlots',
  initialState,
  reducers: {
    addSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter((slot) => !payload.includes(slot))

      state.slots = [...filtredSlots, ...payload]
    },
    updateSlot(state, action: PayloadAction<AuctionSlot>) {
      const payload = action.payload

      const filtredSlots = state.slots.filter((slot) => payload.id !== slot.id)

      state.slots = [...filtredSlots, payload]
    },
  },
})

const {
  actions: auctionSlotsActions,
  reducer: auctionSlotsReducer,
  selectors: auctionSlotsSelectors,
} = slice

export { auctionSlotsActions, auctionSlotsSelectors, auctionSlotsReducer }
