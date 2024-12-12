import { useMemo, useRef } from 'react'

import { useWheelControl } from '@hooks/wheel/useWheelControl'
import { useWheelInit } from '@hooks/wheel/useWheelInit'

import { getRandomHSLColor } from '@utils/canvas'
import {
  getItemsWithAngles,
  updateSlotsAnglesByRotateValue,
} from '@utils/wheelCanvas'

import Wheel from './Wheel'

const slots: AuctionSlot[] = [
  {
    name: 'Test',
    slotHSVColor: getRandomHSLColor(),
    points: 1000,
    _id: '12',
  },
  {
    name: 'Test 2',
    slotHSVColor: getRandomHSLColor(),
    points: 2000,
    _id: '120',
  },
  {
    name: 'Test 3',
    slotHSVColor: getRandomHSLColor(),
    points: 2000,
    _id: '120',
  },
  {
    name: 'Test 4',
    slotHSVColor: getRandomHSLColor(),
    points: 100,
    _id: '120',
  },
]

const WheelContainer = () => {
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

  const slotsWithActualAngles = useMemo(() => {
    return updateSlotsAnglesByRotateValue(
      getItemsWithAngles(slots),
      wheelRotateCSSValue
    )
  }, [wheelRotateCSSValue])

  const handleClick = () => {
    spinWheel(slotsWithActualAngles[0], 5)
  }

  return (
    <div className="flex h-full w-full flex-shrink-[2] flex-col gap-y-2">
      <span ref={lotTextRef} className="text-center text-titleLg font-semibold">
        Ожидание прокрутки колеса...
      </span>
      <div className="h-full w-full">
        <Wheel ref={wheelRef} wheelSelectorRef={wheelSelectorRef} />
      </div>
    </div>
  )
}

export default WheelContainer
