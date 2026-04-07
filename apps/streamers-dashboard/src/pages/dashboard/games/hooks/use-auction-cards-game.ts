import type { CardsGameUnit } from '~entities/games/model/cards-game'

import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { toastErrorNotification } from 'klewik-ui/toaster'

import { useAuctionGameContext } from '../context/auction-game-context'

export const useAuctionCardsGame = () => {
  const auctionGame = useAuctionGameContext()
  const cardsGame = useCardsGameContext()

  const playCard = async (card: CardsGameUnit) => {
    const response = await auctionGame.actions.play(card.auctionSlotId)

    if (response.error) {
      toastErrorNotification('Не удалось сыграть карту. Попробуйте еще раз')
    }

    return response
  }

  return {
    state: cardsGame.state,
    actions: {
      ...cardsGame.actions,
      confirmCardChoice: playCard,
    },
    queryState: auctionGame.state,
  }
}
