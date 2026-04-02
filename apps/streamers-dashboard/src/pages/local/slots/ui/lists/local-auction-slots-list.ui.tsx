import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { createFakeAuctionSlotsArray } from '~entities/auction-slot/model/__tests__/auction-slot.mocks'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { ShadowVirtualList } from 'klewik-ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from 'klewik-ui/virtual-list'

import { LocalAuctionSlotListCard } from '../cards/local-auction-slot-card.ui'

const fakeSlots = createFakeAuctionSlotsArray()

export const LocalAuctionSlotsList = () => {
  const winnerId = useStoreSelector(auctionSelectors.getWinnerId)
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const renderGameSlotCard: VirtualListRenderFunction<AuctionSlot> = (slots, virtualizedItem) => {
    const slot = slots[virtualizedItem.index]

    const isWinnerExist = winnerId !== null
    // const isDropped = isWinnerExist || slot.isDropped

    const isWinner = winnerId === slot.id

    return <LocalAuctionSlotListCard isWinner={isWinner} slot={slot} />
  }

  return (
    <div className="h-full w-full" style={{ flex: '1 1 auto' }}>
      <ShadowVirtualList data={fakeSlots}>
        {renderGameSlotCard}
      </ShadowVirtualList>
    </div>
  )
}
