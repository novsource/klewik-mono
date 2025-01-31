import { ReactNode, memo, useEffect, useMemo, useState } from 'react'

import { ClassValue } from 'clsx'
import { motion } from 'framer-motion'
import VirtualList from 'rc-virtual-list'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionCardChipProps = {
  children: ReactNode
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
  const { id, name, points, percent } = props
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
          <Button
            variant={'ghost'}
            isIconOnly
            className="text-gray-accent transition-colors hover:text-red h-full px-1 py-1"
            startContent={<Icons.Bin />}
            size={'sm'}
          >
            Удалить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="w-full flex flex-col gap-y-2 pt-0">
        <div className="w-full flex flex-row gap-x-2 items-center -ml-0.5">
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
  data?: AuctionSlot[]
  className?: ClassValue
}

const AuctionSlotsList = ({ data }: AuctionSlotsListProps) => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const [slots, setSlots] = useState(() => data ?? storedSlots)

  useEffect(() => {
    if (data === undefined) {
      return setSlots(storedSlots)
    }

    setSlots(data)
  }, [data, storedSlots])

  const slotsWinPercents = useMemo(() => {
    const slotsPointSum = slots.reduce((sum, slot) => sum + slot.points, 0)

    return slots.reduce<string[]>((acc, slot) => {
      acc.push(((slot.points / slotsPointSum) * 100).toFixed(1))
      return acc
    }, [])
  }, [slots])

  return slots.length > 0 ? (
    <VirtualList
      component={'ul'}
      data={slots}
      itemKey={'id'}
      itemHeight={91}
      fullHeight
    >
      {(slot, index) => {
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
      }}
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

export { AuctionSlotsList }
