import Wheel from './Wheel';
import {useWheelInit} from '../../../../shared/hooks/wheel/useWheelInit';
import {getRandomHSLColor} from '../../../../lib/utils/canvas';

const slots: AuctionSlot[] = [
  {
    name: 'Test',
    auctionColor: getRandomHSLColor(),
    tag: '',
    value: 1000,
    _id: '12',
  },
  {
    name: 'Test 2',
    auctionColor: getRandomHSLColor(),
    tag: '',
    value: 2000,
    _id: '120',
  },
];

const WheelContainer = () => {
  const {
    refs: {wheelRef, wheelSelectorRef},
  } = useWheelInit({items: slots, isFullScreen: false});

  return (
    <div className="w-full h-full">
      <Wheel ref={wheelRef} wheelSelectorRef={wheelSelectorRef} />
    </div>
  );
};

export default WheelContainer;
