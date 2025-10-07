'use client'

import type { ComponentProps } from 'react'
import type { ButtonProps } from '~ui/button'
import type {
	BaseAuctionSlotCardProps,
} from '../slot-card'
import { memo, useEffect, useRef, useState, useTransition } from 'react'
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
	triggerProps?: ButtonProps
}

const AuctionSlotCard = memo((props: AuctionSlotCardProps) => {
	const { auctionSlot, triggerProps, className, ...restProps } = props

	return (
		<BaseAuctionSlotCard className={cn('flex-row items-end', className)} {...restProps}>
			<Flex className="pr-4 gap-y-2" direction="column">
				<SolidAuctionSlotHeader
					slotColor="#FFF"
					slotTitle={auctionSlot.title}
					slotId={auctionSlot.auctionSlotOrder}
				/>
				<SolidAuctionSlotContent auctionSlot={auctionSlot} winPercents={10} />
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
		if (!filterTitle)
			return slots

		return slots.filter(slot => slot.title
			.toLowerCase()
			.includes(filterTitle.toLowerCase()))
	})

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
			{showedSlots.map((slot, index) => (
				<li key={slot.id + index}>
					<AuctionSlotCard
						auctionSlot={slot}
						triggerProps={{
							onClick: () => setSlot(slot),
						}}
					/>
				</li>
			))}
		</Flex>
	)
})
