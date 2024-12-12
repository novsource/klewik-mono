import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './slices/app.slice'
import { auctionReducer } from './slices/auction.slice'

export const store = configureStore({
  reducer: { app: appReducer, auction: auctionReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
