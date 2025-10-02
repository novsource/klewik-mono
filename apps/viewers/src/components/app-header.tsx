import type { HeaderProps } from '~ui/header'
import { Button } from '~ui/button'

import { Divider } from '~ui/divider'
import { Header } from '~ui/header'
import { Icons } from '~ui/icons'

export type AppHeaderProps = HeaderProps

export const AppHeader = (props: AppHeaderProps) => {
	return (
		<Header {...props}>
			<div className="h-full w-full pt-2.5">
				<div className="border-gray/20 rounded-medium bg-dark/30 relative z-20 flex h-full w-full items-center justify-between gap-x-4 border-1 px-4 py-4 tablet:py-2 backdrop-blur-md">
					<Icons.KlewikLogo className="text-green-accent" size="lg" />

					<div className="flex h-full items-center">
						<a className="flex items-center text-gray-light hover:text-white size-6 transition-colors" href="https://github.com/novsource/klewik-viewers">
							<Icons.GithubLogo size="sm" />
						</a>
						<Divider className="mx-4" orientation="vertical" />
						<Button
							className="text-gray-light hover:text-white px-0 size-6 transition-colors"
							variant="ghost"
							isIconOnly
							icon={<Icons.Hamburger />}
						/>
					</div>

				</div>
			</div>
		</Header>
	)
}
