import { createListenerMiddleware } from '@reduxjs/toolkit'

const listeningMiddleware = createListenerMiddleware()

const startSSEListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

// startSSEListening({
//   actionCreator: sseActions.updateConnectStatus,
//   effect: (_, api) => {
//     const { dispatch, getState } = api

//     const sseSliceState = getState().sse

//     let isAllConnected = true

//     for (const channelName in sseSliceState.channels) {
//       const castedChannelName = channelName as keyof typeof sseSliceState.channels
//       const channelState = sseSliceState.channels[castedChannelName]

//       const isChannelNotConnected = !channelState.isConnected

//       if (isChannelNotConnected) {
//         isAllConnected = false
//       }
//     }

//     if (isAllConnected && !sseSliceState.isAllConnected) {
//       dispatch(sseActions.setAllConnected(true))
//     }

//     if (!isAllConnected && sseSliceState.isAllConnected) {
//       dispatch(sseActions.setAllConnected(false))
//     }
//   },
// })

export const sseConnectionsListenerMiddlewares = [listeningMiddleware.middleware]
