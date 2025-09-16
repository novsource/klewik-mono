import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import type {
  DialogContentProps,
  DialogHeaderProps,
  DialogProps,
  DialogTriggerProps,
} from '~shared/ui/dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~shared/ui/dialog'
import { Divider } from '~shared/ui/divider'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { InputProps } from '~shared/ui/input'
import { Input } from '~shared/ui/input'
import { MotionBox } from '~shared/ui/motion-box'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~shared/ui/sheet'
import type { TabsProps } from '~shared/ui/tabs'
import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { cn, isStringEmpty, mergeProps } from '~shared/utils'

import { SearchDialogContextProvider, useSearchDialogContext } from '../context'
import { SearchAuctionSlots, SearchDonations } from './search-result-list.ui'

type SearchCategories = 'slots' | 'donations'

export type SearchDialogProps = {
  trigger: ReactNode
}

export const SearchDialog = (props: SearchDialogProps) => {
  const { trigger } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <SearchDialogContextProvider>
      {isLargeThenTablet && <DesktopSearchDialog trigger={trigger} /> }
      {!isLargeThenTablet && <MobileSearchDialog trigger={trigger} /> }
    </SearchDialogContextProvider>
  )
}

export type DesktopSearchDialogProps = DialogProps & {
  trigger: ReactNode
  triggerProps?: DialogTriggerProps
  contentProps?: DialogContentProps
  headerProps?: DialogHeaderProps
}

function DesktopSearchDialog(props: DesktopSearchDialogProps) {
  const {
    trigger,
    triggerProps,
    contentProps,
    headerProps,
    ...dialogProps
  } = props

  const {
    state: { isDialogOpen, searchValue, category },
    dispatch: { setIsDialogOpen, setSearchValue, setCategory },
  } = useSearchDialogContext()

  const dialogContentProps = useMemo(() => mergeProps(contentProps, {
    className: 'w-4/5 landtop:w-3/5 desktop:w-1/2 h-3/4 border-dark-light rounded-[16px] bg-dark-foreground-light p-0 overflow-clip',
  }), [contentProps])
  const dialogHeaderProps = useMemo(() => mergeProps(headerProps, { className: 'gap-0' }), [headerProps])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} {...dialogProps}>
      <DialogTrigger {...triggerProps}>
        {trigger}
      </DialogTrigger>
      <DialogContent {...dialogContentProps}>
        <Flex className="h-full w-full gap-y-6" direction="column">
          <DialogHeader {...dialogHeaderProps}>
            <Flex direction="column">
              <SearchBar
                value={searchValue}
                endContent={(
                  <Button
                    className="text-gray hover:text-white"
                    variant="ghost"
                    isIconOnly
                    icon={<Icons.LargeCross size="xs" />}
                    onClick={() => setSearchValue('')}
                  />
                )}
                onChange={(event) => {
                  setSearchValue(event.target.value)
                }}
              />
              <Divider />
            </Flex>
            <SearchCategoriesGroup
              className="px-4"
              defaultValue={category}
              onValueChange={(value) => {
                const category = value as SearchCategories
                setCategory(category)
              }}
            />
            <Divider />
          </DialogHeader>
          <Flex className="relative h-full">
            {category === 'slots' && <SearchAuctionSlots searchValue={searchValue} />}
            {category === 'donations' && <SearchDonations searchValue={searchValue} />}
          </Flex>
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

export type MobileSearchDialogProps = {
  trigger: ReactNode
}

function MobileSearchDialog(props: MobileSearchDialogProps) {
  const { trigger } = props

  const {
    state: { isDialogOpen, searchValue, category },
    dispatch: { setIsDialogOpen, setSearchValue, setCategory },
  } = useSearchDialogContext()

  return (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger className="w-full" nativeButton={false}>
        {trigger}
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full pb-0" isFullPageSize side="bottom">
        <SheetHeader className="gap-0 space-y-0">
          <Flex className="w-full" justify="between">
            <SheetTitle className="justify-center">Поиск</SheetTitle>
            <Button
              className="size-8"
              isIconOnly
              icon={<Icons.LargeCross width={14} height={14} />}
              size="xs"
              onClick={() => setIsDialogOpen(false)}
            />
          </Flex>
          <Flex direction="column">
            <SearchBar
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
              }}
            />
            <Divider />
          </Flex>
          <SearchCategoriesGroup
            defaultValue={category}
            onValueChange={(value) => {
              const category = value as SearchCategories
              setCategory(category)
            }}
          />
          <Divider />
        </SheetHeader>
        <Flex className="relative h-full">
          {category === 'slots' && <SearchAuctionSlots searchValue={searchValue} />}
          {category === 'donations' && <SearchDonations searchValue={searchValue} />}
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

type SearchBarProps = Omit<InputProps, 'value'> & { value: string }

function SearchBar(props: SearchBarProps) {
  const { value, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const searchInputStartIcon = useMemo(() => {
    return (
      <MotionBox
        initial={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <Icons.Magnifier className={cn(isStringEmpty(value) && 'text-gray')} size="sm" />
      </MotionBox>
    )
  }, [value])

  return (
    <Input
      slotClassNames={
        {
          base: 'w-full',
          wrapper: [
            'max-tablet:px-0.5 max-tablet:gap-x-2.5 border-0 bg-inherit rounded-none max-tablet:data-[focus=true]:bg-inherit',
            'data-[hover=true]:ring-0 data-[focus=true]:ring-0 max-tablet:data-[hover=true]:bg-inherit',
          ],
        }
      }
      startContent={searchInputStartIcon}
      placeholder="Искать по слотам или донатам..."
      size={isLargeThenTablet ? 'default' : 'sm'}
      value={value}
      {...restProps}
    />
  )
}

type SearchCategoriesGroupProps = TabsProps

function SearchCategoriesGroup(props: SearchCategoriesGroupProps) {
  const { className, defaultValue, ...restProps } = props

  return (
    <Tabs
      className={cn('flex', className)}
      variant="bottomLine"
      defaultValue={defaultValue}
      {...restProps}
    >
      <TabsList>
        <TabsTrigger
          value="slots"
          className="gap-x-2"
          startContent={<Icons.Slots size="xs" />}
        >
          Слоты
        </TabsTrigger>
        <TabsTrigger
          className="gap-x-2"
          value="donations"
          startContent={<Icons.MoneyHand size="xs" />}
        >
          Донаты
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
