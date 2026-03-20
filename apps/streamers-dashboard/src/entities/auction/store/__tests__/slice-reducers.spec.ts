import type { UnknownAction } from '@reduxjs/toolkit'

import { createFakeAuction } from '~entities/auction/model/__tests__/auction.mocks'

import { auctionActions, auctionReducer } from '../auction.slice'

function createState(action: UnknownAction = { type: 'unknown' }) {
  return auctionReducer(undefined, action)
}

describe('auction slice actions', () => {
  it('should set auction info', () => {
    const fakeAuction = createFakeAuction()

    const state = createState(auctionActions.updateInfo(fakeAuction))

    expect(state.info).toEqual(fakeAuction)
  })
})
