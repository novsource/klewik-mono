import type { VirtualizerHandle } from 'virtua'

import { useCallback, useRef, useState } from 'react'

import { globalDialogsActions } from '~features/_common/display-dialogs'

import { useSortingSlots } from '~pages/auction-slots/lib'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import {
  BaseAuctionSlotCard,
  SolidAuctionSlotContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { WindowVirtualListProps } from '~shared/ui/virtual-list'
import { WindowVirtualList } from '~shared/ui/virtual-list'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

export type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
} & Omit<WindowVirtualListProps<AuctionSlot>, 'children' | 'virtualizer' | 'data'>

export const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    ...virtualListProps
  } = props

  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )
  const sortingOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const [showedSlots, setShowedSlots] = useState(data ?? storedAuctionSlots)

  const { setDialogState } = useActionCreators(globalDialogsActions)

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
            />
            <SolidAuctionSlotContent
              auctionSlot={auctionSlot}
              winPercents={percents}
            />
          </Flex>
          <Button
            className="bg-dark-light text-gray-light transition-colors hover:text-white"
            isIconOnly
            icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
            onClick={() => {
              setDialogState({ dialog: 'editSlot', data: { initialData: auctionSlot, isOpen: true } })
            }}
            size={isLargeThenTablet ? 'sm' : 'xs'}
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

  return (
    <WindowVirtualList
      data={sortedSlots}
      overscan={8}
      virtualListRef={virtualizerRef}
      {...virtualListProps}
    >
      {renderVirtualListItem}
    </WindowVirtualList>
  )
}
