import { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react'

import { ClassValue } from 'clsx'
import { motion } from 'framer-motion'

import { EditSlotSheet } from '~widgets/edit-slot-dialog/ui'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'
import {
  AuctionCardChip,
  AuctionSlotCard,
  VirtualizedSlotsList,
} from '~features/auction-slot/watch-slots/ui'

import { Auction } from '~entities/auction/model'
import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

type AuctionSlotCardWithControlsProps = AuctionSlot & {
  auctionId: Auction['id']
  percent: string | number
}

const AuctionSlotCardWithControls = memo(
  (props: AuctionSlotCardWithControlsProps) => {
    const { percent, auctionId, ...slot } = props
    return (
      <Card className="flex flex-col justify-between border-1 border-dark gap-y-3 py-2">
        <CardHeader className="flex items-start justify-between h-6">
          <CardTitle className="w-full">
            <Typography
              tag="span"
              className="font-golos-f text-title font-semibold"
            >
              {slot.name}
            </Typography>
          </CardTitle>
          <div className="flex flex-row gap-x-1 h-6">
            <EditSlotSheet
              slot={slot}
              trigger={
                <Button
                  variant={'ghost'}
                  isIconOnly
                  className="text-gray-accent transition-colors hover:text-white h-full px-1 py-1"
                  startContent={<Icons.Pencil />}
                  size={'sm'}
                >
                  Изменить
                </Button>
              }
            />
            <DeleteSlotButton auctionId={auctionId} slotId={slot.id} />
          </div>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-y-2 pt-0">
          <div className="w-full flex flex-row gap-x-2 items-center">
            <div
              className="w-8 h-7 rounded-md"
              style={{
                backgroundColor: Array.isArray(slot.color)
                  ? `rgb(${slot.color.join(',')})`
                  : slot.color,
              }}
            />
            <AuctionCardChip
              startContent={<Icons.Id className="text-gray-light" size="sm" />}
            >
              {slot.id}
            </AuctionCardChip>
            <AuctionCardChip
              startContent={
                <Icons.Coin className="text-gray-light" size="sm" />
              }
            >
              {Intl.NumberFormat('ru-Ru').format(slot.points).toString()}
            </AuctionCardChip>
            <AuctionCardChip
              classNames={{ base: 'bg-green/20', text: 'text-green' }}
            >
              {percent}%
            </AuctionCardChip>
          </div>
        </CardContent>
      </Card>
    )
  }
)

type AuctionSlotsListProps = {
  data?: AuctionSlot[]

  className?: ClassValue
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

  useLayoutEffect(() => {
    if (data === undefined) {
      setShowedSlots(storedAuctionSlots)
    } else {
      setShowedSlots(data)
    }
  }, [storedAuctionSlots, data])

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
    (slot: AuctionSlot, index: number) => {
      const card = withControls ? (
        <AuctionSlotCardWithControls
          {...slot}
          auctionId={auctionId}
          percent={slotsWinPercents[index]}
        />
      ) : (
        <AuctionSlotCard {...slot} percent={slotsWinPercents[index]} />
      )

      if (disableAnimation) {
        return (
          <li key={slot.id} style={{ marginTop: index > 0 ? '8px' : '0' }}>
            {card}
          </li>
        )
      }

      return (
        <motion.li
          key={slot.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ marginTop: index > 0 ? '8px' : '0' }}
        >
          {card}
        </motion.li>
      )
    },
    [slotsWinPercents, withControls, disableAnimation]
  )

  return (
    <VirtualizedSlotsList
      data={showedSlots}
      renderCard={renderAuctionCard}
      {...otherProps}
    />
  )
}

export { AuctionSlotsList }
