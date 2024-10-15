import {RefObject, forwardRef, useEffect, useRef} from 'react';

import {useWheelInit} from '../../../../shared/hooks/useWheelInit';
import {getRandomHSLColor} from '../../../../shared/utils/canvas';

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

const Wheel = forwardRef<HTMLCanvasElement>((_, ref) => {
  const wheelSelectorRef = useRef<HTMLCanvasElement>(null);

  const {draw} = useWheelInit({
    isFullScreen: false,
    items: slots,
    wheelCanvasRef: ref as RefObject<HTMLCanvasElement>,
    wheelSelectorCanvasRef: wheelSelectorRef,
  });

  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="flex flex-shrink-1 h-full w-full justify-center items-center">
      <div className="relative flex h-full w-full items-start justify-center">
        <canvas ref={ref} />
        <canvas className="absolute top-0" ref={wheelSelectorRef} />
      </div>
    </div>
  );
});

export default Wheel;
