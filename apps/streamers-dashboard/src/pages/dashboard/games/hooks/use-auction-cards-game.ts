import { useCardsGameContext } from '~entities/games/context/cards-game/cards-game.context'
import { useGameContext } from '~entities/games/context/game.context'
import { auctionGamesSelectors } from '~entities/games/store'

import { auctionActions, auctionSelectors } from '~entities/auction/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

export const useAuctionCardsGame = () => {
  const auctionInfo = useStoreSelector(auctionSelectors.getAuctionInfo)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const cardsGame = useCardsGameContext()
  const auctionGame = useGameContext()

  const { setAuction } = useActionCreators(auctionActions)

  const confirmCardChoice = async (slotId: number) => {
    const isSlotAlreadyWasPlayed
      = auctionInfo.dropoutSlotsIds.includes(slotId)
        || auctionInfo.winnerSlotId === slotId

    if (isSlotAlreadyWasPlayed) {
      toastErrorNotification('Этот слот уже участвовал в аукционе')

      return
    }

    if (gameMode === 'dropout') {
      const response = await auctionGame.actions.dropSlot({ auctionUUID: auctionInfo.auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
      else {
        setAuction({ dropoutSlotsIds: [...auctionInfo.dropoutSlotsIds, slotId] })
      }

      return response
    }
    else {
      const response = await auctionGame.actions.sendWinner({ auctionUUID: auctionInfo.auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
      else {
        setAuction({ winnerSlotId: slotId })
      }

      return response
    }
  }

  return { state: cardsGame.state, actions: { ...cardsGame.actions, confirmCardChoice }, queryState: auctionGame.state }
}
