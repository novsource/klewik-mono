import {RefObject, useCallback, useLayoutEffect, useState} from 'react';

import {getMaxSizeCanvas, resizeCanvas} from '../../shared/utils/canvas';
import {
  drawEmptyWheel,
  drawSelector,
  drawSlicesItems,
} from '../../shared/utils/wheelCanvas';

type WheelInitHookProps = {
  wheelCanvasRef: RefObject<HTMLCanvasElement>;
  wheelSelectorCanvasRef: RefObject<HTMLCanvasElement>;
  items: AuctionSlot[] | AuctionSlotWithAngles[] | null;
  isFullScreen: boolean;
  wheelImageSize?: number;
};

type WheelInit = (props: WheelInitHookProps) => {
  draw(): void;
  wheelSize: number;
};

export const useWheelInit: WheelInit = ({
  wheelCanvasRef,
  wheelSelectorCanvasRef,
  items,
  isFullScreen,
  wheelImageSize,
}) => {
  const [wheelSize, setWheelSize] = useState(0);

  const draw = useCallback(() => {
    const wheelCanvas = wheelCanvasRef.current;
    const wheelSelectorCanvas = wheelSelectorCanvasRef.current;

    if (wheelCanvas && wheelSelectorCanvas) {
      if (items && !!items.length) {
        drawSlicesItems(wheelCanvas, items);
      } else {
        drawEmptyWheel(wheelSelectorCanvas);
      }

      drawSelector(wheelSelectorCanvas, wheelImageSize);
    }
  }, [wheelCanvasRef, wheelSelectorCanvasRef, items, wheelImageSize]);

  useLayoutEffect(() => {
    const wheelCanvas = wheelCanvasRef.current;
    const wheelSelectorCanvas = wheelSelectorCanvasRef.current;

    if (wheelCanvas && wheelSelectorCanvas) {
      const wrapper = wheelCanvas?.parentElement as HTMLDivElement;
      const wrapperParent = wrapper?.parentElement as HTMLDivElement;

      const resize = () => {
        if (getMaxSizeCanvas(wrapperParent) >= 300) {
          wrapper.style.width = wrapper.style.height = `${getMaxSizeCanvas(
            wrapperParent
          )}px`;
        } else {
          wrapper.style.width = wrapper.style.height = `${300}px`;
        }

        resizeCanvas({
          canvas: wheelCanvas,
          wheelSelector: wheelSelectorCanvas,
          wrapper,
        });

        setWheelSize(wheelCanvas.clientWidth);
        draw();
      };

      resize();

      window.removeEventListener('resize', resize);

      window.addEventListener('resize', resize);
    }
  }, [wheelCanvasRef, wheelSelectorCanvasRef, draw, isFullScreen]);

  return {wheelSize, draw};
};
