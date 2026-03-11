import type { EventSourceMessage } from '../fetch-event-source/models'
import type { CommunicableSSEChannelDefaultEventsMap, CommunicableSSEChannelMessage, CommunicableSSEChannelOptions } from './model'

import { isError } from '~shared/utils'

import { BroadcastLeaderChannel } from './broadcast-leader-channel'
import { ChannelMessagesValidator } from './channel-messages-validator'
import {
  CommunicableSourceMessageSchema,
} from './model'

type CommunicableSSEChannelEvents<Events extends Record<string, any>> = CommunicableSSEChannelDefaultEventsMap & Events

/**
 * A channel with the ability to validate incoming messages and also notifies all existing channels about its initialization
 */
class CommunicableSSEChannel<
  SourceMessage extends EventSourceMessage = EventSourceMessage,
  ChannelEventsMap extends Record<SourceMessage['event'], any> = Record<SourceMessage['event'], any>,
> extends BroadcastLeaderChannel<
  CommunicableSSEChannelMessage<SourceMessage>,
  CommunicableSSEChannelEvents<ChannelEventsMap>
> {
  private readonly _messagesValidator: ChannelMessagesValidator<SourceMessage, ChannelEventsMap>

  constructor(channelName: string, options: CommunicableSSEChannelOptions<SourceMessage, ChannelEventsMap>) {
    const { messageSchema, validationEventMessage, ...channelOptions } = options

    super(channelName, channelOptions)
    this._messagesValidator = new ChannelMessagesValidator({
      messageSchema,
      validateEventDataMessages: validationEventMessage,
    })

    this.onMessage(incomingMessage => this.processMessage(incomingMessage))
  }

  processMessage(incomingMessage: CommunicableSSEChannelMessage<SourceMessage>) {
    // console.log('message: ', incomingMessage)
    const validateCommunicaveMessageResult = CommunicableSourceMessageSchema.safeParse(incomingMessage)

    if (validateCommunicaveMessageResult.success) {
      const message = validateCommunicaveMessageResult.data

      /*
        TODO: Fix type
      */
      // @ts-expect-error misunderstending types
      this.emit('message', message)
      this.emit(validateCommunicaveMessageResult.data.event, null!)

      return
    }

    const messageValidationResult = this._messagesValidator.validate(incomingMessage as SourceMessage)

    if (isError(messageValidationResult)) {
      throw messageValidationResult.message
    }

    /*
      TODO: Fix type
    */
    // @ts-expect-error misunderstending types
    this.emit('message', messageValidationResult)
    this.emit(messageValidationResult.event, messageValidationResult.data!)
  }
}

export { CommunicableSSEChannel }
