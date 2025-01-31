import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AuctionSlot } from '~entities/auction-slot/model'
import { WheelSlot } from '~entities/wheel/model/@x'

import { Auction } from '../model'

type AuctionSliceState = {
  auctionInfo: Partial<Auction>
  wheelSlotsData: WheelSlot[]
}

const initialState: AuctionSliceState = {
  auctionInfo: {},
  wheelSlotsData: [],
}

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuction(state, action: PayloadAction<Partial<Auction>>) {
      const auctionData = action.payload

      state.auctionInfo = { ...auctionData }
    },
    setWheelSlots(state, action: PayloadAction<WheelSlot[]>) {
      const slots = action.payload

      state.wheelSlotsData = [...slots]
    },
    setAuctionSlots(state, action: PayloadAction<AuctionSlot[]>) {
      const payloadSlots = action.payload

      const auctionSlots = state.auctionInfo.slots

      if (!auctionSlots) {
        state.auctionInfo.slots = payloadSlots
        return
      }

      state.auctionInfo.slots = [...auctionSlots, ...payloadSlots]
    },
  },
  selectors: {
    getAuctionUrl: (state) => state.auctionInfo.url,
    getAuctionInfo: (state) => state.auctionInfo,
    getAuctionSlots: (state) => state.auctionInfo.slots,
    getWheelSlots: (state) => state.wheelSlotsData,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
