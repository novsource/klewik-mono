type AuctionSlot = {
	id: number
	auctionSlotOrder: number
	title: string
	points: number
	color?: string
}

type Auction = {
	id: string
	ownerId: string
	url: string
	wheelMode: 'classic' | 'dropout'
	isBetsClosed: boolean
	isEnded: boolean
	createdAt: string
	endedAt: string
}

type DonationCode = {
	id: number
	auctionId: number
	title: string
	code: string
	slotId: number
	createdAt: string
}
