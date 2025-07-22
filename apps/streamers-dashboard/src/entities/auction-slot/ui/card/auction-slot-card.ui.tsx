import type { NumberFlowProps } from '@number-flow/react'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'

import NumberFlow from '@number-flow/react'

import type { AuctionSlot } from '~entities/auction-slot/model'

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

export type AuctionSlotCardProps = CardProps

export const AuctionSlotCard = forwardRef<HTMLDivElement, AuctionSlotCardProps>(
  (props, forwardRef) => {
    const { className, ...restProps } = props

    return (
      <Card
        ref={forwardRef}
        className={cn(
          'flex flex-col justify-between gap-y-2.5 border-1 border-dark-light py-1 tablet:py-2 tablet:gap-y-0',
          className,
        )}
        {...restProps}
      />
    )
  },
)

export type AuctionSlotCardHeaderProps = ComponentProps<'div'>

export const AuctionSlotCardHeader = (props: AuctionSlotCardHeaderProps) => {
  const { className, ...restProps } = props

  return (
    <CardHeader className={cn('flex flex-col gap-y-2.5 items-start justify-between', className)} {...restProps} />
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
      tag="span"
      className={cn('text-title font-bold tablet:text-title-lg', className)}
    >
      {slotTitle}
    </Typography>
  )
}

export type AuctionSlotCardTitleProps = ComponentProps<'div'>

export const AuctionSlotCardTitle = (props: AuctionSlotCardTitleProps) => {
  const { className, ...restProps } = props

  return (
    <CardTitle className={cn('w-full', className)} {...restProps} />
  )
}

export type AuctionSlotCardContentProps = ComponentProps<'div'>

export const AuctionSlotCardContent = (props: AuctionSlotCardContentProps) => {
  const { className, ...restProps } = props

  return <CardContent className={cn('flex flex-row w-full gap-y-2 pt-0 space-y-0', className)} {...restProps} />
}

export type AuctionSlotCardContentInfoProps = ComponentProps<'div'> & {
  icon?: ReactNode
}

export const AuctionSlotCardContentInfo = (props: AuctionSlotCardContentInfoProps) => {
  const { icon, children, className, ...restProps } = props

  return (
    <Flex
      className={cn('h-7 gap-y-0.5 tablet:flex-row tablet:gap-x-2 tablet:items-center tablet:justify-start', className)}
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

  return (
    <AuctionSlotCardContentInfo icon={<Icons.Crown size="lg" />} {...restProps}>
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
    </AuctionSlotCardContentInfo>
  )
}

export type AuctionSlotCardColorInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  slotColor: AuctionSlot['color']
}

export const AuctionSlotCardColorInfo = (props: AuctionSlotCardColorInfoProps) => {
  const { slotColor, ...restProps } = props

  return (
    <AuctionSlotCardContentInfo {...restProps}>
      <div
        className="rounded-full w-9 h-3.5"
        style={{
          backgroundColor: Array.isArray(slotColor)
            ? `rgb(${slotColor.join(',')})`
            : slotColor,
        }}
      />
    </AuctionSlotCardContentInfo>
  )
}

export type AuctionSlotCardPointsInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
  slotPoints: number
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardPointsInfo = (props: AuctionSlotCardPointsInfoProps) => {
  const { slotPoints, numberFlowProps, ...restProps } = props

  return (
    <AuctionSlotCardContentInfo icon={<Icons.Coin size="lg" />} {...restProps}>
      <NumberFlow
        className="font-golos-f font-semibold text-gray-accent text-md tablet:text-title tablet:leading-4"
        willChange
        trend={0}
        value={slotPoints}
        locales="ru-RU"
        {...numberFlowProps}
      />
    </AuctionSlotCardContentInfo>
  )
}

export type AuctionSlotCardIdBadgeProps = Omit<BadgeProps, 'children'> & {
  slotId: AuctionSlot['id']
}

export const AuctionSlotCardIdBadge = (props: AuctionSlotCardIdBadgeProps) => {
  const { className, slotId, ...restProps } = props

  return (
    <Badge className={cn('px-1.5 py-0.25 bg-dark-light border-1 border-dark-accent', className)} {...restProps}>
      <Typography className="font-golos-f text-gray-light rounded-md text-sm" tag="span">
        {`ID: ${slotId}`}
      </Typography>
    </Badge>
  )
}

export type SolidAuctionSlotHeaderProps = AuctionSlotCardHeaderProps & {
  slotId: AuctionSlot['id']
  slotTitle: AuctionSlot['title']
}

export const SolidAuctionSlotHeader = (props: SolidAuctionSlotHeaderProps) => {
  const { slotId, slotTitle, ...restProps } = props

  return (
    <AuctionSlotCardHeader {...restProps}>
      <Flex className="w-full" justify="between">
        <AuctionSlotCardIdBadge slotId={slotId} />
      </Flex>
      <AuctionSlotCardTitle>
        <AuctionSlotCardTitleInfo slotTitle={slotTitle} />
      </AuctionSlotCardTitle>
    </AuctionSlotCardHeader>
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
        className="w-full mobile:gap-x-5"
        direction="row"
        align="end"
      >
        <AuctionSlotCardColorInfo slotColor={auctionSlot.color} />
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
    <AuctionSlotCard className={cn(className)} {...restProps}>
      <SolidAuctionSlotHeader slotId={auctionSlot.id} slotTitle={auctionSlot.title} />
      <SolidAuctionSlotContent className="min-h-11" auctionSlot={auctionSlot} winPercents={winPercents} />
    </AuctionSlotCard>
  )
}
