import { AuctionSlotCardContentInfoDivider, AuctionSlotCardIdInfo, AuctionSlotCardPointsInfo, AuctionSlotCardWinPercents, BaseAuctionSlotCard, BaseAuctionSlotCardContent, SolidAuctionSlotHeader } from '~entities/auction-slot/ui/card'

import type { WheelSlot } from '~entities/wheel/model'

import type { CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'

export type WheelSlotCardProps = CardProps & {
  wheelSlot: WheelSlot
  winPercents: number
  winPercentsBounds: { min: number, max: number }
}

export const WheelSlotCard = (props: WheelSlotCardProps) => {
  const { wheelSlot, winPercents, winPercentsBounds, ...restProps } = props

  return (
    <BaseAuctionSlotCard {...restProps}>
      <SolidAuctionSlotHeader slotTitle={wheelSlot.title} />
      <BaseAuctionSlotCardContent>
        <Flex
          className="bg-dark-light rounded-sm px-1.5 w-fit"
          direction="row"
          align="center"
        >
          <div className="size-3.5 rounded-pill" style={{ backgroundColor: wheelSlot.color }} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardIdInfo slotId={wheelSlot.auctionSlotOrder} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardPointsInfo slotPoints={wheelSlot.points} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardWinPercents winPercents={winPercents} bounds={winPercentsBounds} />
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
