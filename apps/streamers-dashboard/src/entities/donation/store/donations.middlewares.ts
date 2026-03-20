import { createListenerMiddleware } from '@reduxjs/toolkit'

import { donationsActions } from './donations.slice'

const listeningMiddleware = createListenerMiddleware()

const startDonationsListening = listeningMiddleware.startListening.withTypes<RootState, StoreDispatch>()

startDonationsListening({
  actionCreator: donationsActions.addDonation,
  effect: (action, api) => {
    const { payload } = action
    const { dispatch, getState } = api

    const statusesCounts = structuredClone(getState().donations.donationsStatusesCounts)

    if (Array.isArray(payload)) {
      payload.forEach((donation) => {
        const donationProcessedStatus = donation.processData.status

        statusesCounts[donationProcessedStatus] += 1
      })
    }
    else {
      const donationProcessedStatus = payload.processData.status

      statusesCounts[donationProcessedStatus] += 1
    }

    dispatch(donationsActions.updateDonationsStatusesCounts(statusesCounts))
  },
})

export const donationsListenerMiddlewares = [listeningMiddleware.middleware]
