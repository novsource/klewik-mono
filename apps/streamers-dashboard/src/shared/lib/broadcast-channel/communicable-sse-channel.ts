import type { EventSourceMessage } from '../fetch-event-source/models'
import type {
  CommunicableSSEChannelEventsMap,
  CommunicableSSEChannelMessage,
  CommunicableSSEChannelOptions,
} from './model'

import { BroadcastLeaderChannel } from './broadcast-leader-channel'
import { ChannelMessagesValidator } from './channel-messages-validator'

/**
 * A channel with the ability to validate incoming messages and also notifies all existing channels about its initialization
 */
class CommunicableSSEChannel<
  SourceMessage extends EventSourceMessage = EventSourceMessage,
  ChannelEventsMap extends Record<string, any> = Record<string, any>,
> extends BroadcastLeaderChannel<
  CommunicableSSEChannelMessage<SourceMessage>,
  ChannelEventsMap & CommunicableSSEChannelEventsMap
> {
  private readonly _messagesValidator: ChannelMessagesValidator<
    CommunicableSSEChannelMessage<SourceMessage>,
    ChannelEventsMap & CommunicableSSEChannelEventsMap
  >

  constructor(
    channelName: string,
    {
      messageSchema,
      validationEventMessage,
      ...channelOptions
    }: CommunicableSSEChannelOptions<ChannelEventsMap>,
  ) {
    super(channelName, channelOptions)

    this._messagesValidator = new ChannelMessagesValidator({
      messageSchema,
      validateEventDataMessages: validationEventMessage,
    })

    this.onMessage(message => this.messageProcessing(message))
    this.postMessage({ id: '0', data: '', event: 'employee/new' })
  }

  messageProcessing(message: CommunicableSSEChannelMessage<SourceMessage>) {
    const validatedMessage = this._messagesValidator.validate(message)

    if (validatedMessage instanceof Error || validatedMessage === undefined) {
      throw new Error(
        validatedMessage?.message ?? 'Error on message validation: ',
      )
    }

    /** @todo Refactor */
    // @ts-expect-error Emitter eventArgs issue
    this.emit('message', validatedMessage)
    this.emit(validatedMessage.event, validatedMessage.data)
  }
}

export { CommunicableSSEChannel }
