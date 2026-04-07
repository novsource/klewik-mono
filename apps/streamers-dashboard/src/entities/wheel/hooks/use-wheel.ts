import type { AuctionGameMode } from '~entities/games/model'
import type { WheelSlicesSizeMode } from '~entities/games/store'

import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { animate, useMotionValue } from 'motion/react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { WheelSlot } from '~entities/wheel/model'

import type { HexColor, RGBAColor } from '~shared/lib/zod'

import { getHEXColor } from '~shared/utils'

import { formatSlotsToDropoutMode } from '../utils'
import {
  calculateRotateWheelCSSValue,
  getSlotNameOnSelector,
  transformSlotsToWheelSlots,
} from '../utils/wheel-canvas'

type WheelControlCallbacks = {
  rotateValue?: number
  onSpinStart?: (winner: WheelSlot) => void
  onSpinComplete?: (winnerLot: WheelSlot, rotateValue: number) => void
}

type WheelControlOptions = Partial<WheelControlCallbacks> & {
  wheelRef: RefObject<SVGSVGElement>
  initialRotateValue?: number
}

const useWheelControl = (
  wheelSlots: WheelSlot[],
  options: WheelControlOptions,
) => {
  const { wheelRef, rotateValue, ...listeners } = options

  const [selectorTargetTitle, setSelectorTargetTitle] = useState<string | null>(null)
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
        },
        onUpdate(currentDegree) {
          const slotTitle = getSlotNameOnSelector(currentDegree, wheelSlots)

          setSelectorTargetTitle(slotTitle)

          wheel.style.rotate = `${currentDegree}deg`
        },
        onComplete: () => {
          setIsWheelSpinning(false)
          setWheelRotateCSSValue({ current: framerMotionAnimationValue.get(), final: framerMotionAnimationValue.get() })

          listeners.onSpinComplete?.(target, framerMotionAnimationValue.get())
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
    actions: { startWheelSpinAnimation },
  }
}

export type UseWheelReturn = {
  state: {
    selectorCurrentSlot: NullablePossible<string>
    isSpinning: boolean
    wheelSlots: WheelSlot[]
    rotateValue: number
  }
  meta: {
    wheelRef: RefObject<SVGSVGElement>
  }
  actions: {
    startWheelSpinAnimation: (target: WheelSlot, spinTime: number) => void
    updateWheelSlotsColors: () => void
  }
}

type UseWheelOptions = {
  sizeMode: WheelSlicesSizeMode
  mode: AuctionGameMode
}

export const useWheel = (auctionSlots: AuctionSlot[], options: UseWheelOptions): UseWheelReturn => {
  const initialSlotsColorsRef = useRef<NullablePossible<Record<number, HexColor | RGBAColor>>>(null)

  const [wheelSlots, setWheelSlots] = useState(() => {
    const slots = transformSlotsToWheelSlots(auctionSlots, options.sizeMode)

    if (initialSlotsColorsRef.current) {
      return slots.map(slot => ({ ...slot, color: initialSlotsColorsRef.current![slot.id] }))
    }

    initialSlotsColorsRef.current = slots.reduce<Record<number, HexColor | RGBAColor>>(
      (acc, slot) => {
        acc[slot.id] = slot.color

        return acc
      },
      {},
    )

    return slots
  })

  const wheelRef = useRef<SVGSVGElement>(null)

  const {
    state: { wheelRotateCSSValue, selectorTargetTitle, isWheelSpinning },
    actions,
  } = useWheelControl(wheelSlots, {
    rotateValue: 0,
    wheelRef,
  })

  useEffect(() => {
    const preparedSlots = options.mode === 'dropout' ? formatSlotsToDropoutMode(auctionSlots) : auctionSlots
    const transformedSlots = transformSlotsToWheelSlots(preparedSlots, options.sizeMode)

    setWheelSlots(transformSlotsToWheelSlots(transformedSlots, options.sizeMode))
  }, [auctionSlots, options.sizeMode, options.mode])

  const updateWheelSlotsColors = () => {
    setWheelSlots(curr => curr.map((slot) => {
      const randomHexColor = getHEXColor()

      return { ...slot, color: randomHexColor }
    }))
  }

  return {
    state: {
      isSpinning: isWheelSpinning,
      wheelSlots,
      rotateValue: wheelRotateCSSValue.final,
      selectorCurrentSlot: selectorTargetTitle,
    },
    actions: { ...actions, updateWheelSlotsColors },
    meta: { wheelRef },
  }
}
