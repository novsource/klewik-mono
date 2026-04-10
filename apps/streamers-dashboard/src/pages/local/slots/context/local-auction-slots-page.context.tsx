import { useMemo, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { createReactContext } from '~shared/utils/react'

export type LocalAuctionSlotsPageContextValue = {
  state: {
    searchQuery: string
  }
  dispatch: {
    setSearchQuery: Dispatch<SetStateAction<string>>
  }
}

const [Provider, useLocalAuctionSlotsPageContext] = createReactContext<LocalAuctionSlotsPageContextValue>({
  contextName: 'LocalAuctionSlotsPageContext',
  hookName: 'useLocalAuctionSlotsPageContext',
})

type LocalAuctionSlotsPageContextProviderProps = {
  children: ReactNode
}

export const LocalAuctionSlotsPageContextProvider = (props: LocalAuctionSlotsPageContextProviderProps) => {
  const { children } = props

  const [searchQuery, setSearchQuery] = useState('')

  const contextValue = useMemo<LocalAuctionSlotsPageContextValue>(() => ({
    state: {
      searchQuery,
    },
    dispatch: {
      setSearchQuery,
    },
  }), [searchQuery])

  return <Provider value={contextValue}>{children}</Provider>
}

export { useLocalAuctionSlotsPageContext }
