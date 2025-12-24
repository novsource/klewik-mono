import { createListenerMiddleware } from '@reduxjs/toolkit'

import { sseActions } from '../slices'

const listeningMiddleware = createListenerMiddleware()

const startSSEListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

startSSEListening({
  actionCreator: sseActions.updateConnectStatus,
  effect: (_, api) => {
    const { dispatch, getState } = api

    const sseSliceState = getState().sse

    for (const channelName in sseSliceState.channels) {
      const castedName = channelName as keyof typeof sseSliceState.channels
      const isChannelConnected = sseSliceState.channels[castedName].isConnected

      if (!isChannelConnected) {
        dispatch(sseActions.setAllConnected(false))

        return
      }
    }

    dispatch(sseActions.setAllConnected(true))
  },
})

export const sseConnectionsListenerMiddlewares = [listeningMiddleware.middleware]
