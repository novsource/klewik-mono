import { useGameContext } from '~entities/games/context/game.context'
import { auctionGamesSelectors } from '~entities/games/store'
import { generateWinner } from '~entities/games/utils/generate-winner'

import { useAuctionWheelGame } from '~pages/dashboard/games/hooks/use-auction-wheel-game'

import type { WheelSlot } from '~entities/wheel/model'
import { updateSlotsAnglesByRotateValue } from '~entities/wheel/utils'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { toastErrorNotification } from '~shared/ui/toaster/lib'

export type SpinWheelButtonProps = ButtonProps

export const SpinWheelButton = (props: SpinWheelButtonProps) => {
  const { className, ...restProps } = props

  const { spinTime } = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)
  const { state: { wheelSlots, isSpinning, rotateValue }, actions } = useAuctionWheelGame()
  const { state: { isLoading } } = useGameContext()

  const isButtonShouldBeDisabled = wheelSlots.length < 2 || isSpinning || isLoading

  const handleOnClick = async () => {
    if (isButtonShouldBeDisabled)
      return

    const spinTargetSlot = generateWinner(wheelSlots) as WheelSlot

    if (!spinTargetSlot) {
      toastErrorNotification('Не удалось выбрать слот для прокрута. Попробуйте еще раз')
      return
    }

    const response = await actions.confirmSpin(spinTargetSlot.id)

    if (response.error) {
      toastErrorNotification('Не удалось выбрать слот для прокрута. Попробуйте еще раз')
      return
    }

    const target = updateSlotsAnglesByRotateValue(wheelSlots, rotateValue).filter(slot => slot.id === spinTargetSlot.id)[0]!
    actions.startWheelSpinAnimation(target, spinTime)
  }

  return (
    <Button
      className={className}
      variant="action"
      size="lg"
      startContent={<Icons.Refresh size="xs" />}
      disabled={isButtonShouldBeDisabled}
      onClick={handleOnClick}
      {...restProps}
    >
      Прокрутить
    </Button>
  )
}
