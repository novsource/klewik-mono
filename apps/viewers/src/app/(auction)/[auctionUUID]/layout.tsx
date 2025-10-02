import type { ReactNode } from 'react'
import { AppContextProvider } from '~context/app-context'
import { SearchProvider } from '~context/search-bar-context'

export default function AuctionLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<AppContextProvider>
			<SearchProvider>{children}</SearchProvider>
		</AppContextProvider>
	)
}
