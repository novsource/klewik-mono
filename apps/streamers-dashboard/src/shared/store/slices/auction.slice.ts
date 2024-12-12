import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuctionSliceState = {
  auctionInfo: Partial<Auction>
  wheelSlotsData: AuctionSlotWithAngles[]
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
    setWheelSlots(state, payload: PayloadAction<AuctionSlotWithAngles[]>) {
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
