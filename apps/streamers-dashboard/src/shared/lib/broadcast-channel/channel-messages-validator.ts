import { ZodError, ZodSchema } from 'zod'

import { EventSourceMessage } from '../fetch-event-source/models'
import {
  CommunicableSSEChannelMessage,
  CommunicableSourceMessageSchema,
} from './model'

interface ChannelMessagesValidatorMethods<
  SourceMessage extends EventSourceMessage,
> {
  /**
   * The method validates the message for general compliance with the channel's message schema,
   and also validates the message data if a schema representing the event data was passed during class initialization.
   * @param message The message that needs to be validated
   * @returns General validated message if no schema was passed during initialization to validate the message data.
   If a schema was passed for the event, then returns a message with validated data.
   */
  validate: (
    message: SourceMessage
  ) => CommunicableSSEChannelMessage<SourceMessage> | Error | undefined
}

type ChannelMessagesValidatorOptions<
  SourceMessage extends EventSourceMessage,
  ChannelEventsMap extends Record<string, any>,
> = {
  messageSchema: ZodSchema<SourceMessage>
  validateEventDataMessages?: {
    [Event in keyof ChannelEventsMap]?: ZodSchema
  }
}

/**
 * Class for message of broadcast channel validation
 */
class ChannelMessagesValidator<
  SourceMessage extends EventSourceMessage,
  ChannelEventsMap extends Record<string, any>,
> implements ChannelMessagesValidatorMethods<SourceMessage>
{
  constructor(
    private readonly _options: ChannelMessagesValidatorOptions<
      SourceMessage,
      ChannelEventsMap
    >
  ) {}

  validate(
    message: SourceMessage
  ): CommunicableSSEChannelMessage<SourceMessage> | Error | undefined {
    try {
      const validateCommunicaveMessageResult =
        CommunicableSourceMessageSchema.safeParse(message)

      if (validateCommunicaveMessageResult.success) {
        return validateCommunicaveMessageResult.data
      }

      const validatedMessage = this._options.messageSchema.parse(message)

      const event = validatedMessage.event

      if (
        this._options.validateEventDataMessages &&
        this._options.validateEventDataMessages[event]
      ) {
        const eventDataSchema = this._options.validateEventDataMessages[event]

        const parsedData = JSON.parse(message.data)

        if (Array.isArray(parsedData)) {
          parsedData.reduce((acc, item) => {
            acc.push(eventDataSchema.parse(item))
            return acc
          }, [])

          return { ...message, data: parsedData }
        }

        return { ...message, data: eventDataSchema.parse(parsedData) }
      }

      return validatedMessage
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        console.log(err)
        return new Error(err.errors.join(' '))
      } else if (err instanceof Error) {
        return err
      }
    }
  }
}

export { ChannelMessagesValidator }
