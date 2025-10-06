import type { NumberFlowProps } from '@number-flow/react'

import type { ComponentProps, ReactNode } from 'react'
import { forwardRef } from 'react'

import NumberFlow from '@number-flow/react'

import type { AuctionSlot } from '~entities/auction-slot/model'

import { greaterThenDeviceWidthMediaQueries, tailwindScreens } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

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
import { Skeleton } from '~shared/ui/skeleton'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

export type BaseAuctionSlotCardProps = CardProps

export const BaseAuctionSlotCard = forwardRef<HTMLDivElement, BaseAuctionSlotCardProps>(
  (props, forwardRef) => {
    const { className, ...restProps } = props

    return (
      <Card
        ref={forwardRef}
        data-slot="base"
        className={cn([
          'flex flex-col justify-between gap-y-1 border-1 border-dark-light pt-1 pb-2',
          'tablet:py-2 tablet:gap-y-2',
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
    <Typography
      className={cn('text-md font-bold tablet:text-title', className)}
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

export type AuctionSlotCardContentInfoWrapperProps = ComponentProps<'div'> & {
  icon?: ReactNode
}

export const AuctionSlotCardContentInfoWrapper = (props: AuctionSlotCardContentInfoWrapperProps) => {
  const { icon, children, className, ...restProps } = props

  return (
    <Flex
      className={cn([
        'h-7 gap-y-0.5 gap-x-0.75',
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
  numberFlowProps?: NumberFlowProps
}

export const AuctionSlotCardWinPercents = (props: AuctionSlotCardWinPercentsProps) => {
  const { winPercents, numberFlowProps, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(tailwindScreens.tablet)

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
        className="text-green font-golos-f font-semibold text-sm tablet:text-md tablet:leading-4"
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

  const isLargeThenTablet = useMediaQuery(tailwindScreens.tablet)

  return (
    <AuctionSlotCardContentInfoWrapper
      icon={<Icons.Coin size={isLargeThenTablet ? 'default' : 'sm'} />}
      {...restProps}
    >
      <NumberFlow
        className="font-golos-f font-semibold text-gray-accent text-sm tablet:text-md tablet:leading-4"
        willChange
        trend={0}
        value={slotPoints}
        locales="ru-RU"
        {...numberFlowProps}
      />
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
      <Typography className="font-golos-f font-semibold text-gray-accent text-sm tablet:text-md tablet:leading-4" tag="span">
        {slotId}
      </Typography>
    </AuctionSlotCardContentInfoWrapper>
  )
}

export type SolidAuctionSlotHeaderProps = BaseAuctionSlotCardHeaderProps & {
  slotId: AuctionSlot['id']
  slotTitle: AuctionSlot['title']
  slotColor: AuctionSlot['color']
}

export const SolidAuctionSlotHeader = (props: SolidAuctionSlotHeaderProps) => {
  const { slotId, slotTitle, slotColor, ...restProps } = props

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
        <AuctionSlotCardIdInfo slotId={auctionSlot.id} />
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
        slotId={auctionSlot.id}
        slotTitle={auctionSlot.title}
        slotColor={auctionSlot.color}
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
          <Skeleton className="w-8.5 h-5.5 max-tablet:h-4.5" />
        </Flex>
      </BaseAuctionSlotCardHeader>
      <BaseAuctionSlotCardContent {...contentProps}>
        <Flex
          className="w-full gap-x-2.5 tablet:gap-x-3.5"
          direction="row"
          align="end"
        >
          <AuctionSlotCardContentInfoWrapper
            icon={<Icons.Coin size={isDeviceGreaterThenTablet ? 'lg' : 'default'} />}
          >
            <Skeleton className="w-20 h-6" />
          </AuctionSlotCardContentInfoWrapper>
          <AuctionSlotCardContentInfoWrapper
            icon={(
              <Icons.Crown
                size={isDeviceGreaterThenTablet ? 'lg' : 'default'}
              />
            )}
          >
            <Skeleton className="w-9 h-6.5 max-tablet:w-16 max-tablet:h-5.25" />
          </AuctionSlotCardContentInfoWrapper>
        </Flex>
      </BaseAuctionSlotCardContent>
    </BaseAuctionSlotCard>
  )
}
