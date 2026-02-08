import { createListenerMiddleware } from '@reduxjs/toolkit'

import { auctionSlotsActions } from './auction-slots.slice'

const listeningMiddleware = createListenerMiddleware()
const startSlotsActionsListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

export const auctionSlotsListenerMiddlewares = [listeningMiddleware.middleware]

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.addSlots,
  effect: (action, api) => {
    api.dispatch(auctionSlotsActions.updateSlotsPointsSum(action.payload))
  },
})

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.updateSlot,
  effect: (action, api) => {
    const {
      id,
      data: { points },
    } = action.payload

    const pointsSum = api.getState().auctionSlots.slots.reduce((acc, slot) => acc + slot.points, 0)
    const isShouldDispatchUpdatePoints = pointsSum !== api.getState().auctionSlots.slotsPointsSum

    if (!isShouldDispatchUpdatePoints)
      return

    api.dispatch(auctionSlotsActions.updateSlotsPointsSum([{ id, points }]))
  },
})

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.updateSlotsPointsSum,
  effect: (_, api) => {
    const { slots, slotsPointsSum } = api.getState().auctionSlots

    const updatedSlots = slots.reduce((acc, slot) => {
      const winPercents = (slot.points / slotsPointsSum) * 100

      acc.push({ ...slot, winPercents })

      return acc
    }, [] as typeof slots)

    api.dispatch(auctionSlotsActions.updateSlots(updatedSlots))
  },
})

startSlotsActionsListening({
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
