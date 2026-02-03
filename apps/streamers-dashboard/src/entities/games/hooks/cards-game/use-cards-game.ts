import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useEffect, useRef, useState } from 'react'

import { generateWinner } from '~entities/games/utils/generate-winner'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { getHEXColor } from '~shared/utils'

type UseCardsAuctionGameOptions = {
  amount?: number
  onCardSelect?: (card: CardsGameUnit) => void
}

export const useCardsAuctionGame = (auctionSlots: AuctionSlot[], options?: UseCardsAuctionGameOptions) => {
  const optionsRef = useRef(options)

  const [cardsUnits, setCardsUnits] = useState<CardsGameUnit[]>(() => {
    if (auctionSlots.length === 0)
      return []

    const cardAmount = optionsRef.current?.amount ?? 30
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
      const cardAmount = optionsRef.current?.amount ?? 30
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
    const result: CardsGameUnit[] = [...cardsUnits]

    function swap(indexOne: number, indexTwo: number) {
      [result[indexOne], result[indexTwo]] = [result[indexTwo], result[indexOne]]
    }

    result.forEach((_, index) => {
      const randomIndex = Math.floor(Math.random() * (result.length - 1))

      swap(index, randomIndex)
    })

    setCardsUnits(transformAuctionSlotsToCardUnits(result))
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
