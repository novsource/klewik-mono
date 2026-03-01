import type { AuctionSlot } from '~entities/auction-slot/model'

import { Text } from '~shared/components/typography'

import { Divider } from '~shared/ui/divider'
import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn, formatNumberToIntlString } from '~shared/utils'

export type WinnerGameSlotInfoProps = FlexProps & {
  auctionSlot: AuctionSlot
}

export const WinnerGameSlotInfo = (props: WinnerGameSlotInfoProps) => {
  const { auctionSlot, className, ...restProps } = props

  return (
    <Flex
      className={cn('relative px-6 py-4 w-full h-full bg-dark-foreground-light rounded-medium', className)}
      align="center"
      justify="between"
      {...restProps}
    >
      <Flex className="gap-x-1.5" align="center">
        <Icons.Coin className="text-gray-light" size="lg" />
        <Text className="font-golos-f font-medium !text-title text-gray-accent" asSpan>
          {formatNumberToIntlString(auctionSlot.points)}
        </Text>
      </Flex>

      <Divider className="mx-4 h-full" orientation="vertical" />

      <Flex className="gap-x-1.5" align="center">
        <Icons.Crown className="text-gray-light" size="lg" />
        <Text className="font-golos-f font-medium !text-title text-green" asSpan>
          {`${formatNumberToIntlString(auctionSlot.winPercents)}%`}
        </Text>
      </Flex>
    </Flex>
  )
}
