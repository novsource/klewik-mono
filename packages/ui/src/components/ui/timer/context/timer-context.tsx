import type { UseActionTimerReturn } from '../hooks/use-timer'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useTimer } from '../hooks/use-timer'

export type TimerContextState = UseActionTimerReturn

const TimerContext = createContext<NullablePossible<TimerContextState>>(null)

export const useTimerContext = () => {
  const context = useContext(TimerContext)

  if (!context)
    throw new Error('You should use context inside provider')

  return context
}

export type TimerProviderProps = {
  children: ReactNode
  timer?: UseActionTimerReturn
}

export const TimerProvider = (props: TimerProviderProps) => {
  const { children, timer, ...timerOptions } = props

  const defaultTimer = useTimer(timerOptions)

  const contextValue = useMemo<TimerContextState>(() =>
    timer ?? defaultTimer, [defaultTimer, timer])

  return <TimerContext.Provider value={contextValue}>{ children }</TimerContext.Provider>
}
