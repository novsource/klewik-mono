import { baseHttpClient } from '~shared/api/http/instance'

import { AuctionSlot } from '../model'

export class AuctionSlotService {
  static createSlot(
    auctionId: string,
    payload:
      | Omit<AuctionSlot, 'id' | 'color'>
      | Omit<AuctionSlot, 'id' | 'color'>[]
  ) {
    return baseHttpClient.post(`/api/auction/${auctionId}/slots/create`, {
      data: payload,
      withCredentials: true,
    })
  }
}
