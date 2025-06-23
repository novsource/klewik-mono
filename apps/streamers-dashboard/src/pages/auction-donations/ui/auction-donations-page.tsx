import { useState } from 'react'

import { ProcessDonationSheet } from '~widgets/process-donation-dialogs/ui'
import { SearchInput } from '~widgets/search-input/ui'

import { DonationsList } from '~features/donations/watch-donations/ui'

import type { ProcessedDonation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'
import type {
  DonationCardProps,
} from '~entities/donation/ui/card'
import {
  DonationCard,
  DonationCardBadge,
  SkeletonDonationCard,
} from '~entities/donation/ui/card'
import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { tailwindScreens } from '~shared/constants/tailwindcss'
import { useMediaQuery } from '~shared/hooks/use-media-query'
import { useStoreSelector } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsFilterSelect } from './donations-filter'

type DonationProcessStatus = ProcessedDonation['processedStatus'] | 'default'

const AuctionDonationsPage = () => {
  const donations = useStoreSelector(donationsSelectors.getAllDonations)

  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`,
  )

  const [donationsFilterValue, setDonationsFilterValue]
    = useState<DonationProcessStatus>('default')

  const filtredDonations = useFiltredDonations(donations, {
    status: donationsFilterValue,
  })

  return (
    <div
      className={cn([
        'grid grid-rows-slots-table gap-y-3 tablet:grid-rows-slots-desktop',
        'relative mx-auto w-full h-full pt-5 mb-4',
        'mobile:gap-y-5',
        'max-tablet:max-w-[1100px] tablet:gap-y-4 tablet:pl-10',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      <Flex
        className="w-full gap-x-4 pt-1"
        wrap="nowrap"
        align="center"
        justify="between"
      >
        <SearchInput
          slotClassNames={{
            base: 'w-full tablet:max-w-[400px] landtop:max-w-[450px] desktop:max-w-[500px]',
          }}
          size={!isMediaLargeThenTablet ? 'lg' : 'default'}
        />
        <DonationsFilterSelect
          status={donationsFilterValue}
          onValueChange={(status: DonationProcessStatus) =>
            setDonationsFilterValue(status)}
        />
      </Flex>

      {/* <DonationsInfinityList data={filtredDonations} /> */}

      <DonationsList
        data={filtredDonations}
        renderDonation={(donation, index) => (
          <DonationCardWithControls
            data={donation}
            style={{
              marginTop: index !== 0 ? '8px' : '0',
            }}
          />
        )}
      />
    </div>
  )
}

export { AuctionDonationsPage }

function DonationCardWithControls({
  showingSkeleton,
  ...props
}: DonationCardProps & { showingSkeleton?: boolean }) {
  if (showingSkeleton)
    return <SkeletonDonationCard {...props} />

  return (
    <DonationCard
      {...props}
      renderHeader={donation => (
        <Flex className="w-full h-6" justify="between">
          <Flex className="gap-x-1.5">
            <IntegrationBadge integration={donation.source} />
            <DonationCardBadge status={donation.processedStatus} />
          </Flex>
          <Flex>
            <ProcessDonationSheet
              donation={donation}
              trigger={(
                <Button
                  className="h-full text-gray-accent hover:text-white/80 transition-colors z-50"
                  variant="ghost"
                  size="xs"
                  isIconOnly
                  icon={<Icons.OpenArrow size="xs" />}
                />
              )}
            />
          </Flex>
        </Flex>
      )}
    />
  )
}
