import type { UseWheelReturn } from '../hooks'
import type { WheelSlot } from '../model'

import { useCallback, useMemo } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import * as m from 'motion/react-m'

import { useElementSize } from '~shared/hooks'

import { Text } from 'klewik-ui/typography'

import { cn } from '~shared/utils/react'

import { WheelItem } from './wheel-item.ui'
import { WheelSelector } from './wheel-selector.ui'
import { BaseWheel } from './wheel.ui'

export type WheelFortuneProps = ComponentPropsWithoutRef<'div'> & {
  wheelGame: UseWheelReturn
}

export const WheelFortune = (props: WheelFortuneProps) => {
  const { wheelGame, ...restProps } = props

  const {
    state: { isSpinning, wheelSlots, selectorCurrentSlot, rotateValue },
    meta: { wheelRef },
  } = wheelGame

  const { ref: containerRef, value: containerSize } = useElementSize<HTMLDivElement>()

  const wheelSize = useMemo(() => Math.min(containerSize.height, containerSize.width), [containerSize.height, containerSize.width])

  const renderWheelSlot = useCallback((slot: WheelSlot) => {
    const isSlotOnSelector = slot.title.toLowerCase() === selectorCurrentSlot?.toLowerCase()

    return (
      <m.g
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
      >
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
      </m.g>
    )
  }, [isSpinning, selectorCurrentSlot, wheelSize])

  return (
    <div className="w-full h-full flex flex-col gap-y-6">
      <Text className="text-center text-title desktop:text-title-lg font-semibold" asSpan>
        {selectorCurrentSlot || 'Ожидание начала прокручивания...'}
      </Text>

      <div ref={containerRef} className="relative flex shrink h-full w-full justify-start items-start" {...restProps}>
        <div
          className="flex w-full h-1/2 justify-center items-center"
          style={{
            maskImage: `linear-gradient(
            #000,
            #000,
            transparent 0,
            #000 0px,
            #000 90%,
            transparent
          )`,
          }}
        >
          <div className="relative w-full h-full flex justify-center">

            {/* Wheel outer */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 border-24 border-dark/60 rounded-full"
              style={{
                width: wheelSize,
                height: wheelSize,
              }}
            />

            {/* Wheel selector */}
            <div
              className="absolute left-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
              style={{
                width: wheelSize * 0.8,
                height: wheelSize * 0.8,
                top: wheelSize / 2,
              }}
            >
              <div className="relative h-full w-full bg-dark/40 rounded-full">
                <WheelSelector
                  className="z-50"
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

            {/* Wheel of fortune */}
            <div className="relative w-full flex justify-center z-40" style={{ width: wheelSize, height: wheelSize }}>
              <BaseWheel
                ref={wheelRef}
                wheelGame={wheelGame}
                width={containerSize.width}
                height={containerSize.height}
                style={{ rotate: `${rotateValue}deg`, willChange: 'rotate' }}
              >
                {wheelSlots.map(renderWheelSlot)}
              </BaseWheel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
