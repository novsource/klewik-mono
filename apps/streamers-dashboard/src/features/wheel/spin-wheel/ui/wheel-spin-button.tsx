import type { ButtonProps } from 'klewik-ui/button'

import { useEffect } from 'react'

import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'

import { wheelActions, wheelSelectors } from '~entities/wheel/store'
import { generateWinner } from '~entities/wheel/utils'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

const SpinWheelButton = (props: ButtonProps) => {
  const { className, ...restProps } = props

  const { setWheelStatus, setSpinTarget } = useActionCreators(wheelActions)

  const isWheelSpinning = useStoreSelector(wheelSelectors.getIsWheelSpinning)
  const storedWheelStatus = useStoreSelector(wheelSelectors.getWheelStatus)
  const { spinTime } = useStoreSelector(wheelSelectors.getSettings)
  const wheelSlots = useStoreSelector(wheelSelectors.getSlots)

  const isButtonShouldBeDisabled = wheelSlots.length < 2 || isWheelSpinning

  const handleOnClick = () => {
    if (isButtonShouldBeDisabled)
      return

    setWheelStatus('prepare')
  }

  useEffect(() => {
    const isWheelIdle = storedWheelStatus === 'idle'
    const isWheelCanBeSpinned = storedWheelStatus === 'prepare'

    if (isWheelIdle) {
      setSpinTarget(null)
    }

    if (isWheelCanBeSpinned) {
      const target = generateWinner(wheelSlots)

      setSpinTarget(target)
    }
  }, [storedWheelStatus, wheelSlots, spinTime])

  return (
    <Button
      className={className}
      variant="action"
      startContent={<Icons.Refresh size="xs" />}
      disabled={isButtonShouldBeDisabled}
      onClick={handleOnClick}
      {...restProps}
    >
      Прокрутить
    </Button>
  )
}

export default SpinWheelButton
