import type { CardProps } from 'klewik-ui/card'

import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'

import {
  AuctionSlotCardContentInfoDivider,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import type { WheelSlot } from '~entities/wheel/model'

import { cn } from '~shared/utils'

export type WheelSlotCardProps = CardProps & {
  wheelSlot: WheelSlot
  winPercentsBounds: { min: number, max: number }
  isDropped?: boolean
  isWinner?: boolean
}

export const WheelSlotCard = (props: WheelSlotCardProps) => {
  const {
    wheelSlot,
    winPercentsBounds,
    className,
    isDropped = false,
    isWinner = false,
    ...restProps
  } = props

  return (
    <BaseAuctionSlotCard
      className={cn('flex-row items-end pr-2', className)}
      {...restProps}
    >
      <Flex className="gap-y-2 w-full" direction="column">
        <SolidAuctionSlotHeader slotTitle={wheelSlot.title} />

        <BaseAuctionSlotCardContent {...restProps}>
          <Flex
            className="w-fit"
            direction="row"
            align="center"
          >
            <div className={cn('size-7.5 tablet:size-8 bg-red/10 flex items-center justify-center rounded-small', isDropped && 'bg-dark-light', isWinner && 'bg-orange/10')}>
              {isWinner
                ? <Icons.Crown className="text-orange" />
                : isDropped
                  ? <Icons.BrokenHeart className="text-gray-light" />
                  : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
            </div>
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardPointsInfo slotPoints={wheelSlot.points} />
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardWinPercents winPercents={wheelSlot.winPercents} />
          </Flex>
        </BaseAuctionSlotCardContent>
      </Flex>
    </BaseAuctionSlotCard>
  )
}
