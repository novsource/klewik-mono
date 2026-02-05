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
import { Icons } from '~shared/ui/icons'

export type CardsGameListCardProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents: number
  winPercentsBounds: { min: number, max: number }
  isDropped?: boolean
}

export const CardsGameListCard = (props: CardsGameListCardProps) => {
  const { auctionSlot, winPercents, winPercentsBounds, isDropped = false, ...restProps } = props

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
          <AuctionSlotCardContentInfoDivider />
          {isDropped
            ? <Icons.BrokenHeart className="text-gray-light" size="sm" />
            : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
