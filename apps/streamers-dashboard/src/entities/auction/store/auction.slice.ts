import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
    setAuction(state, payload: PayloadAction<Partial<Auction>>) {
      const auctionData = payload.payload

      state.auctionInfo = { ...auctionData }
    },
    setWheelSlots(state, payload: PayloadAction<WheelSlot[]>) {
      const slots = payload.payload

      state.wheelSlotsData = [...slots]
    },
  },
  selectors: {
    getAuctionUrl: (state) => state.auctionInfo.url,
    getAuctionInfo: (state) => state.auctionInfo,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
