import type { AuctionTextRulesDTO } from './auction-settings-api.types'

import { authHttpClient } from '../auth-instance'

export const updateAuctionTextRules = (auctionUUID: string, rules: AuctionTextRulesDTO) => {
  return authHttpClient.post(`api/v1/auctions/${auctionUUID}/info/rules`, { data: { rules } })
}
