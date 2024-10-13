import {RefObject, forwardRef, useEffect, useRef} from 'react';
import {cn} from '../../../../shared/utils/cn';
import {useWheelInit} from '../../../../shared/hooks/useWheelInit';

const Wheel = forwardRef<HTMLCanvasElement>((_, ref) => {
  const wheelSelectorRef = useRef<HTMLCanvasElement>(null);

  const {wheelSize, draw} = useWheelInit({
    isFullScreen: false,
    items: [],
    wheelCanvasRef: ref as RefObject<HTMLCanvasElement>,
    wheelSelectorCanvasRef: wheelSelectorRef,
  });

  useEffect(() => {
    draw();
  }, []);

  return (
    <div className={cn('flex h-full w-full justify-center')}>
      <div className="relative flex h-full w-full items-start justify-center">
        <canvas ref={ref} />
        <canvas className="absolute top-0" ref={wheelSelectorRef} />
      </div>
    </div>
  );
});

export default Wheel;
