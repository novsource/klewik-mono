import { useCallback } from 'react'

import { generateWinner } from '~widgets/wheel/utils/wheel-canvas'

import { WheelEventsBus } from '~entities/wheel/events'
import { wheelSelectors } from '~entities/wheel/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

const SpinWheelButton = () => {
  const wheelSlots = useStoreSelector(wheelSelectors.getSlots)

  const handleOnClick = useCallback(() => {
    if (wheelSlots.length < 2) return

    const winner = generateWinner(wheelSlots)

    console.log(winner)

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
