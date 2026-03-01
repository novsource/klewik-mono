import type { PayloadAction } from '@reduxjs/toolkit'

import type { AuctionGameMode, AuctionGames } from '../model'

import { createSlice } from '@reduxjs/toolkit'

export type WheelSlicesSizeMode = 'auto' | 'points' | 'equals'

type WheelGameSettings = {
  spinTime: number
  slicesDisplayMode: WheelSlicesSizeMode
}

type CardsGameSettings = {
  cardRevealTime: number
}

type GamesSettings = {
  wheel: WheelGameSettings
  cards: CardsGameSettings
}

export type AuctionGamesSliceState = {
  game: AuctionGames
  mode: AuctionGameMode
  gamesSettings: GamesSettings
}

const initialState: AuctionGamesSliceState = {
  game: 'wheel',
  mode: 'classic',
  gamesSettings: {
    wheel: {
      spinTime: 2,
      slicesDisplayMode: 'auto',
    },
    cards: {
      cardRevealTime: 4,
    },
  },
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
    setWheelGameSettings: (state, action: PayloadAction<Partial<WheelGameSettings>>) => {
      state.gamesSettings.wheel = { ...state.gamesSettings.wheel, ...action.payload }
    },
    setCardsGameSettings: (state, action: PayloadAction<Partial<CardsGameSettings>>) => {
      state.gamesSettings.cards = { ...state.gamesSettings.cards, ...action.payload }
    },
  },
  selectors: {
    getGame: state => state.game,
    getGameMode: state => state.mode,
    getWheelGameSettings: state => state.gamesSettings.wheel,
    getCardsGameSettings: state => state.gamesSettings.cards,
  },
})

export const {
  actions: auctionGamesActions,
  reducer: auctionGamesReducer,
  selectors: auctionGamesSelectors,
} = auctionGamesSlice
