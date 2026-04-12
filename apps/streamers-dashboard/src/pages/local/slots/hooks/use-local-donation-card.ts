import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { donationsActions } from '~entities/donation/store'

import type { AuctionSlotsDTO } from '~shared/api/http/auction-slots'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

export const useLocalDonationCard = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { addSlots, updateSlot } = useActionCreators(auctionSlotsActions)
  const { deleteRawDonation } = useActionCreators(donationsActions)

  const approveDonation = (data: { donationId: number, title: string, points: number }) => {
    const approveTarget = auctionSlots.find(slot => slot.title === data.title)

    if (!approveTarget) {
      let lastOrder = 0
      let lastId = 0

      for (const slot of auctionSlots) {
        if (slot.auctionSlotOrder > lastOrder) {
          lastOrder = slot.auctionSlotOrder
        }

        if (slot.id > lastId) {
          lastId = slot.id
        }
      }

      const newSlot: AuctionSlotsDTO = {
        id: lastId + 1,
        auctionSlotOrder: lastOrder + 1,
        title: data.title,
        points: data.points,
        isAlived: true,
        isDropped: false,
      }

      addSlots([newSlot])
    }
    else {
      updateSlot({ id: approveTarget.id, data: { points: approveTarget.points + data.points } })
    }

    deleteRawDonation(data.donationId)
  }

  const declineDonation = (donationId: number) => {
    deleteRawDonation(donationId)
  }

  return { approveDonation, declineDonation }
}
