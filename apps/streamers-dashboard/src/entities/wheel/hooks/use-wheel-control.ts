import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

import { animate, useMotionValue } from 'motion/react'

import type { WheelSlot } from '~entities/wheel/model'

import {
  calculateRotateWheelCSSValue,
  getSlotNameOnSelector,
} from '../utils/wheel-canvas'

type WheelControlCallbacks = {
  onSpinStart: (winner: WheelSlot) => void
  onSpinComplete: (winnerLot: WheelSlot) => void
}

type WheelControlOptions = Partial<WheelControlCallbacks> & {
  wheelRef: RefObject<HTMLCanvasElement>
}

export const useWheelControl = (
  wheelSlots: WheelSlot[],
  { wheelRef, onSpinStart, onSpinComplete }: WheelControlOptions,
) => {
  const [selectorTargetTitle, setSelectorTargetTitle] = useState<string | null>(
    null,
  )
  const [isWheelSpinning, setIsWheelSpinning] = useState(false)
  const framerMotionAnimationValue = useMotionValue(0)

  const [wheelRotateCSSValue, setWheelRotateCSSValue] = useState(() =>
    framerMotionAnimationValue.get(),
  )

  const rotateWheelAnimation = useCallback(
    (target: WheelSlot, spinTime: number) => {
      if (wheelRef.current) {
        const wheel = wheelRef.current

        const targetRotateCSSValue
          = wheelRotateCSSValue + calculateRotateWheelCSSValue(target)

        animate(framerMotionAnimationValue, targetRotateCSSValue, {
          type: 'tween',
          ease: [0.55, 0.65, 0, 1],
          duration: spinTime,
          visualDuration: spinTime,
          onPlay: () => {
            setIsWheelSpinning(true)

            onSpinStart && onSpinStart(target)
            wheel.style.willChange = 'transform'
          },
          onComplete: () => {
            setIsWheelSpinning(false)
            setWheelRotateCSSValue(framerMotionAnimationValue.get())

            onSpinComplete && onSpinComplete(target)
          },
          onUpdate(currentDegree) {
            const slotName = getSlotNameOnSelector(currentDegree, wheelSlots)

            setSelectorTargetTitle(slotName)

            wheel.style.transform = `rotateZ(${currentDegree}deg)`
          },
        })
      }
    },
    [
      setIsWheelSpinning,
      wheelRef,
      onSpinComplete,
      onSpinStart,
      framerMotionAnimationValue,
      wheelRotateCSSValue,
      wheelSlots,
    ],
  )

  const spinWheel = (wheelWinner: WheelSlot, spinTime: number) => {
    rotateWheelAnimation(wheelWinner, spinTime)
  }

  return {
    state: { wheelRotateCSSValue, isWheelSpinning, selectorTargetTitle },
    functions: { spinWheel },
  }
}
