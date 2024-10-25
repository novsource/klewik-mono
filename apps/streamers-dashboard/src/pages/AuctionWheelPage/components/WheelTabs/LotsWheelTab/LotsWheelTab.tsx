import { TabsContent } from '@/components/ui/tabs'
import LotCard from './LotCard/LotCard'

const lots = [
  {
    auctionColor: '#FFF',
    name: 'Hello',
  },
  {
    auctionColor: '#FFF',
    name: 'Hello',
  },
] as AuctionSlot[]

const LotsWheelTab = () => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <div className="h-full rounded-large bg-dark">
        <div className="h-full px-6 py-4">
          <h2 className="text-title font-semibold">Lots of the wheel</h2>
          <div className="mt-2 flex w-full flex-col gap-y-2">
            {lots.map((item) => (
              <LotCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  )
}

export default LotsWheelTab
