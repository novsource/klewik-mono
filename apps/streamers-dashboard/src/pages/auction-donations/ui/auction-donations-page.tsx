import type { DonationsStatusFilterValue } from './donations-filter-select.ui'

import { useLayoutEffect, useState } from 'react'

import z from 'zod'

import { DonationsStats } from '~widgets/dashboard-header/ui/donations-stats'

import { donationsSelectors } from '~entities/donation/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Text, Title } from '~shared/components/typography'

import { useDocumentTitle, useUrlSearchParam } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'

import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsStatusFilterSelect } from './donations-filter-select.ui'
import { AuctionDonationsInfiniteList } from './donations-infinity-list.ui'

const DonationFilterStatusSchema = z.literal<DonationsStatusFilterValue[]>(['added', 'all', 'checkRequested', 'empty', 'error', 'rejected'])

export const AuctionDonationsPage = () => {
  const storedDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const { set: setStatusSearchParam, value } = useUrlSearchParam<DonationsStatusFilterValue>('status', { initialValue: 'all' })

  const [donationsFilterValue, setDonationsFilterValue]
    = useState<DonationsStatusFilterValue>(value ?? 'all')

  const filtredDonationsByStatus = useFiltredDonations(storedDonations, {
    status: donationsFilterValue,
  })

  useLayoutEffect(() => {
    const isDonationFilterStatusURLStateValid = DonationFilterStatusSchema.safeParse(value).success

    if (!isDonationFilterStatusURLStateValid) {
      setStatusSearchParam('all')
    }
  }, [value, setStatusSearchParam])

  useDocumentTitle('Пожертвования | Поинтовый аукцион Klewik')

  return (
    <div
      className={cn([
        'mx-auto grid h-full w-full grid-rows-slots-table gap-y-3 pt-3 pb-26 tablet:pt-5 tablet:min-h-[var(--height-page)] tablet:h-auto',
        'mobile:gap-y-5',
        'max-tablet:max-w-[1100px] tablet:grid-rows-slots-desktop tablet:pb-0 tablet:pl-4',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

        <MediaQueryViewToggler.MatchedItem>
          <PageHeader />

          <DonationsStatusFilterSelect
            className="justify-self-end"
            status={donationsFilterValue}
            onValueChange={setDonationsFilterValue}
          />
        </MediaQueryViewToggler.MatchedItem>

        <MediaQueryViewToggler.NotMatchedItem>
          <Flex className="w-full mt-3.5" justify="between">
            <DonationsStats />
            <DonationsStatusFilterSelect
              status={donationsFilterValue}
              onValueChange={setDonationsFilterValue}
            />
          </Flex>
        </MediaQueryViewToggler.NotMatchedItem>

      </MediaQueryViewToggler>

      <AuctionDonationsInfiniteList data={filtredDonationsByStatus} filterStatus={donationsFilterValue} />
    </div>
  )
}

function PageHeader() {
  return (
    <Flex className="gap-y-0.5 tablet:gap-y-1.25 tablet:mb-12 w-full" direction="column">
      <Title className="tablet:text-title-xl desktop:text-title-2xl">Пожертвования</Title>
      <Text className="text-gray/80">
        Просмотр и модерирование входящих пожертвований
      </Text>
    </Flex>
  )
}
