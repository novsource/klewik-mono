import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import { globalDialogsActions, globalDialogsSelectors } from '~features/_common/display-dialogs'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

export type SearchDialogCategories = 'slots' | 'donations'

export type SearchDialogContextState = {
  searchValue: string
  category: SearchDialogCategories
  isDialogOpen: boolean
  isLoading: boolean
}

type SearchDialogContextDispatch = {
  setSearchValue: (value: string) => void
  setIsLoading: (loading: boolean) => void
  setCategory: (category: SearchDialogCategories) => void
  setIsDialogOpen: (open: boolean) => void
}

type SearchDialogContextFunctions = {
  closeDialog: () => void
}

export type SearchDialogContext = {
  state: SearchDialogContextState
  functions: SearchDialogContextFunctions
  dispatch: SearchDialogContextDispatch
}

const SearchContext = createContext<SearchDialogContext>({
  state: {
    searchValue: '',
    isDialogOpen: false,
    isLoading: false,
    category: 'slots',
  },
  functions: {
    closeDialog: () => ({}),
  },
  dispatch: {
    setIsDialogOpen: () => ({}),
    setSearchValue: () => ({}),
    setCategory: () => ({}),
    setIsLoading: () => ({}),
  },
})

export const useSearchDialogContext = () => {
  const context = useContext(SearchContext)

  if (!context)
    throw new Error('You should use context inside provider')

  return context
}

export type SearchDialogContextProviderProps = Partial<SearchDialogContextState> & {
  children: ReactNode
}

export const SearchDialogContextProvider = (props: SearchDialogContextProviderProps) => {
  const { children, ...contextValues } = props

  const { isOpen } = useStoreSelector(state => globalDialogsSelectors.getDialogState(state, 'search'))

  const { setDialogOpenStatus } = useActionCreators(globalDialogsActions)

  const [searchValue, setSearchValue] = useState(contextValues.searchValue ?? '')
  const [category, setCategory] = useState<SearchDialogCategories>(contextValues.category ?? 'slots')
  const [isLoading, setIsLoading] = useState(false)

  const closeDialog = () => {
    setSearchValue('')
    setDialogOpenStatus({ dialog: 'search', status: false })
  }

  const contextValue = useMemo<SearchDialogContext>(() => {
    return {
      state: { isDialogOpen: isOpen, searchValue, category, isLoading },
      dispatch: {
        setIsLoading,
        setSearchValue,
        setIsDialogOpen: (open: boolean) => setDialogOpenStatus({ dialog: 'search', status: open }),
        setCategory,
      },
      functions: { closeDialog },
    }
  }, [isOpen, searchValue, category, isLoading])

  return (
    <SearchContext.Provider value={contextValue}>
      { children }
    </SearchContext.Provider>
  )
}
