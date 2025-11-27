import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCardContentInfoDivider, AuctionSlotCardContentInfoWrapper, AuctionSlotCardIdInfo, AuctionSlotCardPointsInfo, AuctionSlotCardWinPercents, BaseAuctionSlotCard, BaseAuctionSlotCardContent, SolidAuctionSlotHeader } from '~entities/auction-slot/ui/card'

import { wheelActions } from '~entities/wheel/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  ShadowVirtualListProps,
} from '~shared/ui/shadow-virtual-list'
import {
  ShadowVirtualList,
} from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'
import type { VirtualListRenderFunction } from '~shared/ui/virtual-list'

import { cn } from '~shared/utils'

type AuctionSlotsListProps<DataSlotItem extends AuctionSlot> = {
  data?: DataSlotItem[]
  className?: string
  renderCard?: (
    item: DataSlotItem,
    index: number,
  ) => ReactNode
} & Omit<ShadowVirtualListProps<AuctionSlot>, 'children'>

export const VirtualizedSlotsList = (props: AuctionSlotsListProps<AuctionSlot>) => {
  const { data, renderCard, className, ...virtualListProps } = props

  const { setHighlightedSlotId } = useActionCreators(wheelActions)

  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedPointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const [slots, setSlots] = useState(data ?? storedSlots)

  if (data === undefined && slots !== storedSlots) {
    setSlots(storedSlots)
  }

  if (slots !== data && data !== undefined) {
    setSlots(data)
  }

  const renderVirtualListItem = useCallback<VirtualListRenderFunction<AuctionSlot>>(
    (data, virtualizedItem) => {
      const slot = data[virtualizedItem.index]

      if (renderCard) {
        return renderCard(slot, virtualizedItem.index)
      }

      const slotWinPercents = ((slot.points / storedPointsSum) * 100)

      return (
        <BaseAuctionSlotCard key={slot.id} className="pr-2">
          <Flex className="w-full" justify="between" align="center">
            <SolidAuctionSlotHeader slotColor={slot.color} slotId={slot.id} slotTitle={slot.title} />
            <Button
              className="h-full text-gray hover:text-gray-accent transition-colors"
              tabIndex={-1}
              variant="ghost"
              isIconOnly
              icon={<Icons.EyeOpen size="sm" />}
              size="xs"
              onMouseEnter={() => setHighlightedSlotId(slot.id)}
              onMouseLeave={() => setHighlightedSlotId(null)}
            />
          </Flex>
          <BaseAuctionSlotCardContent>
            <Flex
              className="bg-dark-light rounded-sm px-1.5 w-fit"
              direction="row"
              align="center"
            >
              <AuctionSlotCardContentInfoWrapper>
                <div className="size-3.5 rounded-pill" style={{ backgroundColor: slot.color }} />
              </AuctionSlotCardContentInfoWrapper>
              <AuctionSlotCardContentInfoDivider />
              <AuctionSlotCardIdInfo slotId={slot.auctionSlotOrder} />
              <AuctionSlotCardContentInfoDivider />
              <AuctionSlotCardPointsInfo slotPoints={slot.points} />
              {slotWinPercents
                && (
                  <>
                    <AuctionSlotCardContentInfoDivider />
                    <AuctionSlotCardWinPercents winPercents={slotWinPercents} />
                  </>
                )}
            </Flex>
          </BaseAuctionSlotCardContent>
        </BaseAuctionSlotCard>
      )
    },
    [renderCard, storedPointsSum],
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
        slotsClassNames={{ container: 'pb-4' }}
        overscan={8}
        estimateSize={() => 125}
        {...virtualListProps}
      >
        {renderVirtualListItem}
      </ShadowVirtualList>
    </Flex>
  )
}
