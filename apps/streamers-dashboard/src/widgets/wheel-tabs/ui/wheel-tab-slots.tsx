import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'
import { useSortingSlots } from '~widgets/slots-with-sort/lib'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { TabsContent } from '~shared/ui/tabs'

const SlotsWheelTab = () => {
  const slots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const sortedSlots = useSortingSlots(slots, {
    type: 'descending',
    field: 'points',
  })

  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <AuctionSlotsList
        className="flex"
        data={sortedSlots}
        withControls={false}
        disableAnimation
      />
    </TabsContent>
  )
}

export { SlotsWheelTab }
