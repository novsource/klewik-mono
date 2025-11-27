import { useCallback, useRef } from 'react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useWheel } from '~entities/wheel/hooks'
import type { WheelSlot } from '~entities/wheel/model'
import { wheelSelectors } from '~entities/wheel/store'
import { BaseWheel, WheelItem, WheelSelector } from '~entities/wheel/ui'

import { useElementSize } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

export type WheelProps = FlexProps

export const Wheel = (props: WheelProps) => {
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
      <WheelFortune />
    </Flex>
  )
}

type WheelFortuneProps = FlexProps<'div'>

function WheelFortune(props: WheelFortuneProps) {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const {
    state: { isSpinning, wheelSlots, selectorCurrentSlot },
    refs: { wheelRef },
  } = useWheel(storedAuctionSlots)

  const { ref: containerRef, value: containerSize } = useElementSize<HTMLDivElement>()

  const wheelMask = `linear-gradient(
    #000,
    #000,
    transparent 0,
    #000 0px,
    #000 90%,
    transparent
  )`

  const wheelSize = Math.min(containerSize.height, containerSize.width)

  const renderWheelSlot = useCallback((slot: WheelSlot) => {
    const isSlotOnSelector = slot.title.toLowerCase() === selectorCurrentSlot?.toLowerCase()

    return (
      <WheelItem
        className={cn(
          'transition-opacity',
          isSpinning && !isSlotOnSelector && 'opacity-20',
          isSpinning && isSlotOnSelector && 'opacity-80',
        )}
        key={slot.title}
        slot={slot}
        radius={wheelSize / 2.15}
        center={{
          x: wheelSize / 2,
          y: wheelSize / 2,
        }}
      />
    )
  }, [isSpinning, selectorCurrentSlot, wheelSize])

  return (
    <Flex ref={containerRef} className="relative shrink h-full w-full" align="start" justify="center" {...props}>
      <div className="flex w-full h-1/2 justify-center items-center" style={{ maskImage: wheelMask }}>
        <div className="relative w-full h-full flex justify-center">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 border-24 border-dark/60 rounded-full z-10"
            style={{
              width: wheelSize,
              height: wheelSize,
            }}
          />
          <div
            className="absolute left-1/2 -translate-y-1/2 -translate-x-1/2 bg-dark/60 rounded-full z-20"
            style={{
              width: wheelSize * 0.8,
              height: wheelSize * 0.8,
              top: wheelSize / 2,
            }}
          >
            <div className="relative h-full w-full">
              <WheelSelector
                center={{
                  x: (wheelSize * 0.8) / 2,
                  y: (wheelSize * 0.8) / 2,
                }}
                size={wheelSize * 0.8}
                startAngle={260}
                endAngle={280}
              />
            </div>
          </div>
          <div className="relative w-full flex justify-center z-40" style={{ width: wheelSize, height: wheelSize }}>
            <BaseWheel ref={wheelRef} width={containerSize.width} height={containerSize.height}>
              {wheelSlots.map(renderWheelSlot)}
            </BaseWheel>
          </div>
        </div>
      </div>
    </Flex>
  )
}
