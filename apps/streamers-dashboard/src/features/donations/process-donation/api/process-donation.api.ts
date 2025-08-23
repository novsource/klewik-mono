import type { ProcessDonation } from '../model'

import type { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import type { ProcessedDonation } from '~entities/donation/model'

type ProcessDonationMutationArgs = ProcessDonation & {
  id: ProcessedDonation['id']
  auctionUUID: Auction['auctionUUID']
}

const processDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: builder => ({
    processDonation: builder.mutation<void, ProcessDonationMutationArgs>(({
      query: ({ auctionUUID, id, ...data }) =>
        ({
          url: `${auctionUUID}/donations/${id}`,
          data,
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
    })),
  }),
})

export const { useProcessDonationMutation } = processDonationApi
