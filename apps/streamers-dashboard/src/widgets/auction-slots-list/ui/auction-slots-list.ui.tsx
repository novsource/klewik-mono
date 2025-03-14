import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ListChildComponentProps as ListRenderProps } from 'react-window'

import { motion } from 'framer-motion'

import {
  AuctionSlotCard,
  VirtualizedSlotsList,
} from '~features/auction-slot/watch-slots/ui'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { useIntersection } from '~shared/hooks/use-intersection'

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

  const firstCardRef = useRef<HTMLDivElement>(null)
  const lastCardRef = useRef<HTMLDivElement>(null)

  const { inView: isFirstCardInView } = useIntersection(firstCardRef)
  const { inView: isLastCardInView } = useIntersection(lastCardRef)

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
    ({ data: slots, index, style }: ListRenderProps<AuctionSlot[]>) => {
      const slot = slots[index]

      const refProp =
        index === 0
          ? firstCardRef
          : index === showedSlots.length - 1
            ? lastCardRef
            : undefined

      const card = withControls ? (
        <AuctionSlotCardWithControls
          ref={refProp}
          auctionId={auctionId}
          percent={slotsWinPercents[index]}
          {...slot}
        />
      ) : (
        <AuctionSlotCard
          ref={refProp}
          percent={slotsWinPercents[index]}
          {...slot}
        />
      )

      if (disableAnimation) {
        return (
          <div
            key={slot.id}
            style={{ ...style, marginTop: index > 0 ? `${8 * index}px` : '0' }}
          >
            {card}
          </div>
        )
      }

      return (
        <motion.div
          key={slot.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ ...style, marginTop: index > 0 ? `${8 * index}px` : '0' }}
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
