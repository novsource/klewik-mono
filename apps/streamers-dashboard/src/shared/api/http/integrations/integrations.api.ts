import type { HttpClientRequestOptions } from '~shared/lib/axios'

import { authHttpClient } from '../auth-instance'

export const getConnectedIntegrations = (auctionUUID: string, options?: HttpClientRequestOptions) => {
  return authHttpClient.get(`/api/v1/auctions/${auctionUUID}/integrations/connections`, options)
}
