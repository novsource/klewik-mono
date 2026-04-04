import type { AuctionSlot } from '~entities/auction-slot/model'

import type { AuctionPlatform } from '~entities/integrations/model'

import { klewikLocalExportSerializer } from '../lib/klewik-local.serializer'
import { pointaucSlotsExportSerializer } from '../lib/pointauc-serializer'

export const AUCTION_PLATFORM_SLOTS_EXPORT_SERIALIZER: Record<AuctionPlatform, (slots: AuctionSlot[]) => Maybe<string>> = {
  pointauc: pointaucSlotsExportSerializer,
  klewikLocal: klewikLocalExportSerializer,
} as const
