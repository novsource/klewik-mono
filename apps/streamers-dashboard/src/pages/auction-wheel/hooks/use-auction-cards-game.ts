import { useDropoutSlotMutation, useSetAuctionWinnerMutation } from '~entities/games/api'
import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'
import { auctionGamesSelectors } from '~entities/games/store'

import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

export const useAuctionCardsGame = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const game = useCardsGameContext()

  const [dropSlotMutation, dropSlotMutationState] = useDropoutSlotMutation()
  const [sendAuctionWinnerMutation, sendWinnerMutationState] = useSetAuctionWinnerMutation()

  const confirmCardChoice = async (slotId: number) => {
    if (gameMode === 'dropout') {
      const response = await dropSlotMutation({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
    else {
      const response = await sendAuctionWinnerMutation({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
  }

  const queryState = gameMode === 'classic' ? sendWinnerMutationState : dropSlotMutationState

  return { state: game.state, actions: { ...game.actions, confirmCardChoice }, queryState }
}
