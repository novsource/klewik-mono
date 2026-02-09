import { useGameContext } from '~entities/games/context/game.context'
import { auctionGamesSelectors } from '~entities/games/store'

import { auctionSelectors } from '~entities/auction/store'

import { useWheelGameContext } from '~entities/wheel/context'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { toastErrorNotification } from '~shared/ui/toaster/lib'

export const useAuctionWheelGame = () => {
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const gameMode = useStoreSelector(auctionGamesSelectors.getGameMode)

  const auctionGame = useGameContext()
  const wheel = useWheelGameContext()

  const confirmSpin = async (slotId: number) => {
    if (gameMode === 'dropout') {
      const response = await auctionGame.actions.dropSlot({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
    else {
      const response = await await auctionGame.actions.sendWinner({ auctionUUID, slotId })

      if (response.error) {
        toastErrorNotification('Не удалось подтвердить выбор. Попробуйте еще раз')
      }
    }
  }

  return { state: wheel.state, actions: { ...wheel.actions, confirmSpin }, meta: wheel.meta }
}
