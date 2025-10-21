import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

export type SearchDialogCategories = 'slots' | 'donations'

export type SearchDialogContextState = {
  searchValue: string
  category: SearchDialogCategories
  isDialogOpen: boolean
}

type SearchDialogContextDispatch = {
  setSearchValue: (value: string) => void
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
    category: 'slots',
  },
  functions: {
    closeDialog: () => ({}),
  },
  dispatch: {
    setIsDialogOpen: () => ({}),
    setSearchValue: () => ({}),
    setCategory: () => ({}),
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

  const [searchValue, setSearchValue] = useState(contextValues.searchValue ?? '')
  const [category, setCategory] = useState<SearchDialogCategories>(contextValues.category ?? 'slots')
  const [isDialogOpen, setIsDialogOpen] = useState(contextValues.isDialogOpen ?? false)

  const closeDialog = () => {
    setSearchValue('')
    setIsDialogOpen(false)
  }

  const contextValue = useMemo<SearchDialogContext>(() => {
    return {
      state: { isDialogOpen, searchValue, category },
      dispatch: { setSearchValue, setIsDialogOpen, setCategory },
      functions: { closeDialog },
    }
  }, [isDialogOpen, searchValue, category])

  return (
    <SearchContext.Provider value={contextValue}>
      { children }
    </SearchContext.Provider>
  )
}
