import type { TabsContentProps } from '@radix-ui/react-tabs'

import { useMemo } from 'react'

import type { SlotsWheelTabSlots } from '~pages/auction-wheel/styles'
import { slotsWheelTabStyles } from '~pages/auction-wheel/styles'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import { TabsContent } from '~shared/ui/tabs'
import { cn, twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'

type SlotsWheelTabProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<SlotsWheelTabSlots, string>>
}

const SlotsWheelTab = (props: SlotsWheelTabProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const tabsContentStyles = useMemo(() => twSlotsStyles(slotsWheelTabStyles, slotsClassnames), [slotsClassnames])

  // const sortedSlots = useSortingSlots(slots, {
  //   type: 'descending',
  //   field: 'points',
  // })

  return (
    <TabsContent
      className={cn(tabsContentStyles.content)}
      value={TABS_CONTENT_NAMES.SLOTS}
      {...tabsContentProps}
    >
      <VirtualizedSlotsList data={slots} gap={8} />
    </TabsContent>
  )
}

export { SlotsWheelTab }
