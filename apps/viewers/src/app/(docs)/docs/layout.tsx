import { Header } from '~ui/header'
import { docsPaths } from '~/constants'
import DocsSidebar from './components/docs-sidebar'
import { LinkedHeadersContextProvider } from './context'

export default function DocsLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex h-full w-full flex-col font-[family-name:var(--font-golos-text)]">
			<Header className="fixed top-0 left-1/2 -translate-x-1/2" />
			<main className="main_auction">
				<div className="relative container mx-auto flex h-full w-full py-4 pt-[calc(var(--header-height)+24px)]">
					<LinkedHeadersContextProvider>
						<div className="text-md tablet:text-[16px] flex h-full w-full flex-col px-4 shrink">
							{children}
						</div>
						<DocsSidebar className="tablet:block hidden pl-10" routes={docsPaths} />
					</LinkedHeadersContextProvider>
				</div>
			</main>
		</div>
	)
}
