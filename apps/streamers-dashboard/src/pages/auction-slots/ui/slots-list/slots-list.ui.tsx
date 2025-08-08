import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { useSortingSlots } from '~pages/auction-slots/lib'

import { ResponsiveEditSlotDialogue } from '~widgets/edit-slot-dialog/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import {
  AuctionSlotCard,
  AuctionSlotCardColorInfo,
  AuctionSlotCardContent,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'

import { cn } from '~shared/utils'

const getFormattedPercent = (points: number, allSlotsPointsSum: number) => {
  let percent = ((points / allSlotsPointsSum) * 100).toFixed(2)

  if (percent[-1] === '0' && percent[-2] === '0') {
    let precisionLimit = 2

    while (
      (percent[-1] === '0' && percent[-2] === '0')
      || precisionLimit !== 5
    ) {
      percent = ((points / allSlotsPointsSum) * 100).toFixed(
        precisionLimit,
      )

      precisionLimit++
    }
  }

  return percent
}

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
} & Omit<ShadowVirtualListProps<HTMLDivElement, AuctionSlot>, 'children' | 'virtualizer' | 'data'>

const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    gap = 8,
    ...virtualListProps
  } = props

  const { state: locationState } = useLocation()

  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )
  const sortingOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const [showedSlots, setShowedSlots] = useState(data ?? storedAuctionSlots)

  if (data !== undefined && showedSlots !== data) {
    setShowedSlots(data)
  }

  if (data === undefined && showedSlots !== storedAuctionSlots) {
    setShowedSlots(storedAuctionSlots)
  }

  const virtualizerRef = useRef<NullablePossible<Virtualizer<HTMLDivElement, HTMLDivElement>>>(null)
  const scrollTimeoutRef = useRef<NullablePossible<NodeJS.Timeout>>(null)

  const sortedSlots = useSortingSlots(showedSlots, sortingOptions)

  const scrollToSlot = useCallback((scrollTargetSlot: AuctionSlot) => {
    const virtualizer = virtualizerRef.current

    if (!virtualizer || virtualizer.isScrolling)
      return

    const targetSlotIndex = sortedSlots.findIndex(slot => slot.id === scrollTargetSlot.id)

    console.log(targetSlotIndex)

    virtualizer.scrollToIndex(targetSlotIndex, { behavior: 'smooth' })
  }, [virtualizerRef, sortedSlots])

  const renderAuctionCard = useCallback(
    (auctionSlot: AuctionSlot) => {
      // const percent = getFormattedPercent(auctionSlot.points, storedSlotsPointsSum)
      const percents = ((auctionSlot.points / storedSlotsPointsSum) * 100)

      const scrollSlotTarget = locationState?.scrollToSlot as AuctionSlot | undefined

      const isCurrentItemScrollTargetSlot = scrollSlotTarget && scrollSlotTarget.id === auctionSlot.id
      const isScrollTargetExist = !!scrollSlotTarget
      const isScrollNotEnded = !!scrollTimeoutRef.current

      return (
        <AuctionSlotCard
          className={cn('transition-all', !isCurrentItemScrollTargetSlot
          && isScrollTargetExist
          && isScrollNotEnded
          && 'opacity-30 blur-[3px]', isCurrentItemScrollTargetSlot
          && 'border-1 border-gray-accent rounded-large')}
        >
          <SolidAuctionSlotHeader slotId={auctionSlot.id} slotTitle={auctionSlot.title} />
          <AuctionSlotCardContent>
            <Flex
              className="w-full mobile:gap-x-5"
              direction="row"
              align="end"
            >
              <AuctionSlotCardColorInfo slotColor={auctionSlot.color} />
              <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
              <AuctionSlotCardWinPercents winPercents={percents} />
            </Flex>
            <ResponsiveEditSlotDialogue
              slot={auctionSlot}
              trigger={(
                <Button
                  className="bg-dark-light size-9 text-gray-light transition-colors hover:text-white"
                  isIconOnly
                  icon={<Icons.ArrowRight />}
                />
              )}
            />
          </AuctionSlotCardContent>
        </AuctionSlotCard>
      )
    },
    [storedSlotsPointsSum, locationState, scrollTimeoutRef],
  )

  const renderVirtualListItem = useCallback(
    (
      data: AuctionSlot[],
      _virtualItem: VirtualItem,
      index: number,
      virtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>,
    ) => {
      if (virtualizerRef.current === null) {
        virtualizerRef.current = virtualizer
      }

      console.log(index)

      const slot = data[index]

      const isItemScrollTargetSlot = locationState?.scrollToSlot && slot.id === locationState.scrollToSlot.id

      if (isItemScrollTargetSlot && !virtualizer.isScrolling && scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current!)

        locationState.scrollToSlot = undefined
        scrollTimeoutRef.current = null
      }

      return renderAuctionCard(slot)
    },
    [renderAuctionCard, virtualizerRef, locationState, scrollTimeoutRef],
  )

  useEffect(() => {
    if (locationState?.scrollToSlot) {
      scrollTimeoutRef.current = setTimeout(() => {
        scrollToSlot(locationState.scrollToSlot)
      })
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [locationState, scrollToSlot, scrollTimeoutRef])

  return (
    <Flex className={cn('h-full w-full', className)}>
      <ShadowVirtualList
        data={sortedSlots}
        slotsClassNames={{ content: 'pb-4' }}
        gap={gap}
        overscan={8}
        estimateSize={() => 126}
        scrollPaddingStart={50}
        scrollPaddingEnd={50}
        {...virtualListProps}
      >
        {renderVirtualListItem}
      </ShadowVirtualList>
    </Flex>
  )
}

export { AuctionSlotsList }
