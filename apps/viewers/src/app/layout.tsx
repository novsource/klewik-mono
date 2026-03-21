import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import { AppHeader } from '~/components'
import './globals.css'

const golosText = Golos_Text({
	variable: '--font-golos-text',
	subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
	title: 'Просмотр аукционов | Klewik',
	description:
    'На этом сайте вы можете просмотреть актуальные, участвующие в аукционе стример',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru">
			<body className={`${golosText.variable} antialiased`}>
				<div className="flex flex-col h-full w-full font-[family-name:var(--font-golos-text)]">
					<AppHeader className="mb-2 tablet:mb-6" />
					{children}
				</div>
			</body>
		</html>
	)
}
