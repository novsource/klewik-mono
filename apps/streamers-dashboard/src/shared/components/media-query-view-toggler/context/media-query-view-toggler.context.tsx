import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useMediaQuery } from '~shared/hooks'

type MediaQueryViewTogglerContextState = {
  isMatched: boolean
}

const MediaQueryViewTogglerContext = createContext<MediaQueryViewTogglerContextState>({
  isMatched: false,
})

export const useMediaQuerySwitcherContext = () => {
  const context = useContext(MediaQueryViewTogglerContext)

  if (!context) {
    throw new Error('You should use context inside provider')
  }

  return context
}

type MediaQueryViewTogglerContextProviderProps = {
  query: string
  children: ReactNode
}

export const MediaQueryViewTogglerContextProvider = (props: MediaQueryViewTogglerContextProviderProps) => {
  const { query, children } = props

  const isMatched = useMediaQuery(query)

  const contextValue = useMemo(() => ({ isMatched }), [isMatched])

  return <MediaQueryViewTogglerContext.Provider value={contextValue}>{ children }</MediaQueryViewTogglerContext.Provider>
}
