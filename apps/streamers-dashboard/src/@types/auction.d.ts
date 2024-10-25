type Auction = {
  _id: string
  ownerId: string
  title: string
  slots: AuctionSlot[]
  participants: AuctionParticipant[]
  wheelMode: WheelMode
  dropoutSlots: AuctionSlot[]
  isAlive: boolean
  startDate: Date
}

type AuctionSlot = {
  _id: string
  name: string
  value: number
  tag: string
  auctionColor: string
  ownerId?: string
  sponsorsIds?: AuctionSlotSponsor[]
}

type AuctionSlotWithAngles = AuctionSlot & {
  angles: { startAngle: number; endAngle: number }
}

type AuctionSlotSponsor = {
  userId: string
  value: number
}

type WheelMode = 'classic' | 'dropout'

type AuctionParticipant = {
  _id: string
  username: string
  value: number
}
