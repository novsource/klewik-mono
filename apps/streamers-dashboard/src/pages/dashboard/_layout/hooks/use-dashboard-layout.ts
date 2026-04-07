import { useState } from 'react'

import type { Auction } from '~entities/auction/model'

import { auctionSlotsActions } from '~entities/auction-slot/store'

import { donationsActions } from '~entities/donation/store'

import { useAppSSE, usePrevious } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

export type UseDashboardLayoutReturn = {
  isSSEConnected: boolean
  isDisconnectWithError: boolean
  isPending: boolean
}

export const useDashboardLayout = (auctionUUID: Auction['uuid']): UseDashboardLayoutReturn => {
  const { addDonation, updateDonationsStatusesCounts } = useActionCreators(donationsActions)
  const { addSlots, updateSlot } = useActionCreators(auctionSlotsActions)

  const [isDisconnectWithError, setIsDisconnectWithError] = useState(false)

  const { isConnected, connect, isPending } = useAppSSE({
    onNewTabLeader: () => {
      connect(auctionUUID)
    },
    listeners: {
      'donations/add': (donation) => {
        addDonation(donation)
        updateDonationsStatusesCounts({ [donation.processData.status]: 1 })
      },
      'auction-slots/add': (slots) => {
        addSlots(slots)
      },
      'auction-slots/update': (slot) => {
        updateSlot({ id: slot.id, data: slot })
      },
    },
  })

  const previousConnectStatus = usePrevious(isConnected)

  if (previousConnectStatus && !isConnected && !isDisconnectWithError) {
    setIsDisconnectWithError(true)
  }

  return { isPending, isSSEConnected: isConnected, isDisconnectWithError }
}
