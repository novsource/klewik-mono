import type { NumberFlowProps } from '@number-flow/react'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'

import NumberFlow from '@number-flow/react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import type { BadgeProps } from '~shared/ui/badge'
import { Badge } from '~shared/ui/badge'
import type {
  CardProps,
} from '~shared/ui/card'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'
import { hexToRgba } from '~shared/utils/colors'

export type BaseAuctionSlotCardProps = CardProps

export const BaseAuctionSlotCard = forwardRef<HTMLDivElement, BaseAuctionSlotCardProps>(
  (props, forwardRef) => {
    const { className, ...restProps } = props

    return (
      <Card
        ref={forwardRef}
        data-slot="base"
        className={cn(
          'flex flex-col justify-between gap-y-1 border-1 border-dark-light py-1 tablet:py-2 tablet:gap-y-0',
          className,
        )}
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
      className={cn('flex flex-col gap-y-1 tablet:gap-y-2.5 items-center justify-between', className)}
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
    <Typography
      className={cn('text-md font-bold tablet:text-title-lg', className)}
      tag="span"
    >
      {slotTitle}
    </Typography>
  )
}

export type BaseAuctionSlotCardTitleProps = ComponentProps<'div'>

export const BaseAuctionSlotCardTitle = (props: BaseAuctionSlotCardTitleProps) => {
  const { className, ...restProps } = props

  return (
    <CardTitle className={cn('w-full', className)} {...restProps} />
  )
}

export type AuctionSlotCardContentProps = ComponentProps<'div'>

export const AuctionSlotCardContent = (props: AuctionSlotCardContentProps) => {
  const { className, ...restProps } = props

  return (
    <CardContent
      className={cn('flex flex-row w-full gap-y-2 pt-0 space-y-0', className)}
      data-slot="content"
      {...restProps}
    />
  )
}

export type AuctionSlotCardContentInfoWrapperProps = ComponentProps<'div'> & {
  icon?: ReactNode
}

export const AuctionSlotCardContentInfoWrapper = (props: AuctionSlotCardContentInfoWrapperProps) => {
  const { icon, children, className, ...restProps } = props

  return (
    <Flex
      className={cn('h-7 gap-y-0.5 tablet:flex-row gap-x-0.75 tablet:gap-x-2 tablet:items-center tablet:justify-start', className)}
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
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardWinPercents = (props: AuctionSlotCardWinPercentsProps) => {
  const { winPercents, numberFlowProps, ...restProps } = props

  const isDeviceGreaterThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={(
        <Icons.Crown
          size={isDeviceGreaterThenTablet ? 'lg' : 'default'}
        />
      )}
      {...restProps}
    >
      <NumberFlow
        className="text-green font-golos-f font-semibold text-md tablet:text-title"
        willChange
        trend={0}
        value={winPercents}
        format={{
          notation: 'compact',
          compactDisplay: 'short',
        }}
        locales="ru-RU"
        suffix="%"
        {...numberFlowProps}
      />
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type AuctionSlotCardPointsInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  slotPoints: number
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardPointsInfo = (props: AuctionSlotCardPointsInfoProps) => {
  const { slotPoints, numberFlowProps, ...restProps } = props

  const isDeviceGreaterThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={<Icons.Coin size={isDeviceGreaterThenTablet ? 'lg' : 'default'} />}
      {...restProps}
    >
      <NumberFlow
        className="font-golos-f font-semibold text-gray-accent text-md tablet:text-title tablet:leading-4"
        willChange
        trend={0}
        value={slotPoints}
        locales="ru-RU"
        {...numberFlowProps}
      />
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type AuctionSlotCardIdBadgeProps = Omit<BadgeProps, 'children'> & {
  slotId: AuctionSlot['id']
}

export const AuctionSlotCardIdBadge = (props: AuctionSlotCardIdBadgeProps) => {
  const { className, slotId, ...restProps } = props

  return (
    <Badge
      className={cn('px-1.5 py-0.25 bg-dark-light border-1 border-dark-accent text-gray-light', className)}
      {...restProps}
    >
      <Typography className="font-golos-f rounded-md text-xs tablet:text-sm" tag="span">
        {`ID: ${slotId}`}
      </Typography>
    </Badge>
  )
}

export type SolidAuctionSlotHeaderProps = BaseAuctionSlotCardHeaderProps & {
  slotId: AuctionSlot['id']
  slotTitle: AuctionSlot['title']
  slotColor: AuctionSlot['color']
}

export const SolidAuctionSlotHeader = (props: SolidAuctionSlotHeaderProps) => {
  const { slotId, slotTitle, slotColor, ...restProps } = props

  const badgeStyle = useMemo(() => {
    const bgColor = hexToRgba(slotColor, 0.025) || ''
    const borderColor = hexToRgba(slotColor, 0.35) || ''

    return {
      backgroundColor: bgColor,
      borderColor,
      color: slotColor,
    }
  }, [slotColor])

  return (
    <BaseAuctionSlotCardHeader {...restProps}>
      <Flex className="w-full gap-x-2" align="center">
        <AuctionSlotCardIdBadge
          slotId={slotId}
          style={badgeStyle}
        />
      </Flex>
      <BaseAuctionSlotCardTitle>
        <AuctionSlotCardTitleInfo slotTitle={slotTitle} />
      </BaseAuctionSlotCardTitle>
    </BaseAuctionSlotCardHeader>
  )
}

export type SolidAuctionSlotContentProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents?: number
}

export const SolidAuctionSlotContent = (props: SolidAuctionSlotContentProps) => {
  const { auctionSlot, winPercents, ...restProps } = props

  return (
    <AuctionSlotCardContent {...restProps}>
      <Flex
        className="w-full gap-x-3 tablet:gap-x-5"
        direction="row"
        align="end"
      >
        <AuctionSlotCardPointsInfo slotPoints={auctionSlot.points} />
        {winPercents && <AuctionSlotCardWinPercents winPercents={winPercents} />}
      </Flex>
    </AuctionSlotCardContent>
  )
}

export type SolidAuctionSlotCardProps = CardProps & {
  auctionSlot: AuctionSlot
  winPercents?: number
}

export const SolidAuctionSlotCard = (props: SolidAuctionSlotCardProps) => {
  const { className, auctionSlot, winPercents, ...restProps } = props

  return (
    <BaseAuctionSlotCard className={cn(className)} {...restProps}>
      <SolidAuctionSlotHeader
        slotId={auctionSlot.id}
        slotTitle={auctionSlot.title}
        slotColor={auctionSlot.color}
      />
      <SolidAuctionSlotContent
        className="min-h-11"
        auctionSlot={auctionSlot}
        winPercents={winPercents}
      />
    </BaseAuctionSlotCard>
  )
}
