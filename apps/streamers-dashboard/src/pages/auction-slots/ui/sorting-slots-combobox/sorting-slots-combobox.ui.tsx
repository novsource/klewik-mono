import { memo, useMemo, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { sortingDrawerStyles } from '~pages/auction-slots/styles'
import type { SortingDrawerStylesSlots } from '~pages/auction-slots/styles'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { SortingOptions } from '~shared/store/model'

import { Button } from '~shared/ui/button'
import type { ComboboxData } from '~shared/ui/combobox'
import { Combobox } from '~shared/ui/combobox'
import { Command, CommandItem, CommandList } from '~shared/ui/command'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '~shared/ui/drawer'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn, twSlotsStyles } from '~shared/utils'

const defaultOptions: SortingOptions<AuctionSlot> = {
  field: 'points',
  type: 'descending',
}

const sortingSlotsVariants: Array<
  ComboboxData[number] & { sortingOptions: SortingOptions<AuctionSlot> }
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

type SortingSlotsComboboxProps = {
  onSortingChange?: (sortOptions: SortingOptions<AuctionSlot>) => void
  drawerClassnames?: Partial<Record<SortingDrawerStylesSlots, string>>
}

const SortingSlotsCombobox = memo((props: SortingSlotsComboboxProps) => {
  const { onSortingChange, drawerClassnames } = props

  const [isOpen, setIsOpen] = useState(false)
  const storeSlotsSortOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const { setSlotsSortOptions } = useActionCreators(auctionSlotsActions)

  const isLargeThenTablet = useMediaQuery(
    greaterThenDeviceWidthMediaQueries.tablet,
  )

  const drawerStyles = useMemo(() => twSlotsStyles(sortingDrawerStyles, drawerClassnames), [drawerClassnames])

  const defaultSortValue = useMemo(() => {
    const options = sortingSlotsVariants.find(variant =>
      shallowEqual(variant.sortingOptions, storeSlotsSortOptions),
    )

    return options?.value
  }, [storeSlotsSortOptions])

  if (!isLargeThenTablet) {
    return (
      <Drawer noBodyStyles open={isOpen} onOpenChange={setIsOpen} dismissible={false}>
        <DrawerTrigger asChild>
          <Button isIconOnly icon={<Icons.Sort />} size="sm" />
        </DrawerTrigger>
        <DrawerContent hidePill>
          <DrawerHeader className={drawerStyles.header}>
            <Flex className={drawerStyles.headerTitleWrapper}>
              <Icons.Sort />
              <DrawerTitle className={drawerStyles.title}>Сортировать слоты</DrawerTitle>
            </Flex>
            <Button isIconOnly icon={<Icons.LargeCross size="sm" />} size="xs" onClick={() => setIsOpen(false)} />
          </DrawerHeader>
          <Command className={drawerStyles.content}>
            <CommandList>
              {sortingSlotsVariants.map(variant => (
                <CommandItem key={variant.value} className={drawerStyles.contentItem}>
                  {variant.label }
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <DrawerFooter className={drawerStyles.footer}>
            <Button className={drawerStyles.footerResetButton}>Сбросить</Button>
            <Button className={drawerStyles.footerActionButton} variant="action">Применить</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Combobox
      data={sortingSlotsVariants}
      defaultValue={defaultSortValue}
      placeholder="По умолчанию"
      icon={<Icons.Sort className={cn(storeSlotsSortOptions.type === 'ascending' && 'rotate-180')} />}
      triggerProps={{ onClick: () => setIsOpen(true) }}
      onValueChanged={(value) => {
        const sortOptions = sortingSlotsVariants.find(sort => sort.value === value)
        const options = sortOptions?.sortingOptions ?? defaultOptions

        setSlotsSortOptions(options)
        onSortingChange && onSortingChange(options)
      }}
    />
  )
},
)

export { SortingSlotsCombobox }
