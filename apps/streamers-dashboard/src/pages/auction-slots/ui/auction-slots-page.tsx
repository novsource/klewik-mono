import { useMemo, useState } from 'react'

import { CreateSlotsDialog } from '~widgets/create-slots-dialog/ui'
import { SearchInput } from '~widgets/search-input/ui'
import { useSortingSlots } from '~widgets/slots-with-sort/lib'

import { useSearchAuctionSlots } from '~features/auction-slot/search-slots/hooks'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { appSelectors } from '~shared/store/slices'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { twSlotsStyles } from '~shared/utils'

import { auctionSlotsPageSearchInputStyles, auctionSlotsPageStyles } from '../styles'
import { AuctionSlotsList } from './slots-list/slots-list.ui'
import { SortingSlotsCombobox } from './sorting-slots-combobox'

const AuctionSlotsPage = () => {
  const [searchValue, setSearchValue] = useState<string>('')

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const sortOptions = useStoreSelector(appSelectors.getSlotsSortOptions)

  const searchedSlots = useSearchAuctionSlots(searchValue, auctionSlots)
  const sortedSlots = useSortingSlots(searchedSlots, sortOptions)

  const pageStyles = useMemo(() => twSlotsStyles(auctionSlotsPageStyles), [])
  const searchInputStyles = useMemo(() => twSlotsStyles(auctionSlotsPageSearchInputStyles), [])

  return (
    <div
      className={pageStyles.base}
    >
      <Flex
        className={pageStyles.contentWrapper}
        wrap="nowrap"
        align="center"
        justify="between"
      >
        <SearchInput
          slotClassNames={searchInputStyles}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Flex className={pageStyles.actionPanel} align="center">
          <SortingSlotsCombobox />
          <CreateSlotsDialog
            multiplySlots
            trigger={(
              <Button
                className="z-50 w-full max-tablet:hidden"
                variant="action"
                startContent={<Icons.Plus />}
              >
                Добавить слоты
              </Button>
            )}
          />
        </Flex>
      </Flex>
      <AuctionSlotsList data={sortedSlots} />
    </div>
  )
}

export default AuctionSlotsPage
