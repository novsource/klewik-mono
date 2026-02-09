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

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import type { CardProps } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

export type AuctionSlotsListCardProps = CardProps & {
  auctionSlot: AuctionSlot
  actionButtonProps?: ButtonProps
  isDroped?: boolean
}

export const AuctionSlotsListCard = (props: AuctionSlotsListCardProps) => {
  const {
    auctionSlot,
    className,
    actionButtonProps,
    isDroped = false,
    ...restProps
  } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <BaseAuctionSlotCard
      className={cn('flex-row items-end pr-2', className)}
      {...restProps}
    >
      <Flex className="gap-y-2 pr-3.5" direction="column">
        <SolidAuctionSlotHeader slotTitle={auctionSlot.title} />

        <BaseAuctionSlotCardContent {...restProps}>
          <Flex
            className="bg-dark-light rounded-sm px-1.5 w-fit"
            direction="row"
            align="center"
          >
            <AuctionSlotCardIdInfo slotId={auctionSlot.auctionSlotOrder} />
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
            <AuctionSlotCardContentInfoDivider />
            <AuctionSlotCardWinPercents winPercents={auctionSlot.winPercents} />
            <AuctionSlotCardContentInfoDivider />
            {isDroped
              ? <Icons.BrokenHeart className="text-gray-light" size="sm" />
              : <Icons.Heart className="text-red animate-heartbeating" size="xs" />}
          </Flex>
        </BaseAuctionSlotCardContent>
      </Flex>

      <Button
        className="bg-dark-light text-gray-light transition-colors hover:text-white"
        isIconOnly
        icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
        size={isLargeThenTablet ? 'sm' : 'xs'}
        {...actionButtonProps}
      />

    </BaseAuctionSlotCard>
  )
}
