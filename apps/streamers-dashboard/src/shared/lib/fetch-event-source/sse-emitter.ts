import { SSEEvents } from './sse-client.types'

class SSEEmiter {
  private _subscriptions = new Map<
    keyof SSEEvents,
    Array<(...args: unknown[]) => void>
  >([])

  subscribe<T extends keyof SSEEvents>(
    event: T,
    callback: (arg: Parameters<NonNullable<SSEEvents[T]>>[number]) => void
  ) {
    const listeners = this._subscriptions.get(event)

    if (!listeners) this._subscriptions.set(event, [callback])
    else listeners.push(callback)
  }

  subscribeOnce<T extends keyof SSEEvents>(
    event: T,
    callback: (arg: Parameters<NonNullable<SSEEvents[T]>>[number]) => void
  ) {
    const listeners = this._subscriptions.get(event)

    if (!listeners) {
      this._subscriptions.set(event, [
        callback,
        () => this.unsubscribe(event, callback),
      ])
    } else {
      listeners.push(...[callback, () => this.unsubscribe(event, callback)])
    }
  }

  notify<T extends keyof SSEEvents>(
    eventName: T,
    value?: Parameters<NonNullable<SSEEvents[T]>>[number]
  ) {
    this._subscriptions
      .get(eventName)
      ?.forEach((callbackfn) => callbackfn(value))
  }

  unsubscribe<T extends keyof SSEEvents>(
    eventName: T,
    callback: (arg: Parameters<NonNullable<SSEEvents[T]>>[number]) => void
  ) {
    const listeners = this._subscriptions.get(eventName)

    if (!listeners) return

    this._subscriptions.set(
      eventName,
      listeners.filter((cb) => cb !== callback)
    )
  }
}

export { SSEEmiter }
