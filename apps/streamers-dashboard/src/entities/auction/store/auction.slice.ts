import type { PayloadAction } from '@reduxjs/toolkit'

import type { Auction } from '../model'
import type { AuctionType } from '../model/auction.types'

import { createSlice } from '@reduxjs/toolkit'

import type { AuctionDTO } from '~shared/api/http/auction'

import { AUCTION_SLICE_INITIAL_STATE } from '../constants/slice-initial-state'
import { transformAuctionDTO } from '../lib'

export type AuctionSliceState = {
  type: NullablePossible<AuctionType>
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
    setAuctionType(state, action: PayloadAction<AuctionType>) {
      state.type = action.payload
    },
  },
  selectors: {
    getInfo: state => state.info,
    getAuctionType: state => state.type,
    getAuctionUUID: state => state.info.uuid,
    getIsBetsClosed: state => state.info.isBetsClosed,
    getWinnerId: state => state.info.winnerSlotId,
    getIsAuctionEnded: state => state.info.isEnded,
  },
})

export const {
  reducer: auctionReducer,
  selectors: auctionSelectors,
  actions: auctionActions,
} = auctionSlice
