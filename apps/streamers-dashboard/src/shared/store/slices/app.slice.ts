import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type AppStore = {
  auctionId: string
  auctionUrl: string
}

const initialState: AppStore = {
  auctionId: '',
  auctionUrl: '',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuctionId: (state, payload: PayloadAction<string>) => {
      state.auctionId = payload.payload
    },
    setAuctionUrl: (state, payload: PayloadAction<string>) => {
      state.auctionUrl = payload.payload
    },
  },
  selectors: {
    getAuctionId: (state) => {
      return state.auctionId
    },
    getAuctionUrl: (state) => {
      return state.auctionUrl
    },
  },
})

export const {
  reducer: appReducer,
  actions: appActions,
  selectors: appSelectors,
} = appSlice
