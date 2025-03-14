import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
    setConnected(
      state,
      action: PayloadAction<{ connected: boolean; eventType: SSEEvents }>
    ) {
      const { connected, eventType } = action.payload

      state[eventType] = { isConnected: connected }
    },
  },
  selectors: {
    getEventStatus: (state, eventType: SSEEvents) => {
      return state[eventType]
    },
  },
})

export const {
  actions: sseActions,
  selectors: sseSelectors,
  reducer: sseReducer,
} = sseSlice
