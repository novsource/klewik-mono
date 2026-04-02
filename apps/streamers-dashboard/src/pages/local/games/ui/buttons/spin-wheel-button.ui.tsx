import { auctionGamesSelectors } from '~entities/games/store'
import { generateWinner } from '~entities/games/utils/generate-winner'

import { useWheelGameContext } from '~entities/wheel/context'
import type { WheelSlot } from '~entities/wheel/model'
import { updateSlotsAnglesByRotateValue } from '~entities/wheel/utils'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { toastErrorNotification } from 'klewik-ui/toaster'

export const SpinWheelButton = () => {
  const { spinTime } = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)
  const wheelGame = useWheelGameContext()

  const isButtonDisabled = wheelGame.state.isSpinning || wheelGame.state.wheelSlots.length < 1

  const handleOnClick = () => {
    if (isButtonDisabled)
      return

    const spinTargetSlot = generateWinner(wheelGame.state.wheelSlots) as WheelSlot

    if (!spinTargetSlot) {
      toastErrorNotification('Не удалось выбрать слот для прокрута. Попробуйте еще раз')
      return
    }

    const target = updateSlotsAnglesByRotateValue(wheelGame.state.wheelSlots, wheelGame.state.rotateValue).filter(slot => slot.id === spinTargetSlot.id)[0]!
    wheelGame.actions.startWheelSpinAnimation(target, spinTime)
  }

  return (
    <Button
      className="w-full"
      variant="action"
      size="lg"
      startContent={<Icons.Refresh size="xs" />}
      disabled={isButtonDisabled}
      onClick={handleOnClick}
    >
      Прокрутить
    </Button>
  )
}
