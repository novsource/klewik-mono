import type { ComponentProps, ReactNode } from 'react'
import type {
	CardContentProps,
	CardHeaderProps,
	CardProps,
	CardTitleProps,
} from '~ui/card'

import { useMediaQuery } from '~hooks/index'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '~ui/card'
import { Flex } from '~ui/flex'
import { Icons } from '~ui/icons'
import { Typography } from '~ui/typography'
import { cn } from '~utils/cn'
import { formatNumberToIntlString } from '~utils/format-number'
import { greaterThenDeviceWidthMediaQueries } from '~/constants'

export type BaseAuctionSlotCardProps = CardProps & { ref?: React.RefObject<HTMLDivElement | null> }

export const BaseAuctionSlotCard = (props: BaseAuctionSlotCardProps) => {
	const { ref, className, ...restProps } = props

	return (
		<Card
			ref={ref}
			data-slot="base"
			className={cn([
				'flex flex-col justify-between gap-y-1.5 border-1 border-dark-light pt-1 pb-2',
				'tablet:py-2 tablet:gap-y-2',
			], className)}
			{...restProps}
		/>
	)
}

export type BaseAuctionSlotCardHeaderProps = CardHeaderProps

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

export type BaseAuctionSlotCardTitleProps = CardTitleProps

export const BaseAuctionSlotCardTitle = (props: BaseAuctionSlotCardTitleProps) => {
	const { className, ...restProps } = props

	return (
		<CardTitle className={cn('w-full', className)} {...restProps} />
	)
}

export type BaseAuctionSlotCardContentProps = CardContentProps

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
				<Flex className=" text-gray-light gap-x-1" align="center">
					{icon}
				</Flex>
			)}
			{children}
		</Flex>
	)
}

export type AuctionSlotCardWinPercentsProps = Omit<ComponentProps<'div'>, 'children'> & {
	winPercents: number
}

export const AuctionSlotCardWinPercents = (props: AuctionSlotCardWinPercentsProps) => {
	const { winPercents, ...restProps } = props

	const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

	return (
		<AuctionSlotCardContentInfoWrapper
			icon={(
				<Icons.Crown
					size={isLargeThenTablet ? 'default' : 'sm'}
				/>
			)}
			{...restProps}
		>
			<span className="text-green font-golos-f font-semibold text-sm tablet:text-md tablet:leading-4">
				{formatNumberToIntlString(winPercents)}
				%
			</span>
		</AuctionSlotCardContentInfoWrapper>
	)
}

export type AuctionSlotCardPointsInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
	slotPoints: number
}

export const AuctionSlotCardPointsInfo = (props: AuctionSlotCardPointsInfoProps) => {
	const { slotPoints, ...restProps } = props

	const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

	return (
		<AuctionSlotCardContentInfoWrapper
			icon={<Icons.SlotCoin size={isLargeThenTablet ? 'default' : 'sm'} />}
			{...restProps}
		>
			<span className="font-golos-f font-semibold text-gray-accent text-sm tablet:text-md tablet:leading-4">
				{formatNumberToIntlString(slotPoints)}
			</span>
		</AuctionSlotCardContentInfoWrapper>
	)
}

export type AuctionSlotCardIdInfoProps = Omit<ComponentProps<'div'>, 'children'> & {
	slotId: number
}

export const AuctionSlotCardIdInfo = (props: AuctionSlotCardIdInfoProps) => {
	const { slotId, ...restProps } = props

	const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

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

export type SolidAuctionSlotHeaderProps = Omit<BaseAuctionSlotCardHeaderProps, 'children'> & {
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

export type SolidAuctionSlotContentProps = Omit<BaseAuctionSlotCardContentProps, 'children'> & {
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

export type SolidAuctionSlotCardProps = BaseAuctionSlotCardProps & {
	auctionSlot: AuctionSlot
	winPercents?: number
}

export const SolidAuctionSlotCard = (props: SolidAuctionSlotCardProps) => {
	const { auctionSlot, winPercents, ...restProps } = props

	return (
		<BaseAuctionSlotCard {...restProps}>
			<SolidAuctionSlotHeader
				slotId={auctionSlot.auctionSlotOrder}
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
