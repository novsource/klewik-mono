import { HttpClientRequestOptions, baseHttpClient } from '@api/instance'

export type CreateAuctionResponse = {
  auctionId: string
  url: string
  auctionOwnerId: string
}

export const createAuction = async (
  key: string,
  fetchOptions?: HttpClientRequestOptions
) => {
  return baseHttpClient.post<CreateAuctionResponse>('/api/auction/create', {
    ...fetchOptions,
    data: { password: key },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
