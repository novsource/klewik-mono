'use client'

import { useAppContext } from '~context/app-context'
import { useSearchContext } from '~context/search-bar-context'
import { Button } from '~ui/button'
import { Header } from '~ui/header'
import { MagnifierIcon } from '~ui/icons'
import { Typography } from '~ui/typography'
import { cn } from '~utils/cn'

type AuctionHeaderProps = {
	title: string
	createAt: string
}

const AuctionHeader = ({
	title: auctionTitle,
	createAt,
}: AuctionHeaderProps) => {
	const {
		state: { searchBar, title },
	} = useAppContext()
	const { inputRef } = useSearchContext()

	return (
		<Header
			className={cn('')}
			style={{
				borderColor: `rgba(52,55,60, ${1 - (title.entry?.intersectionRatio ?? 1)})`,
			}}
		>
			<div className="grid grid-cols-3 h-full w-full items-center tablet:px-2">
				<div
					className={cn('flex flex-col')}
					style={{
						opacity: 1 - (title.entry?.intersectionRatio ?? 1),
					}}
				>
					<Typography
						className="text-md font-semibold leading-4 text-nowrap"
						tag="span"
					>
						{auctionTitle}
					</Typography>
					<Typography
						className="text-[10px] text-gray text-nowrap"
						tag="span"
					>
						Cоздан:
						{' '}
						{createAt}
					</Typography>
				</div>
				<Button
					className={cn(
						'hidden bg-dark text-gray rounded-pill w-full font-medium gap-x-2 h-7 [&_svg]:size-3 hover:text-gray-light hover:bg-dark-accent/60',
						!searchBar.inView
						&& 'inline-flex transition-all justify-self-center',
					)}
					startContent={<MagnifierIcon className="text-gray" />}
					size="sm"
					style={{ opacity: 1 - (searchBar.entry?.intersectionRatio ?? 1) }}
					onClick={() => {
						inputRef.current?.focus()
					}}
				>
					Перейти к строке поиска
					{' '}
				</Button>
			</div>
		</Header>
	)
}

export { AuctionHeader }
