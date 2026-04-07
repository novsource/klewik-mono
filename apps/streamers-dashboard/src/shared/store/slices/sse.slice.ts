import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type SSESliceState = {
  isConnected: boolean
  // isAllConnected: boolean
  // channels: {
  //   [key in SSEChannels]: {
  //     isConnected: boolean
  //     lastMessageId: number
  //   }
  // }
}

const initialState: SSESliceState = {
  isConnected: false,
  // isAllConnected: false,
  // channels: SSE_CHANNELS.reduce((state, channel) => {
  //   state[channel] = {
  //     isConnected: false,
  //     lastMessageId: 0,
  //   }

  //   return state
  // }, {} as SSESliceState['channels']),
}

// type UpdateConnectStatus = { isConnected: boolean, eventType: SSEChannels }
// type UpdateMessageId = { eventType: SSEChannels, id: number }

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    // updateConnectStatus(
    //   state,
    //   action: PayloadAction<UpdateConnectStatus>,
    // ) {
    //   const { isConnected, eventType } = action.payload

    //   state.channels[eventType] = { ...state.channels[eventType], isConnected }
    // },
    // updateMessageId(state, action: PayloadAction<UpdateMessageId>) {
    //   const { eventType, id } = action.payload

    //   state.channels[eventType] = { ...state.channels[eventType], lastMessageId: id }
    // },
    // setAllConnected(state, action: PayloadAction<boolean>) {
    //   state.isAllConnected = action.payload
    // },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    resetState() {
      return initialState
    },
  },
  selectors: {
    getState: state => state,
    getIsConnected: state => state.isConnected,
    // getEventStatus: (state, eventType: SSEChannels) => {
    //   return state.channels[eventType]
    // },
    // getIsAllEventsConnected: (state) => {
    //   return state.isAllConnected
    // },
  },
})

export const {
  actions: sseActions,
  selectors: sseSelectors,
  reducer: sseReducer,
} = sseSlice
