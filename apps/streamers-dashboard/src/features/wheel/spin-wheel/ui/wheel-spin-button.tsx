import { useCallback } from 'react'

import { generateWinner } from '~widgets/wheel/utils/wheel-canvas'

import { WheelEventsBus } from '~entities/wheel/events'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

const SpinWheelButton = () => {
  const wheelSlots = useStoreSelector((state) => state.wheel.slots)

  const handleOnClick = useCallback(() => {
    if (wheelSlots.length < 2) return

    const winner = generateWinner(wheelSlots)
    WheelEventsBus.getInstance().notify('spin', winner)
  }, [wheelSlots])

  return (
    <Button
      variant="action"
      startContent={<Icons.Refresh size="lg" />}
      onClick={handleOnClick}
      disabled={wheelSlots.length < 2}
    >
      Прокрутить
    </Button>
  )
}

export default SpinWheelButton
