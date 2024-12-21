import { RefObject, forwardRef, useEffect, useRef } from 'react'

import { AuctionSlot } from '~entities/auction-slot/model/@x/auction-slot'
import { WheelSlot } from '~entities/wheel/model'
import { wheelActions } from '~entities/wheel/store'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'
import { getRandomHEXColor, getRandomHSLColor } from '~shared/utils/colors'

import { useWheelControl, useWheelInit } from '../utils'
import {
  getItemsWithAngles,
  updateSlotsAnglesByRotateValue,
} from '../utils/wheel-canvas'

type WheelProps = {
  wheelSelectorRef: RefObject<HTMLCanvasElement>
}

const slots: AuctionSlot[] = [
  {
    name: 'Test',
    color: getRandomHEXColor(),
    points: 1000,
    id: 12,
  },
  {
    name: 'Test 2',
    color: getRandomHEXColor(),
    points: 2000,
    id: 120,
  },
  {
    name: 'Test 3',
    color: getRandomHEXColor(),
    points: 2000,
    id: 120,
  },
  {
    name: 'Test 4',
    color: getRandomHEXColor(),
    points: 100,
    id: 120,
  },
]

const WheelCanvas = forwardRef<HTMLCanvasElement, WheelProps>(
  ({ wheelSelectorRef }, ref) => {
    return (
      <div className="flex-shrink-1 flex h-full w-full items-center justify-center">
        <div className="relative flex h-full w-full items-start justify-center">
          <canvas ref={ref} />
          <canvas className="absolute top-0" ref={wheelSelectorRef} />
        </div>
      </div>
    )
  }
)

const WheelContainer = () => {
  const dispatch = useStoreDispatch()
  const wheelEventBus = useStoreSelector((state) => state.wheel.emitter)
  const lotTextRef = useRef<HTMLSpanElement>(null)

  const {
    refs: { wheelRef, wheelSelectorRef },
  } = useWheelInit({ items: slots, isFullScreen: false })

  const {
    state: { wheelRotateCSSValue },
    functions: { spinWheel },
  } = useWheelControl({
    wheelRef,
    lotTextRef,
    items: getItemsWithAngles(slots),
  })

  // const slotsWithActualAngles = useMemo(() => {
  //   return updateSlotsAnglesByRotateValue(
  //     getItemsWithAngles(slots),
  //     wheelRotateCSSValue
  //   )
  // }, [wheelRotateCSSValue])

  useEffect(() => {
    const slotsWithActualAngles = updateSlotsAnglesByRotateValue(
      getItemsWithAngles(slots),
      wheelRotateCSSValue
    )

    console.log(slotsWithActualAngles)

    dispatch(wheelActions.setSlots(slotsWithActualAngles))
  }, [wheelRotateCSSValue])

  useEffect(() => {
    const callback = (winner: WheelSlot) => {
      spinWheel(winner, 5)
    }

    wheelEventBus.subscribe('spin', callback)

    return () => {
      wheelEventBus.unsubcribe('spin', callback)
    }
  }, [spinWheel])

  return (
    <div className="flex h-full w-full flex-shrink-[2] flex-col gap-y-2">
      <span ref={lotTextRef} className="text-center text-titleLg font-semibold">
        Ожидание прокрутки колеса...
      </span>
      <div className="h-full w-full">
        <WheelCanvas ref={wheelRef} wheelSelectorRef={wheelSelectorRef} />
      </div>
    </div>
  )
}

export default WheelContainer
