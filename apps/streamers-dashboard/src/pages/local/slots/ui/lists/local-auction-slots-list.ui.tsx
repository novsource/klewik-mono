import { useMemo } from 'react'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { ShadowVirtualList } from 'klewik-ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from 'klewik-ui/virtual-list'

import { LocalAuctionSlotListCard } from '../cards/local-auction-slot-card.ui'

export const LocalAuctionSlotsList = () => {
  const winnerId = useStoreSelector(auctionSelectors.getWinnerId)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const listData = useMemo(() => [...auctionSlots].sort((a, b) => b.points - a.points), [auctionSlots])

  const renderGameSlotCard: VirtualListRenderFunction<AuctionSlot> = (slots, vItem) => {
    const slot = slots[vItem.index]
    const isWinner = winnerId === slot.id

    return <LocalAuctionSlotListCard isWinner={isWinner} slot={slot} />
  }

  return (
    <div className="w-full" style={{ flex: '1 1 auto' }}>
      {/* <ul>
        {listData.map((item, index) => renderGameSlotCard(listData, { id: index, index }))}
      </ul> */}
      <ShadowVirtualList data={listData} slotsClassNames={{ container: 'pb-4' }}>
        {renderGameSlotCard}
      </ShadowVirtualList>
    </div>
  )
}
