import type { SortingDrawerStylesSlots } from '../../styles'

import type { ReactNode } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { shallowEqual } from 'react-redux'

import { LucideCheck } from 'lucide-react'
import z from 'zod'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'

import { useUrlSearchParams } from '~shared/hooks'

import type { SortingOptions } from '~shared/store/model'

import { Button } from 'klewik-ui/button'
import type { CommandProps } from 'klewik-ui/command'
import { Command, CommandItem, CommandList } from 'klewik-ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from 'klewik-ui/drawer'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import type {
  SelectProps,
} from 'klewik-ui/select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
} from 'klewik-ui/select'
import type { SheetProps } from 'klewik-ui/sheet'
import { SheetClose } from 'klewik-ui/sheet'
import { Text } from 'klewik-ui/typography'

import { cn, twSlotsStyles } from '~shared/utils'

import { useSlotsPageContext } from '../../context/slots-page.context'
import { sortingDrawerStyles } from '../../styles'

const defaultOptions: SortingOptions<AuctionSlot> = {
  field: 'points',
  type: 'descending',
}

const sortingSlotsVariants: Array<
  {
    value: string
    label: string
    icon?: ReactNode
    sortingOptions: SortingOptions<AuctionSlot>
  }
> = [
    {
      value: 'nameAscending',
      label: 'Название (возрастание)',
      sortingOptions: { field: 'title', type: 'ascending' },
    },
    {
      value: 'nameDescending',
      label: 'Название (убывание)',
      sortingOptions: { field: 'title', type: 'descending' },
    },
    {
      value: 'pointsAscending',
      label: 'Очки (возрастание)',
      sortingOptions: { field: 'points', type: 'ascending' },
    },
    {
      value: 'pointsDescending',
      label: 'Очки (убывание)',
      sortingOptions: { field: 'points', type: 'descending' },
    },
  ]

const SortingSlotsSchema = z.object({
  type: z.literal(['ascending', 'descending']),
  field: z.literal<Array<keyof AuctionSlot>>(['points', 'id']),
})

type SortingSlotsComboboxProps = {
  onSortingChange?: (sortOptions: SortingOptions<AuctionSlot>) => void
}

export const SortingSlotsCombobox = memo((props: SortingSlotsComboboxProps) => {
  const { onSortingChange } = props

  const [isOpen, setIsOpen] = useState(false)

  const { state: { sortingSlotsOptions } } = useSlotsPageContext()

  const pageUrlSearchParams = useSyncSortingWithSearchParams()

  const handleOnValueChange = (value: unknown) => {
    const sortOptions = sortingSlotsVariants.find(sort => sort.value === value)
    const options = sortOptions?.sortingOptions ?? defaultOptions

    pageUrlSearchParams.set(options)
    onSortingChange?.(options)
  }

  const defaultSortValue = useMemo(() => {
    const defaultOptions = sortingSlotsVariants.find(variant =>
      shallowEqual(variant.sortingOptions, pageUrlSearchParams.value ?? sortingSlotsOptions),
    )

    return defaultOptions?.value
  }, [sortingSlotsOptions, pageUrlSearchParams.value])

  return (
    <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>

      <MediaQueryViewToggler.MatchedItem>
        <DesktopSortingSlotsSelect
          open={isOpen}
          defaultValue={defaultSortValue}
          onValueChange={handleOnValueChange}
          onOpenChange={setIsOpen}
        />
      </MediaQueryViewToggler.MatchedItem>

      <MediaQueryViewToggler.NotMatchedItem>
        <MobileSortingSlotsSheet
          open={isOpen}
          onOpenChange={setIsOpen}
          commandProps={{
            value: defaultSortValue,
            onValueChange: handleOnValueChange,
          }}
        />
      </MediaQueryViewToggler.NotMatchedItem>
    </MediaQueryViewToggler>
  )
})

type DesktopSortingSlotsSelectProps = SelectProps<string, false>

function DesktopSortingSlotsSelect(props: DesktopSortingSlotsSelectProps) {
  const { state: { sortingSlotsOptions } } = useSlotsPageContext()

  return (
    <Select items={sortingSlotsVariants} {...props}>
      <SelectTrigger
        className="text-gray-accent"
        leftIcon={(
          <Icons.Sort
            className={cn('pb-0.25 shrink-0 grow', sortingSlotsOptions.type === 'ascending' && 'rotate-180')}
          />
        )}
        placeholder="Сортировать"
      />
      <SelectContent side="bottom" align="start" alignItemWithTrigger={false}>
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
}

function MobileSortingSlotsSheet(props: MobileSortingSlotsSheetProps) {
  const {
    drawerClassnames,
    commandProps: { defaultValue, ...commandProps },
    ...restProps
  } = props

  const { state: { sortingSlotsOptions } } = useSlotsPageContext()

  const drawerClasses = useMemo(() => twSlotsStyles(sortingDrawerStyles, drawerClassnames), [drawerClassnames])

  return (
    <Drawer side="bottom" {...restProps}>
      <DrawerTrigger render={<Button isIconOnly icon={<Icons.Sort />} size="sm" />} />
      <DrawerContent
        slotClassnames={{
          content: 'w-full h-fit min-h-60 top-auto rounded-t-large border-t-1 border-t-dark-light gap-y-1.5',
        }}
      >
        <div className="w-full h-fit flex flex-row justify-between shrink pt-2 items-start mb-2.5">
          <Flex className="px-2 justify-start" direction="column">
            <Text className="text-title font-semibold text-start" asSpan>
              Сортировать по
            </Text>
          </Flex>
          <SheetClose
            className="text-gray-light hover:text-gray-accent"
          >
            <Icons.LargeCross />
          </SheetClose>
        </div>
        <Command
          value={defaultValue}
          className={drawerClasses.content}
          disablePointerSelection
          {...commandProps}
        >
          <CommandList>
            {sortingSlotsVariants.map(variant => (
              <CommandItem key={variant.value} className={drawerClasses.contentItem} value={variant.value}>
                {variant.icon}
                <Flex className="w-full" justify="between" align="center">
                  {variant.label}
                  {shallowEqual(sortingSlotsOptions, variant.sortingOptions) && <LucideCheck className="size-5" />}
                </Flex>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DrawerContent>
    </Drawer>
  )
}

function useSyncSortingWithSearchParams() {
  const { state: { sortingSlotsOptions }, dispatch: { updateSortingOptions } } = useSlotsPageContext()

  const pageUrlSearchParams = useUrlSearchParams<typeof sortingSlotsOptions>()

  useEffect(() => {
    const searchParams = pageUrlSearchParams.value
    const isSearchParamsValid = SortingSlotsSchema.safeParse(searchParams).success

    if (!isSearchParamsValid && !shallowEqual(searchParams, sortingSlotsOptions)) {
      pageUrlSearchParams.set(sortingSlotsOptions)
    }

    if (isSearchParamsValid && !shallowEqual(searchParams, sortingSlotsOptions)) {
      updateSortingOptions(searchParams!)
    }
  }, [sortingSlotsOptions, pageUrlSearchParams.value])

  return pageUrlSearchParams
}
