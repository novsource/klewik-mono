import { createListenerMiddleware } from '@reduxjs/toolkit'

import { getPercentValue } from '~shared/utils/common'

import { auctionSlotsActions } from './auction-slots.slice'

const listeningMiddleware = createListenerMiddleware()
const startSlotsActionsListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

export const auctionSlotsListenerMiddlewares = [listeningMiddleware.middleware]

// startSlotsActionsListening({
//   actionCreator: auctionActions.setAuction,
//   effect: (action, api) => {
//     const { dropoutSlotsIds, slotsIds } = action.payload

//     if (!slotsIds)
//       return

//     const alivedSlotsIds = slotsIds.filter(id => !dropoutSlotsIds?.includes(id))

//     api.dispatch(auctionSlotsActions.updateAlivedSlotsIds({
//       mode: 'add',
//       data: alivedSlotsIds,
//     }))
//   },
// })

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.addSlots,
  effect: (action, api) => {
    const slots = action.payload

    api.dispatch(auctionSlotsActions.updateAlivedSlotsIds({
      mode: 'add',
      data: slots.map(slot => slot.id),
    }))
  },
})

// startSlotsActionsListening({
//   actionCreator: auctionActions.setAuction,
//   effect: (action, api) => {
//     api.dispatch(auctionSlotsActions.updateDroppedSlotsIds({
//       mode: 'add',
//       data: action.payload.dropoutSlotsIds ?? [],
//     }))
//   },
// })

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

    const pointsSum = api.getState().auctionSlots.slots.reduce((sum, slot) => sum + slot.points, 0)
    const isShouldDispatchUpdatePoints = pointsSum !== api.getOriginalState().auctionSlots.slotsPointsSum

    if (!isShouldDispatchUpdatePoints)
      return

    api.dispatch(auctionSlotsActions.updateSlotsPointsSum([{ id, points: points ?? 0 }]))
  },
})

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.updateSlotsPointsSum,
  effect: (_, api) => {
    const { slots, slotsPointsSum } = api.getState().auctionSlots

    const updatedSlots = slots.reduce((acc, slot) => {
      const winPercents = getPercentValue(slotsPointsSum, slot.points) * 100

      acc.push({ ...slot, winPercents })

      return acc
    }, [] as typeof slots)

    api.dispatch(auctionSlotsActions.updateSlots(updatedSlots))
  },
})

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.setPointsSum,
  effect: (_, api) => {
    const { slots, slotsPointsSum } = api.getState().auctionSlots

    const updatedSlots = slots.reduce((acc, slot) => {
      const winPercents = getPercentValue(slotsPointsSum, slot.points) * 100

      acc.push({ ...slot, winPercents })

      return acc
    }, [] as typeof slots)

    api.dispatch(auctionSlotsActions.updateSlots(updatedSlots))
  },
})

startSlotsActionsListening({
  actionCreator: auctionSlotsActions.setSlots,
  effect: (action, api) => {
    const slots = action.payload

    const pointsSum = slots.reduce((sum, slot) => sum + slot.points, 0)

    api.dispatch(auctionSlotsActions.setPointsSum(pointsSum))
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
