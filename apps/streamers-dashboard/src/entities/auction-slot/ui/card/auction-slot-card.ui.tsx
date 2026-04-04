import type { NumberFlowProps } from '@number-flow/react'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import NumberFlow from '@number-flow/react'
import { transform } from 'motion'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { greaterThenDeviceWidthMediaQueries, tailwindScreens } from '~shared/constants/tailwindcss'

import { Text } from '~shared/components/typography'

import { useMediaQuery } from '~shared/hooks'

import type {
  CardProps,
} from 'klewik-ui/card'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'klewik-ui/card'
import type { FlexProps } from 'klewik-ui/flex'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Skeleton } from 'klewik-ui/skeleton'

import { getRandomNumberInRange } from '~shared/utils/common'
import { cn } from '~shared/utils/react'

export type BaseAuctionSlotCardProps = CardProps

export const BaseAuctionSlotCard = forwardRef<HTMLDivElement, BaseAuctionSlotCardProps>(
  (props, forwardRef) => {
    const { className, ...restProps } = props

    return (
      <Card
        ref={forwardRef}
        data-slot="base"
        className={cn([
          'flex flex-col justify-between gap-y-1 border-1 border-dark-light pt-1.5 pb-2',
          'tablet:py-2.5 tablet:gap-y-2',
        ], className)}
        {...restProps}
      />
    )
  },
)

export type BaseAuctionSlotCardHeaderProps = ComponentProps<'div'>

export const BaseAuctionSlotCardHeader = (props: BaseAuctionSlotCardHeaderProps) => {
  const { className, ...restProps } = props

  return (
    <CardHeader
      className={cn([
        'flex gap-y-1 tablet:gap-y-2.5 items-center justify-between leading-4',
        'tablet:flex-col tablet:leading-6',
      ], className)}
      data-slot="header"
      {...restProps}
    />
  )
}

export type AuctionSlotCardTitleInfoProps = {
  slotTitle: string
  className?: string
}

export const AuctionSlotCardTitleInfo = (props: AuctionSlotCardTitleInfoProps) => {
  const { slotTitle, className } = props

  return (
    <Text
      className={cn([
        'text-base font-semibold font-golos-f mobile:text-title tablet:text-title-lg text-white/85 break-words',
        className,
      ])}
      asSpan
    >
      {slotTitle}
    </Text>
  )
}

export type BaseAuctionSlotCardTitleProps = ComponentProps<'div'>

export const BaseAuctionSlotCardTitle = (props: BaseAuctionSlotCardTitleProps) => {
  const { className, ...restProps } = props

  return (
    <CardTitle className={cn('w-full', className)} {...restProps} />
  )
}

export type BaseAuctionSlotCardContentProps = ComponentProps<'div'>

export const BaseAuctionSlotCardContent = (props: BaseAuctionSlotCardContentProps) => {
  const { className, ...restProps } = props

  return (
    <CardContent
      className={cn('flex flex-row w-full gap-y-2 py-0 space-y-0', className)}
      data-slot="content"
      {...restProps}
    />
  )
}

export type AuctionSlotCardContentInfoWrapperProps = FlexProps & {
  icon?: ReactNode
}

export const AuctionSlotCardContentInfoWrapper = (props: AuctionSlotCardContentInfoWrapperProps) => {
  const { icon, children, className, ...restProps } = props

  return (
    <Flex
      className={cn([
        'h-7 gap-y-0.5 gap-x-0.75 py-1.25',
        'tablet:flex-row tablet:gap-x-1 tablet:items-center tablet:justify-start',
      ], className)}
      justify="center"
      align="center"
      data-slot="content-item-wrapper"
      {...restProps}
    >
      {icon && (
        <Flex className="text-gray-light gap-x-1" align="center">
          {icon}
        </Flex>
      )}
      {children}
    </Flex>
  )
}

export type AuctionSlotCardWinPercentsProps = Omit<ComponentProps<'div'>, 'children'> & {
  winPercents: number
  bounds?: {
    min: number
    max: number
  }
  numberFlowProps?: Omit<NumberFlowProps, 'value'>
}

export const AuctionSlotCardWinPercents = (props: AuctionSlotCardWinPercentsProps) => {
  const { winPercents, numberFlowProps, bounds, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  const color = useMemo(() => {
    if (!bounds)
      return 'var(--color-green)'

    return transform(winPercents, [bounds.min, bounds.max], ['#f76b63', '#3f9663'])
  }, [bounds, winPercents])

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={(
        <Icons.Crown
          size={isLargeThenTablet ? 'default' : 'sm'}
        />
      )}
      {...restProps}
    >
      <NumberFlow
        willChange
        trend={0}
        value={winPercents}
        format={{
          notation: 'standard',
          compactDisplay: 'short',
        }}
        locales="ru-RU"
        suffix="%"
        style={{ color }}
        {...numberFlowProps}
        className={cn('font-golos-f font-semibold text-sm tablet:text-md tablet:leading-4', numberFlowProps?.className)}
      />
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type AuctionSlotCardPointsInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  slotPoints: number
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardPointsInfo = (props: AuctionSlotCardPointsInfoProps) => {
  const { slotPoints, className, numberFlowProps, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(tailwindScreens.tablet)

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={<Icons.Coin size={isLargeThenTablet ? 'default' : 'sm'} />}
      {...restProps}
    >
      <NumberFlow
        className={cn('font-golos-f font-semibold text-gray-accent text-sm tablet:text-md tablet:leading-4', className)}
        willChange
        trend={0}
        value={slotPoints}
        locales="ru-RU"
        {...numberFlowProps}
      />
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type AuctionSlotCardStatusInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  isDropped: boolean
  isWinner?: boolean
}

export const AuctionSlotCardStatusInfo = (props: AuctionSlotCardStatusInfoProps) => {
  const { isDropped, isWinner = false, ...restProps } = props

  return (
    <AuctionSlotCardContentInfoWrapper {...restProps}>
      <div className={cn('size-7.5 tablet:size-8 bg-red/10 flex items-center justify-center rounded-small', isDropped && 'bg-dark-light', isWinner && 'bg-orange/10')}>
        {isWinner
          ? <Icons.Crown className="text-orange" />
          : isDropped
            ? <Icons.BrokenHeart className="text-gray-light" />
            : <Icons.Heart className="text-red" size="xs" />}
      </div>
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type AuctionSlotCardIdInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  slotId: number
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardIdInfo = (props: AuctionSlotCardIdInfoProps) => {
  const { slotId, numberFlowProps, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(tailwindScreens.tablet)

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={<Icons.Id size={isLargeThenTablet ? 'default' : 'sm'} />}
      {...restProps}
    >
      <Text className="font-golos-f font-semibold text-gray-accent text-sm tablet:text-md tablet:leading-4" asSpan>
        {slotId}
      </Text>
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type SolidAuctionSlotHeaderProps = BaseAuctionSlotCardHeaderProps & {
  slotTitle: AuctionSlot['title']
}

export const SolidAuctionSlotHeader = (props: SolidAuctionSlotHeaderProps) => {
  const { slotTitle, ...restProps } = props

  return (
    <BaseAuctionSlotCardHeader {...restProps}>
      <BaseAuctionSlotCardTitle>
        <AuctionSlotCardTitleInfo slotTitle={slotTitle} />
      </BaseAuctionSlotCardTitle>
    </BaseAuctionSlotCardHeader>
  )
}

export type AuctionSlotCardContentInfoDividerProps = ComponentProps<'div'>

export const AuctionSlotCardContentInfoDivider = (props: AuctionSlotCardContentInfoDividerProps) => {
  const { className, ...restProps } = props

  return (
    <div
      className={cn('size-1 bg-gray/80 rounded-pill mx-1.5 tablet:mx-2', className)}
      {...restProps}
    />
  )
}

export type SolidAuctionSlotContentProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents?: number
}

export const SolidAuctionSlotContent = (props: SolidAuctionSlotContentProps) => {
  const { auctionSlot, winPercents, ...restProps } = props

  return (
    <BaseAuctionSlotCardContent {...restProps}>
      <Flex
        className="bg-dark-light rounded-sm px-1.5 w-fit"
        direction="row"
        align="center"
      >
        <AuctionSlotCardIdInfo slotId={auctionSlot.auctionSlotOrder} />
        <AuctionSlotCardContentInfoDivider />
        <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
        {winPercents
          && (
            <>
              <AuctionSlotCardContentInfoDivider />
              <AuctionSlotCardWinPercents winPercents={winPercents} />
            </>
          )}
      </Flex>
    </BaseAuctionSlotCardContent>
  )
}

export type SolidAuctionSlotCardProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents?: number
}

export const SolidAuctionSlotCard = (props: SolidAuctionSlotCardProps) => {
  const { auctionSlot, winPercents, ...restProps } = props

  return (
    <BaseAuctionSlotCard {...restProps}>
      <SolidAuctionSlotHeader
        slotTitle={auctionSlot.title}
      />
      <SolidAuctionSlotContent
        auctionSlot={auctionSlot}
        winPercents={winPercents}
      />
    </BaseAuctionSlotCard>
  )
}

export type SkeletonAuctionSlotCardProps = BaseAuctionSlotCardProps & {
  headerProps?: BaseAuctionSlotCardHeaderProps
  contentProps?: BaseAuctionSlotCardContentProps
}

export const SkeletonAuctionSlotCard = (props: SkeletonAuctionSlotCardProps) => {
  const { headerProps, contentProps, ...restProps } = props

  const isDeviceGreaterThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <BaseAuctionSlotCard {...restProps}>
      <BaseAuctionSlotCardHeader {...headerProps}>
        <Flex className="w-full gap-x-2" align="center">
          <Skeleton className="h-5 tablet:h-6" style={{ width: `${getRandomNumberInRange(60, 380)}px` }} />
        </Flex>
      </BaseAuctionSlotCardHeader>

      <BaseAuctionSlotCardContent {...contentProps}>
        <Flex
          className="w-fit"
          direction="row"
          align="center"
        >
          <Skeleton className="size-7.5 tablet:size-8 rounded-small" />
          {/* <AuctionSlotCardContentInfoWrapper icon={<Icons.Id size={isDeviceGreaterThenTablet ? 'sm' : 'xs'} />}>
            <Skeleton className="w-5 h-4.5 tablet:h-5 tablet:w-8" />
          </AuctionSlotCardContentInfoWrapper> */}
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardContentInfoWrapper icon={<Icons.Coin size={isDeviceGreaterThenTablet ? 'sm' : 'xs'} />}>
            <Skeleton className="h-4.5 tablet:h-5.25" style={{ width: `${getRandomNumberInRange(40, 68)}px` }} />
          </AuctionSlotCardContentInfoWrapper>
          <AuctionSlotCardContentInfoDivider />
          <AuctionSlotCardContentInfoWrapper icon={<Icons.Crown size={isDeviceGreaterThenTablet ? 'sm' : 'xs'} />}>
            <Skeleton className="h-4.5 tablet:h-5.25" style={{ width: `${getRandomNumberInRange(30, 45)}px` }} />
          </AuctionSlotCardContentInfoWrapper>
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
