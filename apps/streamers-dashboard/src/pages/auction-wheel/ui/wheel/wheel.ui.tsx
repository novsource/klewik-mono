import { useRef } from 'react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { wheelSelectors } from '~entities/wheel/store'
import { WheelCanvas } from '~entities/wheel/ui'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'

type WheelProps = FlexProps

export const Wheel = (props: WheelProps) => {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
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
      <WheelCanvas auctionSlots={storedAuctionSlots} />
    </Flex>
  )
}
