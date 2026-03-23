import type { Metadata } from 'next'

import process from 'node:process'
import { notFound } from 'next/navigation'
import { Flex } from 'klewik-ui/flex'
import { AuctionCaptions } from './components/auction-captions'
import { AuctionRulesDialog } from './components/auction-rules-dialog/auction-rules-dialog'
import { AuctionTitle } from './components/auction-title'
import { CreateCodeDialog } from './components/create-code-dialog'
import { FiltredSlotsList } from './components/slots-list/filtred-slots-list.ui'
import { AuctionSlot, AuctionSlotDTO, transformAuctionSlotDTO } from '~/models/auction-slot'
import { AuctionDTO } from '~/models/auction'

export const revalidate = 5
export const dynamicParams = true

async function getSlots(slug: string): Promise<AuctionSlot[]> {
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

  const slots = (await response.json()) as AuctionSlotDTO[]

  const pointsSum = slots.reduce((sum, slot) => sum + slot.points, 0)
  const transformedSlots = slots.map(slot => transformAuctionSlotDTO(slot, pointsSum))

  return transformedSlots
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

  const auction = (await response.json()) as AuctionDTO
  return auction
}

async function getAuctionRules(slug: string) {
  const headers = new Headers()
  headers.append('Content-type', 'application/json')

  const response = await fetch(`${process.env.SERVER_API_URL}/auctions/${slug}/info/rules`, {
    method: 'POST',
    body: JSON.stringify({ secret: process.env.REVALIDATE_SECRET_KEY }),
  })

  if (!response.ok) {
    return ''
  }

  const rules = (await response.json()) ?? '' as string

  return rules
}

export const generateStaticParams = async () => []

type AuctionPageGenMetaArgs = {
  params: Promise<{ auctionUUID: string }>
}

export async function generateMetadata(args: AuctionPageGenMetaArgs): Promise<Metadata> {
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

  return (
    <main className="main_auction">
      <div className="container w-full h-full mx-auto">
        <Flex
          className="w-full h-full gap-y-6 pt-5.5 tablet:gap-y-8 tablet:pt-4 px-2 tablet:px-4"
          direction="column"
        >
          <Flex
            className="gap-y-4.5 tablet:gap-y-5"
            direction="column"
          >
            <Flex className="gap-y-4 mobile:gap-x-6 flex-col mobile:flex-row tablet:gap-x-8" justify="between" align="start">
              <AuctionTitle title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt" date={Date.now()} />

              <Flex className="gap-x-2">
                <AuctionRulesDialog rules={rules} />
                <CreateCodeDialog slots={slots} auctionUUID={auctionUUID} disabled={auctionInfo.isEnded || auctionInfo.isBetsClosed} />
              </Flex>
            </Flex>
          </Flex>
          <FiltredSlotsList slots={slots} />
        </Flex>
      </div>
    </main>
  )
}
