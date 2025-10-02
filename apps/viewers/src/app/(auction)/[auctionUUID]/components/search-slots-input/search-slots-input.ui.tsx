'use client'

import type { InputProps } from '~ui/input'
import { MagnifierIcon } from '~ui/icons'
import { Input } from '~ui/input'

type SearchSlotsInputProps = InputProps

export const SearchSlotsInput = (props: SearchSlotsInputProps) => {
	return (
		<Input
			slotClassNames={{ base: 'min-w-[300px] max-w-[400px] grow' }}
			placeholder="Поиск по названию слота..."
			startContent={<MagnifierIcon className="text-gray" size="sm" />}
			{...props}
		/>
	)
}
