import {TabsContent} from '@/components/ui/tabs';

const LotsWheelTab = () => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <div className="h-full bg-dark rounded-large"></div>
    </TabsContent>
  );
};

export default LotsWheelTab;
