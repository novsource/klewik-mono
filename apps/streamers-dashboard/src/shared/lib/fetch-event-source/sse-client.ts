import {
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source'

import { EventSourceMessage } from './sse-client.types'

export type SSEClientListeners = {
  onopen: (response: Response) => void
  onmessage: (message: EventSourceMessage) => void
  onerror: (error: unknown) => void
  onclose: () => void
}

export type SSEClientConnectOptions = {
  retry?: {
    counts: number
    delay: number
  }
}

class SSEClient {
  async connect(
    url: string,
    listeners: SSEClientListeners,
    options?: SSEClientConnectOptions
  ) {
    const onOpen = async (response: Response) => {
      if (
        response.ok &&
        response.headers.get('content-type') === EventStreamContentType
      ) {
        listeners.onopen(response)
        return
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        throw new Error()
      } else {
        throw new Error()
      }
    }

    const onMessage = (message: EventSourceMessage) =>
      listeners.onmessage(message)

    const onClose = () => {}

    const onError = (err: Error) => {
      listeners.onerror(err)
      throw err
    }

    if (options?.retry) {
      return this.retryConnect(
        url,
        listeners,
        options.retry.delay,
        options.retry.counts
      )
    }

    return fetchEventSource(
      `${import.meta.env.VITE_SERVER_URL}/api/sse/${url}`,
      {
        onopen: onOpen,
        onmessage: onMessage,
        onclose: onClose,
        onerror: onError,
        openWhenHidden: true,
      }
    )
  }

  async retryConnect(
    url: string,
    listeners: SSEClientListeners,
    delay: number = 1000,
    counts: number = 3
  ): Promise<void> {
    console.log(counts)
    const reconnect = async (err: Error): Promise<void> => {
      console.log(counts)

      counts -= 1

      if (counts <= 0) {
        throw err
      }

      const wait = () => new Promise((res) => setTimeout(res, delay))

      return wait().then(() => this.retryConnect(url, listeners, delay, counts))
    }

    return this.connect(url, listeners).catch(reconnect)
  }
}

export { SSEClient }
