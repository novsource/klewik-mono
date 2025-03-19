import { SearchInput } from '~widgets/search-input/ui'

import { DonationsList } from '~features/donations/watch-donations/ui'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Flex } from '~shared/ui/flex'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionDonationsPage = () => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <Flex
      className="mb-4 gap-y-3 mobile:gap-y-5 tablet:max-w-[1100px] landtop:max-w-[1300px] tablet:gap-y-7 tablet:pb-4 tablet:px-2 desktop:max-w-[1800px] desktop-lg:max-w-[2100px] mx-auto w-full h-full"
      direction="column"
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
    </Flex>
  )
}

export { AuctionDonationsPage }
