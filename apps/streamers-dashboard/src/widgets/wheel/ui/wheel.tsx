import { RefObject, forwardRef, useEffect, useRef } from 'react'

import { WheelEventsBus } from '~entities/wheel/events'
import { WheelSlot } from '~entities/wheel/model'
import { wheelActions } from '~entities/wheel/store'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'

import { useWheelControl, useWheelInit } from '../utils'
import {
  getItemsWithAngles,
  updateSlotsAnglesByRotateValue,
} from '../utils/wheel-canvas'

type WheelProps = {
  wheelSelectorRef: RefObject<HTMLCanvasElement>
}

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
  const storedSlots = useStoreSelector((state) => state.auctionSlots.slots)
  const dispatch = useStoreDispatch()

  const lotTextRef = useRef<HTMLSpanElement>(null)
  const {
    refs: { wheelRef, wheelSelectorRef },
  } = useWheelInit({ items: storedSlots, isFullScreen: false })

  const {
    state: { wheelRotateCSSValue },
    functions: { spinWheel },
  } = useWheelControl({
    wheelRef,
    lotTextRef,
    items: getItemsWithAngles(storedSlots),
  })

  useEffect(() => {
    const slotsWithActualAngles = updateSlotsAnglesByRotateValue(
      getItemsWithAngles(storedSlots),
      wheelRotateCSSValue
    )

    dispatch(wheelActions.setSlots(slotsWithActualAngles))
  }, [wheelRotateCSSValue])

  useEffect(() => {
    const callback = (winner: WheelSlot) => {
      spinWheel(winner, 5)
    }

    const spinEventUnsubcribe = WheelEventsBus.getInstance().subscribe(
      'spin',
      callback
    )

    return () => {
      spinEventUnsubcribe()
    }
  }, [spinWheel])

  return (
    <div className="flex h-full w-full flex-shrink-2 flex-col gap-y-2">
      <span
        ref={lotTextRef}
        className="text-center text-title desktop:text-title-lg font-semibold"
      >
        Ожидание прокрутки колеса...
      </span>
      <div className="h-full w-full">
        <WheelCanvas ref={wheelRef} wheelSelectorRef={wheelSelectorRef} />
      </div>
    </div>
  )
}

export default WheelContainer
