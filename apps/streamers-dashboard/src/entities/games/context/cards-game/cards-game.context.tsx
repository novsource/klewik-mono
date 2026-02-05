import type { UseCardsAuctionGameReturnValue } from '~entities/games/hooks/cards-game'
import type { CardsGameUnit } from '~entities/games/model/cards-game'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

export type CardsGameContextState = {
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
  cardGame: UseCardsAuctionGameReturnValue
  children: ReactNode
}

export const CardsGameContextProvider = (props: CardsGameContextProviderProps) => {
  const { children, cardGame } = props

  const contextValue = useMemo(() => cardGame, [cardGame])

  return <CardsGameContext.Provider value={contextValue}>{ children }</CardsGameContext.Provider>
}
