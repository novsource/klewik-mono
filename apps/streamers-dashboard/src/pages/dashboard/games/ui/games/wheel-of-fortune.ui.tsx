import { useCallback, useEffect, useMemo, useState } from 'react'

import { WinnerGameSlotInfo } from '~entities/games/ui'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { WheelSlot } from '~entities/wheel/model'
import { BaseWheel, WheelItem, WheelSelector } from '~entities/wheel/ui'

import { Text } from '~shared/components/typography'

import { useElementSize } from '~shared/hooks'

import type { FlexProps } from 'klewik-ui/flex'
import { Flex } from 'klewik-ui/flex'
import { MotionBox } from 'klewik-ui/motion-box'

import { cn } from '~shared/utils'

import { useAuctionGameContext } from '../../context/auction-game-context'
import { useAuctionWheelGame } from '../../hooks/use-auction-wheel-game'

export type WheelProps = FlexProps

export const WheelGame = (props: WheelProps) => {
  const [slotUnderSelector, setSlotUnderSelector] = useState<NullablePossible<AuctionSlot>>(null)

  const auctionGameContext = useAuctionGameContext()
  const { state } = useAuctionWheelGame()

  useEffect(() => {
    if (state.isSpinning || !state.selectorCurrentSlot)
      return

    const slot = auctionGameContext.state.slots.alived.filter(slot => slot.title === state.selectorCurrentSlot)[0]
    setSlotUnderSelector(slot)
  }, [state.isSpinning, state.selectorCurrentSlot, auctionGameContext.state.slots.alived])

  const isShouldShowSlotInfo = !state.isSpinning && !!slotUnderSelector

  return (
    <Flex className="relative h-full w-full shrink-[2] gap-y-6" direction="column" {...props}>
      <Text className="text-center text-title desktop:text-title-lg font-semibold">
        {state.selectorCurrentSlot || 'Ожидание начала прокручивания...'}
      </Text>
      <WheelFortune />
      <AnimatePresence>
        {
          isShouldShowSlotInfo
          && (
            <MotionBox
              className="absolute w-fit h-fit left-1/2 bottom-[calc(40%)] -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.5 } }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <WinnerGameSlotInfo className="bg-dark" auctionSlot={slotUnderSelector} />
            </MotionBox>
          )
        }
      </AnimatePresence>

    </Flex>
  )
}

type WheelFortuneProps = FlexProps<'div'>

function WheelFortune(props: WheelFortuneProps) {
  const wheelGame = useAuctionWheelGame()

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
    <div ref={containerRef} className="relative flex shrink h-full w-full justify-start items-start" {...props}>
      <div
        className="flex w-full h-1/2 justify-center items-center"
        style={{ maskImage: `linear-gradient(
          #000,
          #000,
          transparent 0,
          #000 0px,
          #000 90%,
          transparent
        )` }}
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
              {/* <div
                className={cn(
                  'absolute w-full h-full rounded-pill overflow-clip z-10 my-1',
                  'animate-pulse duration-[2.5s] bg-dark-accent',
                  isSpinning && 'bg-green-accent/60 opacity-10',
                )}
                style={{
                  maskImage: `url(${bgSelectorUrl})`,
                  objectFit: 'fill',
                  clipPath: 'circle(98%)',
                }}
              /> */}
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
  )
}
