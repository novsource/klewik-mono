import { AuctionSlotSchema } from '~entities/auction-slot/model'

import {
  BroadcastLeaderChannelOptions,
  CommunicableSSEChannel,
} from '~shared/lib/broadcast-channel'

import { AuctionSlotsEventsMessageSchema } from './channel.contracts'
import {
  AuctionEventSourceMessage,
  AuctionSlotsEventsCallbacks,
} from './channel.types'

class AuctionSlotsBroadcastChannel extends CommunicableSSEChannel<
  AuctionEventSourceMessage,
  AuctionSlotsEventsCallbacks
> {
  constructor(channelName: string, options?: BroadcastLeaderChannelOptions) {
    super(channelName, {
      messageSchema: AuctionSlotsEventsMessageSchema,
      validationEventMessage: {
        'auction-slots/add': AuctionSlotSchema,
        'auction-slots/update': AuctionSlotSchema,
      },
      leaderBecomeAutomatic: false,
      ...options,
    })
  }
}

export { AuctionSlotsBroadcastChannel }
