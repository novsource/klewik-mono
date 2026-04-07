import type { SlotsPageContextValue } from '../context/slots-page.context'

import { useMemo } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

export type UseLocalFilterSlotsOptions = {
  extendedPredicate?: (slot: AuctionSlot, index: number) => boolean
} & SlotsPageContextValue['state']['filterSlotsOptions']

const defaultFilterSlotsOptions: UseLocalFilterSlotsOptions = {
  status: 'all',
  points: {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  },
}

export const useLocalFilterSlots = (slots: AuctionSlot[], options?: UseLocalFilterSlotsOptions): AuctionSlot[] => {
  const localFilteredSlots = useMemo(() => {
    const applyedOptions = options ?? defaultFilterSlotsOptions

    const result = slots.filter((slot, index) => slotsFilterPredicate(slot, index, applyedOptions))

    return result
  }, [slots, options])

  return localFilteredSlots
}

function slotsFilterPredicate(slot: AuctionSlot, index: number, options: UseLocalFilterSlotsOptions): boolean {
  const { points, status, extendedPredicate } = options

  const isPassPointsFilter = points ? isSlotPassPointsFilter(slot, points) : true
  const isPassStatusFilter = status ? isSlotPassStatusFilter(slot, status) : true
  const isPassExtendedPredicate = extendedPredicate ? extendedPredicate(slot, index) : true

  return isPassPointsFilter && isPassStatusFilter && isPassExtendedPredicate
}

function isSlotPassPointsFilter(slot: AuctionSlot, options: NonNullable<UseLocalFilterSlotsOptions['points']>): boolean {
  return (slot.points <= options.max) && (slot.points >= options.min)
}

function isSlotPassStatusFilter(slot: AuctionSlot, status: NonNullable<UseLocalFilterSlotsOptions['status']>): boolean {
  if (status === 'all')
    return true

  return status === 'alived' ? slot.isAlived : slot.isDropped
}
