import type { UnknownAction } from '@reduxjs/toolkit'

import { auctionActions, auctionReducer, auctionSelectors } from '../auction.slice'

function createState(action: UnknownAction = { type: 'unknown' }) {
  return auctionReducer(undefined, action)
}

const initialState = {
  auctionInfo: {
    id: 0,
    auctionUUID: '',
    dropoutSlotsIds: [],
    slotsIds: [],
    winnerSlotId: null,
    processedDonationsIds: [],
    ownerId: '',
    url: '',
    createAt: '',
    endedAt: '',
    isBetsClosed: false,
    isEnded: false,
    wheelMode: 'classic',
  },
}

describe('auction slice selectors', () => {
  it('should use correct initial state', () => {
    const state = createState()

    expect(state.auctionInfo).toEqual(initialState.auctionInfo)
  })

  it('should return auction uuid', () => {
    const mockedUUID = 'fds'

    const state = createState(auctionActions.setAuction({ auctionUUID: mockedUUID }))
    const selectorReturnValue = auctionSelectors.getAuctionUUID({ auction: state })

    expect(selectorReturnValue).toEqual(mockedUUID)
  })

  it('should return auction url', () => {
    const mockedURL = 'https://auction.klewik.ru'

    const state = createState(auctionActions.setAuction({ auctionUUID: mockedURL }))
    const selectorReturnValue = auctionSelectors.getAuctionUUID({ auction: state })

    expect(selectorReturnValue).toEqual(mockedURL)
  })

  it('should return state', () => {
    const state = createState()
    const selectorReturnValue = auctionSelectors.getAuctionInfo({ auction: state })

    expect(selectorReturnValue).toEqual(initialState.auctionInfo)
  })

  it('should return bets status', () => {
    const state = createState(auctionActions.setAuction({ isBetsClosed: true }))
    const selectorReturnValue = auctionSelectors.getIsBetsClosed({ auction: state })

    expect(selectorReturnValue).toEqual(true)
  })

  it('should return wheel mode', () => {
    const state = createState(auctionActions.setAuction({ wheelMode: 'dropout' }))
    const selectorReturnValue = auctionSelectors.getWheelMode({ auction: state })

    expect(selectorReturnValue).toEqual('dropout')
  })
})
