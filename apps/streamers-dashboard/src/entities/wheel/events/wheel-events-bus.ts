import { ZodError } from 'zod'

import { WheelSlot, WheelSlotSchema } from '../model'

type WheelEventsMap = {
  spin: (data: WheelSlot) => void
  spinEnded: () => void
}

class EventBus<EventsMap extends Record<string, any>> {
  protected _subscriptions = new Map<
    keyof EventsMap,
    Array<(...args: any[]) => void>
  >()

  subscribe<K extends keyof EventsMap>(key: K, callback: EventsMap[K]) {
    const subscriptions = this._subscriptions.get(key)

    this._subscriptions.set(
      key,
      subscriptions ? [...subscriptions, callback] : [callback]
    )

    return () => {
      this.unsubcribe(key, callback)
    }
  }

  notify<K extends keyof EventsMap>(key: K, ...data: Parameters<EventsMap[K]>) {
    this._subscriptions.get(key)?.forEach((callbackfn) => callbackfn(data))
  }

  unsubcribe<K extends keyof EventsMap>(key: K, callback: EventsMap[K]) {
    const subscriptions = this._subscriptions.get(key)

    this._subscriptions.set(
      key,
      subscriptions ? subscriptions.filter((cb) => cb !== callback) : []
    )
  }
}

class WheelEventsBus extends EventBus<WheelEventsMap> {
  private static _instance = new WheelEventsBus()

  private constructor() {
    super()
  }

  static getInstance() {
    return this._instance
  }

  notify<K extends keyof WheelEventsMap = keyof WheelEventsMap>(
    eventName: K,
    ...data: Parameters<WheelEventsMap[K]>
  ): void {
    if (data) this._validateEventData(eventName, data)

    this._subscriptions.get(eventName)?.forEach((cb) => cb(data))
  }

  private _validateEventData<
    K extends keyof WheelEventsMap = keyof WheelEventsMap,
  >(eventName: K, data: Parameters<WheelEventsMap[K]>) {
    try {
      switch (eventName) {
        case 'spin': {
          WheelSlotSchema.parse(data)
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
