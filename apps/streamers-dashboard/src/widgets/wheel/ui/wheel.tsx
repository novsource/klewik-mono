import { useRef } from 'react'

import { wheelSelectors } from '~entities/wheel/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { WheelCanvas } from './wheel-canvas.ui'

const WheelContainer = () => {
  const selectorTargetTitle = useStoreSelector(
    wheelSelectors.getSelectorTargetTitle
  )

  const slotTextRef = useRef<HTMLSpanElement>(null)

  return (
    <div className="flex h-full w-full flex-shrink-2 flex-col gap-y-2">
      <span
        ref={slotTextRef}
        className="text-center text-title desktop:text-title-lg font-semibold"
      >
        {selectorTargetTitle}
      </span>
      <WheelCanvas />
    </div>
  )
}

export default WheelContainer
