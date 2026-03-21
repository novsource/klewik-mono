import { createApi } from '@reduxjs/toolkit/query/react'

import type { IntegrationsPlatformsDTO } from '~shared/api/http/integrations'

import { axiosAuthBaseQuery } from '~shared/lib/redux-toolkit'

import { integrationsActions } from '../store'

type GetConnectedIntegrationsQueryResult = Partial<Record<IntegrationsPlatformsDTO, {
  isValid: boolean
  isConnected: boolean
}>>

type GetConnectedIntegrationsQueryArgs = {
  auctionUUID: string
}

export const splittedIntegrationsApi = createApi({
  baseQuery: axiosAuthBaseQuery({ baseUrl: '/auctions' }),
  reducerPath: 'integrationsApi',
  endpoints: builder => ({
    getConnectedIntegrations: builder.query<GetConnectedIntegrationsQueryResult, GetConnectedIntegrationsQueryArgs>({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/integrations/stats` }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;

          (Object.keys(response.data) as Array<keyof typeof response.data>).forEach((platform) => {
            if (response.data[platform])
              dispatch(integrationsActions.setPlatformStatus({ platform, data: response.data[platform] }))
          })
        }
        catch (error) {
          if (error instanceof Error)
            throw error
        }
      },
    }),
  }),
})
