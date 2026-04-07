import type { SlotsWheelTabSlots } from '../../styles'

import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import { useDebounceCallback } from '~shared/hooks'
import { useLocalSearchFilter } from '~shared/hooks/use-local-search-filter/use-local-search-filter'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import type { TabsContentProps } from 'klewik-ui/tabs'
import { TabsContent } from 'klewik-ui/tabs'
import { Toggle, ToggleGroup } from 'klewik-ui/toggle'

import { twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants/tabs-content-names'
import { useAuctionGameContext } from '../../context/auction-game-context'
import { slotsWheelTabStyles } from '../../styles'
import { AuctionGameSlotsList } from '../lists/slots-list.ui'

type GameSlotsTabContentProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<SlotsWheelTabSlots, string>>
}

export const GameSlotsTabContent = (props: GameSlotsTabContentProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const auctionGameContext = useAuctionGameContext()

  const [slotCategory, setSlotCategory] = useState<'all' | 'active' | 'dropped'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const localSortedSlots = useMemo(() => [...auctionGameContext.state.slots.all].sort((a, b) => b.points - a.points), [auctionGameContext.state.slots.all])

  const localSearchedSlots = useLocalSearchFilter(searchQuery, localSortedSlots, (query, slot) => {
    const isTitleIncludesSearchQuery = slot.title.toLowerCase().includes(query.toLowerCase())

    const isSlotIncludeCategory
      = slotCategory === 'all'
        ? true
        : slotCategory === 'active'
          ? !slot.isDropped
          : slot.isDropped

    return isTitleIncludesSearchQuery && isSlotIncludeCategory
  })

  const debouncedSearch = useDebounceCallback((value: string) => setSearchQuery(value), 200)

  const handleSearchInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    debouncedSearch(value)
  }

  const tabsContentClasses = useMemo(() =>
    twSlotsStyles(slotsWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={tabsContentClasses.content}
      value={TABS_CONTENT_NAMES.SLOTS}
      {...tabsContentProps}
    >
      <Flex className="w-full gap-x-2">
        <Input
          slotClassNames={{ base: 'text-gray w-full' }}
          startContent={<Icons.Magnifier size="sm" />}
          endContent={(
            <Button
              className="pointer-events-auto hover:text-gray-accent"
              variant="ghost"
              isIconOnly
              icon={<Icons.Close />}
              size="xs"
              onClick={() => {
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
      <AuctionGameSlotsList data={localSearchedSlots} />
    </TabsContent>
  )
}
