import { ProcessDonationDialog } from '~pages/dashboard/donations/ui/dialogs/process-donation-dialog.ui'
import { EditSlotDialog } from '~pages/dashboard/slots/ui/dialogs/edit-slot-dialog.ui'

import { AuctionSettingsDialog } from '~widgets/dashboard-settings-dialog'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { createSingleFakeAuctionSlot } from '~entities/auction-slot/model/__tests__/auction-slot.mocks'

import type { ProcessedDonation } from '~entities/donation/model'
import { createSingleFakeDonation } from '~entities/donation/model/__tests__/donations.mocks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { globalDialogsActions, globalDialogsSelectors } from '../store/global-dialogs.slice'

const placeholderDonation: ProcessedDonation = import.meta.env.DEV
  ? createSingleFakeDonation()
  : {
    id: 1,
    amount: 0,
    auctionId: 0,
    createdAt: '',
    currency: '',
    message: null,
    messageType: 'empty',
    processData: {
      action: 'noAction',
      addedPoints: null,
      donationCode: null,
      slotsIds: null,
      status: 'inProgress',
      title: null,
    },
    source: 'userInput',
    sourceDonationId: null,
    updatedAt: '',
    username: '',
  }
const placeholderSlot: AuctionSlot = import.meta.env.DEV
  ? createSingleFakeAuctionSlot()
  : {
    id: 0,
    auctionSlotOrder: 1,
    points: 0,
    title: '',
    winPercents: 0,
    isAlived: true,
    isDropped: false,
  }

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
