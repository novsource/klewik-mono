import SearchInput from '~pages/auction-slots/ui/search-input/search-input'

import { DonationsList } from '~features/donations/watch-donations/ui'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionDonationsPage = () => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  return (
    <div className="mb-4 flex flex-col gap-y-3 mobile:gap-y-5 tablet:max-w-[1100px] landtop:max-w-[1300px] tablet:gap-y-7 tablet:pb-4 tablet:px-2 desktop:max-w-[1800px] desktop-lg:max-w-[2100px] mx-auto w-full h-full">
      <div className="flex flex-nowrap items-center justify-between gap-x-4 pt-1">
        <SearchInput size={!isMediaLargeThenTablet ? 'lg' : 'default'} />
      </div>
      <div className="h-full w-full overflow-scroll">
        <DonationsList />
      </div>
    </div>
  )
}

export { AuctionDonationsPage }
