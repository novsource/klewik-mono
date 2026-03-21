'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, use, useMemo, useState } from 'react'

type CreateCodeContextState = {
	state: {
		isPending: boolean
		isError: boolean
		isDialogOpen: boolean
		selectedSlot: AuctionSlot | null
		code: string
	}
	dispatch: {
		setIsDialogOpen: Dispatch<SetStateAction<boolean>>
		setSelectedSlot: Dispatch<SetStateAction<AuctionSlot | null>>
		setCode: Dispatch<SetStateAction<string>>
		setIsPending: Dispatch<SetStateAction<boolean>>
		setIsError: Dispatch<SetStateAction<boolean>>
	}
}

const CreateCodeContext = createContext<CreateCodeContextState>({
	state: {
		isError: false,
		isPending: false,
		selectedSlot: null,
		code: '',
		isDialogOpen: false,
	},
	dispatch: {
		setIsDialogOpen: () => ({}),
		setCode: () => ({}),
		setIsError: () => ({}),
		setIsPending: () => ({}),
		setSelectedSlot: () => ({}),
	},
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

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const [isError, setIsError] = useState(false)
	const [selectedSlot, setSelectedSlot] = useState<AuctionSlot | null>(null)
	const [code, setCode] = useState<string>('')

	const contextValue = useMemo<CreateCodeContextState>(() => ({
		state: {
			isError,
			isPending,
			isDialogOpen,
			code,
			selectedSlot,
		},
		dispatch: {
			setIsDialogOpen,
			setCode,
			setIsError,
			setIsPending,
			setSelectedSlot,
		},
	}), [selectedSlot, code, isError, isPending, isDialogOpen])

	return <CreateCodeContext value={contextValue}>{children}</CreateCodeContext>
}
