import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import { SSE_CHANNELS } from '~shared/constants/api'
import type { SSEChannels } from '~shared/constants/api'

type SSESliceState = {
  [key in SSEChannels]: {
    isConnected: boolean
    lastMessageId: number
  }
}

const initialState = SSE_CHANNELS.reduce((state, channel) => {
  state[channel] = {
    isConnected: false,
    lastMessageId: 0,
  }

  return state
}, {} as SSESliceState)

type UpdateConnectStatus = { isConnected: boolean, eventType: SSEChannels }
type UpdateMessageId = { eventType: SSEChannels, id: number }

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    updateConnectStatus(
      state,
      action: PayloadAction<UpdateConnectStatus>,
    ) {
      const { isConnected, eventType } = action.payload

      state[eventType] = { ...state[eventType], isConnected }
    },
    updateMessageId(state, action: PayloadAction<UpdateMessageId>) {
      const { eventType, id } = action.payload

      state[eventType] = { ...state[eventType], lastMessageId: id }
    },
    setAllConnected(state, action: PayloadAction<boolean>) {
      (Object.keys(state) as Array<keyof typeof state>).forEach((key) => {
        state[key].isConnected = action.payload
      })
    },
    resetState() {
      return initialState
    },
  },
  selectors: {
    getState: state => state,
    getEventStatus: (state, eventType: SSEChannels) => {
      return state[eventType]
    },
    getIsAllEventsConnected: (state) => {
      return (Object.keys(state) as Array<keyof typeof state>).every(key => state[key].isConnected)
    },
  },
})

export const {
  actions: sseActions,
  selectors: sseSelectors,
  reducer: sseReducer,
} = sseSlice
