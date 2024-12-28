import { ZodError } from 'zod'

import { WheelSlot, WheelSlotSchema } from '../model'

type WheelEventsMap = {
  spin: WheelSlot | undefined
  spinEnded: void
}

class EventBus<EventsMap extends Record<string, unknown>> {
  protected _subscriptions = new Map<
    keyof EventsMap,
    Array<(...args: unknown[]) => void>
  >()

  subscribe(key: keyof EventsMap, callback: (...args: unknown[]) => void) {
    const subscriptions = this._subscriptions.get(key)

    this._subscriptions.set(
      key,
      subscriptions ? [...subscriptions, callback] : [callback]
    )

    return () => {
      this.unsubcribe(key, callback)
    }
  }

  notify(key: string, ...args: unknown[]) {
    this._subscriptions.get(key)?.forEach((callbackfn) => callbackfn(...args))
  }

  unsubcribe(key: keyof EventsMap, callback: (...args: unknown[]) => void) {
    const subscriptions = this._subscriptions.get(key)

    this._subscriptions.set(
      key,
      subscriptions ? subscriptions.filter((cb) => cb !== callback) : []
    )
  }
}

class WheelEventsBus extends EventBus<WheelEventsMap> {
  constructor() {
    super()
  }

  notify<K extends keyof WheelEventsMap = keyof WheelEventsMap>(
    eventName: K,
    data?: WheelEventsMap[K]
  ): void {
    if (data) this._validateEventData(eventName, data)

    this._subscriptions.get(eventName)?.forEach((cb) => cb(data))
  }

  private _validateEventData<
    K extends keyof WheelEventsMap = keyof WheelEventsMap,
  >(eventName: K, data: WheelEventsMap[K]) {
    try {
      switch (eventName) {
        case 'spin': {
          const castData = data as WheelEventsMap['spin']

          WheelSlotSchema.parse(castData)
          break
        }
        case 'spinEnded': {
          break
        }
        default: {
          return
        }
      }
    } catch (err) {
      if (err instanceof ZodError) {
        throw err
      }

      if (err instanceof Error)
        throw new Error(
          `Uncommon error on ${eventName} event payload validation: ${err.message}`
        )
    }
  }
}

export { WheelEventsBus }
