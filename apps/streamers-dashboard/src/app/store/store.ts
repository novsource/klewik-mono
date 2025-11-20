import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { initMessageListener } from 'redux-state-sync'

import { splittedAuctionApi as auctionApi } from '~entities/auction/api'
import { auctionReducer } from '~entities/auction/store'

import { splittedAuctionSlotsApi as auctionSlotsApi } from '~entities/auction-slot/api'
import {
  auctionSlotsListenerMiddlewares,
  auctionSlotsReducer,
} from '~entities/auction-slot/store'

import { splittedDonationApi as donationsApi } from '~entities/donation/api'
import { donationsReducer } from '~entities/donation/store'
import { donationsListenerMiddlewares } from '~entities/donation/store/donations.middlewares'

import { splittedIntegrationsApi as integrationsApi } from '~entities/integrations/api'
import { integrationsReducer } from '~entities/integrations/store'

import { splittedWheelApi as wheelApi } from '~entities/wheel/api'
import { wheelReducer } from '~entities/wheel/store'

import { auctionSlotsSSEApi, splittedAuthApi as authApi, donationsSSEApi } from '~shared/store/api'
import { appReducer, sseReducer } from '~shared/store/slices'

const rootReducer = combineReducers({
  app: appReducer,
  auction: auctionReducer,
  auctionSlots: auctionSlotsReducer,
  donations: donationsReducer,
  integrations: integrationsReducer,
  sse: sseReducer,
  wheel: wheelReducer,
  [wheelApi.reducerPath]: wheelApi.reducer,
  [auctionApi.reducerPath]: auctionApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [auctionSlotsApi.reducerPath]: auctionSlotsApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [donationsApi.reducerPath]: donationsApi.reducer,
  [donationsSSEApi.reducerPath]: donationsSSEApi.reducer,
  [auctionSlotsSSEApi.reducerPath]: auctionSlotsSSEApi.reducer,
})

// const persistedReducer = persistReducer(
//   {
//     key: '-persist',
//     storage: localStorage,
//     keyPrefix: 'store',
//     blacklist: ['sse', 'sseApi'],
//   },
//   rootReducer,
// )

// const syncStoreConfig: ReduxStateSyncConfig = {
//   blacklist: [
//     'persist/PERSIST',
//     'persist/REHYDRATE',
//     'sseApi/endpoints/connectSlotsSSE',
//     'sseApi/endpoints/connectDonationsSSE',
//   ],
// }

// const syncMiddleware = createStateSyncMiddleware(syncStoreConfig)

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(
        ...auctionSlotsListenerMiddlewares,
        ...donationsListenerMiddlewares,
      )
      .concat(
        auctionApi.middleware,
        authApi.middleware,
        auctionSlotsApi.middleware,
        donationsApi.middleware,
        wheelApi.middleware,
        integrationsApi.middleware,
        donationsSSEApi.middleware,
        auctionSlotsSSEApi.middleware,
      ),
})

// export const persistor = persistStore(store)

initMessageListener(store)

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
