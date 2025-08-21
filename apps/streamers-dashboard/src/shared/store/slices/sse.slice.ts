import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

type SSEEvents = 'auctionSlots' | 'donations'

type SSESliceState = {
  [key in SSEEvents]: {
    isConnected: boolean
  }
}

const initialState: SSESliceState = {
  auctionSlots: {
    isConnected: false,
  },
  donations: {
    isConnected: false,
  },
}

const sseSlice = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    updateConnectStatus(
      state,
      action: PayloadAction<{ connected: boolean, eventType: SSEEvents }>,
    ) {
      const { connected, eventType } = action.payload

      state[eventType] = { isConnected: connected }
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
  },
})

export const {
  actions: sseActions,
  selectors: sseSelectors,
  reducer: sseReducer,
} = sseSlice
