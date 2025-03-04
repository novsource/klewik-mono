import { integrationsActions } from '~entities/integrations/store'

import { Auction } from '~entities/auction/model'

import { splittedSSEApi } from '~shared/store/api'

type ConnectSSEPlatformQueryArgs = {
  auctionId: Auction['id']
}

type ConnectSSEPlatformQueryResult = void

const connectSSEDonationAlertsApi = splittedSSEApi.injectEndpoints({
  endpoints: (builder) => ({
    connectSSEDonationAlerts: builder.query<
      ConnectSSEPlatformQueryResult,
      ConnectSSEPlatformQueryArgs
    >({
      query: ({ auctionId }) => ({ url: `/${auctionId}/donalerts/connect` }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled

        dispatch(
          integrationsActions.setPlatformStatus({
            platform: 'donation-alerts',
            data: {
              isConnected: true,
              isValid: true,
            },
          })
        )
      },
    }),
  }),
})

export const { useLazyConnectSSEDonationAlertsQuery } =
  connectSSEDonationAlertsApi
