'use client'

import type { HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import { useAppContext } from '~context/index'
import { useIntersection } from '~hooks/use-intersection'
import { Typography } from '~ui/typography'

type AuctionTitleProps = {
	title: string
	styles?: HTMLAttributes<HTMLDivElement>['style']
	date: string
}

const AuctionTitle = ({ title, date }: AuctionTitleProps) => {
	const {
		state: { title: titleView },
		dispatchers,
	} = useAppContext()

	const titleWrapperRef = useRef<HTMLDivElement>(null)
	const intersection = useIntersection(titleWrapperRef, { threshold: 0 })

	useEffect(() => {
		if (titleView.entry !== intersection.entry) {
			dispatchers?.title(intersection)
		}
	}, [dispatchers, intersection, titleView])

	return (
		<div
			ref={titleWrapperRef}
			className="flex flex-col gap-y-0.5"
			style={{ opacity: titleView.entry?.intersectionRatio ?? 1 }}
		>
			<Typography tag="h1">{title}</Typography>
			<Typography className="text-xs tablet:text-sm text-gray" tag="span">
				Cоздан:
				{' '}
				{date}
			</Typography>
		</div>
	)
}

export { AuctionTitle }
