import { createStoreListenerMiddleware } from '~shared/lib/redux-toolkit'

import { auctionSlotsActions } from './auction-slots.slice'

const updateSlotsStatisticMiddleware = createStoreListenerMiddleware()

updateSlotsStatisticMiddleware.startListening({
  actionCreator: auctionSlotsActions.addSlots,
  effect: (action, api) => {
    api.dispatch(auctionSlotsActions.updateSlotsPointsSum(action.payload))
  },
})

updateSlotsStatisticMiddleware.startListening({
  actionCreator: auctionSlotsActions.updateSlot,
  effect: (action, api) => {
    const {
      id,
      data: { points },
    } = action.payload

    if (!points) return

    api.dispatch(auctionSlotsActions.updateSlotsPointsSum([{ id, points }]))
  },
})

const auctionSlotsListenersMiddlewares = [
  updateSlotsStatisticMiddleware.middleware,
]

export { auctionSlotsListenersMiddlewares, updateSlotsStatisticMiddleware }
