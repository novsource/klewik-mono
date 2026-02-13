import type { UseWheelReturn } from '../hooks'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

export type WheelGameContextState = UseWheelReturn

const WheelGameContext = createContext<WheelGameContextState>({
  meta: {
    wheelRef: () => null,
  },
  actions: {
    startWheelSpinAnimation: () => ({}),
  },
  state: {
    isSpinning: false,
    rotateValue: 0,
    slotUnderSelectorTitle: null,
    wheelSlots: [],
  },
})

export const useWheelGameContext = () => {
  const context = useContext(WheelGameContext)

  if (!context) {
    throw new Error('You should use context inside provider')
  }

  return context
}

type WheelGameContextProviderProps = WheelGameContextState & {
  children: ReactNode
}

export const WheelGameContextProvider = (props: WheelGameContextProviderProps) => {
  const { children, ...wheelGame } = props

  const contextValue = useMemo(() => wheelGame, [wheelGame])

  return <WheelGameContext.Provider value={contextValue}>{ children }</WheelGameContext.Provider>
}
