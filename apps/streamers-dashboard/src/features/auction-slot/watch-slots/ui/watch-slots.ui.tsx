import {
  ComponentProps,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { ClassValue } from 'clsx'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import { VList } from 'virtua'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

const SlotsShadowScrollArea = ({
  style,
  ref: forwardRef,
  ...otherProps
}: ComponentProps<'div'>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [scrollYProgress, setScrollYProgress] = useState(0)

  const { scrollYProgress: motionScrollYProgress } = useScroll({
    container: containerRef,
  })

  useLayoutEffect(() => {
    if (!forwardRef) return

    if (typeof forwardRef === 'function' || typeof forwardRef === 'string') {
      return
    } else {
      containerRef.current = forwardRef.current
    }
  }, [forwardRef])

  useMotionValueEvent(motionScrollYProgress, 'change', (value) => {
    setScrollYProgress(value)
  })

  const shadowScrollAreaStyle = useMemo(() => {
    const isEndOfContainer = scrollYProgress === 1
    const isStartOfContainer = scrollYProgress === 0

    const topGradientValue = isStartOfContainer ? 0 : 100
    const bottomGradientValue = isEndOfContainer ? 0 : 100

    return `linear-gradient(#000, #000,transparent 0,#000 ${topGradientValue}px,#000 calc(100% - ${bottomGradientValue}px),transparent)`
  }, [scrollYProgress])

  return (
    <div
      data-slot="scrolling-shadow"
      ref={containerRef}
      style={{
        ...style,
        maskImage: shadowScrollAreaStyle,
      }}
      {...otherProps}
    />
  )
}

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  renderCard?: (item: AuctionSlot, index: number) => ReactNode
  shadowScroll?: boolean
}

const VirtualizedSlotsList = ({
  data,
  renderCard,
  shadowScroll = false,
}: AuctionSlotsListProps) => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(() => data ?? storedSlots)

  useEffect(() => {
    if (data === undefined) {
      return setSlots(storedSlots)
    }

    setSlots(data)
  }, [data, storedSlots])

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

  const defaultSlotsCardList = useMemo(() => {
    if (renderCard) return

    return slots.map((slot) => {
      return <AuctionSlotCard {...slot} />
    })
  }, [slots, renderCard])

  return (
    <AutoSizer disableWidth>
      {({ height }) => {
        return (
          <VList style={{ height }}>
            {renderCard ? slots.map(renderCard) : defaultSlotsCardList}
          </VList>
        )
      }}
    </AutoSizer>
  )
}

export { VirtualizedSlotsList }

type AuctionCardChipProps = {
  children?: ReactNode
  style?: HTMLAttributes<HTMLDivElement>['style']
  startContent?: JSX.Element
  endContent?: JSX.Element
  classNames?: {
    base?: ClassValue
    text?: ClassValue
  }
}

const AuctionCardChip = (props: AuctionCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <Flex
      className={cn(
        'px-2 py-1 bg-gray/30 gap-x-1.5 rounded-md',
        classNames?.base
      )}
      direction="row"
      align="center"
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-md font-medium text-gray-accent',
          classNames?.text
        )}
        tag="span"
      >
        {children}
      </Typography>
      {endContent}
    </Flex>
  )
}

type AuctionSlotCardProps = AuctionSlot & {
  percent?: string | number
}

const AuctionSlotCard = memo(
  forwardRef<HTMLDivElement, AuctionSlotCardProps>((props, forwardRef) => {
    const { percent, ...slot } = props
    return (
      <Card
        ref={forwardRef}
        className="flex flex-col justify-between border-1 border-dark gap-y-3 py-2"
      >
        <CardHeader className="flex items-start justify-between h-6">
          <CardTitle className="w-full">
            <Typography
              tag="span"
              className="font-golos-f font-semibold text-title"
            >
              {slot.name}
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-y-2 pt-0">
          <Flex className="w-full gap-x-2" direction="row" align="center">
            <div
              className="w-8 h-7 rounded-md"
              style={{
                backgroundColor: Array.isArray(slot.color)
                  ? `rgb(${slot.color.join(',')})`
                  : slot.color,
              }}
            />
            <AuctionCardChip
              startContent={<Icons.Id className="text-gray-light" size="sm" />}
            >
              {slot.id}
            </AuctionCardChip>
            <AuctionCardChip
              startContent={
                <Icons.Coin className="text-gray-light" size="sm" />
              }
            >
              {Intl.NumberFormat('ru-Ru').format(slot.points).toString()}
            </AuctionCardChip>
            {percent && (
              <AuctionCardChip
                classNames={{ base: 'bg-green/20', text: 'text-green' }}
              >
                {percent}%
              </AuctionCardChip>
            )}
          </Flex>
        </CardContent>
      </Card>
    )
  })
)

export { AuctionSlotCard, AuctionCardChip }
