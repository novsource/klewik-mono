import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { SortingOptions } from '~shared/store/model'

import { createReactContext } from 'klewik-ui/utils'

export type SlotsPageContextValue = {
  state: {
    filterSlotsOptions: {
      points: {
        min: number
        max: number
      }
      status: 'all' | 'alived' | 'dropped'
    }
    sortingSlotsOptions: SortingOptions<AuctionSlot>
  }
  dispatch: {
    updateFilterSlotsOptions: (options: Partial<SlotsPageContextValue['state']['filterSlotsOptions']>) => void
    updateSortingOptions: (options: Partial<SlotsPageContextValue['state']['sortingSlotsOptions']>) => void
  }
}

const [Provider, useSlotsPageContext] = createReactContext<SlotsPageContextValue>({
  contextName: 'SlotsPageContext',
  hookName: 'useSlotsPageContext',
  providerName: 'SlotsPageContextProvider',
})

export const SlotsPageContextProvider = ({ children }: { children: ReactNode }) => {
  const [filterSlotsOptions, setFilterSlotsOptions] = useState<SlotsPageContextValue['state']['filterSlotsOptions']>(
    { status: 'all', points: { min: 0, max: Number.MAX_SAFE_INTEGER } },
  )
  const [sortingOptions, setSortingOptions] = useState<SlotsPageContextValue['state']['sortingSlotsOptions']>({
    field: 'points',
    type: 'descending',
  })

  const contextValue = useMemo<SlotsPageContextValue>(() => ({
    state: {
      filterSlotsOptions,
      sortingSlotsOptions: sortingOptions,
    },
    dispatch: {
      updateFilterSlotsOptions: options => setFilterSlotsOptions(curr => ({ ...curr, ...options })),
      updateSortingOptions: options => setSortingOptions(curr => ({ ...curr, ...options })),
    },
  }), [filterSlotsOptions, sortingOptions])

  return <Provider value={contextValue}>{children}</Provider>
}

export { useSlotsPageContext }
