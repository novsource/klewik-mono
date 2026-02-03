import type { CardsGameUnit } from '~entities/games/model/cards-game'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

import { useCardsAuctionGame } from '~entities/games/hooks/cards-game'

import type { AuctionSlot } from '~entities/auction-slot/model'

type CardsGameContextState = {
  state: {
    cardsUnits: CardsGameUnit[]
    preparedCardUnit: NullablePossible<CardsGameUnit>
    choosedCardUnit: NullablePossible<CardsGameUnit>
  }
  actions: {
    prepareCard: (card: CardsGameUnit) => void
    chooseCard: (card: CardsGameUnit) => void
    clearChoosenCard: () => void
    shuffleCards: () => void
  }
}

const CardsGameContext = createContext<CardsGameContextState>({
  state: {
    cardsUnits: [],
    choosedCardUnit: null,
    preparedCardUnit: null,
  },
  actions: {
    prepareCard: () => ({}),
    chooseCard: () => ({}),
    clearChoosenCard: () => ({}),
    shuffleCards: () => ({}),
  },
})

export const useCardsGameContext = () => {
  const context = useContext(CardsGameContext)

  if (!context) {
    throw new Error('You should use cards game context inside provider!')
  }

  return context
}

export type CardsGameContextProviderProps = {
  auctionSlots: AuctionSlot[]
  children: ReactNode
  onCardSelect?: (card: CardsGameUnit) => void
}

export const CardsGameContextProvider = (props: CardsGameContextProviderProps) => {
  const { auctionSlots, children, onCardSelect } = props

  const { state: gameState, actions } = useCardsAuctionGame(auctionSlots, { onCardSelect })

  const contextValue = useMemo(() => ({ state: gameState, actions }), [gameState, actions])

  return <CardsGameContext.Provider value={contextValue}>{ children }</CardsGameContext.Provider>
}
