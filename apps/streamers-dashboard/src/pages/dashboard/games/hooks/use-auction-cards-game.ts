import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'
import { useGameContext } from '~entities/games/context/game.context'
import { auctionGamesSelectors } from '~entities/games/store'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

export const useAuctionCardsGame = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const cardsGame = useCardsGameContext()
  const auctionGame = useGameContext()

  const confirmCardChoice = async (slotId: number) => {
    if (gameMode === 'dropout') {
      const response = await auctionGame.actions.dropSlot({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
    else {
      const response = await auctionGame.actions.sendWinner({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
  }

  return { state: cardsGame.state, actions: { ...cardsGame.actions, confirmCardChoice }, queryState: auctionGame.state }
}
