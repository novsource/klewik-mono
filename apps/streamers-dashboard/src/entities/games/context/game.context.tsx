import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '../api'

type GameContextState = {
  state: {
    activeSlots: AuctionSlot[]
    isLoading: boolean
    isError: boolean
  }
  actions: {
    dropSlot: ReturnType<typeof useDropoutSlotMutation>[0]
    sendWinner: ReturnType<typeof useSetAuctionWinnerMutation>[0]
  }
  dispatch: {
    setActiveSlots: Dispatch<SetStateAction<AuctionSlot[]>>
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
    activeSlots: [],
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
  activeSlots: AuctionSlot[]
  children: ReactNode
}

export const GameContextProvider = (props: GameContextProviderProps) => {
  const [activeSlots, setActiveSlots] = useState<AuctionSlot[]>(props.activeSlots)
  const [dropSlotMutation, dropSlotMutationState] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation, sendWinnerMutationState] = useSetAuctionWinnerMutation()

  const contextValue = useMemo<GameContextState>(() => ({
    state: {
      activeSlots,
      isLoading: dropSlotMutationState.isLoading || sendWinnerMutationState.isLoading,
      isError: dropSlotMutationState.isError || sendWinnerMutationState.isError,
    },
    actions: {
      dropSlot: dropSlotMutation,
      sendWinner: sendAuctionWinnerMutation,
    },
    dispatch: {
      setActiveSlots,
    },
  }), [
    activeSlots,
    dropSlotMutation,
    sendAuctionWinnerMutation,
    dropSlotMutationState,
    sendWinnerMutationState,
  ])

  return <GameContext.Provider value={contextValue}>{ props.children }</GameContext.Provider>
}
