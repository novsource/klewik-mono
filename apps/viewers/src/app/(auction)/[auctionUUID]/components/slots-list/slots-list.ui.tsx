'use client'

import type { ComponentProps } from 'react'
import type { ButtonProps } from '~ui/button'
import type {
	BaseAuctionSlotCardProps,
} from '../slot-card'
import { memo, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Button } from '~ui/button'
import { Flex } from '~ui/flex'
import { Icons } from '~ui/icons'
import { cn } from '~utils/cn'
import {
	BaseAuctionSlotCard,
	SolidAuctionSlotContent,
	SolidAuctionSlotHeader,
} from '../slot-card'

type AuctionSlotCardProps = BaseAuctionSlotCardProps & {
	auctionSlot: AuctionSlot
	winPercent: number
	triggerProps?: ButtonProps
}

const AuctionSlotCard = memo((props: AuctionSlotCardProps) => {
	const { auctionSlot, triggerProps, className, winPercent, ...restProps } = props

	return (
		<BaseAuctionSlotCard className={cn('flex-row items-end', className)} {...restProps}>
			<Flex className="pr-4 gap-y-2" direction="column">
				<SolidAuctionSlotHeader
					slotColor="#FFF"
					slotTitle={auctionSlot.title}
					slotId={auctionSlot.auctionSlotOrder}
				/>
				<SolidAuctionSlotContent auctionSlot={auctionSlot} winPercents={winPercent} />
			</Flex>
			<Button
				variant="action"
				isIconOnly
				icon={<Icons.Plus />}
				size="xs"
				{...triggerProps}
			/>
		</BaseAuctionSlotCard>
	)
})

type SlotsListProps = ComponentProps<'ul'> & {
	slots: AuctionSlot[]
	setSlot: (slot: AuctionSlot) => void
	filterTitle?: string | null
}

export const SlotsList = memo((props: SlotsListProps) => {
	const {
		slots,
		setSlot,
		filterTitle,
		className,
		...restProps
	} = props

	const [showedSlots, setShowedSlots] = useState(() => {
		const sortedSlots = slots.sort((a, b) => b.points - a.points)

		if (!filterTitle)
			return sortedSlots

		return sortedSlots.filter(slot => slot.title
			.toLowerCase()
			.includes(filterTitle.toLowerCase()))
	})

	const pointsSum = useMemo(() => {
		return showedSlots.reduce((sum, slot) => sum + slot.points, 0)
	}, [showedSlots])

	const [isPending, startTransition] = useTransition()

	const prevFilterTitleRef = useRef(filterTitle)

	useEffect(() => {
		if (prevFilterTitleRef.current === filterTitle)
			return

		if (!filterTitle) {
			prevFilterTitleRef.current = filterTitle
			return setShowedSlots(slots)
		}

		startTransition(() => {
			const filtredByTitleSlots = showedSlots.filter(
				slot => slot.title
					.toLocaleLowerCase()
					.includes(filterTitle.toLocaleLowerCase()),
			)

			prevFilterTitleRef.current = filterTitle
			setShowedSlots(filtredByTitleSlots)
		})
	}, [filterTitle, showedSlots, slots])

	return (
		<Flex
			as="ul"
			direction="column"
			className={cn(
				'relative gap-y-1.5 tablet:gap-y-2 pb-4',
				isPending && 'after:w-full after:h-full after:bg-dark/10 after:absolute after:top-0',
				className,
			)}
			{...restProps}
		>
			{showedSlots.map((slot) => {
				const winPercent = (slot.points / pointsSum) * 100
				return (
					<li key={slot.title}>
						<AuctionSlotCard
							auctionSlot={slot}
							winPercent={winPercent}
							triggerProps={{
								onClick: () => setSlot(slot),
							}}
						/>
					</li>
				)
			})}
		</Flex>
	)
})
