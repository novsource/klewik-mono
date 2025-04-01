import { ComponentProps, useCallback, useMemo } from 'react'

import { generateWinner } from '~widgets/wheel/utils/wheel-canvas'

import { WheelEventsBus } from '~entities/wheel/events'
import { wheelSelectors } from '~entities/wheel/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

type SpinWheelButtonProps = ComponentProps<'button'>

const SpinWheelButton = ({ className, ...props }: SpinWheelButtonProps) => {
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)
  const wheelSlots = useStoreSelector(wheelSelectors.getSlots)

  const isButtonShouldBeDisabled = useMemo(
    () => wheelSlots.length < 2 || isWheelSpinning,
    [isWheelSpinning, wheelSlots]
  )

  const handleOnClick = useCallback(() => {
    if (isButtonShouldBeDisabled) return

    const winner = generateWinner(wheelSlots)

    WheelEventsBus.getInstance().notify('spin', winner)
  }, [wheelSlots])

  return (
    <Button
      className={className}
      variant="action"
      startContent={<Icons.Refresh size="xs" />}
      onClick={handleOnClick}
      disabled={isButtonShouldBeDisabled}
      {...props}
    >
      Прокрутить
    </Button>
  )
}

export default SpinWheelButton
