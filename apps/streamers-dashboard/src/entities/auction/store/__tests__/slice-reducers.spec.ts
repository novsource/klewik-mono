import type { UnknownAction } from '@reduxjs/toolkit'

import type { Auction } from '~entities/auction/model'

import { auctionActions, auctionReducer } from '../auction.slice'

function createState(action: UnknownAction = { type: 'unknown' }) {
  return auctionReducer(undefined, action)
}

describe('auction slice actions', () => {
  it('should set auction info', () => {
    const newAuctionInfo: Auction = {
      auctionUUID: 'fdsa',
      createAt: new Date(),
      endedAt: new Date(),
      dropoutSlotsIds: [1, 2, 3],
      id: 10,
      isBetsClosed: true,
      isEnded: true,
      ownerId: 'fdas',
      processedDonationsIds: [1, 2, 4],
      slotsIds: [1, 2, 3],
      url: 'https://auction.klewik.ru',
      wheelMode: 'dropout',
      winnerSlotId: 1,
    }

    const state = createState(auctionActions.setAuction(newAuctionInfo))

    expect(state.auctionInfo).toEqual(newAuctionInfo)
  })

  it('should update wheel mode', () => {
    let state = createState()
    expect(state.auctionInfo.wheelMode).toEqual('classic')

    state = createState(auctionActions.updateWheelMode('dropout'))
    expect(state.auctionInfo.wheelMode).toEqual('dropout')
  })
})
