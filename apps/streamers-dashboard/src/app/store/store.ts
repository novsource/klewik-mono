import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { auctionGamesReducer } from '~entities/games/store'

import { globalDialogsReducer } from '~app/components/global-dialogs/store/global-dialogs.slice'

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

import { auctionSlotsSSEApi, splittedAuthApi as authApi, donationsSSEApi, integrationsSSEApi } from '~shared/store/api'
import { sseConnectionsListenerMiddlewares } from '~shared/store/middlewares'
import { appReducer, sseReducer } from '~shared/store/slices'

const rootReducer = combineReducers({
  app: appReducer,
  auction: auctionReducer,
  auctionSlots: auctionSlotsReducer,
  auctionGames: auctionGamesReducer,
  donations: donationsReducer,
  globalDialogs: globalDialogsReducer,
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
  [integrationsSSEApi.reducerPath]: integrationsSSEApi.reducer,
})

// const actionsBlacklist = [
//   globalDialogsActions.setDialogOpenStatus.type,
//   globalDialogsActions.setDialogState.type,
//   sseActions.resetState.type,
//   sseActions.setAllConnected.type,
// ] as const

// const syncMiddleware = createStateSyncMiddleware({
//   predicate: (action) => {
//     const isUserNotInsideDashboard = !window.location.pathname.split('/').includes('dashboard')

//     if (isUserNotInsideDashboard)
//       return false

//     if (isAction(action) && Array.isArray(actionsBlacklist)) {
//       return !actionsBlacklist.includes(action.type)
//     }

//     return false
//   },
//   receiveState: (currentState: ReducerState<typeof rootReducer>, updatedState: ReducerState<typeof rootReducer>) => {
//     const isUserNotInsideDashboard = !window.location.pathname.split('/').includes('dashboard')

//     console.log(isUserNotInsideDashboard)

//     if (isUserNotInsideDashboard)
//       return currentState

//     return updatedState
//   },
// })
// const syncReducer = withReduxStateSync(rootReducer)

export const createStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(
        // syncMiddleware,
        ...auctionSlotsListenerMiddlewares,
        ...donationsListenerMiddlewares,
        ...sseConnectionsListenerMiddlewares,
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
        integrationsSSEApi.middleware,
      ),
})

export const rootStore = createStore()

// initStateWithPrevTab(rootStore)

export type RootState = ReturnType<typeof rootStore.getState>
export type StoreDispatch = typeof rootStore.dispatch
