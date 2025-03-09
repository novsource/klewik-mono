import { useLayoutEffect, useState } from 'react'

import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Combobox, ComboboxData } from '~shared/ui/combobox'
import { Icons } from '~shared/ui/icons'
import { ScrollArea } from '~shared/ui/scroll-area'

import { SortingSlotsOptions, useSortingSlots } from '../lib'

type SlotsListWithSortingProps = {
  data?: AuctionSlot[]
  defaultSortingOptions?: SortingSlotsOptions
}

const sortingSlotsVariants: Array<
  ComboboxData[number] & { sortingOptions: SortingSlotsOptions }
> = [
  {
    value: 'nameAscending',
    label: 'По названию (возрастание)',
    icon: (
      <Icons.SortAlphabetAsc className="text-gray hover:text-gray-accent" />
    ),
    sortingOptions: { field: 'id', type: 'ascending' },
  },
  {
    value: 'nameDescending',
    label: 'По названию (убывание)',
    icon: <Icons.SortAlphabetDes className="text-gray" />,
    sortingOptions: { field: 'id', type: 'descending' },
  },
  {
    value: 'pointsAscending',
    label: 'По количеству очков (возрастание)',
    sortingOptions: { field: 'points', type: 'ascending' },
  },
  {
    value: 'pointsDescending',
    label: 'По количеству очков (убывание)',
    sortingOptions: { field: 'points', type: 'descending' },
  },
]

const defaultSortOptions: SortingSlotsOptions = {
  field: 'points',
  type: 'descending',
}

const SlotsListWithSorting = ({
  data,
  defaultSortingOptions: inputDefaultSortingOptions,
}: SlotsListWithSortingProps) => {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(() => data ?? storedAuctionSlots)
  const [sortingOptions, setSortingOptions] = useState<SortingSlotsOptions>(
    () => inputDefaultSortingOptions ?? defaultSortOptions
  )

  const sortedSlots = useSortingSlots(slots, sortingOptions)

  useLayoutEffect(() => {
    if (data === undefined) {
      setSlots(storedAuctionSlots)
      return
    }

    setSlots(data)
  }, [storedAuctionSlots, data])

  return (
    <div className="flex flex-col w-full h-full gap-y-3 overflow-scroll">
      <Combobox
        data={sortingSlotsVariants}
        placeholder="По умолчанию"
        onValueChanged={(sortValue) => {
          setSortingOptions(
            sortingSlotsVariants.find((sort) => sort.value === sortValue)
              ?.sortingOptions ?? defaultSortOptions
          )
        }}
      />

      <ScrollArea className="h-full w-full overflow-scroll">
        <AuctionSlotsList
          className="flex h-full w-full flex-col gap-y-2"
          data={sortedSlots}
        />
      </ScrollArea>
    </div>
  )
}

export { SlotsListWithSorting }
