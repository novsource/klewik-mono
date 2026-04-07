import { useMemo } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useWheelGameContext } from '~entities/wheel/context'
import type { WheelSlot } from '~entities/wheel/model'

import { Text } from '~shared/components/typography'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { ShadowVirtualList } from 'klewik-ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from 'klewik-ui/virtual-list'

import { getPercentValue } from '~shared/utils/common'

import { useAuctionGameContext } from '../../context/auction-game-context'
import { GameListCard } from '../cards/cards-game-list-card.ui'

export type AuctionGameSlotsListProps = {
  data: AuctionSlot[]
}

export const AuctionGameSlotsList = (props: AuctionGameSlotsListProps) => {
  const { data } = props

  const auctionGameType = useStoreSelector(auctionGamesSelectors.getGame)

  return auctionGameType === 'wheel'
    ? <WheelSlotsList data={data} />
    : <CardsGameSlotsList data={data} />
}

type AuctionWheelSlotsListProps = {
  data: AuctionSlot[]
}

function WheelSlotsList(props: AuctionWheelSlotsListProps) {
  const { data } = props

  const { state: { wheelSlots } } = useWheelGameContext()

  return <BaseGameSlotsList data={wheelSlots} />
}

function CardsGameSlotsList(props: AuctionWheelSlotsListProps) {
  const { data } = props

  return <BaseGameSlotsList data={data} />
}

type BaseGameSlotsListProps = {
  data: AuctionSlot[]
}

function BaseGameSlotsList(props: BaseGameSlotsListProps) {
  const { data } = props

  const auctionGame = useAuctionGameContext()

  const storedPointsSum = useStoreSelector(auctionSlotsSelectors.getSlotsPointsSum)

  const winPercentsBounds = useMemo(() => {
    if (auctionGame.state.slots.alived.length === 0)
      return { min: 0, max: 0 }

    const sortedSlots = [...auctionGame.state.slots.alived].sort((a, b) => a.points - b.points)

    const minPercents = getPercentValue(storedPointsSum, sortedSlots[0].points) * 100
    const maxPercents = (sortedSlots[sortedSlots.length - 1].points / storedPointsSum) * 100

    return { min: minPercents, max: maxPercents }
  }, [storedPointsSum, auctionGame.state.slots.alived])

  if (data.length === 0) {
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

    const isWinnerExist = auctionGame.state.slots.winner !== null
    const isDropped = isWinnerExist || slot.isDropped

    const isWinner = auctionGame.state.slots.winner?.id === slot.id

    return <GameListCard key={slot.title} auctionSlot={slot} isDropped={isDropped} isWinner={isWinner} winPercentsBounds={winPercentsBounds} />
  }

  return (
    <div className="h-full w-full" style={{ flex: '1 1 auto' }}>
      <ShadowVirtualList data={data}>
        {renderGameSlotCard}
      </ShadowVirtualList>
    </div>
  )
}
