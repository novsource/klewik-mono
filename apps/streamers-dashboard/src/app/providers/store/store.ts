import { configureStore } from '@reduxjs/toolkit'

import { auctionSlotsReducer } from '~entities/auction-slot/store'
import { auctionReducer } from '~entities/auction/store'
import { wheelReducer } from '~entities/wheel/store'

import { appReducer } from '~shared/store/slices'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auction: auctionReducer,
    auctionSlots: auctionSlotsReducer,
    wheel: wheelReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
