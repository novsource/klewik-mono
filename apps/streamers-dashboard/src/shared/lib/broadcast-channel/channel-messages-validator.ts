import type { ZodType } from 'zod'

import type { EventHandler } from '../emitter'
import type { EventSourceMessage } from '../fetch-event-source/models'

import z, { ZodError } from 'zod'

import { isError } from '~shared/utils'

type ValidateMessageResult<T extends EventSourceMessage, ChannelsEventsMap extends Record<string, any>> = Omit<T, 'data'> & {
  data: ChannelsEventsMap[T['event']]
}

type ChannelMessagesValidatorMethods<
  SourceMessage extends EventSourceMessage,
  ChannelEventsMap extends Record<string, any>,
> = {
  /**
   * The method validates the message for general compliance with the channel's message schema,
   and also validates the message data if a schema representing the event data was passed during class initialization.
   * @param message The message that needs to be validated
   * @returns General validated message if no schema was passed during initialization to validate the message data.
   If a schema was passed for the event, then returns a message with validated data.
   */
  validate: (
    message: SourceMessage
  ) => ValidateMessageResult<SourceMessage, ChannelEventsMap> | Error
}

type ChannelMessagesValidatorOptions<
  SourceMessage extends EventSourceMessage,
  ChannelEventsMap extends Record<SourceMessage['event'], any>,
> = {
  messageSchema: ZodType<SourceMessage>
  validateEventDataMessages: {
    [Event in keyof ChannelEventsMap]: ZodType<ChannelEventsMap[Event]>
  }
}

/**
 * Class for message of broadcast channel validation
 */
export class ChannelMessagesValidator<
  SourceMessage extends EventSourceMessage,
  ChannelEventsMap extends Record<string, EventHandler>,
> implements ChannelMessagesValidatorMethods<SourceMessage, ChannelEventsMap> {
  constructor(
    private readonly _options: ChannelMessagesValidatorOptions<
      SourceMessage,
      ChannelEventsMap
    >,
  ) {}

  validate(message: SourceMessage): ValidateMessageResult<SourceMessage, ChannelEventsMap> | Error {
    try {
      const validatedMessage = this._options.messageSchema.parse(message)
      const deserializedMessageData = JSON.parse(message.data)

      const messageEvent = validatedMessage.event as SourceMessage['event']
      const eventDataSchema = this._options.validateEventDataMessages[messageEvent]

      const validatedEventMessageData = eventDataSchema.parse(deserializedMessageData)

      return { ...message, data: validatedEventMessageData }
    }
    catch (error) {
      if (error instanceof ZodError) {
        return new Error(z.treeifyError(error).errors.join('; '))
      }

      if (isError(error)) {
        return error
      }

      return new Error('Unknown error on sse channel message validating')
    }
  }
}
