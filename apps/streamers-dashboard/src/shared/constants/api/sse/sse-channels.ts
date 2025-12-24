export const SSE_CHANNELS = ['donations', 'auctionSlots', 'integrations'] as const

export type SSEChannels = typeof SSE_CHANNELS[number]
