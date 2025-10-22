import { useEffect } from 'react'

import { EditSlotDialog } from '~features/auction-slot/edit-slot/ui'

import { ProcessDonationDialog } from '~features/donations/process-donation/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useGlobalDialogsContext } from '../context'

export const GlobalDialogs = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const {
    state: {
      selectedDonation,
      selectedSlot,
      isEditSlotDialogOpen,
      isProcessDonationDialogOpen,
    },
    dispatch: {
      setSelectedSlot,
      setIsEditSlotDialogOpen,
      setIsProcessDonationDialogOpen,
    },
  } = useGlobalDialogsContext()

  useEffect(() => {
    if (selectedSlot && auctionSlots.length !== 0) {
      const storedSelectedSlot = auctionSlots.find(slot => slot.id === selectedSlot.id)

      if (!storedSelectedSlot && isEditSlotDialogOpen) {
        setIsEditSlotDialogOpen(false)
      }

      if (storedSelectedSlot) {
        setSelectedSlot(storedSelectedSlot)
      }
    }
  }, [auctionSlots, selectedSlot])

  const handleEditSlotDialogClose = (open: boolean) => {
    if (!open) {
      return setIsEditSlotDialogOpen(false)
    }
  }

  const handleProcessDonationDialogClose = (open: boolean) => {
    if (!open) {
      return setIsProcessDonationDialogOpen(false)
    }
  }

  return (
    <>
      <EditSlotDialog
        slot={selectedSlot}
        open={isEditSlotDialogOpen}
        onOpenChange={handleEditSlotDialogClose}
      />
      <ProcessDonationDialog
        donation={selectedDonation}
        open={isProcessDonationDialogOpen}
        onOpenChange={handleProcessDonationDialogClose}
      />
    </>
  )
}
