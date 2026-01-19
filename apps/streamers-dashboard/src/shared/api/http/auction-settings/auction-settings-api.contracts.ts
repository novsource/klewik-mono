import type { AuctionTextRulesDTO } from './auction-settings-api.types'

import { z } from 'zod'

export const AuctionTextRulesDTOSchema = z.string().min(0)

export const isAuctionTextRules = (value: unknown): value is AuctionTextRulesDTO => {
  const isSuccessValidated = AuctionTextRulesDTOSchema.safeParse(value).success

  return isSuccessValidated
}
