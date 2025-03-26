import { useState } from 'react'

import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'
import { CreateSlotsDialog } from '~widgets/create-slots-dialog/ui'
import { SearchInput } from '~widgets/search-input/ui'
import { useSortingSlots } from '~widgets/slots-with-sort/lib'

import { useSearchAuctionSlots } from '~features/auction-slot/search-slots/hooks'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { appSelectors } from '~shared/store/slices'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

import { SortingSlotsCombobox } from './sorting-slots-combobox'

const AuctionSlotsPage = () => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const sortOptions = useStoreSelector(appSelectors.getSlotsSortOptions)

  const [searchValue, setSearchValue] = useState<string>('')

  const searchedSlots = useSearchAuctionSlots(searchValue, auctionSlots)
  const sortedSlots = useSortingSlots(searchedSlots, sortOptions)

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
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Flex className="gap-x-2" align="center">
          <SortingSlotsCombobox />
          <CreateSlotsDialog
            multiplySlots
            trigger={
              <Button variant={'action'} startContent={<Icons.Plus />}>
                {'Добавить слот'}
              </Button>
            }
          />
        </Flex>
      </Flex>
      <div className="h-full w-full">
        <AuctionSlotsList data={sortedSlots} disableAnimation />
      </div>
    </div>
  )
}

export default AuctionSlotsPage
