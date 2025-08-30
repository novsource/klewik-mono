import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type SSEEvents = 'auctionSlots' | 'donations'

type SSESliceState = {
  [key in SSEEvents]: {
    isConnected: boolean
    lastMessageId: number
  }
}

const initialState: SSESliceState = {
  auctionSlots: {
    isConnected: false,
    lastMessageId: 0,
  },
  donations: {
    isConnected: false,
    lastMessageId: 0,
  },
}

type UpdateConnectStatus = { isConnected: boolean, eventType: SSEEvents }
type UpdateMessageId = { eventType: SSEEvents, id: number }

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
  },
  selectors: {
    getEventStatus: (state, eventType: SSEEvents) => {
      return state[eventType]
    },
    getIsAllEventsConnected: (state) => {
      return (Object.keys(state) as Array<keyof typeof state>).every(key => state[key].isConnected)
    },
    getLastMessageIds: (state) => {

    },
  },
})

export const {
  actions: sseActions,
  selectors: sseSelectors,
  reducer: sseReducer,
} = sseSlice
