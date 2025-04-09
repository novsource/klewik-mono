import {
  ComponentProps,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { AnimatePresence, motion, transform } from 'framer-motion'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { Virtualizer as VirtualList } from 'virtua'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useDebouncedCallback } from '~shared/hooks/use-debounced-callback'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ScrollArea } from '~shared/ui/scroll-area'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  renderCard?: (item: AuctionSlot, index: number) => ReactNode
} & Pick<SlotsShadowScrollAreaProps, 'shadowSize' | 'shadowEnabled'>

const VirtualizedSlotsList = (props: AuctionSlotsListProps) => {
  const { data, className, renderCard, shadowEnabled, shadowSize } = props

  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(() => data ?? storedSlots)

  useEffect(() => {
    if (data === undefined) {
      return setSlots(storedSlots)
    }

    setSlots(data)
  }, [data, storedSlots])

  const defaultSlotsCardList = useMemo(() => {
    if (renderCard) return

    return slots.map((slot) => <AuctionSlotCard {...slot} />)
  }, [slots, renderCard])

  if (slots.length === 0) {
    return (
      <Flex
        className="h-full gap-y-2"
        direction="column"
        justify="center"
        align="center"
      >
        <Icons.Logo className="text-gray" width={32} height={32} />
        <Typography
          tag="p"
          className="text-gray-light font-medium font-golos-f"
        >
          Slots not found
        </Typography>
      </Flex>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <SlotsShadowScrollArea
            className={cn(className)}
            shadowSize={shadowSize}
            shadowEnabled={shadowEnabled}
            style={{ width, height, overflowAnchor: 'none', overflowY: 'auto' }}
          >
            <VirtualList count={slots.length}>
              {renderCard ? slots.map(renderCard) : defaultSlotsCardList}
            </VirtualList>
          </SlotsShadowScrollArea>
        )
      }}
    </AutoSizer>
  )
}

export { VirtualizedSlotsList }

type SlotsShadowScrollAreaProps = ComponentProps<'div'> & {
  shadowEnabled?: boolean
  shadowSize?: number
}

const SlotsShadowScrollArea = (props: SlotsShadowScrollAreaProps) => {
  const {
    style,
    children,
    ref: forwardRef,
    shadowEnabled = true,
    shadowSize = 60,
    ...restProps
  } = props

  const scrollElementRef = useRef<HTMLDivElement | null>(null)

  const [scrollYProgress, setScrollYProgress] = useState(0)

  const [isShadowAnimated, setIsShadowAnimated] = useState(false)

  const { scrollYProgress: motionScrollYProgress } = useScroll({
    container: scrollElementRef,
  })

  const debouncedShadowAnimation = useDebouncedCallback(
    () => setIsShadowAnimated(true),
    2000
  )

  useLayoutEffect(() => {
    if (!scrollElementRef.current) return

    debouncedShadowAnimation()

    scrollElementRef.current.addEventListener('resize', () => {
      console.log('resize')
    })
  }, [scrollElementRef])

  useLayoutEffect(() => {
    if (!forwardRef) return

    if (typeof forwardRef === 'function' || typeof forwardRef === 'string') {
      return
    } else {
      scrollElementRef.current = forwardRef.current
    }
  }, [forwardRef])

  useMotionValueEvent(motionScrollYProgress, 'change', (value) => {
    setIsShadowAnimated(() => {
      debouncedShadowAnimation()
      return false
    })

    setScrollYProgress(value)
  })

  const shadowScrollAreaStyle = useMemo(() => {
    const getTopGradientValue = transform([0, 0.025], [0, shadowSize])
    const getBottomGradientValue = transform([0.975, 1], [shadowSize, 0])

    return `linear-gradient(#000, #000,transparent 0,#000 ${getTopGradientValue(scrollYProgress)}px,#000 calc(100% - ${getBottomGradientValue(scrollYProgress)}px),transparent)`
  }, [scrollYProgress, shadowSize])

  return (
    <div
      data-slot="shadow-scroll-area"
      style={{
        ...style,
        position: 'relative',
        maskImage: shadowEnabled ? shadowScrollAreaStyle : 'none',
      }}
      {...restProps}
    >
      <AnimatePresence>
        {isShadowAnimated && (
          <>
            <motion.div
              className={cn(
                'w-full bg-gradient-to-b from-transparent via-white/40 via-20% to-transparent to-80%',
                `h-[50px]`
              )}
              initial={{ opacity: 0, translateY: 0 }}
              animate={{
                opacity: [0, 1, 0],
                translateY: [0, -40],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                display: scrollYProgress !== 0 ? 'inline-block' : 'none',
                zIndex: 2,
                position: 'absolute',
              }}
            />
            <motion.div
              className={cn(
                'w-full bg-gradient-to-t from-transparent via-white/40 via-20% to-transparent to-80% bottom-0',
                `h-[50px]`
              )}
              initial={{ opacity: 0, translateY: 0 }}
              animate={{
                translateY: [0, 40],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                display: scrollYProgress !== 1 ? 'inline-block' : 'none',
                zIndex: 2,
                position: 'absolute',
              }}
            />
          </>
        )}
      </AnimatePresence>
      <ScrollArea
        className="h-full w-full"
        style={{ scrollMarginLeft: 50 }}
        viewportProps={{
          ref: scrollElementRef,
          style: {
            paddingBottom: 16,
            scrollPaddingLeft: 26,
            scrollMarginLeft: 50,
            scrollbarWidth: 'none',
          },
        }}
      >
        {children}
      </ScrollArea>
    </div>
  )
}

export { SlotsShadowScrollArea }
