import process from 'node:process'

import { notFound } from 'next/navigation'
import { Typography } from '~ui/typography'
import { ControlledSlotsMemo } from './_widgets/controlled-slots/controlled-slots.ui'
import { IntegrationsInfo } from './_widgets/integrations-info'
import { AuctionTitle } from './components/auction-title'
import { RefreshPageTimer } from './components/refresh--page-timer'

import { AuctionHeader } from './components/test-header'

export const revalidate = 120
export const dynamicParams = true

async function getSlots(id: string) {
	const headers = new Headers()

	headers.append('Content-type', 'application/json')

	const response = await fetch(
		`${process.env.SERVER_API_URL}/auctions/${id}/slots`,
		{
			method: 'POST',
			headers,
			body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
			cache: 'force-cache',
		},
	)

	if (response.status !== 200) {
		return []
	}

	const slots = (await response.json()) as AuctionSlot[]

	return slots
}

async function getAuctionInfo(id: string) {
	const headers = new Headers()

	headers.append('Content-type', 'application/json')

	const response = await fetch(`${process.env.SERVER_API_URL}/auctions/${id}`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
	})

	if (response.status === 404 || response.status === 400)
		notFound()

	const auction = (await response.json()) as Auction
	return auction
}

export const generateStaticParams = async () => []

export async function generateMetadata({
	params,
}: {
	params: Promise<{ auctionUUID: string }>
}) {
	const { auctionUUID } = await params

	const auction = await getAuctionInfo(auctionUUID)

	return {
		title: `Аукцион номер #${auction.id}`,
	}
}

export default async function AuctionPage({
	params,
}: {
	params: Promise<{ auctionUUID: string }>
}) {
	const auctionUUID = (await params).auctionUUID

	const [slots, auctionInfo] = await Promise.all([
		getSlots(auctionUUID),
		getAuctionInfo(auctionUUID),
	])

	const date = new Intl.DateTimeFormat('ru-RU', {
		minute: 'numeric',
		month: 'numeric',
		hour: 'numeric',
		day: 'numeric',
	}).format(Date.now())

	return (
		<>
			<AuctionHeader title={auctionInfo.id} createAt={date} />
			<main className="main_auction">
				<div className="container w-full h-full mx-auto">
					<div className="flex flex-col w-full h-full gap-y-6 tablet:gap-y-8 pt-4 px-4">
						<div className="flex flex-col gap-y-2.5 tablet:gap-y-4">
							<AuctionTitle title={auctionInfo.id} date={date} />
							<div className="flex flex-col gap-y-2">
								<IntegrationsInfo />
								<Typography className="text-sm text-gray-accent" tag="span">
									Сайт обновится через:
									{' '}
									<RefreshPageTimer startTime={Date.now()} value={120} />
									{' '}
									секунд
								</Typography>
							</div>
						</div>
						<ControlledSlotsMemo slots={slots} />
					</div>
				</div>
			</main>
		</>

	)
}
