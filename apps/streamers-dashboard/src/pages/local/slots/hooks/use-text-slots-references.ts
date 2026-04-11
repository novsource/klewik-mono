import { useMemo, useRef } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import type { HexColor } from '~shared/lib/zod'

import { getHEXColor } from '~shared/utils'

type TextSlotReference = {
  slot: AuctionSlot
  color: HexColor
}

export const useTextSlotsReferences = (text: string) => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const defaultSlotsColorsRef = useRef(auctionSlots.reduce((acc, slot) => {
    acc[slot.title] = getHEXColor()

    return acc
  }, {} as Record<string, HexColor>))

  const slotsReferencesColors = useMemo(() => {
    return auctionSlots.reduce((acc, slot) => {
      const isSlotAlreadyHaveColor = Reflect.has(defaultSlotsColorsRef.current, slot.title)

      if (isSlotAlreadyHaveColor) {
        acc[slot.title] = defaultSlotsColorsRef.current[slot.title]
      }
      else {
        const color = getHEXColor()
        acc[slot.title] = color
      }

      return acc
    }, {} as Record<string, HexColor>)
  }, [auctionSlots])

  defaultSlotsColorsRef.current = slotsReferencesColors

  const slotsReferenceInMessage = useMemo(() => {
    if (!text)
      return []

    return auctionSlots.reduce((acc, slot) => {
      if (slot.title.length < 1) {
        return acc
      }

      const index = boyerMooreSearch(text, slot.title)

      if (index === -1)
        return acc

      acc[index] = {
        slot,
        color: slotsReferencesColors[slot.title],
      }

      return acc
    }, {} as Record<number, TextSlotReference>)
  }, [auctionSlots, text, slotsReferencesColors])

  return slotsReferenceInMessage
}

function boyerMooreSearch(text: string, pattern: string) {
  const textLength = text.length
  const patternLength = pattern.length
  if (patternLength === 0)
    return 0

  const shiftTable: Record<string, number> = {}

  for (let index = 0; index < patternLength - 1; index++) {
    shiftTable[pattern[index]] = patternLength - 1 - index
  }

  let shift = 0
  while (shift <= (textLength - patternLength)) {
    let index = patternLength - 1

    while (index >= 0 && pattern[index] === text[shift + index]) {
      index--
    }

    if (index < 0) {
      return shift
    }
    else {
      const charAtMismatch = text[shift + patternLength - 1]
      shift += shiftTable[charAtMismatch] || patternLength
    }
  }
  return -1
}
