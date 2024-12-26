import { useCallback } from 'react'

import { generateWinner } from '~widgets/wheel/utils/wheel-canvas'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

const SpinWheelButton = () => {
  const wheelEventBus = useStoreSelector((state) => state.wheel.emitter)
  const wheelSlots = useStoreSelector((state) => state.wheel.slots)

  const handleOnClick = useCallback(() => {
    const winner = generateWinner(wheelSlots)
    wheelEventBus.notify('spin', winner)
  }, [wheelSlots])

  return (
    <Button
      variant="action"
      startContent={<Icons.Refresh size="default" />}
      onClick={handleOnClick}
    >
      Прокрутить
    </Button>
  )
}

export default SpinWheelButton
