import { memo, useMemo } from 'react'

import { VList } from 'virtua'

import { donationsSelectors } from '~entities/donation/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from 'klewik-ui/icons'
import { Stack } from 'klewik-ui/stack'
import { Text } from 'klewik-ui/typography'

import { DonationsListCard } from './donation-card.ui'

type MemoizedDonationsListProps = {
  donationsIds: number[]
}

const MemoizedDonationsList = memo((props: MemoizedDonationsListProps) => {
  const { donationsIds } = props

  return (
    <VList>
      {donationsIds.map((donationId, index) => (
        <DonationsListCard key={donationId} className={index !== 0 ? 'mt-6' : ''} donationId={donationId} />
      ))}
    </VList>
  )
})

export const DonationsList = () => {
  const rawDonations = useStoreSelector(donationsSelectors.getAllRawDonations)

  const listValues = useMemo(() => rawDonations.map(donation => donation.id), [rawDonations])

  if (rawDonations.length === 0) {
    return (
      <Stack className="w-full h-full flex items-center justify-center text-gray-accent" gap="sm">
        <Icons.Logo size="lg" />
        <Text asSpan>Донатов нет</Text>
      </Stack>
    )
  }

  return (
    <div className="w-full h-full" style={{ flex: '1 1 auto' }}>
      <MemoizedDonationsList donationsIds={listValues} />
    </div>
  )
}
