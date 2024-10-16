import {getRandomHSLColor} from '@utils/canvas';
import Wheel from './Wheel';
import {useWheelInit} from '@hooks/wheel/useWheelInit';
import {useWheelControl} from '@hooks/wheel/useWheelControl';
import {useMemo, useRef} from 'react';
import {
  getItemsWithAngles,
  updateSlotsAnglesByRotateValue,
} from '@utils/wheelCanvas';

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
  const lotTextRef = useRef<HTMLSpanElement>(null);

  const {
    refs: {wheelRef, wheelSelectorRef},
  } = useWheelInit({items: slots, isFullScreen: false});

  const {
    state: {wheelRotateCSSValue},
    functions: {spinWheel},
  } = useWheelControl({wheelRef, lotTextRef, items: getItemsWithAngles(slots)});

  const slotsWithActualAngles = useMemo(() => {
    return updateSlotsAnglesByRotateValue(
      getItemsWithAngles(slots),
      wheelRotateCSSValue
    );
  }, [wheelRotateCSSValue]);

  const handleClick = () => {
    spinWheel(slotsWithActualAngles[0], 5);
  };

  return (
    <div className="h-full w-full flex flex-col gap-y-2">
      <span ref={lotTextRef}>Text</span>
      <button onClick={handleClick}>Spin</button>
      <div className="w-full h-full">
        <Wheel ref={wheelRef} wheelSelectorRef={wheelSelectorRef} />
      </div>
    </div>
  );
};

export default WheelContainer;
