import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { SolidAuctionSlotCard } from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  ShadowVirtualListProps,
} from '~shared/ui/shadow-virtual-list'
import {
  ShadowVirtualList,
} from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionSlotsListProps<DataSlotItem extends AuctionSlot> = {
  data?: DataSlotItem[]
  className?: string
  renderCard?: (item: DataSlotItem, virtualItem: VirtualItem, index: number, virtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>) => ReactNode
} & Omit<ShadowVirtualListProps<HTMLDivElement, DataSlotItem>, 'children'>

const VirtualizedSlotsList = (props: AuctionSlotsListProps<AuctionSlot>) => {
  const { data, renderCard, className, ...virtualListProps } = props

  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(data ?? storedSlots)

  if (data === undefined && slots !== storedSlots) {
    setSlots(storedSlots)
  }

  if (slots !== data && data !== undefined) {
    setSlots(data)
  }

  const renderVirtualListItem = useCallback(
    (data: AuctionSlot[], virtualItem: VirtualItem, index: number, virtualizer: Virtualizer<HTMLDivElement, HTMLDivElement>) => {
      const slot = data[index]

      if (renderCard) {
        return renderCard(slot, virtualItem, index, virtualizer)
      }

      return <SolidAuctionSlotCard auctionSlot={slot} />
    },
    [renderCard],
  )

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
          className="font-golos-f font-medium text-gray-light"
        >
          Слоты не найдены
        </Typography>
      </Flex>
    )
  }

  return (
    <Flex className={cn('h-full w-full', className)}>
      <ShadowVirtualList
        data={slots}
        slotsClassNames={{ content: 'pb-4' }}
        overscan={8}
        estimateSize={() => 125}
        {...virtualListProps}
      >
        {renderVirtualListItem}
      </ShadowVirtualList>
    </Flex>
  )
}

export { VirtualizedSlotsList }
