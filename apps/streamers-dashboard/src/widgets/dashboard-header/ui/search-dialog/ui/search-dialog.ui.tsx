import { useCallback, useMemo, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import NumberFlow from '@number-flow/react'
import { AnimatePresence } from 'motion/react'

import { useSearchAuctionSlots } from '~features/auction-slot/search-slots/hooks'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
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
import type { RadioGroupProps } from '~shared/ui/radio'
import { Radio, RadioGroup } from '~shared/ui/radio'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~shared/ui/select'
import { ShadowVirtualList } from '~shared/ui/shadow-virtual-list'
import { Typography } from '~shared/ui/typograghy'
import type { VirtualizedItem } from '~shared/ui/virtual-list'

import { cn, isStringEmpty } from '~shared/utils'

type SearchCategories = 'slots' | 'donations'

const SearchDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFilterShowed, setIsFilterShowed] = useState(false)

  const navigate = useNavigate()

  const [categoryRadioValue, setCategoryRadioValue] = useState<SearchCategories>('slots')
  const [searchValue, setSearchValue] = useState('')

  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const searchedSlots = useSearchAuctionSlots(searchValue, auctionSlots)

  const renderAuctionSlotListItem = useCallback(
    (data: AuctionSlot[], virtualizedItem: VirtualizedItem) => {
      const slot = data[virtualizedItem.index]

      if (isStringEmpty(searchValue))
        return []

      const navigateToSlot = (slot: AuctionSlot) => {
        setIsDialogOpen(false)
        navigate('slots', { relative: 'route', state: { scrollToSlot: slot } })
      }

      return (
        <MotionBox
          key={virtualizedItem.id}
          layout
          withAnimatePresense
          initial={{ scaleX: 0.9, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          exit={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigateToSlot(slot)}
        >
          <div
            className="flex items-center justify-between gap-x-2 w-full bg-dark px-2 py-2.5 rounded-small border-1 border-dark-light hover:border-gray hover:bg-dark-light text-gray-light transition-all cursor-pointer hover:text-gray-accent"
          >
            <Flex className="gap-x-2" align="center">
              <Typography className="px-1 py-0.25 bg-dark border-1 border-dark-light font-golos-f text-gray-light rounded-sm text-sm" tag="span">{ `ID: ${slot.id}`}</Typography>
              <Typography className="font-breeze" tag="span">{slot.title}</Typography>
            </Flex>
            <Icons.ArrowRight />
          </div>
        </MotionBox>
      )
    },
    [searchValue, navigate],
  )

  const searchResultContent = useMemo(() => {
    const countOfSearchResult = searchedSlots.length

    const isSearchValueEmpty = isStringEmpty(searchValue)
    const isEmptySearchResults = !countOfSearchResult && !isSearchValueEmpty

    if (isSearchValueEmpty) {
      return (
        <Flex className="w-full h-full" justify="center" align="center">
          <Typography className="font-breeze text-gray" tag="span">Пустое поле ввода</Typography>
        </Flex>
      )
    }

    return (
      <Flex className="w-full px-4 gap-y-2 h-full" direction="column">
        <Flex className="gap-x-2" align="center">
          <Typography className="text-gray-light" tag="span">Найдено: </Typography>
          <NumberFlow
            className="py-0.5 px-1 border-1 border-dark-accent text-sm rounded-sm bg-dark text-gray-accent"
            value={countOfSearchResult}
            willChange
          />
        </Flex>
        <Flex
          className={cn('w-full h-full', isEmptySearchResults && 'justify-center items-center')}
        >
          {isEmptySearchResults
            ? (
                <Typography
                  className="font-breeze text-gray"
                  tag="span"
                >
                  По вашему запросу ничего не найдено
                </Typography>
              )
            : (
                <ShadowVirtualList
                  slotsClassNames={{ container: 'pb-4' }}
                  data={searchedSlots}
                  overscan={8}
                >
                  {renderAuctionSlotListItem}
                </ShadowVirtualList>
              )}
        </Flex>
      </Flex>
    )
  }, [
    searchedSlots,
    renderAuctionSlotListItem,
    searchValue,
  ])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button
          className="px-2 font-medium justify-start"
          startContent={<Icons.Magnifier size="xs" />}
          size="xs"
          onClick={() => setIsDialogOpen(true)}
        >
          Поиск
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 landtop:w-3/5 desktop:w-1/2 h-3/4 border-dark-light rounded-[16px] bg-dark-foreground-light p-0 overflow-clip">
        <Flex className="h-full w-full gap-y-6" direction="column">
          <DialogHeader className="gap-0">
            <Flex className="mb-4" direction="column">
              <SearchBar
                value={searchValue}
                endContent={(
                  <Button
                    className="text-gray-light hover:text-gray-accent"
                    variant="ghost"
                    isIconOnly
                    icon={<Icons.Filter />}
                    onClick={() => setIsFilterShowed(curr => !curr)}
                  />
                )}
                onChange={(event) => {
                  setSearchValue(event.target.value)
                }}
              />
              <Divider />
            </Flex>
            <SearchCategoriesGroup
              className="mb-4"
              defaultValue={categoryRadioValue}
              onValueChange={(value) => {
                const category = value as SearchCategories
                setCategoryRadioValue(category)
              }}
            />

            <AnimatePresence initial={false}>
              {isFilterShowed
                && (
                  <MotionBox
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 60, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <SearchFilter />
                  </MotionBox>
                )}
            </AnimatePresence>

          </DialogHeader>
          {searchResultContent}
        </Flex>
      </DialogContent>
    </Dialog>
  )
}

export { SearchDialog }

type SearchBarProps = Omit<InputProps, 'value'> & { value: string }

function SearchBar(props: SearchBarProps) {
  const { value, ...restProps } = props

  const searchInputStartIcon = useMemo(() => {
    if (!isStringEmpty(value)) {
      return (
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <Icons.Magnifier />
        </MotionBox>
      )
    }

    return (
      <MotionBox
        initial={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <Icons.Magnifier className="text-gray-light" />
      </MotionBox>
    )
  }, [value])

  return (
    <Input
      slotClassNames={{ base: 'w-full', wrapper: 'data-[hover=true]:ring-0 data-[focus=true]:ring-0 border-0 bg-inherit rounded-none' }}
      startContent={searchInputStartIcon}
      placeholder="Искать по слотам или донатам..."
      size="lg"
      value={value}
      {...restProps}
    />
  )
}

type SearchCategoriesGroupProps = RadioGroupProps

function SearchCategoriesGroup(props: SearchCategoriesGroupProps) {
  const { className, defaultValue, ...restProps } = props

  return (
    <Flex className="w-full px-4 gap-y-2" direction="column">
      <Typography className="text-gray font-normal text-left text-sm" tag="span">Категория</Typography>

      <RadioGroup
        className={cn('flex gap-x-2', className)}
        defaultValue={defaultValue ?? 'slots'}
        {...restProps}
      >
        <Radio value="slots" variant="ghost" size="sm">
          Слоты
        </Radio>
        <Radio value="donations" variant="ghost" size="sm">
          Донаты
        </Radio>
      </RadioGroup>
    </Flex>
  )
}

function SearchFilter() {
  return (
    <Flex className="w-full px-4 gap-y-2" direction="column">
      <Typography className="text-gray font-normal text-sm text-left" tag="span">Где ищем</Typography>

      <Select size="sm">
        <SelectTrigger>
          <SelectValue placeholder="Везде" />
        </SelectTrigger>
        <SelectContent sideOffset={4}>
          <SelectGroup>
            <SelectItem value="nickname">В никнейме</SelectItem>
            <SelectItem value="message">В сообщении</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Flex>
  )
}
