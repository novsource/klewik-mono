'use client'

import type { ReactNode } from 'react'
import { createContext, use, useMemo, useState } from 'react'

type HeaderItem = {
	id: string
	inView: boolean
}

export type LinkedHeadersContextState = {
	headers: HeaderItem[]
	headersInView: string[]
	addHeader: (header: HeaderItem) => void
	updateHeadersInView: (headerId: HeaderItem['id']) => void
	removeFromView: (headerId: HeaderItem['id']) => void
}

const LinkedHeadersContext = createContext<LinkedHeadersContextState>({
	headers: [],
	headersInView: [],
	addHeader: _ => ({}),
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
	updateHeadersInView: (headerId: HeaderItem['id']) => void
	removeFromView: (headerId: HeaderItem['id']) => void
}

export const LinkedHeadersContextProvider = (props: LinkedHeadersContextProviderProps) => {
	const { children } = props

	const [headers, setHeaders] = useState<HeaderItem[]>([])

	const addHeader = (header: HeaderItem) => {
		setHeaders(curr => [...curr, header])
	}

	const updateHeadersInView = (headerId: HeaderItem['id']) => {
		setHeaders((storedHeaders) => {
			const storedHeaderIndex = storedHeaders.findIndex(header => headerId === header.id)
			const isHeaderAlreadyStored = storedHeaderIndex !== -1

			if (isHeaderAlreadyStored) {
				return [
					...storedHeaders.slice(0, storedHeaderIndex),
					{ id: headerId, inView: true },
					...storedHeaders.slice(storedHeaderIndex + 1),
				]
			}

			return [...storedHeaders, { id: headerId, inView: true }]
		})
	}

	const removeFromView = (headerId: HeaderItem['id']) => {
		setHeaders((curr) => {
			return curr.map((header) => {
				if (header.id === headerId)
					return { id: headerId, inView: false }

				return header
			})
		})
	}

	const headersInView = useMemo(() => headers.reduce<string[]>((acc, header) => {
		if (header.inView)
			acc.push(header.id)

		return acc
	}, []), [headers])

	const contextValue = useMemo<LinkedHeadersContextProviderValue>(() => ({
		headers,
		headersInView,
		addHeader,
		updateHeadersInView,
		removeFromView,
	}), [headers, headersInView])

	return <LinkedHeadersContext value={contextValue}>{children}</LinkedHeadersContext>
}
