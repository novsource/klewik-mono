'use client'

import type {
	ReactNode,
} from 'react'
import {
	createContext,
	use,
	useCallback,
	useState,
} from 'react'

type ViewState = {
	entry: IntersectionObserverEntry | null
	inView: boolean
}

type AppContextState = {
	state: Record<'title' | 'integrations' | 'searchBar', ViewState>
	dispatchers?: Record<
    'title' | 'integrations' | 'searchBar',
    (data: ViewState) => void
	>
}

const appContextInitValue: AppContextState = {
	state: {
		integrations: {
			inView: false,
			entry: null,
		},
		searchBar: {
			inView: false,
			entry: null,
		},
		title: {
			inView: false,
			entry: null,
		},
	},
}

const AppContext = createContext(appContextInitValue)

export const useAppContext = () => {
	const context = use(AppContext)

	if (!context) {
		throw new Error('You should use context inside provider')
	}

	return context
}

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [viewState, setViewState] = useState(appContextInitValue)

	const setTitleView = useCallback((data: ViewState) => {
		setViewState(prev => ({ state: { ...prev.state, title: data } }))
	}, [])

	const setIntegrationView = useCallback((data: ViewState) => {
		setViewState(prev => ({ state: { ...prev.state, integrations: data } }))
	}, [])

	const setSearchBarView = useCallback((data: ViewState) => {
		setViewState(prev => ({ state: { ...prev.state, searchBar: data } }))
	}, [])

	return (
		<AppContext
			value={{
				state: { ...viewState.state },
				dispatchers: {
					integrations: setIntegrationView,
					title: setTitleView,
					searchBar: setSearchBarView,
				},
			}}
		>
			{children}
		</AppContext>
	)
}
