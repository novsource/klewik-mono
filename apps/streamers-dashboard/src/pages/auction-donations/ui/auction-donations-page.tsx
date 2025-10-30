import { useState } from 'react'

import { DonationsStats } from '~widgets/dashboard-header/ui/donations-stats'

import type { ProcessedDonationStatus } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useDidUpdate, useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { sseSelectors } from '~shared/store/slices'

import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { toastErrorNotification } from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsFilterSelect } from './donations-filter-select.ui'
import { AuctionDonationsInfiniteList } from './donations-infinity-list.ui'

export const AuctionDonationsPage = () => {
  const { isConnected: isDonationsSSEEventConnected } = useStoreSelector(store => sseSelectors.getEventStatus(store, 'auctionSlots'))

  const storedDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const [donationsFilterValue, setDonationsFilterValue]
    = useState<NullablePossible<ProcessedDonationStatus>>(null)

  const filtredDonations = useFiltredDonations(storedDonations, {
    status: donationsFilterValue,
  })

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  useDidUpdate(() => {
    if (!isDonationsSSEEventConnected) {
      toastErrorNotification('Auction slots not connected!!!')
    }
  }, [isDonationsSSEEventConnected])

  return (
    <div
      className={cn([
        'grid grid-rows-slots-table gap-y-3 pt-3 pb-20 tablet:grid-rows-slots-desktop',
        'relative mx-auto w-full h-full tablet:pt-5 tablet:mb-4 tablet:pb-0',
        'tablet:min-h-[var(--height-page)] tablet:h-auto',
        'mobile:gap-y-5',
        'max-tablet:max-w-[1100px] tablet:gap-y-7 tablet:pl-10',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      <Flex
        className="w-full gap-x-4 pt-6 tablet:pt-1"
        wrap="nowrap"
        align="center"
        justify="between"
      >
        <Typography className="tablet:text-title-xl" tag="h1">
          Пожертвования
        </Typography>
        {isLargeThenTablet && (
          <DonationsFilterSelect
            status={donationsFilterValue}
            onValueChange={(status: ProcessedDonationStatus) =>
              setDonationsFilterValue(status)}
          />
        )}
      </Flex>
      {!isLargeThenTablet && (
        <Flex className="w-full mt-3.5" justify="between">
          <DonationsStats />
          <DonationsFilterSelect
            status={donationsFilterValue}
            onValueChange={(status: ProcessedDonationStatus) =>
              setDonationsFilterValue(status)}
          />
        </Flex>
      )}
      <Divider className="border-gray/10 mt-1.5 mb-3" />
      <AuctionDonationsInfiniteList data={filtredDonations} filterStatus={donationsFilterValue} />
    </div>
  )
}
