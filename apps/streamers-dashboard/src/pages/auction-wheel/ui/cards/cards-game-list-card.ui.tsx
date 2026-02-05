import type { AuctionSlot } from '~entities/auction-slot/model'
import {
  AuctionSlotCardContentInfoDivider,
  AuctionSlotCardIdInfo,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import type { CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'

export type CardsGameListCardProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents: number
  winPercentsBounds: { min: number, max: number }
}

export const CardsGameListCard = (props: CardsGameListCardProps) => {
  const { auctionSlot, winPercents, winPercentsBounds, ...restProps } = props

  return (
    <BaseAuctionSlotCard {...restProps}>
      <SolidAuctionSlotHeader slotTitle={auctionSlot.title} />
      <BaseAuctionSlotCardContent>
        <Flex
          className="bg-dark-light rounded-sm px-1.5 w-fit"
          direction="row"
          align="center"
        >
          <AuctionSlotCardIdInfo slotId={auctionSlot.auctionSlotOrder} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardWinPercents winPercents={winPercents} bounds={winPercentsBounds} />
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
