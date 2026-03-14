export const SSE_CHANNELS = ['donations', 'auctionSlots', 'integrations'] as const

export type SSEChannels = typeof SSE_CHANNELS[number]

export const SSE_CHANNELS_CONNECT_ENDPOINTS: Record<SSEChannels, (auctionUUID: string) => string> = {
  donations: auctionUUID => `${auctionUUID}/sse/donations-events`,
  auctionSlots: auctionUUID => `${auctionUUID}/sse/slots-events`,
  integrations: auctionUUID => `${auctionUUID}/sse/integrations-events`,
} as const
