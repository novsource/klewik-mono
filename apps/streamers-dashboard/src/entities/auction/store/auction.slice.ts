import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { WheelSlot } from '~entities/wheel/model/@x'

import { Auction } from '../model'

type AuctionSliceState = {
  auctionInfo: Auction
  wheelSlotsData: WheelSlot[]
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
  wheelSlotsData: [],
}

const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuction(state, action: PayloadAction<Partial<Auction>>) {
      const auctionData = action.payload

      state.auctionInfo = { ...state.auctionInfo, ...auctionData }
    },
    setWheelSlots(state, action: PayloadAction<WheelSlot[]>) {
      const slots = action.payload

      state.wheelSlotsData = [...slots]
    },
  },
  selectors: {
    getAuctionId: (state) => state.auctionInfo.id,
    getAuctionUrl: (state) => state.auctionInfo.url,
    getAuctionInfo: (state) => state.auctionInfo,
    getWheelSlots: (state) => state.wheelSlotsData,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
