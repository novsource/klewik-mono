import { createApi } from '@reduxjs/toolkit/query/react'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'

import type { SSEQueryArgs } from '~shared/lib/redux-toolkit'
import { sseEventQuery } from '~shared/lib/redux-toolkit'

export const donationsSSEApi = createApi({
  baseQuery: sseEventQuery(donationsSSEClient, {
    connectOptions: { openWhenHidden: true },
  }),
  reducerPath: 'sseDonationsApi',
  endpoints: builder => ({
    connectDonationsSSE: builder.query<void, { auctionUUID: string }>({
      query: ({ auctionUUID }) => ({ eventURL: `${auctionUUID}/sse/donations-events` }),
    }),
  }),
})

export const auctionSlotsSSEApi = createApi({
  baseQuery: sseEventQuery(auctionSlotsSSEClient, {
    connectOptions: { openWhenHidden: true },
  }),
  reducerPath: 'sseAuctionSlotsApi',
  endpoints: builder => ({
    connectAuctionSlotsSSE: builder.query<void, { auctionUUID: string }>({
      query: ({ auctionUUID }) => ({ eventURL: `${auctionUUID}/sse/slots-events` }),
    }),
  }),
})

export const { useLazyConnectDonationsSSEQuery } = donationsSSEApi
export const { useLazyConnectAuctionSlotsSSEQuery } = auctionSlotsSSEApi

export type ConnectSSEQueryArgs = Omit<SSEQueryArgs, 'url'> & {
  auctionUUID: string
}

// export const splittedSSEApi = createApi({
//   baseQuery: sseBaseQuery(),
//   reducerPath: 'sseApi',
//   endpoints: builder => ({
//     connectSlotsSSE: builder.query<void, ConnectSSEQueryArgs>({
//       query: ({ auctionUUID, ...sseConnectionOptions }) =>
//         ({ url: `${auctionUUID}/sse/slots-events`, ...sseConnectionOptions }),
//     }),
//     connectDonationsSSE: builder.query<void, ConnectSSEQueryArgs>({
//       query: ({ auctionUUID, ...sseConnectionOptions }) =>
//         ({ url: `${auctionUUID}/sse/donations-events`, ...sseConnectionOptions }),
//       async onCacheEntryAdded(_, api) {
//         await api.cacheDataLoaded
//       },
//     }),
//   }),
// })

// export const {
//   useConnectDonationsSSEQuery,
//   useConnectSlotsSSEQuery,
//   useLazyConnectDonationsSSEQuery,
//   useLazyConnectSlotsSSEQuery,
// } = splittedSSEApi
