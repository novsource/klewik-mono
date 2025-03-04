import { HTMLAttributes, ReactNode, memo, useEffect, useState } from 'react'

import { ClassValue } from 'clsx'
import VirtualList from 'rc-virtual-list'

import { AuctionSlot } from '~entities/auction-slot/model'
import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

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
  percent?: string | number
}

const AuctionSlotCard = memo((props: AuctionSlotCardProps) => {
  const { percent, ...slot } = props
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
            startContent={<Icons.Coin className="text-gray-light" size="sm" />}
          >
            {Intl.NumberFormat('ru-Ru').format(slot.points).toString()}
          </AuctionCardChip>
          {percent && (
            <AuctionCardChip
              classNames={{ base: 'bg-green/20', text: 'text-green' }}
            >
              {percent}%
            </AuctionCardChip>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

export { AuctionSlotCard, AuctionCardChip }
