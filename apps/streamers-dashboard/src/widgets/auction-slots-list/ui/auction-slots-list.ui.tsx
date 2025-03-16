import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import {
  AuctionSlotCard,
  VirtualizedSlotsList,
} from '~features/auction-slot/watch-slots/ui'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { AuctionSlotCardWithControls } from './list-card'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  withControls?: boolean
  disableAnimation?: boolean
}

type AuctionSlotWithPercents = AuctionSlot & {
  percent: string | number
}

const AuctionSlotsList = ({
  data,
  withControls = true,
  disableAnimation = false,
  className,
  ...otherProps
}: AuctionSlotsListProps) => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum
  )

  const [showedSlots, setShowedSlots] = useState(
    () => data ?? storedAuctionSlots
  )

  const slotsWinPercents = useMemo(() => {
    const percentsArr = [...storedAuctionSlots].map<AuctionSlotWithPercents>(
      (slot) => {
        const percent = ((slot.points / storedSlotsPointsSum) * 100).toFixed(2)

        return { ...slot, percent }
      }
    )

    return showedSlots.map(
      (slot) => percentsArr.find((item) => item.id === slot.id)?.percent ?? 0
    )
  }, [storedAuctionSlots, storedSlotsPointsSum, showedSlots])

  const renderAuctionCard = useCallback(
    (item: AuctionSlot, index: number) => {
      const card = withControls ? (
        <AuctionSlotCardWithControls
          auctionId={auctionId}
          percent={slotsWinPercents[index]}
          {...item}
        />
      ) : (
        <AuctionSlotCard percent={slotsWinPercents[index]} {...item} />
      )

      if (disableAnimation) {
        return (
          <div
            key={item.id}
            style={{
              marginTop: index > 0 ? `8px` : '0',
            }}
          >
            {card}
          </div>
        )
      }

      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            marginTop: index > 0 ? `8px` : '0',
          }}
        >
          {card}
        </motion.div>
      )
    },
    [slotsWinPercents, withControls, disableAnimation]
  )

  useLayoutEffect(() => {
    if (data === undefined) {
      setShowedSlots(storedAuctionSlots)
    } else {
      setShowedSlots(data)
    }
  }, [storedAuctionSlots, data])

  return (
    <VirtualizedSlotsList
      data={showedSlots}
      renderCard={renderAuctionCard}
      className={className}
      shadowScroll
      {...otherProps}
    />
  )
}

export { AuctionSlotsList }
