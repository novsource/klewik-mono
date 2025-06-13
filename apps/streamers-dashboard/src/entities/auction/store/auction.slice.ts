import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Auction } from '../model'

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
    url: '',
    createAt: new Date(),
    endedAt: new Date(),
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
  },
  selectors: {
    getAuctionUUID: (state) => state.auctionInfo.auctionUUID,
    getAuctionUrl: (state) => state.auctionInfo.url,
    getAuctionInfo: (state) => state.auctionInfo,
    getBetsStatus: (state) => state.auctionInfo.isBetsClosed,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
