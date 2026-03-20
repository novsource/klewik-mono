import type { UseWheelReturn } from '../hooks'

import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { createReactContext } from '~shared/utils/react'

export type WheelGameContextValue = UseWheelReturn

const [_, useWheelGameContext, Context] = createReactContext<WheelGameContextValue>({
  contextName: 'WheelGameContext',
  hookName: 'useWheelGameContext',
  providerName: 'WheelGameContextProvider',
})

type WheelGameContextProviderProps = WheelGameContextValue & {
  children: ReactNode
}

export const WheelGameContextProvider = (props: WheelGameContextProviderProps) => {
  const { children, ...wheelGame } = props

  const contextValue = useMemo(() => wheelGame, [wheelGame])

  return <Context.Provider value={contextValue}>{ children }</Context.Provider>
}

export { useWheelGameContext }
