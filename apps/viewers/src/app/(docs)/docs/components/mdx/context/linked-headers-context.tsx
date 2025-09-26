'use client'

import type { ReactNode } from 'react'
import { createContext, use, useMemo, useState } from 'react'

type HeaderInViewItem = {
	id: string
	top: number
	bottom: number
}

export type LinkedHeadersContextState = {
	headersInView: HeaderInViewItem[]
	updateHeadersInView: (header: HeaderInViewItem) => void
	removeFromView: (headerId: HeaderInViewItem['id']) => void
}

const LinkedHeadersContext = createContext<LinkedHeadersContextState>({
	headersInView: [],
	updateHeadersInView: _ => ({}),
	removeFromView: _ => ({}),
})

export const useLinkedHeadersContext = () => {
	const context = use(LinkedHeadersContext)

	if (!context)
		throw new Error('You should use linked headers context inside provider')

	return context
}

type LinkedHeadersContextProviderProps = {
	children: ReactNode
}

type LinkedHeadersContextProviderValue = LinkedHeadersContextState & {
	updateHeadersInView: (header: HeaderInViewItem) => void
	removeFromView: (headerId: HeaderInViewItem['id']) => void
}

export const LinkedHeadersContextProvider = (props: LinkedHeadersContextProviderProps) => {
	const { children } = props

	const [headersInView, setHeadersInView] = useState<LinkedHeadersContextState['headersInView']>([])

	const updateHeadersInView = (headerToAdd: HeaderInViewItem) => {
		setHeadersInView((storedHeaders) => {
			const storedHeaderIndex = storedHeaders.findIndex(header => headerToAdd.id === header.id)
			const isHeaderAlreadyStored = storedHeaderIndex !== -1

			if (isHeaderAlreadyStored) {
				return [
					...storedHeaders.slice(0, storedHeaderIndex),
					headerToAdd,
					...storedHeaders.slice(storedHeaderIndex + 1),
				]
			}

			return [...storedHeaders, headerToAdd]
		})
	}

	const removeFromView = (headerId: HeaderInViewItem['id']) => {
		setHeadersInView((curr) => {
			return curr.filter(header => header.id !== headerId)
		})
	}

	const value = useMemo<LinkedHeadersContextProviderValue>(() => ({ headersInView, updateHeadersInView, removeFromView }), [headersInView])

	return <LinkedHeadersContext value={value}>{children }</LinkedHeadersContext>
}
