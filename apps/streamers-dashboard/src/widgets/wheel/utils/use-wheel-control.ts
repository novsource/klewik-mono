import { RefObject, useCallback, useState } from 'react'

import { animate, useMotionValue } from 'framer-motion'

import { WheelSlot } from '~entities/wheel/model'

import {
  calculateRotateWheelCSSValue,
  getSlotNameOnSelector,
} from './wheel-canvas'

type WheelControlCallbacks = {
  onSpinStart: () => void
  onSpinComplete: (winnerLot: WheelSlot) => void
}

type WheelControl = Partial<WheelControlCallbacks> & {
  wheelRef: RefObject<HTMLCanvasElement>
  lotTextRef: RefObject<HTMLSpanElement>
  items: WheelSlot[]
}

export const useWheelControl = ({
  wheelRef,
  lotTextRef,
  items,
  onSpinStart,
  onSpinComplete,
}: WheelControl) => {
  const [isWheelSpinning, setIsWheelSpinning] = useState(false)
  const framerMotionAnimationValue = useMotionValue(0)

  const [wheelRotateCSSValue, setWheelRotateCSSValue] = useState(() =>
    framerMotionAnimationValue.get()
  )

  const rotateWheelAnimation = useCallback(
    (winner: WheelSlot, spinTime: number) => {
      if (wheelRef.current && lotTextRef.current) {
        const wheel = wheelRef.current
        const slotNameTextField = lotTextRef.current

        const targetRotateCSSValue =
          wheelRotateCSSValue + calculateRotateWheelCSSValue(winner)

        animate(framerMotionAnimationValue, targetRotateCSSValue, {
          duration: spinTime,
          ease: [0.62, 0.67, 0, 0.99],
          onPlay: () => {
            setIsWheelSpinning(true)

            onSpinStart && onSpinStart()
          },
          onComplete: () => {
            setIsWheelSpinning(false)
            setWheelRotateCSSValue(framerMotionAnimationValue.get())

            onSpinComplete && onSpinComplete(winner)
          },
          onUpdate(currentDegree) {
            const slotName = getSlotNameOnSelector(currentDegree, items)

            slotNameTextField.innerText = slotName

            wheel.style.transform = `rotate(${currentDegree}deg)`
          },
        })
      }
    },
    [
      setIsWheelSpinning,
      lotTextRef,
      wheelRef,
      onSpinComplete,
      onSpinStart,
      framerMotionAnimationValue,
      wheelRotateCSSValue,
      items,
    ]
  )

  const spinWheel = (wheelWinner: WheelSlot, spinTime: number) => {
    rotateWheelAnimation(wheelWinner, spinTime)
  }

  return {
    state: { wheelRotateCSSValue, isWheelSpinning },
    functions: { spinWheel },
  }
}
