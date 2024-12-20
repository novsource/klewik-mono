import { configureStore } from '@reduxjs/toolkit'

import { wheelReducer } from '~entities/wheel/store'

import { appReducer } from './slices/app.slice'
import { auctionReducer } from './slices/auction.slice'

export const store = configureStore({
  reducer: { app: appReducer, auction: auctionReducer, wheel: wheelReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
