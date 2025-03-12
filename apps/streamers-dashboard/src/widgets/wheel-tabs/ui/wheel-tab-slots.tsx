import { AuctionSlotsList } from '~widgets/auction-slots-list/ui'

import { ScrollArea } from '~shared/ui/scroll-area'
import { TabsContent } from '~shared/ui/tabs'

const SlotsWheelTab = () => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <ScrollArea className="h-full">
        <AuctionSlotsList
          className={'flex '}
          withControls={false}
          disableAnimation
        />
      </ScrollArea>
    </TabsContent>
  )
}

export { SlotsWheelTab }
