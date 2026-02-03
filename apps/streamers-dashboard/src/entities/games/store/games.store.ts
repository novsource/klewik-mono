import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionGames } from '../model'

import { createSlice } from '@reduxjs/toolkit'

export type AuctionGamesSliceState = {
  game: AuctionGames
}

const initialState: AuctionGamesSliceState = {
  game: 'wheel',
}

const auctionGamesSlice = createSlice({
  name: 'auctionGames',
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<AuctionGames>) => {
      state.game = action.payload
    },
  },
  selectors: {
    getGame: state => state.game,
  },
})

export const {
  actions: auctionGamesActions,
  reducer: auctionGamesReducer,
  selectors: auctionGamesSelectors,
} = auctionGamesSlice
