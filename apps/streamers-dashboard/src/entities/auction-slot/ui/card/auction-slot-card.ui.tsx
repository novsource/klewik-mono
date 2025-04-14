import { ComponentProps, ReactNode, forwardRef } from 'react'

import { ClassValue } from 'clsx'

import { AuctionSlot } from '~entities/auction-slot/model'

import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  CardTitle,
} from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

type AuctionCardChipProps = {
  children?: ReactNode
  style?: ComponentProps<'div'>['style']
  startContent?: JSX.Element
  endContent?: JSX.Element
  classNames?: {
    base?: ClassValue
    text?: ClassValue
  }
}

type AuctionSlotCardProps = Omit<CardProps, 'id' | 'color'> &
  AuctionSlot & {
    percent?: string | number
  }

const AuctionSlotCard = forwardRef<HTMLDivElement, AuctionSlotCardProps>(
  (props, forwardRef) => {
    const { id, percent, name, color, points, className, ...cardProps } = props
    return (
      <Card
        ref={forwardRef}
        className={cn(
          'flex flex-col justify-between border-1 border-dark gap-y-3 py-2',
          className
        )}
        {...cardProps}
      >
        <CardHeader className="flex items-start justify-between h-6">
          <CardTitle className="w-full">
            <Typography
              tag="span"
              className="font-golos-f font-semibold text-title"
            >
              {name}
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col gap-y-2 pt-0">
          <Flex className="w-full gap-x-2" direction="row" align="center">
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
              startContent={
                <Icons.Coin className="text-gray-light" size="sm" />
              }
            >
              {Intl.NumberFormat('ru-Ru').format(points).toString()}
            </AuctionCardChip>
            {percent && (
              <AuctionCardChip
                classNames={{ base: 'bg-green/20', text: 'text-green' }}
              >
                {percent}%
              </AuctionCardChip>
            )}
          </Flex>
        </CardContent>
      </Card>
    )
  }
)

const AuctionCardChip = (props: AuctionCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <Flex
      className={cn(
        'px-2 py-1 bg-gray/30 gap-x-1.5 rounded-md',
        classNames?.base
      )}
      direction="row"
      align="center"
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
    </Flex>
  )
}

export { AuctionSlotCard, AuctionCardChip }
