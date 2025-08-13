import type { RefObject } from 'react'
import { useCallback, useState } from 'react'

import { animate, useMotionValue } from 'motion/react'

import type { WheelSlot } from '~entities/wheel/model'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { wheelActions, wheelSelectors } from '../store'
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
  const storeWheelRotateValue = useStoreSelector(wheelSelectors.getRotateValue)

  const storeWheelActions = useActionCreators(wheelActions)

  const [selectorTargetTitle, setSelectorTargetTitle] = useState<string | null>(
    null,
  )
  const [isWheelSpinning, setIsWheelSpinning] = useState(false)
  const framerMotionAnimationValue = useMotionValue(storeWheelRotateValue)

  const [wheelRotateCSSValue, setWheelRotateCSSValue] = useState(() =>
    framerMotionAnimationValue.get(),
  )

  const rotateWheelAnimation = useCallback(
    (target: WheelSlot, spinTime: number) => {
      const wheel = wheelRef.current

      if (!wheel)
        return

      const targetRotateCSSValue
          = wheelRotateCSSValue + calculateRotateWheelCSSValue(target)

      animate(framerMotionAnimationValue, targetRotateCSSValue, {
        type: 'tween',
        ease: [0.55, 0.65, 0, 1],
        duration: spinTime,
        visualDuration: spinTime,
        onPlay: () => {
          storeWheelActions.setWheelStatus('spinning')
          storeWheelActions.setRotateValue(targetRotateCSSValue)

          onSpinStart && onSpinStart(target)
          wheel.style.willChange = 'transform'
        },
        onUpdate(currentDegree) {
          const slotName = getSlotNameOnSelector(currentDegree, wheelSlots)

          storeWheelActions.setSelectorTitleName(slotName)

          wheel.style.transform = `rotateZ(${currentDegree}deg)`
        },
        onComplete: () => {
          storeWheelActions.setWheelStatus('idle')
          storeWheelActions.setRotateValue(framerMotionAnimationValue.get())

          onSpinComplete && onSpinComplete(target)
        },
      })
    },
    [
      wheelRef,
      onSpinComplete,
      onSpinStart,
      framerMotionAnimationValue,
      wheelRotateCSSValue,
      wheelSlots,
      storeWheelActions,
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
