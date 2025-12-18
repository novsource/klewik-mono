import { useState } from 'react'

import { DonationsStats } from '~widgets/dashboard-header/ui/donations-stats'

import type { ProcessedDonationStatus } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsStatusFilterSelect } from './donations-filter-select.ui'
import { AuctionDonationsInfiniteList } from './donations-infinity-list.ui'

export const AuctionDonationsPage = () => {
  const storedDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const [donationsFilterValue, setDonationsFilterValue]
    = useState<NullablePossible<ProcessedDonationStatus>>(null)

  const filtredDonationsByStatus = useFiltredDonations(storedDonations, {
    status: donationsFilterValue,
  })

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <div
      className={cn([
        'grid grid-rows-slots-table gap-y-3 pt-3 pb-20 tablet:grid-rows-slots-desktop',
        'relative mx-auto w-full h-full tablet:pt-5 tablet:mb-4 tablet:pb-0',
        'tablet:min-h-[var(--height-page)] tablet:h-auto',
        'mobile:gap-y-5',
        'tablet:gap-y-0 tablet:pb-0 tablet:pl-4',
        'max-tablet:max-w-[1100px] tablet:gap-y-7',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      {isLargeThenTablet
        && (
          <Flex
            className="w-full gap-x-4 pt-6 tablet:pt-1"
            wrap="nowrap"
            align="center"
            justify="between"
          >
            <PageTitle />

            <DonationsStatusFilterSelect
              status={donationsFilterValue}
              onValueChange={setDonationsFilterValue}
            />

          </Flex>
        )}

      {!isLargeThenTablet && (
        <Flex className="w-full mt-3.5" justify="between">
          <DonationsStats />
          <DonationsStatusFilterSelect
            status={donationsFilterValue}
            onValueChange={setDonationsFilterValue}
          />
        </Flex>
      )}
      <Divider className="border-gray/10 mt-1.5 mb-3" />
      <AuctionDonationsInfiniteList data={filtredDonationsByStatus} filterStatus={donationsFilterValue} />
    </div>
  )
}

function PageTitle() {
  return (
    <Flex className="gap-y-0.5 tablet:gap-y-1.25 w-full" direction="column">
      <Typography className="tablet:text-title-xl" tag="h1">
        Пожертвования
      </Typography>
      <Typography
        className="text-gray/80 max-tablet:text-sm"
        tag="span"
      >
        Просмотр и модерирование входящих пожертвований
      </Typography>
    </Flex>
  )
}
