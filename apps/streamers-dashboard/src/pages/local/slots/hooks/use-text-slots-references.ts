import { useEffect, useMemo, useRef } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useDebounceState, usePrevious, useUnmount } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import type { HexColor } from '~shared/lib/zod'

import { getHEXColor } from '~shared/utils'

type TextSlotReference = {
  slot: AuctionSlot
  color: HexColor
}

export const useTextSlotsReferences = (text: string) => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const [debouncedSlots, setDebouncedSlots] = useDebounceState(auctionSlots, 250)

  const previousDebouncedSlots = usePrevious(debouncedSlots)

  useEffect(() => {
    setDebouncedSlots(auctionSlots)
  }, [auctionSlots, setDebouncedSlots])

  useUnmount(() => {
    setDebouncedSlots.cancel()
  })

  const defaultSlotsReferencesRef = useRef(getSlotsReferences(text, debouncedSlots))

  const slotsReferenceInMessage = useMemo(() => {
    const existingsResults: Record<number, TextSlotReference> = {}
    const updatedSlots: AuctionSlot[] = []

    for (const slot of debouncedSlots) {
      const isNewSlot = !previousDebouncedSlots?.find(prevSlot => prevSlot.title === slot.title)

      if (isNewSlot) {
        updatedSlots.push(slot)
      }
      else {
        if (!defaultSlotsReferencesRef.current)
          continue

        for (const key in defaultSlotsReferencesRef.current) {
          const value = defaultSlotsReferencesRef.current[key]

          if (value.slot.title === slot.title) {
            existingsResults[key] = value
          }
        }
      }
    }

    const referencesInUpdatedSlots = getSlotsReferences(text, updatedSlots)

    return { ...referencesInUpdatedSlots, ...existingsResults }
  }, [debouncedSlots, text, previousDebouncedSlots])
  defaultSlotsReferencesRef.current = slotsReferenceInMessage

  return defaultSlotsReferencesRef.current
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

function getSlotsReferences(text: string, slots: AuctionSlot[]): NullablePossible<Record<number, TextSlotReference>> {
  if (text.length < 1)
    return null

  return slots.reduce((acc, slot) => {
    if (slot.title.length < 1) {
      return acc
    }

    const index = boyerMooreSearch(text, slot.title)

    if (index === -1)
      return acc

    acc[index] = {
      slot,
      color: getHEXColor(),
    }

    return acc
  }, {} as Record<number, TextSlotReference>)
}
