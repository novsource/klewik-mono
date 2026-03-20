import { createApi } from '@reduxjs/toolkit/query/react'

import { auctionSlotsSSEClient } from '~shared/api/sse/clients/auction-slots'
import { donationsSSEClient } from '~shared/api/sse/clients/donations'
import { integrationsSSEClient } from '~shared/api/sse/clients/integrations/integrations-client'

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

export const integrationsSSEApi = createApi({
  baseQuery: sseEventQuery(integrationsSSEClient, {
    connectOptions: { openWhenHidden: true },
  }),
  reducerPath: 'sseIntegrationsApi',
  endpoints: builder => ({
    connectIntegrationsSSE: builder.query<void, { auctionUUID: string }>({
      query: ({ auctionUUID }) => ({ eventURL: `${auctionUUID}/sse/integrations-events` }),
    }),
  }),
})

export const { useLazyConnectDonationsSSEQuery } = donationsSSEApi
export const { useLazyConnectAuctionSlotsSSEQuery } = auctionSlotsSSEApi
export const { useLazyConnectIntegrationsSSEQuery } = integrationsSSEApi

export type ConnectSSEQueryArgs = Omit<SSEQueryArgs, 'url'> & {
  auctionUUID: string
}
