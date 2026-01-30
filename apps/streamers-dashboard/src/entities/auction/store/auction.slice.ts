import type { PayloadAction } from '@reduxjs/toolkit'

import type { Auction } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import { getAuctionInfoThunk } from '../api'

type AuctionSliceState = {
  auctionInfo: Auction
}

const initialState: AuctionSliceState = {
  auctionInfo: {
    id: 0,
    auctionUUID: '',
    dropoutSlotsIds: [],
    slotsIds: [],
    winnerSlotId: null,
    processedDonationsIds: [],
    ownerId: '',
    createAt: '',
    endedAt: null,
    isBetsClosed: false,
    isEnded: false,
    wheelMode: 'classic',
  },
}

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuction(state, action: PayloadAction<Partial<Auction>>) {
      const auctionData = action.payload

      state.auctionInfo = { ...state.auctionInfo, ...auctionData }
    },
    updateWheelMode(state, action: PayloadAction<Auction['wheelMode']>) {
      state.auctionInfo.wheelMode = action.payload
    },
  },
  selectors: {
    getAuctionUUID: state => state.auctionInfo.auctionUUID,
    getAuctionInfo: state => state.auctionInfo,
    getIsBetsClosed: state => state.auctionInfo.isBetsClosed,
    getWheelMode: state => state.auctionInfo.wheelMode,
  },
  extraReducers: (builder) => {
    builder.addCase(getAuctionInfoThunk.fulfilled, (state, action) => {
      const auctionInfo = action.payload

      state.auctionInfo = auctionInfo!
    })
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
