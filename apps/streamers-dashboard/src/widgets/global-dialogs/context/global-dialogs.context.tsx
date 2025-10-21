import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { ProcessedDonation } from '~entities/donation/model'

const placeholderDonation: ProcessedDonation = {
  amount: 0,
  auctionId: -1,
  createdAt: new Date().toISOString(),
  currency: 'RUB',
  id: -1,
  message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  messageType: 'text',
  source: 'donationAlerts',
  sourceDonationId: -1,
  updatedAt: new Date().toISOString(),
  username: 'Username',
  processData: {
    action: 'noAction',
    addedPoints: null,
    slotsIds: [],
    status: 'empty',
    title: null,
  },
}

const placeholderSlot: AuctionSlot = {
  color: '#FFF',
  id: -1,
  points: 0,
  auctionSlotOrder: -1,
  title: '',
}

type GlobalDialogsContextState = {
  state: {
    isEditSlotDialogOpen: boolean
    isProcessDonationDialogOpen: boolean
    selectedSlot: AuctionSlot
    selectedDonation: ProcessedDonation
  }
  dispatch: {
    setIsEditSlotDialogOpen: Dispatch<SetStateAction<boolean>>
    setIsProcessDonationDialogOpen: Dispatch<SetStateAction<boolean>>
    setSelectedSlot: Dispatch<SetStateAction<AuctionSlot>>
    setSelectedDonation: Dispatch<SetStateAction<ProcessedDonation>>
  }
}

const GlobalDialogsContext = createContext<GlobalDialogsContextState>({
  state: {
    isEditSlotDialogOpen: false,
    isProcessDonationDialogOpen: false,
    selectedDonation: placeholderDonation,
    selectedSlot: placeholderSlot,
  },
  dispatch: {
    setIsEditSlotDialogOpen: () => ({}),
    setIsProcessDonationDialogOpen: () => ({}),
    setSelectedDonation: () => ({}),
    setSelectedSlot: () => ({}),
  },

})

export const useGlobalDialogsContext = () => {
  const context = useContext(GlobalDialogsContext)

  if (!context) {
    throw new Error('You should use context inside provider')
  }

  return context
}

type GlobalDialogsProviderProps = {
  children: ReactNode
}

export const GlobalDialogsProvider = (props: GlobalDialogsProviderProps) => {
  const { children } = props

  const [selectedSlot, setSelectedSlot] = useState<AuctionSlot>(placeholderSlot)
  const [selectedDonation, setSelectedDonation] = useState<ProcessedDonation>(placeholderDonation)

  const [isEditSlotDialogOpen, setIsEditSlotDialogOpen] = useState(false)
  const [isProcessDonationDialogOpen, setIsProcessDonationDialogOpen] = useState(false)

  const contextValue = useMemo<GlobalDialogsContextState>(() => ({
    state: {
      isEditSlotDialogOpen,
      isProcessDonationDialogOpen,
      selectedSlot,
      selectedDonation,
    },
    dispatch: {
      setIsProcessDonationDialogOpen,
      setIsEditSlotDialogOpen,
      setSelectedDonation,
      setSelectedSlot,
    },
  }), [selectedSlot, selectedDonation, isEditSlotDialogOpen, isProcessDonationDialogOpen])

  return <GlobalDialogsContext.Provider value={contextValue}>{ children }</GlobalDialogsContext.Provider>
}
