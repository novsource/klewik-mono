'use client'

import { memo, useMemo } from 'react'
import { cn } from '~utils/cn'
import { SlotCard } from '../slot-card'

type SlotsListProps = {
	slots: Slot[]
	filterTitle?: string | null
}

export type Slot = {
	id: number
	title: string
	points: number
}

export const SlotsList = memo((props: SlotsListProps) => {
	const { slots, filterTitle } = props

	const showedSlots = useMemo(() => {
		return slots.map((slot) => {
			const isSlotPassFilter = filterTitle
				? slot.title.toLocaleLowerCase().includes(filterTitle.toLocaleLowerCase())
				: true

			return (
				<li className={cn(!isSlotPassFilter && 'hidden')} key={slot.id}>
					<SlotCard
						id={slot.id}
						name={slot.title}
						points={slot.points}
						percent={10}
						color="#FFF"
					/>
				</li>
			)
		})
	}, [filterTitle, slots])

	return (
		<ul className="flex flex-col gap-y-2 pb-4">
			{showedSlots}
		</ul>
	)
})
