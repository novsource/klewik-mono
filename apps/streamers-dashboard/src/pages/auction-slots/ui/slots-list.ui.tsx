import type { VirtualizerHandle } from 'virtua'

import { useCallback, useRef, useState } from 'react'

import { useSortingSlots } from '~pages/auction-slots/lib'

import { useGlobalDialogsContext } from '~widgets/global-dialogs/context'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import {
  BaseAuctionSlotCard,
  SolidAuctionSlotContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import { WindowVirtualList } from '~shared/ui/virtual-list'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

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

  const { dispatch: { setIsEditSlotDialogOpen, setSelectedSlot } } = useGlobalDialogsContext()

  if (data !== undefined && showedSlots !== data) {
    setShowedSlots(data)
  }

  if (data === undefined && showedSlots !== storedAuctionSlots) {
    setShowedSlots(storedAuctionSlots)
  }

  const virtualizerRef = useRef<NullablePossible<VirtualizerHandle>>(null)

  const sortedSlots = useSortingSlots(showedSlots, sortingOptions)

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const renderAuctionSlotCard = useCallback(
    (auctionSlot: AuctionSlot) => {
      const percents = ((auctionSlot.points / storedSlotsPointsSum) * 100)

      return (
        <BaseAuctionSlotCard
          className="flex-row items-end pr-2"
          key={auctionSlot.title}
        >
          <Flex className="gap-y-2 pr-3.5" direction="column">
            <SolidAuctionSlotHeader
              slotId={auctionSlot.auctionSlotOrder}
              slotTitle={auctionSlot.title}
              slotColor={auctionSlot.color}
            />
            <SolidAuctionSlotContent
              auctionSlot={auctionSlot}
              winPercents={percents}
            />
          </Flex>
          <Button
            className="bg-dark-light size-7 tablet:size-8.5 text-gray-light transition-colors hover:text-white"
            isIconOnly
            icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
            onClick={() => {
              setSelectedSlot(auctionSlot)
              setIsEditSlotDialogOpen(true)
            }}
          />
        </BaseAuctionSlotCard>
      )
    },
    [storedSlotsPointsSum, isLargeThenTablet],
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

  if (isLargeThenTablet) {
    return (
      <WindowVirtualList
        data={sortedSlots}
        overscan={8}
        virtualListRef={virtualizerRef}
      >
        {renderVirtualListItem}
      </WindowVirtualList>
    )
    // return (
    //   <Flex className={cn('w-full h-full overflow-scroll', className)}>
    //     <ShadowVirtualList
    //       data={sortedSlots}
    //       slotsClassNames={{ container: 'pb-4' }}
    //       gap={gap}
    //       overscan={8}
    //       virtualListRef={virtualizerRef}
    //       {...virtualListProps}
    //     >
    //       {renderVirtualListItem}
    //     </ShadowVirtualList>
    //   </Flex>
    // )
  }

  return (
    <WindowVirtualList
      data={sortedSlots}
      overscan={8}
      virtualListRef={virtualizerRef}
    >
      {renderVirtualListItem}
    </WindowVirtualList>
  )
}
