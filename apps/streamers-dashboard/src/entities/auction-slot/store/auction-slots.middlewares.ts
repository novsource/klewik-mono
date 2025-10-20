import { createListenerMiddleware } from '@reduxjs/toolkit'

import { auctionSlotsActions } from './auction-slots.slice'

const listeningMiddleware = createListenerMiddleware()
const startSlotsListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

export const auctionSlotsListenerMiddlewares = [listeningMiddleware.middleware]

startSlotsListening({
  actionCreator: auctionSlotsActions.addSlots,
  effect: (action, api) => {
    api.dispatch(auctionSlotsActions.updateSlotsPointsSum(action.payload))
  },
})

startSlotsListening({
  actionCreator: auctionSlotsActions.updateSlot,
  effect: (action, api) => {
    const {
      id,
      data: { points },
    } = action.payload

    if (!points)
      return

    api.dispatch(auctionSlotsActions.updateSlotsPointsSum([{ id, points }]))
  },
})

startSlotsListening({
  actionCreator: auctionSlotsActions.deleteSlot,
  effect: (action, api) => {
    const { id } = action.payload
    const { dispatch, getState } = api

    const deletedSlot = getState().auctionSlots.slots.find(slot => slot.id === id)
    const pointsSum = getState().auctionSlots.slotsPointsSum

    if (!deletedSlot)
      return

    dispatch(auctionSlotsActions.setPointsSum(pointsSum - deletedSlot.points))
  },
})
