import type { ProcessDonationForm } from '../model'

import type { Auction } from '~entities/auction/model'

import { splittedDonationApi } from '~entities/donation/api'
import type { DonationCode, ProcessedDonation } from '~entities/donation/model'

type ProcessDonationMutationArgs = ProcessDonationForm & {
  id: ProcessedDonation['id']
  auctionUUID: Auction['auctionUUID']
  title: string
  points: number
}

type ApproveDonationMutationArgs = {
  id: ProcessedDonation['id']
  auctionUUID: Auction['auctionUUID']
  title: string
  points: number
}

type DeclineDonationMutationArgs = {
  id: ProcessedDonation['id']
  auctionUUID: Auction['auctionUUID']
}

type GetDonationCodeInfo = {
  code: string
  auctionUUID: Auction['auctionUUID']
}

const processDonationApi = splittedDonationApi.injectEndpoints({
  endpoints: builder => ({
    approveDonation: builder.mutation<void, ApproveDonationMutationArgs>(({
      query: ({ auctionUUID, id, ...data }) => ({
        url: `/${auctionUUID}/donations/${id}/status`,
        method: 'POST',
        data: {
          ...data,
          status: 'added',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    })),
    declineDonation: builder.mutation<void, DeclineDonationMutationArgs>(({
      query: ({ auctionUUID, id }) => ({
        url: `/${auctionUUID}/donations/${id}/status`,
        method: 'POST',
        data: {
          status: 'rejected',
        },
      }),
    })),
    processDonation: builder.mutation<void, ProcessDonationMutationArgs>(({
      query: ({ auctionUUID, id, ...data }) =>
      ({
        url: `/${auctionUUID}/donations/${id}`,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    })),
    getDonationCodeInfo: builder.mutation<DonationCode, GetDonationCodeInfo>({
      query: ({ auctionUUID, code }) => ({
        url: `/${auctionUUID}/donations/code/info`,
        method: 'POST',
        data: {
          code,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
})

export const {
  useProcessDonationMutation,
  useGetDonationCodeInfoMutation,
  useApproveDonationMutation,
  useDeclineDonationMutation,
} = processDonationApi
