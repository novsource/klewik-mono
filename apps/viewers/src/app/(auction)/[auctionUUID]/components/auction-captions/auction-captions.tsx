'use client'

import { useState } from 'react'
import { useTimer } from '~hooks/index'
import { Caption } from '~ui/caption'
import { Flex } from '~ui/flex'
import { REVALIDATE_TIME } from '~/constants'

export type AuctionInfoProps = {
	createAt: string
	revalidateDate: number
}

export const AuctionCaptions = (props: AuctionInfoProps) => {
	const { createAt, revalidateDate } = props

	const [isShouldReloadPage, setIsShouldReloadPage] = useState(false)

	useTimer(REVALIDATE_TIME - Math.floor((Date.now() - revalidateDate) / 1000),	{
		immediately: true,
		onExpire: () => {
			setIsShouldReloadPage(true)
		},
	})

	return (
		<Flex className="gap-x-1.5">
			<Caption
				className="w-fit"
				size="sm"
				variant={isShouldReloadPage ? 'warn' : 'default'}
				title="Время актуальности данных"
			>
				{isShouldReloadPage ? 'Необходимо обновление страницы' : 'Данные актуальные'}
			</Caption>
			<Caption
				className="w-fit"
				variant="default"
				size="sm"
				title="Дата и время создания"
			>
				{createAt}
			</Caption>
		</Flex>
	)
}
