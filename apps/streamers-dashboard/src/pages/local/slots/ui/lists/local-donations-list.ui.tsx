import type { Donation } from '~entities/donation/model'
import { createFakeDonationsArray } from '~entities/donation/model/__tests__/donations.mocks'

import { ShadowVirtualList } from 'klewik-ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from 'klewik-ui/virtual-list'

import { LocalDonationsListCard } from '../cards/local-donation-card.ui'

const fakeDonations = createFakeDonationsArray({ maxLength: 100 })

export const LocalDonationsList = () => {
  const renderGameSlotCard: VirtualListRenderFunction<Donation> = (donations, virtualizedItem) => {
    const donation = donations[virtualizedItem.index]

    return <LocalDonationsListCard donation={donation} />
  }

  return (
    <div className="w-full" style={{ flex: '1 1 auto' }}>
      <ShadowVirtualList data={fakeDonations} gap={28} slotsClassNames={{ container: 'py-4' }}>
        {renderGameSlotCard}
      </ShadowVirtualList>
    </div>
  )
}
