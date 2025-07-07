import { useCallback, useState } from 'react'

import { useSortingSlots } from '~pages/auction-slots/lib'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { auctionSelectors } from '~entities/auction/store'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'

import { AuctionSlotCardWithControls } from './list-card.ui'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  withControls?: boolean
  disableAnimation?: boolean
} & Omit<ShadowVirtualListProps<HTMLDivElement, AuctionSlot>, 'children'>

const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    withControls = true,
    gap = 6,
    disableAnimation = false,
    ...virtualListProps
  } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )

  const sortingOptions = useStoreSelector(auctionSlotsSelectors.getSlotsSortOptions)

  const [showedSlots, setShowedSlots] = useState(data ?? storedAuctionSlots)

  if (data !== undefined && showedSlots !== data) {
    setShowedSlots(data)
  }

  if (data === undefined && showedSlots !== storedAuctionSlots) {
    setShowedSlots(storedAuctionSlots)
  }

  const sortedSlots = useSortingSlots(showedSlots, sortingOptions)

  const renderAuctionCard = useCallback(
    (item: AuctionSlot) => {
      let percent = ((item.points / storedSlotsPointsSum) * 100).toFixed(2)

      if (percent[-1] === '0' && percent[-2] === '0') {
        let precisionLimit = 2

        while (
          (percent[-1] === '0' && percent[-2] === '0')
          || precisionLimit !== 5
        ) {
          percent = ((item.points / storedSlotsPointsSum) * 100).toFixed(
            precisionLimit,
          )

          precisionLimit++
        }
      }

      const card = withControls
        ? (
            <AuctionSlotCardWithControls
              auctionUUID={auctionUUID}
              percent={Number(Number.parseFloat(percent).toPrecision(4))}
              {...item}
            />
          )
        : (
            <AuctionSlotCard percent={percent} {...item} />
          )

      if (disableAnimation) {
        return <div key={item.title}>{card}</div>
      }

      return <div key={item.title}>{card}</div>
    },
    [storedSlotsPointsSum, withControls, disableAnimation, auctionUUID],
  )

  return (
    <VirtualizedSlotsList
      data={sortedSlots}
      renderCard={renderAuctionCard}
      className={className}
      gap={gap}
      overscan={8}
      {...virtualListProps}
    />
  )
}

export { AuctionSlotsList }
