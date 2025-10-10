import type {
  EventSourceMessage,
  SSEClientConnectOptions,
  SSEClientListeners,
} from './models/base-sse-client.types'

import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source'
import { Mutex } from 'async-mutex'
import { AxiosError } from 'axios'

import { refreshTokens } from '~shared/api/http/auth/auth.api'

import { EventSourceMessageSchema } from './models'

type RetrySSEConnectOptions = Omit<SSEClientConnectOptions, 'retry'> & {
  retry: NonNullable<SSEClientConnectOptions['retry']>
}

const mutex = new Mutex()
export class BaseSSEClient {
  async connect(
    url: string,
    inputListeners: SSEClientListeners,
    inputOptions?: SSEClientConnectOptions,
  ) {
    const baseUrl = import.meta.env.VITE_SERVER_URL

    const onOpen = async (response: Response) => {
      if (
        response.ok
        && response.headers.get('content-type') === EventStreamContentType
      ) {
        inputListeners.onopen(response)
      }
      else if (
        response.status >= 400
        && response.status < 500
        && response.status !== 429
      ) {
        const isMutexLocked = mutex.isLocked()
        if (response.status === 401 && isMutexLocked) {
          await mutex.waitForUnlock()
          return this.connect(url, inputListeners, inputOptions)
        }

        /** @todo Refactor auth error */
        if (response.status === 401 && !isMutexLocked) {
          const release = await mutex.acquire()
          try {
            await refreshTokens()
            return this.connect(url, inputListeners, inputOptions)
          }
          catch (error) {
            if (error instanceof AxiosError)
              throw new Error(error.cause?.message)
            if (error instanceof Error)
              throw new Error('Authorization error')
          }
          finally {
            release()
          }
        }
      }
      else {
        if (response.status === 500) {
          throw new Error('Server error')
        }

        throw new Error('Unexpected error when trying to connect SSE')
      }
    }

    const onMessage = (message: EventSourceMessage) => {
      const parsedMessage = EventSourceMessageSchema.safeParse(message)

      if (!parsedMessage.success) {
        inputListeners.onerror(
          new Error(
            `Invalid SSE message: ${parsedMessage.error.errors.join('')}`,
          ),
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
        'Access-Control-Allow-Origin': baseUrl,
      },
    }

    const params = new URLSearchParams()

    params.set('lastMessageId', String(options?.lastMessageId ?? 0))

    const isRetryInOptions = Reflect.has(options, 'retry')

    await mutex.waitForUnlock()

    if (isRetryInOptions) {
      // @ts-expect-error - reflect checking
      return this._retryConnect(`/api/v1/auctions/${url}`, listeners, options)
    }

    return this._internalRequest(`/api/v1/auctions/${url}`, listeners, options)
  }

  private async _retryConnect(
    url: string,
    listeners: SSEClientListeners,
    options: RetrySSEConnectOptions,
  ): Promise<void> {
    const reconnect = async (err: Error): Promise<void> => {
      options.retry.counts -= 1

      if (options.retry.counts <= 0) {
        throw err
      }

      const wait = () =>
        new Promise(res => setTimeout(res, options.retry.delay))

      return wait().then(() => this._retryConnect(url, listeners, options))
    }

    return this._internalRequest(url, listeners, options).catch(reconnect)
  }

  private _internalRequest(
    url: string,
    listeners: SSEClientListeners,
    options: SSEClientConnectOptions,
  ) {
    return fetchEventSource(url, {
      ...listeners,
      ...options,
    })
  }
}
