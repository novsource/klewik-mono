import { useCallback, useState } from 'react'

import * as m from 'motion/react-m'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import type { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'
import { auctionSelectors } from '~entities/auction/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import type { ShadowVirtualListProps } from '~shared/ui/shadow-virtual-list'

import { AuctionSlotCardWithControls } from './list-card.ui'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  withControls?: boolean
  disableAnimation?: boolean
} & ShadowVirtualListProps<HTMLDivElement, AuctionSlot>

const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const {
    data,
    className,
    withControls = true,
    disableAnimation = false,
    ...virtualListProps
  } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )

  const [showedSlots, setShowedSlots] = useState(data ?? storedAuctionSlots)

  if (data !== undefined && showedSlots !== data) {
    setShowedSlots(data)
  }

  if (data === undefined && showedSlots !== storedAuctionSlots) {
    setShowedSlots(storedAuctionSlots)
  }

  const renderAuctionCard = useCallback(
    (item: AuctionSlot, index: number) => {
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

      return (
        <m.div
          layout
          key={item.title}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.35 }}
        >
          {card}
        </m.div>
      )
    },
    [storedSlotsPointsSum, withControls, disableAnimation, auctionUUID],
  )

  return (
    <VirtualizedSlotsList
      data={showedSlots}
      renderCard={renderAuctionCard}
      className={className}
      gap={8}
      {...virtualListProps}
    />
  )
}

export { AuctionSlotsList }
