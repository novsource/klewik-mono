import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Auction } from '../model'

type AuctionSliceState = {
  auctionInfo: Auction
}

const initialState: AuctionSliceState = {
  auctionInfo: {
    id: '',
    ownerId: '',
    url: '',
    createAt: 0,
    endedAt: 0,
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
    getAuctionId: (state) => state.auctionInfo.id,
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
