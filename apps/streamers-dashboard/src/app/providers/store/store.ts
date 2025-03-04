import { configureStore } from '@reduxjs/toolkit'

import { splittedAuctionApi as auctionApi } from '~entities/auction/api'
import { auctionReducer } from '~entities/auction/store'

import { splittedAuctionSlotsApi as auctionSlotsApi } from '~entities/auction-slot/api'
import {
  auctionSlotsListenersMiddlewares,
  auctionSlotsReducer,
} from '~entities/auction-slot/store'

import { donationsReducer } from '~entities/donation/store'

import { wheelReducer } from '~entities/wheel/store'

import { appReducer } from '~shared/store/slices'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auction: auctionReducer,
    auctionSlots: auctionSlotsReducer,
    donations: donationsReducer,
    wheel: wheelReducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
    [auctionSlotsApi.reducerPath]: auctionSlotsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(...auctionSlotsListenersMiddlewares)
      .concat(auctionApi.middleware, auctionSlotsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
