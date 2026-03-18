import type { UnknownAction } from '@reduxjs/toolkit'

import { AUCTION_SLICE_INITIAL_STATE as initialState } from '~entities/auction/constants/slice-initial-state'

import { genuuid } from '~shared/utils/common'

import { auctionActions, auctionReducer, auctionSelectors } from '../auction.slice'

function createState(action: UnknownAction = { type: 'unknown' }) {
  return auctionReducer(undefined, action)
}

describe('auction slice selectors', () => {
  it('should use correct initial state', () => {
    const state = createState()

    expect(state.info).toEqual(initialState.info)
  })

  it('should return auction uuid', () => {
    const randomUUID = genuuid()

    const state = createState(auctionActions.updateInfo({ uuid: randomUUID }))
    const selectorReturnValue = auctionSelectors.getAuctionUUID({ auction: state })

    expect(selectorReturnValue).toEqual(randomUUID)
  })

  it('should return state', () => {
    const state = createState()
    const selectorReturnValue = auctionSelectors.getInfo({ auction: state })

    expect(selectorReturnValue).toEqual(initialState.info)
  })

  it('should return bets status', () => {
    const state = createState(auctionActions.updateInfo({ isBetsClosed: true }))
    const selectorReturnValue = auctionSelectors.getIsBetsClosed({ auction: state })

    expect(selectorReturnValue).toEqual(true)
  })
})
