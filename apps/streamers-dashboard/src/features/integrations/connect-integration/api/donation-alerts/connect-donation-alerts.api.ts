import type { Auction } from '~entities/auction/model'

import { splittedIntegrationsApi } from '~entities/integrations/api'
import { integrationsActions } from '~entities/integrations/store'

type ConnectSSEPlatformQueryArgs = {
  auctionUUID: Auction['uuid']
}

type ConnectSSEPlatformQueryResult = void

const connectSSEDonationAlertsApi = splittedIntegrationsApi.injectEndpoints({
  endpoints: builder => ({
    connectSSEDonationAlerts: builder.query<
      ConnectSSEPlatformQueryResult,
      ConnectSSEPlatformQueryArgs
    >({
      query: ({ auctionUUID }) => ({ url: `/${auctionUUID}/integrations/donalerts/connect` }),
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
