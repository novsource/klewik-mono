import { auctionGamesSelectors } from '~entities/games/store'
import { generateWinner } from '~entities/games/utils/generate-winner'

import { useAuctionGameContext } from '~pages/dashboard/games/context/auction-game-context'
import { useAuctionWheelGame } from '~pages/dashboard/games/hooks/use-auction-wheel-game'

import type { WheelSlot } from '~entities/wheel/model'
import { updateSlotsAnglesByRotateValue } from '~entities/wheel/utils'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import { toastErrorNotification } from 'klewik-ui/toaster/lib'

export type SpinWheelButtonProps = ButtonProps

export const SpinWheelButton = (props: SpinWheelButtonProps) => {
  const { className, ...restProps } = props

  const { spinTime } = useStoreSelector(auctionGamesSelectors.getWheelGameSettings)
  const wheelGame = useAuctionWheelGame()
  const auctionGameContext = useAuctionGameContext()

  const isButtonShouldBeDisabled = wheelGame.state.wheelSlots.length < 2 || wheelGame.state.isSpinning || auctionGameContext.state.playMutationState.isLoading

  const handleOnClick = async () => {
    if (isButtonShouldBeDisabled)
      return

    const spinTargetSlot = generateWinner(wheelGame.state.wheelSlots) as WheelSlot

    if (!spinTargetSlot) {
      toastErrorNotification('Не удалось выбрать слот для прокрута. Попробуйте еще раз')
      return
    }

    const response = await wheelGame.actions.confirmSpin(spinTargetSlot.id)

    if (response.error) {
      toastErrorNotification('Не удалось выбрать слот для прокрута. Попробуйте еще раз')
      return
    }

    const target = updateSlotsAnglesByRotateValue(wheelGame.state.wheelSlots, wheelGame.state.rotateValue).filter(slot => slot.id === spinTargetSlot.id)[0]!
    wheelGame.actions.startWheelSpinAnimation(target, spinTime)
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
