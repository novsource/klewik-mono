import { useState } from 'react'

import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'
import { CreateSlotsDialog } from '~widgets/create-slots-dialog/ui'
import { SearchInput } from '~widgets/search-input/ui'

import { useSearchAuctionSlots } from '~features/auction-slot/search-slots/hooks'
import {
  SlotsCountStatisticCard,
  SlotsPointsSumStatisticCard,
} from '~features/auction-slot/watch-statistics/ui'
import { ConnectedIntegrationsStatisticCard } from '~features/integrations/show-connected-integrations/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useMediaQuery } from '~shared/hooks/use-media-query'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import { tailwindScreens } from '~shared/constants/tailwindcss'

const AuctionSlotsPage = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const [searchValue, setSearchValue] = useState<string>('')
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )

  const searchedSlots = useSearchAuctionSlots(searchValue, auctionSlots)

  return (
    <div className="mb-4 grid grid-rows-slots-table gap-y-3 mobile:gap-y-5 tablet:grid-rows-slots-desktop tablet:max-w-[1100px] landtop:max-w-[1300px] tablet:gap-y-7 tablet:pb-4 tablet:px-2 desktop:max-w-[1800px] desktop-lg:max-w-[2100px] mx-auto w-full h-full">
      {isMediaLargeThenTablet && (
        <div className="w-full overflow-x-scroll flex flex-nowrap gap-x-2 [&>section]:rounded-medium">
          <ConnectedIntegrationsStatisticCard />
          <SlotsCountStatisticCard />
          <SlotsPointsSumStatisticCard />
        </div>
      )}

      <div className="flex flex-nowrap items-center justify-between gap-x-4 pt-1">
        <SearchInput
          size={!isMediaLargeThenTablet ? 'lg' : 'default'}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center gap-x-2">
          <CreateSlotsDialog
            multiplySlots
            trigger={
              <Button
                size={!isMediaLargeThenTablet ? 'lg' : 'default'}
                variant={'action'}
                startContent={<Icons.Plus size="xs" />}
              >
                {isMediaLargeThenTablet && 'Добавить слот'}
              </Button>
            }
          />
        </div>
      </div>

      <div className="h-full w-full overflow-scroll">
        <AuctionSlotsList
          className="flex h-full w-full flex-col gap-y-2"
          data={searchedSlots}
        />
      </div>
    </div>
  )
}

export default AuctionSlotsPage
