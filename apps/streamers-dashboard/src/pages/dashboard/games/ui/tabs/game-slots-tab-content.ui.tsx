import type { SlotsWheelTabSlots } from '../../styles'

import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import { useSortingSlots } from '~pages/dashboard/slots/lib'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useDebounceCallback } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import type { TabsContentProps } from '~shared/ui/tabs'
import { TabsContent } from '~shared/ui/tabs'
import { Toggle, ToggleGroup } from '~shared/ui/toggle'

import { cn, twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'
import { slotsWheelTabStyles } from '../../styles'
import { AuctionGameSlotsList } from '../lists/wheel-slots-list.ui'

type GameSlotsTabContentProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<SlotsWheelTabSlots, string>>
}

export const GameSlotsTabContent = (props: GameSlotsTabContentProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const { dropoutSlotsIds } = useStoreSelector(auctionSelectors.getAuctionInfo)

  const droppedSlotIdsCollection = useMemo<Set<number>>(() => {
    const result = new Set<number>()

    dropoutSlotsIds.forEach((slotId) => {
      result.add(slotId)
    })

    return result
  }, [dropoutSlotsIds])

  const [slotCategory, setSlotCategory] = useState<'all' | 'active' | 'dropped'>('all')
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedSlots = useSortingSlots(slots, { type: 'descending', field: 'points' })

  const searchedSlots = useMemo(() =>
    sortedSlots.filter((slot) => {
      const isTitleIncludesSearchQuery = slot.title.toLowerCase().includes(searchQuery.toLowerCase())

      const isSlotDropped = droppedSlotIdsCollection.has(slot.id)
      const isSlotIncludeCategory = slotCategory === 'all' ? true : slotCategory === 'active' ? !isSlotDropped : isSlotDropped

      return isTitleIncludesSearchQuery && isSlotIncludeCategory
    }), [searchQuery, sortedSlots, slotCategory, droppedSlotIdsCollection])

  const debouncedSearch = useDebounceCallback((value: string) => setSearchQuery(value), 250)

  const handleSearchInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setSearchValue(value)
    debouncedSearch(value)
  }

  const tabsContentStyles = useMemo(() =>
    twSlotsStyles(slotsWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={cn(tabsContentStyles.content)}
      value={TABS_CONTENT_NAMES.SLOTS}
      {...tabsContentProps}
    >
      <Flex className="w-full gap-x-2">
        <Input
          slotClassNames={{ base: 'text-gray w-full' }}
          value={searchValue}
          startContent={<Icons.Magnifier size="sm" />}
          endContent={(
            <Button
              className="pointer-events-auto hover:text-gray-accent"
              variant="ghost"
              isIconOnly
              icon={<Icons.Close />}
              size="xs"
              onClick={() => {
                setSearchValue('')
                setSearchQuery('')
              }}
            />
          )}
          placeholder="Искать по названию..."
          onChange={handleSearchInputOnChange}
        />
        <ToggleGroup
          className="flex p-0.5 h-9.5 gap-x-0.5 bg-dark rounded-small text-gray border-1 border-dark-light items-center"
          defaultValue={[slotCategory]}
          value={[slotCategory]}
          onValueChange={(value) => {
            if (value.length === 0)
              return

            setSlotCategory(value[0] as typeof slotCategory)
          }}
        >
          <Toggle value="all" className="text-sm data-[pressed]:text-gray-accent data-[pressed]:bg-dark-accent h-full hover:bg-dark-light">Все</Toggle>
          <Toggle value="active" className="data-[pressed]:bg-red/10 data-[pressed]:text-red h-full hover:bg-dark-light" buttonProps={{ isIconOnly: true, icon: <Icons.Heart /> }} />
          <Toggle value="dropped" className="data-[pressed]:text-gray-accent data-[pressed]:bg-dark-accent h-full hover:bg-dark-light" buttonProps={{ isIconOnly: true, icon: <Icons.BrokenHeart /> }} />
        </ToggleGroup>
      </Flex>
      <AuctionGameSlotsList data={searchedSlots} gap={8} />
    </TabsContent>
  )
}
