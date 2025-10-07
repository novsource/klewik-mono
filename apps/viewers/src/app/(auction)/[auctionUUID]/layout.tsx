import type { ReactNode } from 'react'
import { AppContextProvider } from '~context/app-context'
import { SearchProvider } from '~context/search-bar-context'
import { CreateCodeContextProvider } from './context'

export default function AuctionLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<AppContextProvider>
			<CreateCodeContextProvider>
				<SearchProvider>{children}</SearchProvider>
			</CreateCodeContextProvider>
		</AppContextProvider>
	)
}
