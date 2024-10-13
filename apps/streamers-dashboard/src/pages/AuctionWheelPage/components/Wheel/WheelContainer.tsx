import {useRef} from 'react';
import Wheel from './Wheel';

const WheelContainer = () => {
  const wheelRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="w-full h-full">
      <Wheel ref={wheelRef} />
    </div>
  );
};

export default WheelContainer;
