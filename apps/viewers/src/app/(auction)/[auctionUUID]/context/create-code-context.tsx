'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, use, useMemo, useState } from 'react'

type CreateCodeContextState = {
	selectedSlot: AuctionSlot | null
	setSelectedSlot: Dispatch<SetStateAction<AuctionSlot | null>>
	code: ''
}

const CreateCodeContext = createContext<CreateCodeContextState>({
	selectedSlot: null,
	setSelectedSlot: _ => ({}),
	code: '',
})

export const useCreateCodeContext = () => {
	const context = use(CreateCodeContext)

	if (!context)
		throw new Error('You should use context inside provider')

	return context
}

type CreateCodeContextProviderProps = {
	children: ReactNode
}

export const CreateCodeContextProvider = (props: CreateCodeContextProviderProps) => {
	const { children } = props

	const [selectedSlot, setSelectedSlot] = useState<CreateCodeContextState['selectedSlot']>(null)
	const [code, setCode] = useState<CreateCodeContextState['code']>('')

	const contextValue = useMemo<CreateCodeContextState>(() => ({
		code,
		selectedSlot,
		setSelectedSlot,
	}), [selectedSlot, code])

	return <CreateCodeContext value={contextValue}>{children}</CreateCodeContext>
}
