import type { Auction } from '~entities/auction/model'

import { auctionSlotsActions } from '~entities/auction-slot/store'

import { donationsActions } from '~entities/donation/store'

import { useAppSSE, useAuctionSlotsSSE, useDonationsSSE } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

export type UseDashboardLayoutReturn = {
  isSSEConnected: boolean
  isPending: boolean
}

export const useDashboardLayout = (auctionUUID: Auction['auctionUUID']): UseDashboardLayoutReturn => {
  const { isAllEventsConnected, connectAll, isPending } = useAppSSE({
    onNewTabLeader: () => {
      connectAll(auctionUUID)
    },
  })

  const { addDonation, updateDonationsStatusesCounts } = useActionCreators(donationsActions)
  const { addSlots, updateSlot } = useActionCreators(auctionSlotsActions)

  useDonationsSSE({
    'donations/add': (donation) => {
      addDonation(donation)
      updateDonationsStatusesCounts({ [donation.processData.status]: 1 })
    },
  })

  useAuctionSlotsSSE({
    'auction-slots/add': (slots) => {
      addSlots(slots)
    },
    'auction-slots/update': (slot) => {
      updateSlot({ id: slot.id, data: slot })
    },
  })

  return { isPending, isSSEConnected: isAllEventsConnected }
}
