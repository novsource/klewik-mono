import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { animate, useMotionValue } from 'motion/react'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { WheelSlot } from '~entities/wheel/model'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'
import type { HexColor } from '~shared/lib/zod'

import { wheelActions } from '../store'
import { formatSlotsToDropoutMode } from '../utils'
import {
  calculateRotateWheelCSSValue,
  getItemsWithAngles,
  getSlotNameOnSelector,
  updateSlotsAnglesByRotateValue,
} from '../utils/wheel-canvas'

type WheelControlCallbacks = {
  rotateValue?: number
  onSpinStart?: (winner: WheelSlot) => void
  onSpinComplete?: (winnerLot: WheelSlot) => void
}

type WheelControlOptions = Partial<WheelControlCallbacks> & {
  wheelRef: RefObject<HTMLElement>
  initialRotateValue?: number
}

export const useWheelControl = (
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

          wheel.style.transform = `rotateZ(${0}deg)`

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

export type UseWheelReturn = {
  refs: {
    wheelRef: RefObject<HTMLElement>
  }
  functions: {
    startWheelSpinAnimation: (target: WheelSlot, spinTime: number) => void
  }
  state: {
    selectorCurrentSlot: NullablePossible<string>
    isSpinning: boolean
    wheelSlots: WheelSlot[]
    rotateValue: number
  }
}

export const useWheel = (slots: AuctionSlot[]): UseWheelReturn => {
  const {
    rotateValue: storedRotateWheelValue,
    spinStatus: storedSpinStatus,
    highlightedSlotId: storedHighlightedSlotId,
    selectorTargetTitle: storeSelectorTitle,
    spinTarget: storedSpinTarget,
    settings: storedWheelSettings,
  } = useStoreSelector(state => state.wheel)

  const wheelRef = useRef<HTMLElement>(null)

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
    state: { wheelRotateCSSValue, selectorTargetTitle, isWheelSpinning },
    functions: { startWheelSpinAnimation },
  } = useWheelControl(getItemsWithAngles(preparedSlots), {
    rotateValue: storedSpinStatus === 'spinning'
      ? storedRotateWheelValue.current
      : storedRotateWheelValue.final,
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

  return {
    refs: { wheelRef },
    state: {
      isSpinning: isWheelSpinning,
      wheelSlots,
      rotateValue: wheelRotateCSSValue.final,
      selectorCurrentSlot: selectorTargetTitle,
    },
    functions: { startWheelSpinAnimation },
  }
}
