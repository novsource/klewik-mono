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
	const { dispatch: { setSelectedSlot, setIsDialogOpen } } = useCreateCodeContext()

	const searchInput = useMemo(() => {
		return (
			<SearchSlotsInput
				ref={inputRef}
				onChange={e => setSearchText(e.target.value)}
			/>
		)
	}, [inputRef, setSearchText])

	const handleSelectSlot = (slot: AuctionSlot) => {
		setSelectedSlot(slot)
		setIsDialogOpen(true)
	}

	return (
		<div className="flex h-full flex-col gap-y-4 px-0.5 mb-4">
			<div className="flex w-full justify-between max-tablet:flex-col max-tablet:gap-y-1">
				{searchInput}
			</div>
			<SlotsList
				slots={slots}
				filterTitle={searchText}
				setSlot={handleSelectSlot}
			/>
		</div>
	)
})
