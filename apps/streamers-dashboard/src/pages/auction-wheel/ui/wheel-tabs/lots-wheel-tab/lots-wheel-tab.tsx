import { TabsContent } from '~shared/ui/tabs'

import LotCard from './lot-card'

const lots = [
  {
    slotHSVColor: '#FFF',
    name: 'Hello',
  },
  {
    slotHSVColor: '#FFF',
    name: 'Hello',
  },
] as AuctionSlot[]

const LotsWheelTab = () => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <div className="flex h-full flex-col gap-y-2">
        {/* <div className="h-full px-6 py-4">
          <h2 className="text-title font-semibold">Lots of the wheel</h2>
          <div className="mt-2 flex w-full flex-col gap-y-2">
            {lots.map((item) => (
              <LotCard key={item.name} {...item} />
            ))}
          </div>
        </div> */}
        {lots.map((item) => (
          <LotCard key={item.name} {...item} />
        ))}
      </div>
    </TabsContent>
  )
}

export default LotsWheelTab
