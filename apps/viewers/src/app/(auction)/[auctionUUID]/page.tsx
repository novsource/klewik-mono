import process from 'node:process'

import { notFound } from 'next/navigation'
import { Flex } from '~ui/flex'
import { AuctionCaptions } from './components/auction-captions'
import { AuctionTitle } from './components/auction-title'
import { CreateCodeDialog } from './components/create-code-dialog'
import { FiltredSlotsList } from './components/slots-list/filtred-slots-list.ui'

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

type AuctionPageGenMetaArgs = {
	params: Promise<{ auctionUUID: string }>
}

export async function generateMetadata(args: AuctionPageGenMetaArgs) {
	const { params } = args

	const { auctionUUID } = await params

	const auction = await getAuctionInfo(auctionUUID)

	return {
		title: `Аукцион номер #${auction.id}`,
	}
}

type AuctionPageProps = {
	params: Promise<{ auctionUUID: string }>
}

export default async function AuctionPage(props: AuctionPageProps) {
	const { params } = props

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
		<main className="main_auction">
			<div className="container w-full h-full mx-auto">
				<Flex
					className="w-full h-full gap-y-6 tablet:gap-y-8 pt-4 px-2 tablet:px-4"
					direction="column"
				>
					<Flex
						className="gap-y-4.5 tablet:gap-y-5"
						direction="column"
					>
						<Flex className="gap-x-6 tablet:gap-x-8" justify="between" align="start">
							<AuctionTitle title={auctionInfo.id} date={date} />
							<CreateCodeDialog slots={slots} auctionUUID={auctionUUID} />
						</Flex>
						<AuctionCaptions
							createAt={date}
							revalidateDate={Date.now()}
						/>
					</Flex>
					<FiltredSlotsList slots={slots} />
				</Flex>
			</div>
		</main>
	)
}
