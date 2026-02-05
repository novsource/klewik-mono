import type { CardsGameContextState } from '~entities/games/context/cards-game/cards-game.context'
import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useEffect, useState } from 'react'

import { generateWinner } from '~entities/games/utils/generate-winner'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { getHEXColor, shuffleArray } from '~shared/utils'

type UseCardsAuctionGameOptions = {
  amount?: number
  onCardSelect?: (card: CardsGameUnit) => void
}

export type UseCardsAuctionGameReturnValue = CardsGameContextState

export const useCardsAuctionGame = (auctionSlots: AuctionSlot[], options?: UseCardsAuctionGameOptions) => {
  const [cardsUnits, setCardsUnits] = useState<CardsGameUnit[]>(() => {
    if (auctionSlots.length === 0)
      return []

    const cardAmount = options?.amount ?? 30
    const winners = Array.from({ length: cardAmount }).fill(null).map(_ => generateWinner(auctionSlots))

    return transformAuctionSlotsToCardUnits(winners)
  })
  const [choosedCardUnit, setChoosedCardUnit] = useState<NullablePossible<CardsGameUnit>>(null)
  const [preparedCardUnit, setPreparedCardUnit] = useState<NullablePossible<CardsGameUnit>>(null)

  useEffect(() => {
    if (auctionSlots.length === 0) {
      setCardsUnits([])
    }
    else {
      const cardAmount = options?.amount ?? 30
      const winners = Array.from({ length: cardAmount }).fill(null).map(_ => generateWinner(auctionSlots))

      setCardsUnits(transformAuctionSlotsToCardUnits(winners))
    }
  }, [auctionSlots])

  const chooseCard = (card: CardsGameUnit) => {
    setChoosedCardUnit(card)
    options?.onCardSelect?.(card)
  }

  const clearChoosenCard = () => {
    setChoosedCardUnit(null)
  }

  const shuffleCards = () => {
    const shuffledCards = shuffleArray(cardsUnits, false)

    setCardsUnits(shuffledCards)
  }

  return {
    state: {
      cardsUnits,
      choosedCardUnit,
      preparedCardUnit,
    },
    actions: {
      prepareCard: setPreparedCardUnit,
      chooseCard,
      clearChoosenCard,
      shuffleCards,
    },
  }
}

function transformAuctionSlotsToCardUnits(slots: AuctionSlot[]) {
  let id = 0

  return slots.map<CardsGameUnit>((slot) => {
    id++

    return { id, auctionSlotId: slot.id, color: getHEXColor(), title: slot.title, bgImageUrl: '' }
  })
}
