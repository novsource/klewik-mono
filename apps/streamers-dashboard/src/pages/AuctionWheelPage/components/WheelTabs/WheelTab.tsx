import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import AppearanceWheelTab from './AppearanceWheelTab/AppearanceWheelTab';
import ControlWheelTab from './ControlWheelTab/ControlWheelTab';
import LotsWheelTab from './LotsWheelTab/LotsWheelTab';
import {useMemo} from 'react';

const WheelTab = () => {
  const tabsTriggers = useMemo(() => {
    return ['Control', 'Lots', 'Appearance'].map((item) => (
      <TabsTrigger value={item.toLowerCase()} className="flex-grow text-body">
        {item}
      </TabsTrigger>
    ));
  }, []);
  return (
    <Tabs defaultValue="control">
      <TabsList className="dark w-full flex justify-between">
        {tabsTriggers}
      </TabsList>
      <ControlWheelTab />
      <LotsWheelTab />
      <AppearanceWheelTab />
    </Tabs>
  );
};

export default WheelTab;
