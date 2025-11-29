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
import { Command, CommandItem, CommandList } from '~shared/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~shared/ui/drawer'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SelectProps,
} from '~shared/ui/select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '~shared/ui/select'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~shared/ui/sheet'

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
    label: 'По номеру (возрастание)',
    icon: (
      <Icons.Id className="text-gray hover:text-gray-accent" />
    ),
    sortingOptions: { field: 'id', type: 'ascending' },
  },
  {
    value: 'nameDescending',
    label: 'По номеру (убывание)',
    icon: (
      <Icons.Id className="text-gray hover:text-gray-accent" />
    ),
    sortingOptions: { field: 'id', type: 'descending' },
  },
  {
    value: 'pointsAscending',
    label: 'По количеству очков (возрастание)',
    icon: (
      <Icons.Coin className="text-gray hover:text-gray-accent" />
    ),
    sortingOptions: { field: 'points', type: 'ascending' },
  },
  {
    value: 'pointsDescending',
    label: 'По количеству очков (убывание)',
    icon: (
      <Icons.Coin className="text-gray hover:text-gray-accent" />
    ),
    sortingOptions: { field: 'points', type: 'descending' },
  },
]

type SortingSlotsComboboxProps = SelectProps & {
  onSortingChange?: (sortOptions: SortingOptions<AuctionSlot>) => void
  drawerClassnames?: Partial<Record<SortingDrawerStylesSlots, string>>
}

export const SortingSlotsCombobox = memo((props: SortingSlotsComboboxProps) => {
  const { onSortingChange, drawerClassnames, ...restProps } = props

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

  const handleOnValueChange = (value: unknown) => {
    const sortOptions = sortingSlotsVariants.find(sort => sort.value === value)
    const options = sortOptions?.sortingOptions ?? defaultOptions

    setSlotsSortOptions(options)
    onSortingChange && onSortingChange(options)
  }

  if (!isLargeThenTablet) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger render={<Button isIconOnly icon={<Icons.Sort />} size="sm" />} />
        <SheetContent
          className="w-full h-fit min-h-60 top-auto rounded-t-large border-t-1 border-t-dark-light gap-y-1.5"
          side="bottom"
          isFullPageSize
        >
          <SheetHeader className="w-full h-fit flex flex-row justify-between shrink pt-2 items-start mb-2.5">
            <Flex className="justify-start" direction="column">
              <SheetTitle className="text-title font-semibold text-start">
                Сортировать по
              </SheetTitle>
              {/* <SheetDescription className="text-sm text-gray-light">
                {isCodeCreated ? 'Не забудьте скопировать код для вставки в сообщение' : 'Заполните поле снизу для создание донат-кода'}
              </SheetDescription> */}
            </Flex>
            <SheetClose
              className="text-gray-light hover:text-gray-accent"
            >
              <Icons.LargeCross />
            </SheetClose>
          </SheetHeader>
          <Command value={storeSlotsSortOptions} className={drawerStyles.content} onValueChange={console.log}>
            <CommandList>
              {sortingSlotsVariants.map(variant => (
                <CommandItem key={variant.value} className={drawerStyles.contentItem} value={variant.value}>
                  {variant.icon}
                  {variant.label }
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <Flex className="gap-y-2 mt-4" direction="column">
            <Button className={drawerStyles.footerActionButton} variant="action">Применить</Button>
            <Button className={drawerStyles.footerResetButton} onClick={() => setIsOpen(false)}>Закрыть</Button>
          </Flex>
        </SheetContent>
      </Sheet>
    )
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
    <Select
      open={isOpen}
      defaultValue={defaultSortValue}
      onValueChange={handleOnValueChange}
      onOpenChange={setIsOpen}
      size="sm"
      {...restProps}
    >
      <SelectTrigger className="text-gray-accent" hideChevron>
        <Icons.Sort
          className={cn(storeSlotsSortOptions.type === 'ascending' && 'rotate-180', 'pb-0.25 shrink-0 grow')}
        />
        Сортировка
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sortingSlotsVariants.map((variant) => {
            return (
              <SelectItem key={variant.label} value={variant.value}>
                {variant.icon }
                {variant.label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
})
