import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import type { WheelSlot } from '~entities/wheel/model'

import { Text } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from '~shared/ui/virtual-list'

import { cn } from '~shared/utils'

import { useAuctionWheelGame } from '../../hooks/use-auction-wheel-game'
import { CardsGameListCard } from '../cards/cards-game-list-card.ui'
import { WheelSlotCard } from '../cards/wheel-slot-card.ui'

export type AuctionGameSlotsListProps = {
  className?: string
  renderCard?: (
    item: WheelSlot | AuctionSlot,
    index: number,
  ) => ReactNode
} & Omit<ShadowVirtualListProps<WheelSlot | AuctionSlot>, 'children'>

export const AuctionGameSlotsList = (props: AuctionGameSlotsListProps) => {
  const { data, renderCard, className, ...virtualListProps } = props

  const game = useStoreSelector(auctionGamesSelectors.getGame)
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedPointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const { state: { wheelSlots } } = useAuctionWheelGame()

  const [listItems, setListItems] = useState(data)

  useEffect(() => {
    const newListItems = game === 'wheel' ? wheelSlots.filter(item => data.findIndex(slot => slot.id === item.id) !== -1) : data
    newListItems.sort((a, b) => b.points - a.points)

    setListItems(newListItems)
  }, [game, data, storedAuctionSlots, wheelSlots])

  const winPercentsBounds = useMemo(() => {
    if (storedAuctionSlots.length === 0)
      return { min: 0, max: 0 }

    const sortedSlots = [...storedAuctionSlots].sort((a, b) => a.points - b.points)

    const minPercents = (sortedSlots[0].points / storedPointsSum) * 100
    const maxPercents = (sortedSlots[sortedSlots.length - 1].points / storedPointsSum) * 100

    return { min: minPercents, max: maxPercents }
  }, [storedPointsSum, storedAuctionSlots])

  if (listItems.length === 0) {
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

  const renderGameSlotCard: VirtualListRenderFunction<WheelSlot | AuctionSlot> = (slots, virtualizedItem) => {
    const slot = slots[virtualizedItem.index]

    switch (game) {
      case 'wheel': {
        return (
          <WheelSlotCard
            key={slot.id}
            wheelSlot={slot as WheelSlot}
            winPercentsBounds={winPercentsBounds}
          />
        )
      }
      case 'cards': {
        return (
          <CardsGameListCard
            key={slot.id}
            auctionSlot={slot as AuctionSlot}
            winPercentsBounds={winPercentsBounds}
          />
        )
      }
    }
  }

  return (
    <Flex className={cn('h-full w-full', className)} direction="column">
      <ShadowVirtualList
        data={listItems}
        slotsClassNames={{ container: 'pb-4' }}
        estimateSize={() => 125}
        {...virtualListProps}
      >
        {renderGameSlotCard}
      </ShadowVirtualList>
    </Flex>
  )
}
