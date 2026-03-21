import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { AnimatePresence } from 'motion/react'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { MediaQueryViewToggler } from '~shared/components/media-query-view-toggler'
import { Text } from '~shared/components/typography'

import { useMediaQuery } from '~shared/hooks'

import { Button } from 'klewik-ui/button'
import type {
  DialogContentProps,
  DialogHeaderProps,
  DialogProps,
  DialogTriggerProps,
} from 'klewik-ui/dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from 'klewik-ui/dialog'
import { Divider } from 'klewik-ui/divider'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import type { InputProps } from 'klewik-ui/input'
import { Input } from 'klewik-ui/input'
import { MotionBox } from 'klewik-ui/motion-box'
import type { RadioGroupProps } from 'klewik-ui/radio'
import { Radio, RadioGroup } from 'klewik-ui/radio'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from 'klewik-ui/sheet'

import { cn, isStringEmpty, mergeProps } from '~shared/utils'

import { SearchDialogContextProvider, useSearchDialogContext } from '../context'
import { SearchAuctionSlots, SearchDonations } from './search-result-list.ui'

type SearchCategories = 'slots' | 'donations'

export type SearchDialogProps = {
  trigger: ReactNode
}

export const SearchDialog = (props: SearchDialogProps) => {
  const { trigger } = props

  return (
    <SearchDialogContextProvider>
      <MediaQueryViewToggler query={greaterThenDeviceWidthMediaQueries.tablet}>
        <MediaQueryViewToggler.MatchedItem>
          <DesktopSearchDialog trigger={trigger} />
        </MediaQueryViewToggler.MatchedItem>

        <MediaQueryViewToggler.NotMatchedItem>
          <MobileSearchDialog trigger={trigger} />
        </MediaQueryViewToggler.NotMatchedItem>
      </MediaQueryViewToggler>
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
    state: { isLoading, isDialogOpen, searchValue, category },
    dispatch: { setIsDialogOpen, setSearchValue, setCategory },
    functions: { closeDialog },
  } = useSearchDialogContext()

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      return closeDialog()
    }

    setIsDialogOpen(true)
  }

  const dialogContentProps = useMemo(() => mergeProps(contentProps, {
    className: 'w-4/5 landtop:w-3/5 desktop:w-1/2 h-3/4 border-dark-light rounded-[16px] bg-dark-foreground-light p-0 overflow-clip',
  }), [contentProps])
  const dialogHeaderProps = useMemo(() => mergeProps(headerProps, { className: 'gap-0' }), [headerProps])

  const isShouldShowSlots = category === 'slots'
  const isShouldShowDonations = category === 'donations'

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOnOpenChange} {...dialogProps}>
      <DialogTrigger
        {...triggerProps}
        render={(
          <>
            {trigger}
          </>
        )}
      />
      <DialogContent {...dialogContentProps}>
        <Flex className="h-full w-full gap-y-6" direction="column">
          <DialogHeader {...dialogHeaderProps}>
            <Flex direction="column">
              <SearchBar
                value={searchValue}
                showLoader={isLoading}
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
              className="px-4 my-3"
              defaultValue={category}
              onValueChange={(value) => {
                const category = value as SearchCategories
                setCategory(category)
              }}
            />
            <Divider />
          </DialogHeader>
          <Flex className="relative h-full">
            {isShouldShowSlots && <SearchAuctionSlots searchValue={searchValue} />}
            {isShouldShowDonations && <SearchDonations searchValue={searchValue} />}
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
    state: { isLoading, isDialogOpen, searchValue, category },
    dispatch: { setIsDialogOpen, setSearchValue, setCategory },
  } = useSearchDialogContext()

  return (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger
        className="w-full"
        render={(
          <>
            {trigger}
          </>
        )}
      >
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
              showLoader={isLoading}
              onChange={(event) => {
                setSearchValue(event.target.value)
              }}
            />
            <Divider />
          </Flex>
          <SearchCategoriesGroup
            className="px-2 my-3"
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

type SearchBarProps = Omit<InputProps, 'value'> & { value: string, showLoader: boolean }

function SearchBar(props: SearchBarProps) {
  const { value, showLoader, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <Input
      slotClassNames={
        {
          base: 'w-full tablet:px-1',
          wrapper: [
            'max-tablet:px-0.5 max-tablet:gap-x-2.5 border-0 bg-inherit rounded-none max-tablet:data-[focus=true]:bg-inherit',
            'data-[hover=true]:ring-0 data-[focus=true]:ring-0 max-tablet:data-[hover=true]:bg-inherit',
          ],
        }
      }
      startContent={(
        <AnimatePresence>
          {
            !showLoader
              ? (
                  <MotionBox
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Icons.Magnifier className={cn(isStringEmpty(value) && 'text-gray')} size="sm" />
                  </MotionBox>
                )
              : (
                  <MotionBox
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Icons.Loading className="text-green-accent" />
                  </MotionBox>
                )
          }
        </AnimatePresence>
      )}
      placeholder="Искать по слотам или донатам..."
      size={isLargeThenTablet ? 'lg' : 'default'}
      value={value}
      {...restProps}
    />
  )
}

type SearchCategoriesGroupProps = RadioGroupProps

function SearchCategoriesGroup(props: SearchCategoriesGroupProps) {
  const { className, ...restProps } = props

  return (
    <RadioGroup
      className={cn('flex flex-col w-full gap-y-3 tablet:gap-y-2 px-6', className)}
      {...restProps}
    >

      <Text className="text-gray-light/60 font-medium text-start" asSpan>Я хочу искать...</Text>

      <Flex className="gap-x-3">
        <Radio value="slots" variant="tab">
          <Flex className="gap-x-1.5" align="center">
            <Icons.Slots size="sm" />
            <Text>
              Слоты
            </Text>
          </Flex>
        </Radio>
        <Radio value="donations" variant="tab">
          <Flex className="gap-x-1.5" align="center">
            <Icons.MoneyHand size="sm" />
            <Text>
              Донаты
            </Text>
          </Flex>
        </Radio>
      </Flex>

    </RadioGroup>
  )

  // return (
  //   <Tabs
  //     className={cn('flex', className)}
  //     variant="bottomLine"
  //     defaultValue={defaultValue}
  //     {...restProps}
  //   >
  //     <TabsList>
  //       <TabsTrigger
  //         value="slots"
  //         className="gap-x-2"
  //         startContent={<Icons.Slots size="xs" />}
  //       >
  //         Слоты
  //       </TabsTrigger>
  //       <TabsTrigger
  //         className="gap-x-2"
  //         value="donations"
  //         startContent={<Icons.MoneyHand size="xs" />}
  //       >
  //         Донаты
  //       </TabsTrigger>
  //     </TabsList>
  //   </Tabs>
  // )
}
