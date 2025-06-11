import { configureStore } from '@reduxjs/toolkit'
import { splittedIntegrationsApi as integrationsApi } from '~entities/integrations/api'
import { integrationsReducer } from '~entities/integrations/store'

import { splittedAuctionApi as auctionApi } from '~entities/auction/api'
import { auctionReducer } from '~entities/auction/store'

import { splittedAuctionSlotsApi as auctionSlotsApi } from '~entities/auction-slot/api'
import {
  auctionSlotsListenersMiddlewares,
  auctionSlotsReducer,
} from '~entities/auction-slot/store'

import { splittedDonationApi as donationsApi } from '~entities/donation/api'
import { donationsReducer } from '~entities/donation/store'

import { wheelReducer } from '~entities/wheel/store'

import { splittedSSEApi as sseApi } from '~shared/store/api'
import { appReducer, sseReducer } from '~shared/store/slices'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auction: auctionReducer,
    auctionSlots: auctionSlotsReducer,
    donations: donationsReducer,
    integrations: integrationsReducer,
    sse: sseReducer,
    wheel: wheelReducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
    [auctionSlotsApi.reducerPath]: auctionSlotsApi.reducer,
    [integrationsApi.reducerPath]: integrationsApi.reducer,
    [donationsApi.reducerPath]: donationsApi.reducer,
    [sseApi.reducerPath]: sseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(...auctionSlotsListenersMiddlewares)
      .concat(
        auctionApi.middleware,
        auctionSlotsApi.middleware,
        donationsApi.middleware,
        integrationsApi.middleware,
        sseApi.middleware
      ),
})

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
