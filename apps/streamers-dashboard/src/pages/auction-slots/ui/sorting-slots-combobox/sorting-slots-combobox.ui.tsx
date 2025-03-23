import { memo, useLayoutEffect, useMemo } from 'react'
import { shallowEqual } from 'react-redux'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'

import { SlotsSortingOptions } from '~shared/store/model'
import { appSelectors } from '~shared/store/slices'
import { appActions as storeAppActions } from '~shared/store/slices'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useLocalStorage } from '~shared/hooks/use-local-storage'

import { Combobox, ComboboxData } from '~shared/ui/combobox'
import { Icons } from '~shared/ui/icons'

type SortingSlotsComboboxProps = {
  onSortingChange?: (sortOptions: SlotsSortingOptions<AuctionSlot>) => void
}

const SortingSlotsCombobox = memo(
  ({ onSortingChange }: SortingSlotsComboboxProps) => {
    const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
    const slotsSortOptions = useStoreSelector(appSelectors.getSlotsSortOptions)

    const appActions = useActionCreators(storeAppActions)

    const { set, value } = useLocalStorage('slots-sorting-options')

    useLayoutEffect(() => {
      if (!value || !value[auctionId]) {
        set({ [auctionId]: defaultOptions })
        appActions.setSlotsSortOptions(defaultOptions)
      } else {
        appActions.setSlotsSortOptions(value[auctionId])
      }
    }, [])

    const defaultSortValue = useMemo(() => {
      const value = sortingSlotsVariants.find((variant) =>
        shallowEqual(variant.sortingOptions, slotsSortOptions)
      )?.value

      return value
    }, [slotsSortOptions])

    return (
      <Combobox
        data={sortingSlotsVariants}
        placeholder="По умолчанию"
        defaultValue={defaultSortValue}
        icon={<Icons.Sort size="sm" />}
        onValueChanged={(sortValue) => {
          const sortOptions =
            sortingSlotsVariants.find((sort) => sort.value === sortValue)
              ?.sortingOptions ?? defaultOptions

          appActions.setSlotsSortOptions(sortOptions)
          set({ [auctionId]: sortOptions })

          onSortingChange && onSortingChange(sortOptions)
        }}
      />
    )
  }
)

export { SortingSlotsCombobox }

const defaultOptions: SlotsSortingOptions<AuctionSlot> = {
  field: 'points',
  type: 'descending',
}

const sortingSlotsVariants: Array<
  ComboboxData[number] & { sortingOptions: SlotsSortingOptions<AuctionSlot> }
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
