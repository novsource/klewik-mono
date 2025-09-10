export const SSE_CHANNELS = ['donations', 'auctionSlots'] as const

export type SSEChannels = typeof SSE_CHANNELS[number]
