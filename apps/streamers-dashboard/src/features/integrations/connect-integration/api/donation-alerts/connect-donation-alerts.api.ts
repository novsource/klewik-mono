import type { Auction } from '~entities/auction/model'

import { integrationsActions } from '~entities/integrations/store'

import { splittedSSEApi } from '~shared/store/api'

type ConnectSSEPlatformQueryArgs = {
  auctionUUID: Auction['auctionUUID']
}

type ConnectSSEPlatformQueryResult = void

const connectSSEDonationAlertsApi = splittedSSEApi.injectEndpoints({
  endpoints: builder => ({
    connectSSEDonationAlerts: builder.query<
      ConnectSSEPlatformQueryResult,
      ConnectSSEPlatformQueryArgs
    >({
      query: ({ auctionUUID }) => ({ url: `${auctionUUID}/donalerts/connect` }),
      onQueryStarted: async (_, api) => {
        await api.queryFulfilled

        api.dispatch(
          integrationsActions.setPlatformStatus({
            platform: 'donationAlerts',
            data: {
              isConnected: true,
              isValid: true,
            },
          }),
        )
      },
    }),
  }),
})

export const { useLazyConnectSSEDonationAlertsQuery }
  = connectSSEDonationAlertsApi
