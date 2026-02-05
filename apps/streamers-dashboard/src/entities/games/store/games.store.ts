import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionGameMode, AuctionGames } from '../model'

import { createSlice } from '@reduxjs/toolkit'

export type AuctionGamesSliceState = {
  game: AuctionGames
  mode: AuctionGameMode
}

const initialState: AuctionGamesSliceState = {
  game: 'wheel',
  mode: 'classic',
}

const auctionGamesSlice = createSlice({
  name: 'auctionGames',
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<AuctionGames>) => {
      state.game = action.payload
    },
    setGameMode: (state, action: PayloadAction<AuctionGameMode>) => {
      state.mode = action.payload
    },
  },
  selectors: {
    getGame: state => state.game,
    getGameMode: state => state.mode,
  },
})

export const {
  actions: auctionGamesActions,
  reducer: auctionGamesReducer,
  selectors: auctionGamesSelectors,
} = auctionGamesSlice
