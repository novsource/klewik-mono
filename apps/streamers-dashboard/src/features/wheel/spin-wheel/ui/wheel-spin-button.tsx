import type { ComponentProps } from 'react'
import { useCallback, useMemo } from 'react'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

type SpinWheelButtonProps = ComponentProps<'button'>

const SpinWheelButton = ({ className, ...props }: SpinWheelButtonProps) => {
  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)
  const wheelSlots = useStoreSelector(wheelSelectors.getSlots)

  const dispatch = useStoreDispatch()

  const isButtonShouldBeDisabled = useMemo(
    () => wheelSlots.length < 2 || isWheelSpinning,
    [isWheelSpinning, wheelSlots],
  )

  const handleOnClick = useCallback(() => {
    if (isButtonShouldBeDisabled)
      return

    dispatch(wheelActions.setWheelStatus('prepare'))
  }, [dispatch, isButtonShouldBeDisabled])

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
