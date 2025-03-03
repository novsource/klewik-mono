import { ReactNode, useEffect, useState } from 'react'

import { ClassValue } from 'clsx'
import VirtualList from 'rc-virtual-list'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: ClassValue
  renderCard: (slot: AuctionSlot, index: number) => ReactNode
}

const VirtualizedSlotsList = ({ data, renderCard }: AuctionSlotsListProps) => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(() => data ?? storedSlots)

  useEffect(() => {
    if (data === undefined) {
      return setSlots(storedSlots)
    }

    setSlots(data)
  }, [data, storedSlots])

  return slots.length > 0 ? (
    <VirtualList
      component={'ul'}
      data={slots}
      itemKey={'id'}
      itemHeight={91}
      fullHeight
    >
      {renderCard}
    </VirtualList>
  ) : (
    <div className="flex flex-col gap-y-2 justify-center items-center h-full">
      <Icons.Logo className="text-gray" width={32} height={32} />
      <Typography tag="p" className="text-gray-light font-medium font-golos-f">
        Slots not found
      </Typography>
    </div>
  )
}

export { VirtualizedSlotsList }
