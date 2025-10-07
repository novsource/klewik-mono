'use client'

import { memo, useMemo } from 'react'
import { useSearchContext } from '~context/search-bar-context'
import { SearchSlotsInput } from '../../components/search-slots-input'
import { SlotsList } from '../../components/slots-list/'
import { useCreateCodeContext } from '../../context'

type ControlledSlotsProps = {
	slots: AuctionSlot[]
}

export const FiltredSlotsList = memo((
	props: ControlledSlotsProps,
) => {
	const { slots } = props

	const { inputRef, setSearchText, searchText } = useSearchContext()
	const { setSelectedSlot } = useCreateCodeContext()

	const showedSlots = useMemo(() =>
		Array.from({ length: 300 })
			.fill(slots[0]) as AuctionSlot[], [slots])

	const searchInput = useMemo(() => {
		return (
			<SearchSlotsInput
				ref={inputRef}
				onChange={e => setSearchText(e.target.value)}
			/>
		)
	}, [inputRef, setSearchText])

	return (
		<div className="flex h-full flex-col gap-y-4 px-0.5 mb-4">
			<div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
				{searchInput}
			</div>
			<SlotsList
				slots={showedSlots}
				filterTitle={searchText}
				setSlot={setSelectedSlot}
			/>
		</div>
	)
})
