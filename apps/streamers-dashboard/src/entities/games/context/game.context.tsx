import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '../api'

type GameContextState = {
  state: {
    isLoading: boolean
    isError: boolean
  }
  actions: {
    dropSlot: ReturnType<typeof useDropoutSlotMutation>[0]
    sendWinner: ReturnType<typeof useSetAuctionWinnerMutation>[0]
  }
}

const GameContext = createContext<GameContextState>({
  actions: {
    // @ts-expect-error expect default mutation
    dropSlot: () => ({}),
    // @ts-expect-error expect default mutation
    sendWinner: () => ({}),
  },
  state: {
    isLoading: false,
    isError: false,
  },
})

export const useGameContext = () => {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('You should use context inside provider')
  }

  return context
}

type GameContextProviderProps = {
  children: ReactNode
}

export const GameContextProvider = (props: GameContextProviderProps) => {
  const { children } = props

  const [dropSlotMutation, dropSlotMutationState] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation, sendWinnerMutationState] = useSetAuctionWinnerMutation()

  const contextValue = useMemo<GameContextState>(() => ({
    state: {
      isLoading: dropSlotMutationState.isLoading || sendWinnerMutationState.isLoading,
      isError: dropSlotMutationState.isError || sendWinnerMutationState.isError,
    },
    actions: {
      dropSlot: dropSlotMutation,
      sendWinner: sendAuctionWinnerMutation,
    },
  }), [dropSlotMutation, sendAuctionWinnerMutation, dropSlotMutationState, sendWinnerMutationState])

  return <GameContext.Provider value={contextValue}>{ children }</GameContext.Provider>
}
