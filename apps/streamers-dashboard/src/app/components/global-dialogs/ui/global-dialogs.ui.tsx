import { ProcessDonationDialog } from '~pages/auction-donations/ui/dialogs/process-donation-dialog.ui'
import { EditSlotDialog } from '~pages/auction-slots/ui/dialogs/edit-slot-dialog.ui'

import { AuctionSettingsDialog } from '~widgets/dashboard-settings-dialog'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { createSingleFakeAuctionSlot } from '~entities/auction-slot/model/__tests__/auction-slot.mocks'

import type { ProcessedDonation } from '~entities/donation/model'
import { createSingleFakeDonation } from '~entities/donation/model/__tests__/donations.mocks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { globalDialogsActions, globalDialogsSelectors } from '../store/global-dialogs.slice'

const placeholderDonation: ProcessedDonation = createSingleFakeDonation()
const placeholderSlot: AuctionSlot = createSingleFakeAuctionSlot()

export const GlobalDialogs = () => {
  const { processDonation, editSlot } = useStoreSelector(globalDialogsSelectors.getAllDialogsStates)

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const handleEditSlotDialogClose = (open: boolean) => {
    setDialogOpenStatus({ dialog: 'editSlot', status: open })
  }

  const handleProcessDonationDialogClose = (open: boolean) => {
    setDialogOpenStatus({ dialog: 'processDonation', status: open })
  }

  return (
    <>
      <EditSlotDialog
        slot={editSlot.initialData || placeholderSlot}
        open={editSlot.isOpen}
        onOpenChange={handleEditSlotDialogClose}
      />
      <ProcessDonationDialog
        donation={processDonation.initialData || placeholderDonation}
        open={processDonation.isOpen}
        onOpenChange={handleProcessDonationDialogClose}
      />
      <AuctionSettingsDialog />
    </>
  )
}
