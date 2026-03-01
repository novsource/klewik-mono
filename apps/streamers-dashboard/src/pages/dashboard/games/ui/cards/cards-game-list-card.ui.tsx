import type { AuctionSlot } from '~entities/auction-slot/model'
import {
  AuctionSlotCardContentInfoDivider,
  AuctionSlotCardPointsInfo,
  AuctionSlotCardWinPercents,
  BaseAuctionSlotCard,
  BaseAuctionSlotCardContent,
  SolidAuctionSlotHeader,
} from '~entities/auction-slot/ui/card'

import type { CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

export type CardsGameListCardProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercentsBounds: { min: number, max: number }
  isDropped?: boolean
}

export const CardsGameListCard = (props: CardsGameListCardProps) => {
  const { auctionSlot, winPercentsBounds, className, isDropped = false, ...restProps } = props

  return (
    <BaseAuctionSlotCard
      className={cn('flex-row items-end pr-2', className)}
      {...restProps}
    >
      <Flex className="gap-y-2 pr-3.5" direction="column">
        <SolidAuctionSlotHeader slotTitle={auctionSlot.title} />

        <BaseAuctionSlotCardContent {...restProps}>
          <Flex
            className="w-fit"
            direction="row"
            align="center"
          >
            <div className={cn('size-7.5 tablet:size-8 bg-red/10 flex items-center justify-center rounded-small', isDropped && 'bg-dark-light')}>
              {isDropped
                ? <Icons.BrokenHeart className="text-gray-light" />
                : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
            </div>
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardWinPercents winPercents={auctionSlot.winPercents} />
          </Flex>
        </BaseAuctionSlotCardContent>
      </Flex>

    </BaseAuctionSlotCard>
  )

  // return (
  //   <BaseAuctionSlotCard {...restProps}>
  //     <SolidAuctionSlotHeader slotTitle={auctionSlot.title} />
  //     <BaseAuctionSlotCardContent>
  //       <Flex
  //         className="bg-dark-light rounded-sm px-1.5 w-fit"
  //         direction="row"
  //         align="center"
  //       >
  //         <AuctionSlotCardIdInfo slotId={auctionSlot.auctionSlotOrder} />
  //         <AuctionSlotCardContentInfoDivider />
  //         <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
  //         <AuctionSlotCardContentInfoDivider />
  //         <AuctionSlotCardWinPercents winPercents={auctionSlot.winPercents} bounds={winPercentsBounds} />
  //         <AuctionSlotCardContentInfoDivider />
  //         {isDropped
  //           ? <Icons.BrokenHeart className="text-gray-light" size="sm" />
  //           : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
  //       </Flex>
  //     </BaseAuctionSlotCardContent>
  //   </BaseAuctionSlotCard>
  // )
}
