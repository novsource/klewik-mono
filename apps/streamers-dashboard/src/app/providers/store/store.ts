import { configureStore } from '@reduxjs/toolkit'

import { auctionReducer } from '~entities/auction/store'
import { wheelReducer } from '~entities/wheel/store'

import { appReducer } from '~shared/store/slices'

import { socketReducer } from './slices/socket.slice'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auction: auctionReducer,
    wheel: wheelReducer,
    socket: socketReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
