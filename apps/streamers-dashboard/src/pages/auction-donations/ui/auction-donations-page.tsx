import { useState } from 'react'

import { SearchInput } from '~widgets/search-input/ui'

import { DonationsList } from '~features/donations/watch-donations/ui'

import { Donation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'
import { ShadowScrollArea } from '~shared/ui/shadow-scroll-area'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

import { useFiltredDonations } from '../lib'
import { DonationsFilterSelect } from './donations-filter'

type DonationProcessStatus = Donation['processingStatus'] | 'default'

const mockedDonations = Array<Donation | null>(30)
  .fill(null)
  .map(
    (_, index) =>
      ({
        amount: Math.random() * 50000,
        currency: 'RUB',
        id: index,
        message: 'Test',
        message_type: 'text',
        processingStatus: 'added',
        provider: 'donation-alerts',
        username: 'Barbos',
      }) satisfies Donation
  )

const AuctionDonationsPage = () => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  const donations = useStoreSelector(donationsSelectors.getAllDonations)

  const [donationsFilterValue, setDonationsFilterValue] =
    useState<DonationProcessStatus>('default')

  const filtredDonations = useFiltredDonations(mockedDonations, {
    status: donationsFilterValue,
  })

  return (
    <div
      className={cn([
        'mx-auto w-full h-full pt-5 mb-4 grid grid-rows-slots-table gap-y-3',
        'mobile:gap-y-5',
        'tablet:grid-rows-slots-desktop max-tablet:max-w-[1100px] tablet:gap-y-4 tablet:pl-10',
        'desktop:max-w-[1750px] desktop-lg:max-w-[2100px]',
        'landtop:max-w-[1600px]',
      ])}
    >
      <Flex
        className="gap-x-4 pt-1"
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
            setDonationsFilterValue(status)
          }
        />
      </Flex>
      <ShadowScrollArea className="h-full pb-4">
        <DonationsList data={filtredDonations} />
      </ShadowScrollArea>
    </div>
  )
}

export { AuctionDonationsPage }
