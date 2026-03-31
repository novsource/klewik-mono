import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { useAuctionGameContext } from '../context/auction-game-context'

export const useAuctionCardsGame = () => {
  const auctionGame = useAuctionGameContext()
  const cardsGame = useCardsGameContext()

  const confirmCardChoice = async (card: CardsGameUnit) => {
    cardsGame.actions.confirmCard(card)

    return auctionGame.actions.play(card.auctionSlotId)
  }

  return { state: cardsGame.state, actions: { ...cardsGame.actions, confirmCardChoice }, queryState: auctionGame.state }
}
