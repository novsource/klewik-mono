import { useAuctionSlotsIDB } from '~entities/auction-slot/hooks'
import { auctionSlotsActions } from '~entities/auction-slot/store'

import { useMount } from '~shared/hooks'

import { useActionCreators } from '~shared/lib/redux-toolkit'

export const useLocalDashboardStateRestore = () => {
  const { addSlots } = useActionCreators(auctionSlotsActions)

  const auctionSlotsIDB = useAuctionSlotsIDB()

  const restoreSlots = async () => {
    try {
      if (auctionSlotsIDB.isOpened) {
        const slots = (await auctionSlotsIDB.getAll()) ?? []

        addSlots(slots)
        return
      }

      await auctionSlotsIDB.open()

      const slots = (await auctionSlotsIDB.getAll()) ?? []
      addSlots(slots)
    }
    catch (error) {
      if (error instanceof Error)
        throw error
    }
  }

  useMount(() => {
    restoreSlots()
  })
}
