import {TabsContent} from '@/components/ui/tabs';
import LotCard from './LotCard/LotCard';

const lots = [
  {
    auctionColor: '#FFF',
    name: 'Hello',
  },
  {
    auctionColor: '#FFF',
    name: 'Hello',
  },
] as AuctionSlot[];

const LotsWheelTab = () => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <div className="h-full bg-dark rounded-large">
        <div className="py-4 px-6 h-full">
          <h2 className="font-semibold text-title">Lots of the wheel</h2>
          <div className="flex gap-y-2 flex-col w-full mt-2">
            {lots.map((item) => (
              <LotCard key={item.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default LotsWheelTab;
