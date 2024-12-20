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
