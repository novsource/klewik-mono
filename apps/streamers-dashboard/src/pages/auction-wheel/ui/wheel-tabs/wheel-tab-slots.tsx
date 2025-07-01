import { useSortingSlots } from '~widgets/slots-with-sort/lib'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { TabsContent } from '~shared/ui/tabs'

import { TABS_CONTENT_NAMES } from '../../constants'

const SlotsWheelTab = () => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const sortedSlots = useSortingSlots(slots, {
    type: 'descending',
    field: 'points',
  })

  return (
    <TabsContent
      className="data-[state=active]:h-full"
      value={TABS_CONTENT_NAMES.SLOTS}
    >
      <VirtualizedSlotsList data={sortedSlots} gap={8} />
    </TabsContent>
  )
}

export { SlotsWheelTab }
