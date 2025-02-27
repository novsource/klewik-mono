import { Auction } from '~entities/auction/model'

import { baseHttpClient } from '~shared/api/http/instance'

import { SetAuctionViewParametersFormData } from '../model'

const setAuctionViewParameters = (
  auctionId: Auction['id'],
  payload: SetAuctionViewParametersFormData,
  signal: AbortSignal
) => {
  return baseHttpClient.post(`/api/auction/${auctionId}/view/parameters`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
    signal,
    withCredentials: true,
  })
}

export { setAuctionViewParameters }
