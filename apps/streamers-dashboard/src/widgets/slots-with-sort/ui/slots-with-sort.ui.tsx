import { useLayoutEffect, useState } from 'react'
import { shallowEqual } from 'react-redux'

import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { SlotsSortingOptions } from '~shared/store/model'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Combobox, ComboboxData } from '~shared/ui/combobox'
import { Icons } from '~shared/ui/icons'

import { useSortingSlots } from '../lib'

type SlotsListWithSortingProps = {
  data?: AuctionSlot[]
  defaultSortingOptions?: SlotsSortingOptions
  onSortingChange?: (sortOptions: SlotsSortingOptions) => void
}

const sortingSlotsVariants: Array<
  ComboboxData[number] & { sortingOptions: SlotsSortingOptions }
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

const defaultSortOptions: SlotsSortingOptions = {
  field: 'points',
  type: 'descending',
}

const SlotsListWithSorting = ({
  data,
  defaultSortingOptions: inputDefaultSortingOptions,
  onSortingChange,
}: SlotsListWithSortingProps) => {
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const [slots, setSlots] = useState(() => data ?? storedAuctionSlots)
  const [sortingOptions, setSortingOptions] = useState<SlotsSortingOptions>(
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
        defaultValue={
          sortingSlotsVariants.find((sort) =>
            shallowEqual(sort.sortingOptions, sortingOptions)
          )?.value
        }
        onValueChanged={(sortValue) => {
          const sortOptions = sortingSlotsVariants.find(
            (sort) => sort.value === sortValue
          )?.sortingOptions

          setSortingOptions(sortOptions ?? defaultSortOptions)
          onSortingChange && onSortingChange(sortOptions ?? defaultSortOptions)
        }}
      />

      <div className="h-full w-full overflow-scroll pb-4">
        <AuctionSlotsList
          className="flex h-full w-full flex-col gap-y-2"
          data={sortedSlots}
        />
      </div>
    </div>
  )
}

export { SlotsListWithSorting }
