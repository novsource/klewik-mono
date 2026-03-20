import { useCallback, useMemo } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

export type UseExportSlotsOptions = {
  serializer?: (slots: AuctionSlot[]) => string | undefined
  skipDropped?: boolean
}

export const useExportSlots = (options?: UseExportSlotsOptions) => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const localFilteredSlotsToExport = useMemo(() => {
    if (!options || !options?.skipDropped)
      return storedSlots

    return storedSlots.filter(slot => slot.isAlived)
  }, [storedSlots, options])

  const exportFile = useCallback(() => {
    const serializer = options?.serializer ?? JSON.stringify

    const serializedData = serializer(localFilteredSlotsToExport)

    if (serializedData === undefined) {
      throw new Error('Error on serialize slots to export')
    }

    const blob = new Blob([serializedData], { type: 'application/json' })

    const url = URL.createObjectURL(blob)

    // Create a link element, set its attributes, and trigger a click to download the file
    const link = document.createElement('a')
    link.href = url
    link.download = 'klewik_slots_data.json' // The desired file name
    link.click() // Programmatically click the link to start the download

    // Clean up by revoking the object URL (optional, but good practice)
    URL.revokeObjectURL(url)
  }, [localFilteredSlotsToExport, options])

  return { exportFile }
}
