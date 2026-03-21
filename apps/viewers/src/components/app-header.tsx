import type { HeaderProps } from '~ui/header'

import Link from 'next/link'
import { Divider } from '~ui/divider'
import { Header } from '~ui/header'
import { Icons } from '~ui/icons'
import { cn } from '~utils/cn'

export type AppHeaderProps = HeaderProps

export const AppHeader = (props: AppHeaderProps) => {
	const { className, ...restProps } = props

	return (
		<Header
			className={cn(
				'border-b-dark-light border-b-1 bg-dark-foreground/30 backdrop-blur-sm sticky top-0',
				className,
			)}
			{...restProps}
		>
			<div className="container h-full w-full">
				<div className="relative flex h-full w-full items-center justify-between gap-x-4 tablet:px-4 py-2">
					<Icons.KlewikLogo className="text-green-accent" size="lg" />
					<div className="flex h-full items-center">
						<Link
							className="flex items-center gap-x-1.5 text-sm font-medium text-gray-light hover:text-dark-white transition-colors hover:underline underline-offset-5"
							href="/docs"
							target="_blank"
						>
							Документация
							<Icons.LinkArrow size="xs" />
						</Link>
						<Divider className="mx-4" orientation="vertical" />
						<Link
							className="flex items-center text-gray-light hover:text-dark-white size-6 transition-colors"
							href="https://github.com/novsource/klewik-viewers"
						>
							<Icons.GithubLogo size="sm" />
						</Link>
					</div>
				</div>
			</div>
		</Header>
	)
}
