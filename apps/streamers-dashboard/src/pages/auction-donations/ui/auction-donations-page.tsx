import { useState } from 'react'

import { ProcessDonationSheet } from '~widgets/process-donation-dialogs/ui'

import type { ProcessedDonationStatus } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'
import type {
  DonationCardProps,
} from '~entities/donation/ui/card'
import {
  DonationCard,
  DonationCardBadge,
} from '~entities/donation/ui/card'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsFilterSelect } from './donations-filter-select.ui'
import { DonationsInfinityList } from './donations-infinity-list.ui'

type DonationProcessStatus = ProcessedDonationStatus | 'all'

export const AuctionDonationsPage = () => {
  const donations = useStoreSelector(donationsSelectors.getAllDonations)

  const [donationsFilterValue, setDonationsFilterValue]
    = useState<DonationProcessStatus>('all')

  const filtredDonations = useFiltredDonations(donations, {
    status: donationsFilterValue,
  })

  return (
    <div
      className={cn([
        'grid grid-rows-slots-table gap-y-3 tablet:grid-rows-slots-desktop',
        'relative mx-auto w-full h-full tablet:pt-5 mb-4',
        'mobile:gap-y-5',
        'max-tablet:max-w-[1100px] tablet:gap-y-7 tablet:pl-10',
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
        <Typography
          className="tablet:text-title-xl"
          tag="h1"
        >
          Пожертвования
        </Typography>
        <DonationsFilterSelect
          status={donationsFilterValue}
          onValueChange={(status: DonationProcessStatus) =>
            setDonationsFilterValue(status)}
        />
      </Flex>

      <DonationsInfinityList
        data={filtredDonations}
        filterStatus={donationsFilterValue}
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

function DonationCardWithControls(props: DonationCardProps) {
  return (
    <DonationCard
      {...props}
      renderHeader={donation => (
        <Flex className="w-full h-6" justify="between">
          <Flex className="gap-x-1.5">
            <IntegrationBadge integration={donation.source} />
            <DonationCardBadge status={donation.processData.status} />
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
