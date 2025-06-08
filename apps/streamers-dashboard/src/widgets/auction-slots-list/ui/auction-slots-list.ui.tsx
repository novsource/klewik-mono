import { useCallback, useLayoutEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'
import { AuctionSlotCard } from '~entities/auction-slot/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { AuctionSlotCardWithControls } from './list-card'

type AuctionSlotsListProps = {
  data?: AuctionSlot[]
  className?: string
  withControls?: boolean
  disableAnimation?: boolean
}

const AuctionSlotsList = ({
  data,
  withControls = true,
  disableAnimation = false,
  className,
  ...otherProps
}: AuctionSlotsListProps) => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionUUID)
  const storedAuctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum
  )

  const [showedSlots, setShowedSlots] = useState(
    () => data ?? storedAuctionSlots
  )

  useLayoutEffect(() => {
    if (data === undefined) {
      setShowedSlots(storedAuctionSlots)
    } else {
      setShowedSlots(data)
    }
  }, [storedAuctionSlots, data])

  const renderAuctionCard = useCallback(
    (item: AuctionSlot, index: number) => {
      let percent = ((item.points / storedSlotsPointsSum) * 100).toFixed(2)

      if (percent[-1] === '0' && percent[-2] === '0') {
        let precisionLimit = 2

        while (
          (percent[-1] === '0' && percent[-2] === '0') ||
          precisionLimit !== 5
        ) {
          percent = ((item.points / storedSlotsPointsSum) * 100).toFixed(
            precisionLimit
          )

          precisionLimit++
        }
      }

      const card = withControls ? (
        <AuctionSlotCardWithControls
          auctionId={auctionId}
          percent={Number(parseFloat(percent).toPrecision(4))}
          {...item}
        />
      ) : (
        <AuctionSlotCard percent={percent} {...item} />
      )

      if (disableAnimation) {
        return (
          <div
            key={item.name}
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
          key={item.name}
          initial={{ scaleY: 0.25, translateY: 50 }}
          animate={{ scaleY: 1, translateY: 0 }}
          exit={{ scaleY: 0, translateY: -50, className: 'absolute -z-2' }}
          transition={{ ease: 'easeInOut', duration: 0.35 }}
          style={{
            marginTop: index > 0 ? `8px` : '0',
          }}
        >
          {card}
        </motion.div>
      )
    },
    [storedSlotsPointsSum, withControls, disableAnimation]
  )

  return (
    <VirtualizedSlotsList
      data={showedSlots}
      renderCard={renderAuctionCard}
      className={className}
      shadowEnabled
      {...otherProps}
    />
  )
}

export { AuctionSlotsList }
