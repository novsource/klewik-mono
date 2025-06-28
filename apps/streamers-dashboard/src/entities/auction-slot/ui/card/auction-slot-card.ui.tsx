import type { ClassValue } from 'clsx'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type {
  CardProps,
} from '~shared/ui/card'
import {
  Card,
  CardContent,
  CardHeader,
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

type AuctionSlotCardProps = Omit<CardProps, 'id' | 'color' | 'className'>
  & AuctionSlot & {
    percent?: string | number
    slotClassNames?: {
      base?: string
      header?: string
      title?: string
      content?: string
    }
  }

const AuctionSlotCard = forwardRef<HTMLDivElement, AuctionSlotCardProps>(
  (props, forwardRef) => {
    const { id, percent, title, color, points, slotClassNames, ...cardProps }
      = props
    return (
      <Card
        ref={forwardRef}
        className={cn(
          'flex flex-col justify-between gap-y-3 border-1 border-dark py-2',
          slotClassNames?.base,
        )}
        {...cardProps}
      >
        <CardHeader
          className={cn(
            'flex h-6 items-start justify-between',
            slotClassNames?.header,
          )}
        >
          <CardTitle className={cn('w-full', slotClassNames?.title)}>
            <Typography
              tag="span"
              className="font-golos-f text-md tablet:text-title tablet:font-semibold"
            >
              {title}
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            'flex w-full flex-col gap-y-2 pt-0',
            slotClassNames?.content,
          )}
        >
          <Flex
            className="w-full gap-x-1 tablet:gap-x-2"
            direction="row"
            align="center"
          >
            <div
              className="h-7 w-8 rounded-md max-tablet:size-6"
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
                {percent}
                %
              </AuctionCardChip>
            )}
          </Flex>
        </CardContent>
      </Card>
    )
  },
)

const AuctionCardChip = (props: AuctionCardChipProps) => {
  const { children, startContent, endContent, classNames } = props

  return (
    <Flex
      className={cn(
        'gap-x-1 rounded-md bg-gray/30 px-1.5 py-1 tablet:gap-x-1.5 tablet:px-2 tablet:py-1',
        classNames?.base,
      )}
      direction="row"
      align="center"
    >
      {startContent}
      <Typography
        className={cn(
          'font-golos-f text-sm font-medium text-gray-accent tablet:text-md',
          classNames?.text,
        )}
        tag="span"
      >
        {children}
      </Typography>
      {endContent}
    </Flex>
  )
}

export { AuctionCardChip, AuctionSlotCard }
