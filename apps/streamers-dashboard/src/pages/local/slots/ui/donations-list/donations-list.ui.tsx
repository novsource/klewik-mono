import type { Donation } from '~entities/donation/model'
import { createFakeDonationsArray } from '~entities/donation/model/__tests__/donations.mocks'

import { ShadowVirtualList } from 'klewik-ui/shadow-virtual-list'
import type { VirtualListRenderFunction } from 'klewik-ui/virtual-list'

import { DonationsListCard } from './donation-card.ui'

const fakeDonations = createFakeDonationsArray({ maxLength: 100 })

export const DonationsList = () => {
  const renderGameSlotCard: VirtualListRenderFunction<Donation> = (donations, virtualizedItem) => {
    const { id, index } = virtualizedItem
    const donation = donations[virtualizedItem.index]

    return <DonationsListCard key={id} className={index !== 0 ? 'mt-6' : ''} donation={donation} />
  }

  return (
    <div style={{ flex: '1 1 auto' }}>
      <ShadowVirtualList data={fakeDonations} slotsClassNames={{ container: 'py-4' }}>
        {renderGameSlotCard}
      </ShadowVirtualList>
    </div>
  )
}
