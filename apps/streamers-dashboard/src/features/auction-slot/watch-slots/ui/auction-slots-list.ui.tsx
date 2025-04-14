import { ReactNode, useEffect, useMemo, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { Virtualizer as VirtualList } from 'virtua'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import {
  ShadowScrollArea,
  ShadowScrollAreaProps,
} from '~shared/ui/shadow-scroll-area'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  renderCard?: (item: AuctionSlot, index: number) => ReactNode
} & Pick<ShadowScrollAreaProps, 'shadowSize' | 'shadowEnabled'>

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
          <ShadowScrollArea
            className={cn(className)}
            shadowSize={shadowSize}
            shadowEnabled={shadowEnabled}
            style={{ width, height, overflowAnchor: 'none', overflowY: 'auto' }}
          >
            <VirtualList count={slots.length}>
              {renderCard ? slots.map(renderCard) : defaultSlotsCardList}
            </VirtualList>
          </ShadowScrollArea>
        )
      }}
    </AutoSizer>
  )
}

export { VirtualizedSlotsList }
