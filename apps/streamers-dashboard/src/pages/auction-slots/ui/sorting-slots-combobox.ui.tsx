import { memo, useEffect, useMemo, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { LucideCheck } from 'lucide-react'

import { sortingDrawerStyles } from '~pages/auction-slots/styles'
import type { SortingDrawerStylesSlots } from '~pages/auction-slots/styles'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import type { SortingOptions } from '~shared/store/model'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import type { ComboboxData } from '~shared/ui/combobox'
import type { CommandProps } from '~shared/ui/command'
import { Command, CommandItem, CommandList } from '~shared/ui/command'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type {
  SelectProps,
} from '~shared/ui/select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
} from '~shared/ui/select'
import type { SheetProps } from '~shared/ui/sheet'
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
    sortingOptions: { field: 'id', type: 'ascending' },
  },
  {
    value: 'nameDescending',
    label: 'По номеру (убывание)',
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

type SortingSlotsComboboxProps = SelectProps<string, false> & {
  onSortingChange?: (sortOptions: SortingOptions<AuctionSlot>) => void
  drawerClassnames?: Partial<Record<SortingDrawerStylesSlots, string>>
}

export const SortingSlotsCombobox = memo((props: SortingSlotsComboboxProps) => {
  const { onSortingChange, drawerClassnames, ...restProps } = props

  const storeSlotsSortOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<SortingOptions<AuctionSlot>>(storeSlotsSortOptions)

  const { setSlotsSortOptions } = useActionCreators(auctionSlotsActions)

  const isLargeThenTablet = useMediaQuery(
    greaterThenDeviceWidthMediaQueries.tablet,
  )

  const defaultSortValue = useMemo(() => {
    const defaultOptions = sortingSlotsVariants.find(variant =>
      shallowEqual(variant.sortingOptions, options),
    )

    return defaultOptions?.value
  }, [options])

  const handleOnValueChange = (value: unknown) => {
    const sortOptions = sortingSlotsVariants.find(sort => sort.value === value)
    const options = sortOptions?.sortingOptions ?? defaultOptions

    setOptions(options)
  }

  const handleOnConfirm = () => {
    setSlotsSortOptions(options)
    onSortingChange?.(options)
  }

  useEffect(() => {
    if (isLargeThenTablet) {
      setSlotsSortOptions(options)
      onSortingChange?.(options)
    }
  }, [options, isLargeThenTablet, onSortingChange])

  const isConfirmButtonDisabled = shallowEqual(options, storeSlotsSortOptions)

  if (!isLargeThenTablet) {
    return (
      <MobileSortingSlotsSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        commandProps={{
          value: defaultSortValue,
          onValueChange: handleOnValueChange,
        }}
        confirmSortingButtonProps={{
          disabled: isConfirmButtonDisabled,
          onClick: handleOnConfirm,
        }}
        closeSheetButtonProps={{
          onClick: () => setIsOpen(false),
        }}
      />
    )
  }

  return (
    <DesktopSortingSlotsSelect
      open={isOpen}
      defaultValue={defaultSortValue}
      onValueChange={handleOnValueChange}
      onOpenChange={setIsOpen}
    />
  )
})

type DesktopSortingSlotsSelectProps = SelectProps<string, false>

function DesktopSortingSlotsSelect(props: DesktopSortingSlotsSelectProps) {
  const storeSlotsSortOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  return (
    <Select items={sortingSlotsVariants} {...props}>
      <SelectTrigger
        className="text-gray-accent"
        leftIcon={(
          <Icons.Sort
            className={cn(storeSlotsSortOptions.type === 'ascending' && 'rotate-180', 'pb-0.25 shrink-0 grow')}
          />
        )}
      />
      <SelectContent side="bottom" align="start">
        <SelectList>
          {sortingSlotsVariants.map((variant) => {
            return (
              <SelectItem
                key={variant.label}
                label={variant.label}
                value={variant.value}
                itemWrapperProps={{ className: 'flex gap-x-2 items-center font-medium' }}
              />
            )
          })}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

type MobileSortingSlotsSheetProps = SheetProps & {
  commandProps: Omit<CommandProps, 'className'>
  drawerClassnames?: Partial<Record<SortingDrawerStylesSlots, string>>
  confirmSortingButtonProps?: ButtonProps
  closeSheetButtonProps?: ButtonProps
}

function MobileSortingSlotsSheet(props: MobileSortingSlotsSheetProps) {
  const {
    drawerClassnames,
    commandProps: { defaultValue, ...commandProps },
    confirmSortingButtonProps,
    closeSheetButtonProps,
    ...restProps
  } = props

  const storeSlotsSortOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const drawerStyles = useMemo(() => twSlotsStyles(sortingDrawerStyles, drawerClassnames), [drawerClassnames])

  return (
    <Sheet {...restProps}>
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
          </Flex>
          <SheetClose
            className="text-gray-light hover:text-gray-accent"
          >
            <Icons.LargeCross />
          </SheetClose>
        </SheetHeader>
        <Command
          value={defaultValue}
          className={drawerStyles.content}
          disablePointerSelection
          {...commandProps}
        >
          <CommandList>
            {sortingSlotsVariants.map(variant => (
              <CommandItem key={variant.value} className={drawerStyles.contentItem} value={variant.value}>
                {variant.icon}
                <Flex className="w-full" justify="between" align="center">
                  {variant.label}
                  {shallowEqual(storeSlotsSortOptions, variant.sortingOptions) && <LucideCheck className="size-5" />}
                </Flex>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
        <Flex className="gap-y-2 mt-4" direction="column">
          <Button
            className={drawerStyles.footerActionButton}
            variant="action"
            {...confirmSortingButtonProps}
          >
            Применить
          </Button>
          <Button className={drawerStyles.footerResetButton} {...closeSheetButtonProps}>Закрыть</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
