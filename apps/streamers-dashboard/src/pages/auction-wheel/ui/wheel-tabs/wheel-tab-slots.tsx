import type { TabsContentProps } from '@radix-ui/react-tabs'

import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import { useSortingSlots } from '~pages/auction-slots/lib'
import type { SlotsWheelTabSlots } from '~pages/auction-wheel/styles'
import { slotsWheelTabStyles } from '~pages/auction-wheel/styles'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { wheelSelectors } from '~entities/wheel/store'

import { useDebounceCallback } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { TabsContent } from '~shared/ui/tabs'

import { cn, twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'

type SlotsWheelTabContentProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<SlotsWheelTabSlots, string>>
}

export const SlotsWheelTabContent = (props: SlotsWheelTabContentProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const slots = useStoreSelector(wheelSelectors.getSlots)

  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const sortedSlots = useSortingSlots(slots, { type: 'descending', field: 'points' })

  const searchedSlots = useMemo(() =>
    sortedSlots.filter(slot => slot.title.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery, sortedSlots])

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
      <VirtualizedSlotsList data={searchedSlots} gap={8} />
    </TabsContent>
  )
}
