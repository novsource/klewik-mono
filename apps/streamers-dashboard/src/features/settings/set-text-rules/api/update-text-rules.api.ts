import { splittedAuctionApi } from '~entities/auction/api'

import type { AuctionTextRulesDTO } from '~shared/api/http/auction-settings'

type UpdateAuctionTextRulesMutationArgs = {
  auctionUUID: string
  rules: AuctionTextRulesDTO
}

const updateTextRulesApi = splittedAuctionApi.injectEndpoints({
  endpoints: builder => ({
    updateAuctionTextRules: builder.mutation<void, UpdateAuctionTextRulesMutationArgs>({
      query: ({ auctionUUID, rules }) => ({
        url: `/${auctionUUID}/info/rules/update`,
        method: 'POST',
        data: {
          rules,
        },
      }),
    }),
  }),
})

export const { useUpdateAuctionTextRulesMutation } = updateTextRulesApi
