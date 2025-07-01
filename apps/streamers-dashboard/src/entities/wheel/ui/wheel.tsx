import { useRef } from 'react'

import { wheelSelectors } from '~entities/wheel/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { WheelCanvas } from './wheel-canvas.ui'

const WheelContainer = () => {
  const selectorTargetTitle = useStoreSelector(
    wheelSelectors.getSelectorTargetTitle
  )

  const slotTextRef = useRef<HTMLSpanElement>(null)

  return (
    <Flex className="h-full w-full shrink-[2] gap-y-2" direction="column">
      <span
        ref={slotTextRef}
        className="text-center text-title desktop:text-title-lg font-semibold"
      >
        {selectorTargetTitle}
      </span>
      <WheelCanvas />
    </Flex>
  )
}

export default WheelContainer
