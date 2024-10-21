import {WheelContainer} from './components/Wheel';
import WheelTab from './components/WheelTabs/WheelTab';

const AuctionWheelPage = () => {
  return (
    <div className="flex h-full w-full px-4 flex-shrink-1 py-4">
      <WheelContainer />
      <div className="min-w-[300px] w-[500px] h-full">
        <WheelTab />
      </div>
    </div>
  );
};

export default AuctionWheelPage;
