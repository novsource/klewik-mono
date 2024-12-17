type Auction = {
  _id: string
  url: string
  ownerId: string
  title: string
  slots: AuctionSlot[]
  wheelMode: WheelMode
  dropoutSlots: AuctionSlot[]
  isAlive: boolean
  startDate: number
}

type AuctionSlot = {
  _id: string
  name: string
  points: number
  slotHSVColor: string
  sponsorsIds?: AuctionSlotSponsor[]
  chance?: number
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
