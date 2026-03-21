import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { AutocompleteTag } from '../ui/autocomplete.ui'
import { createContext, use, useEffect, useMemo, useState } from 'react'

type AutocompleteContextState = {
	items: readonly AutocompleteTag[]
	query: string
	setQuery: Dispatch<SetStateAction<string>>
}

const AutocompleteContext = createContext<AutocompleteContextState>({ query: '', items: [], setQuery: () => ({}) })

export const useAutocompleteContext = () => {
	const context = use(AutocompleteContext)

	if (!context)
		throw new Error('You should use context inside provider')

	return context
}

export type AutocompleteContextProviderProps = {
	query?: string
	items: AutocompleteTag[]
	children: ReactNode
}

export const AutocompleteContextProvider = (props: AutocompleteContextProviderProps) => {
	const { items, query: propsQuery, children } = props

	const [query, setQuery] = useState(propsQuery ?? '')
	const [autocompleteItems, setAutocompleteItems] = useState(items ?? [])

	useEffect(() => {
		setAutocompleteItems(items)
	}, [items])

	const contextValue = useMemo<AutocompleteContextState>(() => ({
		query,
		items: autocompleteItems,
		setQuery,
	}), [autocompleteItems, query])

	return <AutocompleteContext value={contextValue}>{children}</AutocompleteContext>
}
