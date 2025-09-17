import type { VirtualizerHandle } from 'virtua'

import { useCallback, useRef, useState } from 'react'

import { useSortingSlots } from '~pages/auction-slots/lib'

import { EditSlotDialog } from '~features/auction-slot/edit-slot/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import {
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { cn } from '~shared/utils'

export type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
} & Omit<ShadowVirtualListProps<AuctionSlot>, 'children' | 'virtualizer' | 'data'>

export const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    gap = 8,
    ...virtualListProps
  } = props
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

  const virtualizerRef = useRef<NullablePossible<VirtualizerHandle>>(null)

  const sortedSlots = useSortingSlots(showedSlots, sortingOptions)

  const renderAuctionSlotCard = useCallback(
    (auctionSlot: AuctionSlot) => {
      const percents = ((auctionSlot.points / storedSlotsPointsSum) * 100)

      return (
        <BaseAuctionSlotCard
          key={auctionSlot.title}
        >
          <SolidAuctionSlotHeader
            slotId={auctionSlot.id}
            slotTitle={auctionSlot.title}
            slotColor={auctionSlot.color}
          />
          <BaseAuctionSlotCardContent>
            <Flex
              className="w-full gap-x-3 tablet:gap-x-5"
              direction="row"
              align="end"
            >
              <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
              <AuctionSlotCardWinPercents winPercents={percents} />
            </Flex>
            <EditSlotDialog
              slot={auctionSlot}
              trigger={(
                <Button
                  className="bg-dark-light size-9 text-gray-light transition-colors hover:text-white"
                  isIconOnly
                  icon={<Icons.ArrowRight />}
                />
              )}
            />
          </BaseAuctionSlotCardContent>
        </BaseAuctionSlotCard>
      )
    },
    [storedSlotsPointsSum],
  )

  const renderVirtualListItem = useCallback(
    (
      data: AuctionSlot[],
      virtualizedItem: VirtualizedItem,
    ) => {
      const slot = data[virtualizedItem.index]

      return renderAuctionSlotCard(slot)
    },
    [renderAuctionSlotCard],
  )

  return (
    <Flex className={cn('h-full w-full', className)}>
      <ShadowVirtualList
        data={sortedSlots}
        slotsClassNames={{ container: 'pb-4' }}
        gap={gap}
        overscan={8}
        virtualListRef={virtualizerRef}
        {...virtualListProps}
      >
        {renderVirtualListItem}
      </ShadowVirtualList>
    </Flex>
  )
}
