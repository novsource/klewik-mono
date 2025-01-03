import { baseHttpClient } from '~shared/api/http/instance'

import { AuctionSlot } from '../model'

export class AuctionSlotService {
  private static readonly _instance = new AuctionSlotService()

  static getInstance() {
    return this._instance
  }

  createSlot(
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
