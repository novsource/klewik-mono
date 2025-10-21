import { EditSlotDialog } from '~features/auction-slot/edit-slot/ui'

import { ProcessDonationDialog } from '~features/donations/process-donation/ui'

import { useGlobalDialogsContext } from '../context'

export const GlobalDialogs = () => {
  const {
    state: {
      selectedDonation,
      selectedSlot,
      isEditSlotDialogOpen,
      isProcessDonationDialogOpen,
    },
    dispatch: {
      setIsEditSlotDialogOpen,
      setIsProcessDonationDialogOpen,
    },
  } = useGlobalDialogsContext()

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
