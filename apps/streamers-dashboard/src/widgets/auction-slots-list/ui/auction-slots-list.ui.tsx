import { HTMLAttributes, ReactNode, memo, useCallback, useMemo } from 'react'

import { ClassValue } from 'clsx'
import { motion } from 'framer-motion'

import { DeleteSlotButton } from '~features/auction-slot/delete-slot/ui'
import { VirtualizedSlotsList } from '~features/auction-slot/watch-slots/ui'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionCardChipProps = {
  children?: ReactNode
  style?: HTMLAttributes<HTMLDivElement>['style']
  startContent?: JSX.Element
  endContent?: JSX.Element
  classNames?: {
    base?: ClassValue
    text?: ClassValue
  }
}

const AuctionCardChip = (props: AuctionCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <div
      className={cn(
        'px-2 py-1 bg-gray/30 flex flex-row gap-x-1.5 items-center rounded-md',
        classNames?.base
      )}
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-md font-medium text-gray-accent',
          classNames?.text
        )}
        tag="span"
      >
        {children}
      </Typography>
      {endContent}
    </div>
  )
}

type AuctionSlotCardProps = AuctionSlot & {
  percent: string | number
}

const AuctionSlotCard = memo((props: AuctionSlotCardProps) => {
  const { id, name, points, percent, color } = props
  return (
    <Card className="flex flex-col justify-between border-1 border-dark gap-y-3 py-2">
      <CardHeader className="flex items-start justify-between h-6">
        <CardTitle className="w-full">
          <Typography
            tag="span"
            className="font-golos-f text-title font-semibold"
          >
            {name}
          </Typography>
        </CardTitle>
        <div className="flex flex-row gap-x-1 h-6">
          <Button
            variant={'ghost'}
            isIconOnly
            className="text-gray-accent transition-colors hover:text-white h-full px-1 py-1"
            startContent={<Icons.Pencil />}
            size={'sm'}
          >
            Изменить
          </Button>
          <DeleteSlotButton slotId={id} />
        </div>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-y-2 pt-0">
        <div className="w-full flex flex-row gap-x-2 items-center">
          <div
            className="w-8 h-7 rounded-md"
            style={{
              backgroundColor: Array.isArray(color)
                ? `rgb(${color.join(',')})`
                : color,
            }}
          />
          <AuctionCardChip
            startContent={<Icons.Id className="text-gray-light" size="sm" />}
          >
            {id}
          </AuctionCardChip>
          <AuctionCardChip
            startContent={<Icons.Coin className="text-gray-light" size="sm" />}
          >
            {Intl.NumberFormat('ru-Ru').format(points).toString()}
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
})

type AuctionSlotsListProps = {
  className?: ClassValue
}

const AuctionSlotsList = (props: AuctionSlotsListProps) => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const slotsWinPercents = useMemo(() => {
    const slotsPointSum = auctionSlots.reduce(
      (sum, slot) => sum + slot.points,
      0
    )

    return auctionSlots.reduce<string[]>((acc, slot) => {
      acc.push(((slot.points / slotsPointSum) * 100).toFixed(1))
      return acc
    }, [])
  }, [auctionSlots])

  const renderAuctionCard = useCallback((slot: AuctionSlot, index: number) => {
    return (
      <motion.li
        key={slot.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ marginTop: index > 0 ? '8px' : '0' }}
      >
        <AuctionSlotCard {...slot} percent={slotsWinPercents[index]} />
      </motion.li>
    )
  }, [])

  return (
    <VirtualizedSlotsList
      className={props.className}
      data={auctionSlots}
      renderCard={renderAuctionCard}
    />
  )
}

export { AuctionSlotsList }
