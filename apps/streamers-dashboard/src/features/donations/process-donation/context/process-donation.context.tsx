import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { useGetDonationCodeInfoMutation } from '~features/donations/process-donation/api'

import { auctionSelectors } from '~entities/auction/store'

import type { DonationCode, ProcessedDonation } from '~entities/donation/model'
import { getDonationCodeFromMessage } from '~entities/donation/utils'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

type ProcessDonationContextState = {
  state: {
    donationCode: NullablePossible<DonationCode>
    isConflict: boolean
    isBlockedActions: boolean
    isDonationCodeLoading: boolean
    isDonationCodeLoadingError: boolean
  }
  functions: {
    reloadDonationCode: (message: NullablePossible<string>) => Promise<void>
  }
  dispatch: {
    setDonationCode: Dispatch<SetStateAction<NullablePossible<DonationCode>>>
    setIsBlockedActions: Dispatch<SetStateAction<boolean>>
    setIsConflict: Dispatch<SetStateAction<boolean>>
  }
}

const ProcessDonationContext = createContext<ProcessDonationContextState>({
  state: {
    donationCode: null,
    isBlockedActions: false,
    isConflict: false,
    isDonationCodeLoading: false,
    isDonationCodeLoadingError: false,
  },
  functions: {
    reloadDonationCode: () => Promise.resolve(),
  },
  dispatch: {
    setIsConflict: () => ({}),
    setDonationCode: () => ({}),
    setIsBlockedActions: () => ({}),
  },
})

export const useProcessDonationContext = () => {
  const context = useContext(ProcessDonationContext)

  if (!context)
    throw new Error('You should use context insider provider')

  return context
}

type ProcessDonationContextProviderProps = {
  donation: ProcessedDonation
  children: ReactNode
}

export const ProcessDonationContextProvider = (props: ProcessDonationContextProviderProps) => {
  const { donation, children } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [donationCode, setDonationCode] = useState<ProcessDonationContextState['state']['donationCode']>(null)
  const [isBlockedActions, setIsBlockedActions] = useState(false)
  const [isConflict, setIsConflict] = useState(false)

  const processedDonationIdRef = useRef(donation.id)

  const [getDonationCodeMutation, donationCodeMutationState]
    = useGetDonationCodeInfoMutation()

  const donationCodeQuery = useCallback(async (message: string | null) => {
    if (!message || donationCodeMutationState.isLoading || donationCode || donation.id <= 0)
      return

    const code = getDonationCodeFromMessage(message || '')

    if (!code)
      return

    setIsBlockedActions(true)
    const response = await getDonationCodeMutation({ auctionUUID, code })
    setIsBlockedActions(false)

    if (response.error) {
      return
    }

    setDonationCode(response.data)
  }, [
    getDonationCodeMutation,
    auctionUUID,
    donationCode,
    donationCodeMutationState.isLoading,
    donation.id,
  ])

  useEffect(() => {
    donationCodeQuery(donation.message)
  }, [donation.id, donation.message, donationCodeQuery])

  if (donation.id !== processedDonationIdRef.current) {
    processedDonationIdRef.current = donation.id

    setDonationCode(null)
  }

  const contextValue = useMemo<ProcessDonationContextState>(() => ({
    state: {
      isConflict,
      donationCode,
      isBlockedActions,
      isDonationCodeLoading: donationCodeMutationState.isLoading,
      isDonationCodeLoadingError: donationCodeMutationState.isError,
    },
    functions: {
      reloadDonationCode: donationCodeQuery,
    },
    dispatch: {
      setIsConflict,
      setDonationCode,
      setIsBlockedActions,
    },
  }), [
    donationCodeQuery,
    donationCode,
    isBlockedActions,
    isConflict,
    donationCodeMutationState.isLoading,
    donationCodeMutationState.isError,
  ])

  return <ProcessDonationContext.Provider value={contextValue}>{children}</ProcessDonationContext.Provider>
}
