import {
  AuctionSlotCardContentInfoDivider,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import type { WheelSlot } from '~entities/wheel/model'

import type { CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

export type WheelSlotCardProps = CardProps & {
  wheelSlot: WheelSlot
  winPercentsBounds: { min: number, max: number }
  isDropped?: boolean
}

export const WheelSlotCard = (props: WheelSlotCardProps) => {
  const { wheelSlot, winPercentsBounds, isDropped = false, ...restProps } = props

  return (
    <BaseAuctionSlotCard className="relative overflow-clip" {...restProps}>
      <SolidAuctionSlotHeader slotTitle={wheelSlot.title} />
      <BaseAuctionSlotCardContent>
        <Flex
          className="bg-dark-light rounded-sm px-1.5 w-fit"
          direction="row"
          align="center"
        >
          <div className="size-3.5 rounded-pill" style={{ backgroundColor: wheelSlot.color }} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardPointsInfo slotPoints={wheelSlot.points} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardWinPercents winPercents={wheelSlot.winPercents} bounds={winPercentsBounds} />
          <AuctionSlotCardContentInfoDivider />
          {isDropped
            ? <Icons.BrokenHeart className="text-gray-light" size="sm" />
            : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
