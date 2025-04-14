import { SearchInput } from '~widgets/search-input/ui'

import { DonationsList } from '~features/donations/watch-donations/ui'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'

import { tailwindScreens } from '~shared/constants/tailwindcss'

import { cn } from '~shared/utils'

const AuctionDonationsPage = () => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

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
        <SearchInput size={!isMediaLargeThenTablet ? 'lg' : 'default'} />
      </Flex>
      <div className="h-full w-full overflow-scroll">
        <DonationsList />
      </div>
    </div>
  )
}

export { AuctionDonationsPage }
