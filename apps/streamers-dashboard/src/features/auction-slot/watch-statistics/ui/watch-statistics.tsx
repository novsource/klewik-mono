import { memo } from 'react'

import NumberFlow from '@number-flow/react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import type { FlexProps } from '~shared/ui/flex'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

export type SlotsCountStatisticCardProps = FlexProps

export const SlotsCountStatisticCard = memo((props: SlotsCountStatisticCardProps) => {
  const { className, ...restProps } = props

  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const isLargeThenMobile = useMediaQuery(greaterThenDeviceWidthMediaQueries.mobile)

  return (
    <Flex
      className={cn(
        'h-9 gap-x-1.5 rounded-md bg-dark px-2 mobile:px-2.5 py-1.5 text-md leading-5 font-semibold text-gray-accent text-nowrap',
        className,
      )}
      align="center"
      justify="center"
      {...restProps}
    >
      <Icons.Slots width={isLargeThenMobile ? 18 : 14} height={isLargeThenMobile ? 18 : 14} />
      <NumberFlow
        className="font-azeret-mono font-medium tracking-tight text-sm mobile:text-md"
        willChange
        value={storedSlots.length}
      />
    </Flex>
  )
})

export type SlotsPointsSumStatisticCardProps = FlexProps

export const SlotsPointsSumStatisticCard = memo((props: SlotsPointsSumStatisticCardProps) => {
  const { className, ...restProps } = props

  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )

  const isLargeThenMobile = useMediaQuery(greaterThenDeviceWidthMediaQueries.mobile)

  return (
    <Flex
      className={cn(
        'h-9 gap-x-1.5 rounded-md bg-dark px-2 mobile:px-2.5 py-1.5 text-md leading-5 font-semibold text-gray-accent text-nowrap',
        className,
      )}
      align="center"
      justify="center"
      {...restProps}
    >
      <Icons.PointsSum width={isLargeThenMobile ? 21 : 16} height={isLargeThenMobile ? 21 : 16} />
      <NumberFlow
        className="font-azeret-mono font-medium tracking-tight text-sm mobile:text-md"
        willChange
        value={storedSlotsPointsSum}
        locales="ru-RU"
      />
    </Flex>
  )
})
