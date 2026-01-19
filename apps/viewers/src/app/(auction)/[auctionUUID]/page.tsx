import process from 'node:process'

import { notFound } from 'next/navigation'
import { Flex } from '~ui/flex'
import { AuctionCaptions } from './components/auction-captions'
import { AuctionRulesDialog } from './components/auction-rules-dialog/auction-rules-dialog'
import { AuctionTitle } from './components/auction-title'
import { CreateCodeDialog } from './components/create-code-dialog'
import { FiltredSlotsList } from './components/slots-list/filtred-slots-list.ui'

export const revalidate = 120
export const dynamicParams = true

async function getSlots(slug: string) {
	const headers = new Headers()
	headers.append('Content-type', 'application/json')

	const response = await fetch(
		`${process.env.SERVER_API_URL}/auctions/${slug}/slots`,
		{
			method: 'POST',
			body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
			headers,
			cache: 'force-cache',
		},
	)

	if (response.status !== 200) {
		return []
	}

	const slots = (await response.json()) as AuctionSlot[]

	return slots
}

async function getAuctionInfo(slug: string) {
	const headers = new Headers()
	headers.append('Content-type', 'application/json')

	const response = await fetch(`${process.env.SERVER_API_URL}/auctions/${slug}`, {
		method: 'POST',
		body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
		headers,
	})

	if (response.status === 404 || response.status === 400)
		notFound()

	const auction = (await response.json()) as Auction
	return auction
}

async function getAuctionRules(slug: string) {
	const headers = new Headers()
	headers.append('Content-type', 'application/json')

	const response = await fetch(`${process.env.SERVER_API_URL}/auctions/${slug}/info/rules`, {
		method: 'POST',
		body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
	})

	const rules = (await response.json()) ?? '' as string

	return rules
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

	const [slots, auctionInfo, rules] = await Promise.all([
		getSlots(auctionUUID),
		getAuctionInfo(auctionUUID),
		getAuctionRules(auctionUUID),
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

							<Flex className="gap-x-2">
								<AuctionRulesDialog rules={rules} />
								<CreateCodeDialog slots={slots} auctionUUID={auctionUUID} />
							</Flex>
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
