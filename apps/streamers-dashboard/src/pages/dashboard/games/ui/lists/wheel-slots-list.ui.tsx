import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { WheelSlot } from '~entities/wheel/model'
import { wheelSelectors } from '~entities/wheel/store'

import { Text } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from '~shared/ui/virtual-list'

import { cn } from '~shared/utils'

import { CardsGameListCard } from '../cards/cards-game-list-card.ui'
import { WheelSlotCard } from '../cards/wheel-slot-card.ui'

export type AuctionGameSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  renderCard?: (
    item: WheelSlot,
    index: number,
  ) => ReactNode
} & Omit<ShadowVirtualListProps<WheelSlot>, 'children'>

export const AuctionGameSlotsList = (props: AuctionGameSlotsListProps) => {
  const { data, renderCard, className, ...virtualListProps } = props

  const game = useStoreSelector(auctionGamesSelectors.getGame)
  const storedSlots = useStoreSelector(wheelSelectors.getSlots)
  const storedPointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const [slots, setSlots] = useState(data ?? storedSlots)

  if (data === undefined && slots !== storedSlots) {
    setSlots(storedSlots)
  }

  if (slots !== data && data !== undefined) {
    setSlots(data)
  }

  const isEmptySlots = !slots.length && !storedSlots.length

  const winPercentsBounds = useMemo(() => {
    if (isEmptySlots)
      return { min: 0, max: 0 }

    const sortedSlots = [...storedSlots].sort((a, b) => a.points - b.points)

    const minPercents = (sortedSlots[0].points / storedPointsSum) * 100
    const maxPercents = (sortedSlots[sortedSlots.length - 1].points / storedPointsSum) * 100

    return { min: minPercents, max: maxPercents }
  }, [storedPointsSum, storedSlots, isEmptySlots])

  if (slots.length === 0) {
    return (
      <Flex
        className="h-full gap-y-2"
        direction="column"
        justify="center"
        align="center"
      >
        <Icons.Logo className="text-gray" width={32} height={32} />
        <Text
          className="font-golos-f font-medium text-gray-light"
          asSpan
        >
          Слоты не найдены
        </Text>
      </Flex>
    )
  }

  const renderGameSlotCard: VirtualListRenderFunction<WheelSlot> = (slots, virtualizedItem) => {
    const slot = slots[virtualizedItem.index]

    switch (game) {
      case 'wheel': {
        return (
          <WheelSlotCard
            key={slot.id}
            wheelSlot={slot}
            winPercentsBounds={winPercentsBounds}
          />
        )
      }
      case 'cards': {
        return (
          <CardsGameListCard
            key={slot.id}
            auctionSlot={slot}
            winPercentsBounds={winPercentsBounds}
          />
        )
      }
    }
  }

  return (
    <Flex className={cn('h-full w-full', className)} direction="column">
      <ShadowVirtualList
        data={slots}
        slotsClassNames={{ container: 'pb-4' }}
        estimateSize={() => 125}
        {...virtualListProps}
      >
        {renderGameSlotCard}
      </ShadowVirtualList>
    </Flex>
  )
}
