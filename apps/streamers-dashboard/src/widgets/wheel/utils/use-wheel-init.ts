import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { AuctionSlot } from '~entities/auction-slot/model'

import { WheelSlot } from '~entities/wheel/model'

import { getMaxSizeCanvas, resizeCanvasWithRatio } from '~shared/utils/canvas'
import { getHEXColor } from '~shared/utils/colors'

import { useWheelSelector } from './use-wheel-selector'
import { drawEmptyWheel, drawSlicesItems } from './wheel-canvas'

type WheelInitOptions = {
  isFullScreen?: boolean
}

type WheelInit = {
  refs: {
    wheelRef: RefObject<HTMLCanvasElement>
    innerRef: RefObject<HTMLCanvasElement>
  }
  functions: {
    drawWheel(): void
    drawInner(): void
    resizeWheel(): () => void
    resizeInnerBackground(): void
  }
  properties: {
    wheelSize: number
  }
}

export const useWheelInit = (
  items: AuctionSlot[] | WheelSlot[],
  { isFullScreen = false }: WheelInitOptions
): WheelInit => {
  const [wheelSize, setWheelSize] = useState(0)

  const wheelCanvasRef = useRef<HTMLCanvasElement>(null)
  const innerWheelCanvasRef = useRef<HTMLCanvasElement>(null)

  const defaultWheelColor = useRef(getHEXColor())

  const { drawBackground, resizeBackground } =
    useWheelSelector(innerWheelCanvasRef)

  const draw = useCallback(() => {
    const wheelCanvas = wheelCanvasRef.current

    if (wheelCanvas) {
      if (items && !!items.length) {
        drawSlicesItems(wheelCanvas, items)
      } else {
        drawEmptyWheel(wheelCanvas, {
          color: defaultWheelColor.current,
        })
      }
    }
  }, [wheelCanvasRef, items])

  const resizeWheel = useCallback(() => {
    const wheelCanvas = wheelCanvasRef.current
    const innerCanvas = innerWheelCanvasRef.current

    if (wheelCanvas && innerCanvas) {
      const wrapper = wheelCanvas.parentElement as HTMLDivElement
      const wrapperParent = wrapper.parentElement as HTMLDivElement

      const resize = () => {
        if (getMaxSizeCanvas(wrapperParent) > 300) {
          wrapper.style.width = wrapper.style.height = `${getMaxSizeCanvas(
            wrapperParent
          )}px`
        } else {
          wrapper.style.width = wrapper.style.height = `${300}px`
        }

        resizeCanvasWithRatio(wheelCanvas, wrapper)
        resizeCanvasWithRatio(innerCanvas, wrapper)

        setWheelSize(wheelCanvas.clientWidth)
        draw()
      }

      resize()

      window.removeEventListener('resize', resize)
      window.addEventListener('resize', resize)

      return () => {
        window.removeEventListener('resize', resize)
      }
    }

    return () => {}
  }, [wheelCanvasRef, innerWheelCanvasRef, draw, isFullScreen])

  useLayoutEffect(() => {
    drawBackground()
    resizeBackground()
  }, [drawBackground, resizeBackground])

  return {
    refs: {
      wheelRef: wheelCanvasRef,
      innerRef: innerWheelCanvasRef,
    },
    properties: {
      wheelSize,
    },
    functions: {
      drawWheel: draw,
      resizeWheel,
      resizeInnerBackground: resizeBackground,
      drawInner: drawBackground,
    },
  }
}
