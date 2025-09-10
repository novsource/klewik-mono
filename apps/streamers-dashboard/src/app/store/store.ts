import type { Config as ReduxStateSyncConfig } from 'redux-state-sync'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import createMigrate from 'redux-persist/es/createMigrate'
import persistStore from 'redux-persist/es/persistStore'
import localStorage from 'redux-persist/es/storage'
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'

import { splittedAuctionApi as auctionApi } from '~entities/auction/api'
import { auctionReducer } from '~entities/auction/store'

import { splittedAuctionSlotsApi as auctionSlotsApi } from '~entities/auction-slot/api'
import {
  auctionSlotsListenersMiddlewares,
  auctionSlotsReducer,
} from '~entities/auction-slot/store'

import { splittedDonationApi as donationsApi } from '~entities/donation/api'
import { donationsReducer } from '~entities/donation/store'

import { splittedIntegrationsApi as integrationsApi } from '~entities/integrations/api'
import { integrationsReducer } from '~entities/integrations/store'

import { wheelReducer } from '~entities/wheel/store'

import { splittedAuthApi as authApi, splittedSSEApi as sseApi } from '~shared/store/api'
import { appReducer, sseReducer } from '~shared/store/slices'

const rootReducer = combineReducers({
  app: appReducer,
  auction: auctionReducer,
  auctionSlots: auctionSlotsReducer,
  donations: donationsReducer,
  integrations: integrationsReducer,
  sse: sseReducer,
  wheel: wheelReducer,
  [auctionApi.reducerPath]: auctionApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [auctionSlotsApi.reducerPath]: auctionSlotsApi.reducer,
  [integrationsApi.reducerPath]: integrationsApi.reducer,
  [donationsApi.reducerPath]: donationsApi.reducer,
  [sseApi.reducerPath]: sseApi.reducer,
})

const migrations = {
  0: (state) => {
    return { ...state, sse: {
      auctionSlots: {
        isConnected: false,
        lastMessageId: 0,
      },
      donations: {
        isConnected: false,
        lastMessageId: 0,
      },
    } }
  },
}

const persistedReducer = persistReducer(
  {
    key: '-persist',
    storage: localStorage,
    keyPrefix: 'store',
    migrate: createMigrate(migrations),
    blacklist: ['sse', 'sseApi'],
  },
  rootReducer,
)

const syncStoreConfig: ReduxStateSyncConfig = {
  blacklist: [
    'persist/PERSIST',
    'persist/REHYDRATE',
    'sseApi/endpoints/connectSlotsSSE',
    'sseApi/endpoints/connectDonationsSSE',
  ],
}

const syncMiddleware = createStateSyncMiddleware(syncStoreConfig)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(...auctionSlotsListenersMiddlewares)
      .concat(
        auctionApi.middleware,
        authApi.middleware,
        auctionSlotsApi.middleware,
        donationsApi.middleware,
        integrationsApi.middleware,
        sseApi.middleware,
        syncMiddleware,
      ),
})

export const persistor = persistStore(store)

initMessageListener(store)

export type RootState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch
