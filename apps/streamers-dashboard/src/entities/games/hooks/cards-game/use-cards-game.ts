import type { CardsGameContextValue } from '~entities/games/context/cards-game/cards-game.context'
import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useEffect, useState } from 'react'

import { generateWinner } from '~entities/games/utils/generate-winner'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { getHEXColor, shuffleArray } from '~shared/utils/common'

type UseCardsGameOptions = {
  amount?: number
  onCardSelect?: (card: CardsGameUnit) => void
  onCardConfirm?: (card: CardsGameUnit) => void
}

export type UseCardsGameReturnValue = CardsGameContextValue

export const useCardsGame = (auctionSlots: AuctionSlot[], options?: UseCardsGameOptions) => {
  const [cardsUnits, setCardsUnits] = useState<CardsGameUnit[]>(() => {
    if (auctionSlots.length === 0)
      return []

    const cardAmount = options?.amount ?? 30
    const winners = Array.from({ length: cardAmount }).fill(null).map(_ => generateWinner(auctionSlots)!)

    return transformAuctionSlotsToCardUnits(winners)
  })
  const [choosedCardUnit, setChoosedCardUnit] = useState<NullablePossible<CardsGameUnit>>(null)
  const [confirmedCard, setConfirmedCard] = useState<NullablePossible<CardsGameUnit>>(null)

  useEffect(() => {
    if (auctionSlots.length === 0) {
      setCardsUnits([])
    }
    else {
      const cardAmount = options?.amount ?? 30
      const winners = Array.from({ length: cardAmount }).fill(null).map(_ => generateWinner(auctionSlots)!)

      setCardsUnits(transformAuctionSlotsToCardUnits(winners))
    }
  }, [auctionSlots, options?.amount])

  const chooseCard = (card: CardsGameUnit) => {
    setChoosedCardUnit(card)
    options?.onCardSelect?.(card)
  }

  const confirmCard = (card: CardsGameUnit) => {
    setChoosedCardUnit(card)
    setConfirmedCard(card)

    options?.onCardConfirm?.(card)
  }

  const clearChoosenCard = () => {
    setChoosedCardUnit(null)
  }

  const clearConfirmedCard = () => {
    setConfirmedCard(null)
  }

  const shuffleCards = () => {
    const shuffledCards = shuffleArray(cardsUnits, false)

    setCardsUnits(shuffledCards)
  }

  return {
    state: {
      cardsUnits,
      choosedCardUnit,
      confirmedCard,
    },
    actions: {
      confirmCard,
      chooseCard,
      clearConfirmedCard,
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
