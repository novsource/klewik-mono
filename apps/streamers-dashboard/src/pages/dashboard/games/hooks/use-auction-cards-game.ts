import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'

import { useAuctionGameContext } from '../context/auction-game-context'

export const useAuctionCardsGame = () => {
  const auctionGame = useAuctionGameContext()
  const cardsGame = useCardsGameContext()

  const confirmCardChoice = async (slotId: number) => {
    return auctionGame.actions.play(slotId)
  }

  return { state: cardsGame.state, actions: { ...cardsGame.actions, confirmCardChoice }, queryState: auctionGame.state }
}
