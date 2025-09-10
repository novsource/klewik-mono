import { createApi } from '@reduxjs/toolkit/query/react'

import type { SSEQueryArgs } from '~shared/lib/redux-toolkit'
import { sseBaseQuery } from '~shared/lib/redux-toolkit'

export type ConnectSSEQueryArgs = Omit<SSEQueryArgs, 'url'> & {
  auctionUUID: string
}

export const splittedSSEApi = createApi({
  baseQuery: sseBaseQuery(),
  reducerPath: 'sseApi',
  endpoints: builder => ({
    connectSlotsSSE: builder.query<void, ConnectSSEQueryArgs>({
      query: ({ auctionUUID, ...sseConnectionOptions }) =>
        ({ url: `${auctionUUID}/slots-events`, ...sseConnectionOptions }),
    }),
    connectDonationsSSE: builder.query<void, ConnectSSEQueryArgs>({
      query: ({ auctionUUID, ...sseConnectionOptions }) =>
        ({ url: `${auctionUUID}/donations-events`, ...sseConnectionOptions }),
    }),
  }),
})

export const {
  useConnectDonationsSSEQuery,
  useConnectSlotsSSEQuery,
  useLazyConnectDonationsSSEQuery,
  useLazyConnectSlotsSSEQuery,
} = splittedSSEApi
