import type { VirtualizerHandle } from 'virtua'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { globalDialogsActions } from '~app/components/global-dialogs/store/global-dialogs.slice'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { SkeletonAuctionSlotCard } from '~entities/auction-slot/ui/card'

import { StartTransitionContainer } from '~shared/components/start-transition-container'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { WindowVirtualListProps } from '~shared/ui/virtual-list'
import { WindowVirtualList } from '~shared/ui/virtual-list'
import type { VirtualizedItem } from '~shared/ui/virtual-list/hooks'

import { useSortingSlots } from '../../lib'
import { AuctionSlotsListCard } from '../cards/slots-list-card.ui'

export type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
} & Omit<WindowVirtualListProps<AuctionSlot>, 'children' | 'virtualizer' | 'data'>

export const AuctionSlotsVirtualList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    ...virtualListProps
  } = props

  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedDroppedSlots = useStoreSelector(auctionSlotsSelectors.getDropoutSlots)
  const sortingOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const [listItems, setListItems] = useState(data ?? storedAuctionSlots)

  const droppedSlotsByIds = useMemo<Record<number, boolean>>(() => {
    return storedDroppedSlots.reduce((acc, curr) => {
      acc[curr.id] = true

      return acc
    }, {} as Record<number, boolean>)
  }, [storedDroppedSlots])

  const { setDialogState } = useActionCreators(globalDialogsActions)

  useEffect(() => {
    if (!data && listItems !== storedAuctionSlots) {
      setListItems(storedAuctionSlots)
    }

    if (data !== undefined && !shallowEqual(data, listItems)) {
      setListItems(data)
    }
  }, [data, storedAuctionSlots, listItems])

  const virtualizerRef = useRef<NullablePossible<VirtualizerHandle>>(null)

  const sortedSlots = useSortingSlots(listItems, sortingOptions)

  const renderAuctionSlotCard = useCallback(
    (auctionSlot: AuctionSlot) => {
      const isDropped = droppedSlotsByIds[auctionSlot.id]

      return (
        <StartTransitionContainer fallback={(
          <SkeletonAuctionSlotCard />
        )}
        >
          <AuctionSlotsListCard
            auctionSlot={auctionSlot}
            isDroped={isDropped}
            actionButtonProps={{
              onClick: () => {
                setDialogState({ dialog: 'editSlot', data: { initialData: auctionSlot, isOpen: true } })
              },
            }}
          />
        </StartTransitionContainer>
      )
    },
    [setDialogState, droppedSlotsByIds],
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
      gap={6}
      overscan={8}
      virtualListRef={virtualizerRef}
      {...virtualListProps}
    >
      {renderVirtualListItem}
    </WindowVirtualList>
  )
}
