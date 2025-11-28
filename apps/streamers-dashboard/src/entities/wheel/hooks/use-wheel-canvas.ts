import type { RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { animate, transform, useMotionValue } from 'motion/react'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { WheelSlot } from '~entities/wheel/model'

import { useResizeObserver } from '~shared/hooks/use-resize-observer'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'
import type { HexColor } from '~shared/lib/zod'

import { clearCanvas, getMaxSizeCanvas, resizeCanvasWithRatio } from '~shared/utils/canvas'
import { getHEXColor } from '~shared/utils/colors'

import { wheelActions } from '../store'
import { formatSlotsToDropoutMode } from '../utils'
import {
  calculateRotateWheelCSSValue,
  drawEmptyWheel,
  drawSlicesItems,
  getItemsWithAngles,
  getSlotNameOnSelector,
  updateSlotsAnglesByRotateValue,
} from '../utils/wheel-canvas'

const HDR_TINY_CLOVER_PATH_2D = new Path2D(
  'M4.27501 6.75308L4.84177 6.75308C5.74506 6.75308 6.49905 7.39235 6.67601 8.24313L6.67601 7.01615C6.67601 6.34524 6.13213 5.80137 5.46122 5.80137C4.88066 5.80137 4.3952 6.20865 4.27501 6.75308ZM6.64905 8.62659C6.53163 9.17471 6.04441 9.58567 5.46122 9.58567C4.87803 9.58567 4.39083 9.17471 4.27339 8.62659L6.64905 8.62659ZM3.63232 7.01615C3.63232 6.00608 4.45115 5.18726 5.46122 5.18726C6.47129 5.18726 7.29011 6.00608 7.29011 7.01615L7.29012 8.3709C7.29012 9.38096 6.47129 10.1998 5.46122 10.1998C4.45115 10.1998 3.63232 9.38096 3.63232 8.3709L3.63232 7.01615ZM11.5854 8.62655C11.468 9.1747 10.9808 9.58567 10.3976 9.58567C9.81437 9.58567 9.32715 9.1747 9.20973 8.62655L11.5854 8.62655ZM11.6124 8.32134L11.6124 7.01615C11.6124 6.34525 11.0685 5.80137 10.3976 5.80137C9.81701 5.80137 9.33157 6.20863 9.21136 6.75304L9.76356 6.75303C10.6944 6.75303 11.4666 7.43179 11.6124 8.32134ZM8.56868 7.01615C8.56868 6.00608 9.3875 5.18726 10.3976 5.18726C11.4076 5.18726 12.2265 6.00608 12.2265 7.01615L12.2265 8.3709C12.2265 9.38096 11.4076 10.1998 10.3976 10.1998C9.3875 10.1998 8.56868 9.38096 8.56868 8.3709L8.56868 7.01615ZM1.53893 7.93355C-0.121046 9.59352 -0.121057 12.2848 1.53894 13.9448C3.19893 15.6048 5.8903 15.6048 7.55028 13.9448C7.68486 13.8103 7.90307 13.8102 8.03764 13.9448C9.69764 15.6048 12.389 15.6048 14.049 13.9448C15.7089 12.2848 15.7089 9.59347 14.049 7.9335C13.9144 7.79893 13.9144 7.58076 14.049 7.44618C15.7089 5.7862 15.7089 3.09484 14.049 1.43485C12.389 -0.225189 9.69764 -0.225036 8.03764 1.43488C7.90307 1.56944 7.68486 1.56943 7.55028 1.43483C5.8903 -0.225189 3.19893 -0.225189 1.53893 1.43485C-0.121058 3.09484 -0.121047 5.78617 1.53893 7.44613C1.67353 7.58073 1.67353 7.79895 1.53893 7.93355Z',
)

const HIDPI_CLOVER_PATH = new Path2D(
  'M8.82931 13.3163L9.96283 13.3163C11.7694 13.3163 13.2774 14.5949 13.6313 16.2964L13.6313 13.8425C13.6313 12.5007 12.5436 11.4129 11.2017 11.4129C10.0406 11.4129 9.0697 12.2275 8.82931 13.3163ZM13.5774 17.0634C13.3426 18.1596 12.3681 18.9815 11.2017 18.9815C10.0354 18.9815 9.06095 18.1596 8.82608 17.0634L13.5774 17.0634ZM7.54395 13.8425C7.54394 11.8223 9.18159 10.1847 11.2017 10.1847C13.2219 10.1847 14.8595 11.8223 14.8595 13.8425L14.8595 16.552C14.8595 18.5721 13.2219 20.2097 11.2017 20.2097C9.18159 20.2097 7.54395 18.5721 7.54395 16.552L7.54395 13.8425ZM23.4501 17.0633C23.2153 18.1596 22.2408 18.9815 21.0744 18.9815C19.908 18.9815 18.9336 18.1596 18.6988 17.0633L23.4501 17.0633ZM23.504 16.4529L23.504 13.8425C23.504 12.5007 22.4163 11.4129 21.0744 11.4129C19.9133 11.4129 18.9424 12.2274 18.702 13.3163L19.8064 13.3163C21.668 13.3163 23.2125 14.6738 23.504 16.4529ZM17.4166 13.8425C17.4166 11.8223 19.0543 10.1847 21.0744 10.1847C23.0946 10.1847 24.7322 11.8223 24.7322 13.8425L24.7322 16.552C24.7322 18.5721 23.0946 20.2097 21.0744 20.2097C19.0543 20.2097 17.4166 18.5721 17.4166 16.552L17.4166 13.8425ZM3.35717 15.6773C0.0372041 18.9972 0.0371827 24.3799 3.35717 27.6998C6.67716 31.0198 12.0599 31.0198 15.3799 27.6999C15.649 27.4307 16.0854 27.4306 16.3546 27.6998C19.6746 31.0197 25.0573 31.0198 28.3773 27.6998C31.6972 24.3799 31.6972 18.9971 28.3773 15.6772C28.1081 15.408 28.1081 14.9717 28.3773 14.7025C31.6972 11.3826 31.6972 5.99985 28.3773 2.67987C25.0573 -0.640198 19.6746 -0.639892 16.3546 2.67993C16.0854 2.94907 15.649 2.94904 15.3799 2.67984C12.0599 -0.640196 6.67716 -0.640197 3.35717 2.67987C0.0371811 5.99985 0.0372034 11.3825 3.35717 14.7024C3.62635 14.9716 3.62635 15.4081 3.35717 15.6773Z',
)

type WheelSelectorOptions = {
  gapBetweenClovers?: number
  bgCloverColor?: string
}

type BgElementItem = { path: Path2D, matrix: DOMMatrix, isFilled: boolean }

const tinyCloverSize = window.devicePixelRatio === 1 ? 15 : 30

const getBgCloversColor = transform([0, 1], ['#161616', '#212121'])

const useWheelBackground = (
  canvasRef: RefObject<HTMLCanvasElement>,
  wrapperRef?: RefObject<HTMLElement>,
  options?: WheelSelectorOptions,
) => {
  const bgElementsArr = useRef<Array<BgElementItem>>([])
  const selectorCloversArr = useRef<Array<{ path: Path2D, matrix: DOMMatrix }>>(
    [],
  )
  const bgColumnsCount = useRef(0)
  const bgRowsCount = useRef(0)

  const drawBackgroundWithClover = useCallback(
    (time: number = 0) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const pixelRatio = window.devicePixelRatio

        const wrapper
          = wrapperRef?.current ?? (canvas.parentElement as HTMLDivElement)

        const gapBetweenTinyClovers
          = options?.gapBetweenClovers ?? 5 * pixelRatio

        const maxCountInRowBackground = Math.floor(
          (wrapper.offsetWidth * pixelRatio)
          / (tinyCloverSize + gapBetweenTinyClovers),
        )
        const maxRowsCountBackground = Math.floor(
          (wrapper.offsetHeight * pixelRatio)
          / (tinyCloverSize + gapBetweenTinyClovers),
        )

        bgColumnsCount.current = maxCountInRowBackground
        bgRowsCount.current = maxRowsCountBackground

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        for (let i = 0; i <= maxRowsCountBackground; i++) {
          for (let j = 0; j <= maxCountInRowBackground; j++) {
            // Draw tiny clover for background
            const mat = new DOMMatrix()

            // f - двигает по y | e - двигает по x
            mat.e = j * (tinyCloverSize + gapBetweenTinyClovers)
            mat.f = i * (tinyCloverSize + gapBetweenTinyClovers)

            const clover = new Path2D()

            clover.addPath(
              pixelRatio === 1 ? HDR_TINY_CLOVER_PATH_2D : HIDPI_CLOVER_PATH,
              mat,
            )

            ctx.save()

            ctx.fillStyle = getBgCloversColor(Math.cos(time / 2500))
            ctx.fill(clover)

            ctx.restore()

            bgElementsArr.current.push({
              matrix: mat,
              path: clover,
              isFilled: false,
            })
          }
        }
      }
    },
    [canvasRef, wrapperRef, options?.gapBetweenClovers],
  )

  const resizeBackground = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current

      const wrapper
        = wrapperRef?.current ?? (canvas.parentElement as HTMLDivElement)

      bgElementsArr.current = []
      selectorCloversArr.current = []

      clearCanvas(canvas)

      resizeCanvasWithRatio(canvas, wrapper)
      drawBackgroundWithClover()
    }
  }, [drawBackgroundWithClover, wrapperRef, canvasRef])

  return {
    drawBackground: drawBackgroundWithClover,
    resizeBackground,
  }
}

type UseWheelInitReturn = {
  refs: {
    wheelRef: RefObject<HTMLCanvasElement>
    innerRef: RefObject<HTMLCanvasElement>
  }
  functions: {
    drawWheel: () => void
    drawInner: () => void
    resizeWheel: () => void
    resizeInnerBackground: () => void
  }
  properties: {
    wheelSize: number
  }
}

const useWheelInit = (
  slots: AuctionSlot[] | WheelSlot[],
): UseWheelInitReturn => {
  const [wheelSize, setWheelSize] = useState(0)

  const documentBodyRef = useRef(document.body)
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null)
  const innerWheelCanvasRef = useRef<HTMLCanvasElement>(null)

  const defaultWheelColor = useRef(getHEXColor())

  const { drawBackground, resizeBackground } = useWheelBackground(innerWheelCanvasRef)

  const draw = useCallback(() => {
    const wheelCanvas = wheelCanvasRef.current

    if (!wheelCanvas)
      return

    const isSlotsArrEmpty = !slots.length

    if (isSlotsArrEmpty || !slots) {
      drawEmptyWheel(wheelCanvas, {
        color: defaultWheelColor.current,
      })
    }
    else {
      drawSlicesItems(wheelCanvas, slots)
    }
  }, [wheelCanvasRef, slots])

  const resizeWheel = useCallback(() => {
    const wheelCanvas = wheelCanvasRef.current
    const innerCanvas = innerWheelCanvasRef.current

    if (!wheelCanvas || !innerCanvas)
      return

    const wrapper = wheelCanvas.parentElement as HTMLDivElement
    const wrapperParent = wrapper.parentElement as HTMLDivElement

    const maxWheelCanvasSize = getMaxSizeCanvas(wrapperParent)

    if (maxWheelCanvasSize > 300) {
      wrapper.style.width = wrapper.style.height = `${maxWheelCanvasSize}px`
    }
    else {
      wrapper.style.width = wrapper.style.height = `${300}px`
    }

    resizeCanvasWithRatio(wheelCanvas, wrapper)
    resizeCanvasWithRatio(innerCanvas, wrapper)

    setWheelSize(wheelCanvas.clientWidth)
    draw()
  }, [wheelCanvasRef, innerWheelCanvasRef, draw])

  useResizeObserver(documentBodyRef, { onChange: () => {
    drawBackground()
    resizeWheel()
    resizeBackground()
  } })

  useEffect(() => {
    resizeBackground()
  }, [slots, resizeBackground])

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

type WheelControlCallbacks = {
  rotateValue?: number
  onSpinStart?: (winner: WheelSlot) => void
  onSpinComplete?: (winnerLot: WheelSlot) => void
}

type WheelControlOptions = Partial<WheelControlCallbacks> & {
  wheelRef: RefObject<HTMLElement>
  initialRotateValue?: number
}

const useWheelControl = (
  wheelSlots: WheelSlot[],
  options: WheelControlOptions,
) => {
  const {
    wheelRef,
    rotateValue,
    ...listeners
  } = options

  const [selectorTargetTitle, setSelectorTargetTitle] = useState<string | null>(
    null,
  )
  const [isWheelSpinning, setIsWheelSpinning] = useState(false)
  const framerMotionAnimationValue = useMotionValue(rotateValue ?? 0)

  const [wheelRotateCSSValue, setWheelRotateCSSValue] = useState(() =>
    ({
      current: framerMotionAnimationValue.get(),
      final: framerMotionAnimationValue.get(),
    }),
  )

  const rotateWheelAnimation = useCallback(
    (target: WheelSlot, spinTime: number) => {
      const wheel = wheelRef.current

      if (!wheel)
        return

      const targetRotateCSSValue
          = wheelRotateCSSValue.current + calculateRotateWheelCSSValue(target)

      if (targetRotateCSSValue !== wheelRotateCSSValue.current)
        setWheelRotateCSSValue({ ...wheelRotateCSSValue, final: targetRotateCSSValue })

      animate(framerMotionAnimationValue, targetRotateCSSValue, {
        type: 'tween',
        ease: [0.55, 0.65, 0, 1],
        duration: spinTime,
        visualDuration: spinTime,
        onPlay: () => {
          setIsWheelSpinning(true)

          listeners.onSpinStart?.(target)
          wheel.style.willChange = 'transform'
        },
        onUpdate(currentDegree) {
          const slotTitle = getSlotNameOnSelector(currentDegree, wheelSlots)

          setSelectorTargetTitle(slotTitle)

          wheel.style.transform = `rotateZ(${currentDegree}deg)`
        },
        onComplete: () => {
          setIsWheelSpinning(false)

          setWheelRotateCSSValue({ current: framerMotionAnimationValue.get(), final: framerMotionAnimationValue.get() })

          listeners.onSpinComplete?.(target)
        },
      })
    },
    [
      wheelRef,
      listeners,
      wheelRotateCSSValue,
      framerMotionAnimationValue,
      wheelSlots,
    ],
  )

  const startWheelSpinAnimation = (wheelWinner: WheelSlot, spinTime: number) => {
    rotateWheelAnimation(wheelWinner, spinTime)
  }

  return {
    state: { wheelRotateCSSValue, isWheelSpinning, selectorTargetTitle },
    functions: { startWheelSpinAnimation },
  }
}

export type UseWheelCanvasReturn = {
  refs: {
    wheelRef: RefObject<HTMLCanvasElement>
    innerRef: RefObject<HTMLCanvasElement>
  }
  functions: {
    startWheelSpinAnimation: (target: WheelSlot, spinTime: number) => void
  }
  state: {
    isSpinning: boolean
    wheelSlots: WheelSlot[]
    rotateValue: number
  }
}

export const useWheelCanvas = (slots: AuctionSlot[]): UseWheelCanvasReturn => {
  const {
    rotateValue: storedRotateWheelValue,
    spinStatus: storedSpinStatus,
    highlightedSlotId: storedHighlightedSlotId,
    selectorTargetTitle: storeSelectorTitle,
    spinTarget: storedSpinTarget,
    settings: storedWheelSettings,
  } = useStoreSelector(state => state.wheel)

  // TODO: Put wheel mode into wheel slice
  const storedWheelMode = useStoreSelector(auctionSelectors.getWheelMode)

  const { setSlots, setRotateValue, setWheelStatus, setSelectorTitleName } = useActionCreators(wheelActions)

  const preparedSlots = useMemo(() => {
    const formattedByModeSlots = storedWheelMode === 'classic' ? slots : formatSlotsToDropoutMode(slots)

    if (!storedHighlightedSlotId)
      return formattedByModeSlots

    return formattedByModeSlots.map((slot) => {
      if (slot.id === storedHighlightedSlotId) {
        return slot
      }

      return { ...slot, color: '#333' as HexColor }
    })
  }, [storedHighlightedSlotId, storedWheelMode, slots])

  const {
    refs: { wheelRef, innerRef },
    functions: { drawWheel, drawInner, resizeInnerBackground, resizeWheel },
  } = useWheelInit(preparedSlots)

  const {
    state: { wheelRotateCSSValue, selectorTargetTitle, isWheelSpinning },
    functions: { startWheelSpinAnimation },
  } = useWheelControl(getItemsWithAngles(preparedSlots), {
    rotateValue: storedSpinStatus === 'spinning' ? storedRotateWheelValue.current : storedRotateWheelValue.final,
    wheelRef,
  })

  const wheelSlots = useMemo(() => {
    if (isWheelSpinning)
      return getItemsWithAngles(preparedSlots)

    return updateSlotsAnglesByRotateValue(
      getItemsWithAngles(preparedSlots),
      wheelRotateCSSValue.final,
    )
  }, [wheelRotateCSSValue, isWheelSpinning, preparedSlots])

  useEffect(() => {
    if (isWheelSpinning)
      return

    setSlots(wheelSlots)
  }, [wheelSlots, isWheelSpinning])

  const storedIsWheelSpinning = storedSpinStatus === 'spinning'

  useEffect(() => {
    if (!storedSpinTarget)
      return

    startWheelSpinAnimation(storedSpinTarget, storedWheelSettings.spinTime)
  }, [storedSpinTarget, storedWheelSettings.spinTime])

  if (storedIsWheelSpinning !== isWheelSpinning) {
    const wheelStatus = isWheelSpinning ? 'spinning' : 'idle'

    setWheelStatus(wheelStatus)
  }

  if (isWheelSpinning && storeSelectorTitle !== selectorTargetTitle && selectorTargetTitle) {
    setSelectorTitleName(selectorTargetTitle)
  }

  if (storedRotateWheelValue.final !== wheelRotateCSSValue.final) {
    setRotateValue(wheelRotateCSSValue)
  }

  useLayoutEffect(() => {
    drawWheel()
    drawInner()

    resizeInnerBackground()
    resizeWheel()
  }, [drawWheel, resizeWheel, drawInner, resizeInnerBackground])

  return {
    state: { isSpinning: isWheelSpinning, wheelSlots, rotateValue: wheelRotateCSSValue.final },
    refs: { wheelRef, innerRef },
    functions: { startWheelSpinAnimation },
  }
}
