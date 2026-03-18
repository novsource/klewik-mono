import type { PayloadAction } from '@reduxjs/toolkit'

import type { Auction } from '../model'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionDTO } from '~shared/api/http/auction'

import { AUCTION_SLICE_INITIAL_STATE } from '../constants/slice-initial-state'
import { transformAuctionDTO } from '../lib'

export type AuctionSliceState = {
  info: Auction
}

const auctionSlice = createSlice({
  name: 'auction',
  initialState: AUCTION_SLICE_INITIAL_STATE,
  reducers: {
    updateInfo(state, action: PayloadAction<Partial<Auction>>) {
      state.info = { ...state.info, ...action.payload }
    },
    setAuction(state, action: PayloadAction<AuctionDTO>) {
      const auctionDTO = action.payload

      const transformedData = transformAuctionDTO(auctionDTO)

      state.info = transformedData
    },
  },
  selectors: {
    getInfo: state => state.info,
    getAuctionUUID: state => state.info.uuid,
    getIsBetsClosed: state => state.info.isBetsClosed,
    getIsAuctionEnded: state => state.info.isEnded,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
