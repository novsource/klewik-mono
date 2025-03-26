import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source'

import { refreshTokens } from '~shared/api/http/auth/auth.api'

import { EventSourceMessageSchema } from './models'
import {
  EventSourceMessage,
  SSEClientConnectOptions,
  SSEClientListeners,
} from './models/base-sse-client.types'

type AuthorizationError = Error

const AuthorizationError = () => new Error('Authorization error')

class BaseSSEClient {
  async connect(
    url: string,
    inputListeners: SSEClientListeners,
    inputOptions?: SSEClientConnectOptions
  ) {
    const onOpen = async (response: Response) => {
      if (
        response.ok &&
        response.headers.get('content-type') === EventStreamContentType
      ) {
        inputListeners.onopen(response)
        return
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        /** @todo Refactor auth error */
        if (response.status === 401) {
          await refreshTokens()
          throw AuthorizationError()
        }
      } else {
        if (response.status === 500) {
          throw new Error()
        }

        throw new Error()
      }
    }

    const onMessage = (message: EventSourceMessage) => {
      const parsedMessage = EventSourceMessageSchema.safeParse(message)

      if (!parsedMessage.success) {
        inputListeners.onerror(
          new Error(
            'Invalid SSE message: ' + parsedMessage.error.errors.join('')
          )
        )
        return
      }

      inputListeners.onmessage(parsedMessage.data)
    }

    const onClose = () => {
      inputListeners.onclose()
    }

    const onError = (err: unknown) => {
      inputListeners.onerror(err)
      throw err
    }

    const listeners: SSEClientListeners = {
      onopen: onOpen,
      onclose: onClose,
      onerror: onError,
      onmessage: onMessage,
    }

    const options: SSEClientConnectOptions = {
      ...inputOptions,
      openWhenHidden: true,
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': import.meta.env.VITE_SERVER_URL,
      },
    }

    const connectUrl = new URL(
      `${import.meta.env.VITE_SERVER_URL}/api/sse/${url}`
    )
    const params = new URLSearchParams()

    params.set('lastMessageId', String(options?.lastMessageId ?? 0))

    connectUrl.search = params.toString()

    if (Reflect.has(options, 'retry')) {
      return this._retryConnect(connectUrl.toString(), listeners, options)
    }

    return this._internalRequest(connectUrl.toString(), listeners, options)
  }

  private async _retryConnect(
    url: string,
    listeners: SSEClientListeners,
    options: Omit<SSEClientConnectOptions, 'retry'> & {
      retry: NonNullable<SSEClientConnectOptions['retry']>
    }
  ): Promise<void> {
    const reconnect = async (err: Error): Promise<void> => {
      options.retry.counts -= 1

      if (options.retry.counts <= 0) {
        throw err
      }

      const wait = () =>
        new Promise((res) => setTimeout(res, options.retry.delay))

      return wait().then(() => this._retryConnect(url, listeners, options))
    }

    return this._internalRequest(url, listeners, options).catch(reconnect)
  }

  private _internalRequest(
    url: string,
    listeners: SSEClientListeners,
    options: SSEClientConnectOptions
  ) {
    return fetchEventSource(url, {
      ...listeners,
      ...options,
    })
  }
}

export { BaseSSEClient }
