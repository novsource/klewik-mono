import { useRef } from 'react'

import { wheelSelectors } from '~entities/wheel/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'

import { WheelCanvas } from './wheel-canvas.ui'

type WheelContainerProps = FlexProps

const WheelContainer = (props: WheelContainerProps) => {
  const selectorTargetTitle = useStoreSelector(
    wheelSelectors.getSelectorTargetTitle,
  )

  const slotTextRef = useRef<HTMLSpanElement>(null)

  return (
    <Flex className="h-full w-full shrink-[2] gap-y-6" direction="column" {...props}>
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
