/*
  Important!!!
  A few words about implementation. In emitter should be smth like void or [] in methods but TS limitations :c

  First related issue: https://github.com/microsoft/TypeScript/issues/29131
  Second related issue: https://github.com/microsoft/TypeScript/issues/39600
*/

export type EventHandler<T = any> = (...args: T[]) => void

type BaseEmitterMethods<T extends Record<string, any>> = {
  /**
   * Calls all handlers with data corresponding to the event data type
   * @param eventName
   * @param eventArgs event related data
   */
  emit: <EventName extends keyof T>(
    eventName: EventName,
    eventArgs: T[EventName]
  ) => void

  /**
   * Adds a handler inside emitter
   * @param eventName
   * @param eventArgs
   * @returns A function for unsubscribing from event emitting
   */
  on: <EventName extends keyof T>(
    eventName: EventName,
    handler: (eventArgs: T[EventName]) => void
  ) => void

  /**
   * Remove a handler from emitter
   * @param eventName
   * @param eventArgs
   */
  off: <EventName extends keyof T>(
    eventName: EventName,
    handler: (eventArgs: T[EventName]) => void
  ) => void
}

/**
  Base implemention of EventEmitter
 */
export class BaseEmitter<EventsMap extends Record<string, any> = Record<string, any>>
implements BaseEmitterMethods<EventsMap> {
  /**
    Map of event emitter handlers
   */
  private _subscriptions = new Map<keyof EventsMap, any[]>([])

  /*
    Here the problem. Emit method (and others methods like on, off, etc.) always require second argument -
    if we want call emit without any linked data, TS give us TypeError
  */
  emit<Event extends keyof EventsMap>(
    eventName: Event,
    eventArgs: EventsMap[Event],
  ) {
    this._internalEmit(eventName, eventArgs)
  }

  on<Event extends keyof EventsMap>(
    eventName: Event,
    handler: (eventArgs: EventsMap[Event]) => void,
  ) {
    return this._internalSubscribe(eventName, handler)
  }

  off<Event extends keyof EventsMap>(
    eventName: Event,
    handler: (eventArgs: EventsMap[Event]) => void,
  ) {
    this._internalUnsubscribe(eventName, handler)
  }

  private _internalSubscribe<Event extends keyof EventsMap>(
    eventName: Event,
    handler: (eventArgs: EventsMap[Event]) => void,
  ) {
    let settedHandlers: EventHandler[] = []

    const storedHandlers = this._subscriptions.get(eventName)

    if (storedHandlers && storedHandlers.length !== 0) {
      settedHandlers = storedHandlers
    }

    this._subscriptions.set(eventName, [...settedHandlers, handler])

    return () => {
      this._internalUnsubscribe(eventName, handler)
    }
  }

  private _internalUnsubscribe<Event extends keyof EventsMap>(
    eventName: Event,
    handler: (eventArgs: EventsMap[Event]) => void,
  ) {
    const storedHandlers = this._subscriptions.get(eventName)

    if (!storedHandlers || storedHandlers.length === 0)
      return

    const filtredHandlers = storedHandlers.filter(
      storedHandler => storedHandler !== handler,
    )

    this._subscriptions.set(eventName, filtredHandlers)
  }

  private _internalEmit<Event extends keyof EventsMap>(
    eventName: Event,
    eventArgs: EventsMap[Event],
  ) {
    const storedHandlers = this._subscriptions.get(eventName)

    if (!storedHandlers || storedHandlers.length === 0)
      return

    for (const subscription of storedHandlers) {
      subscription(eventArgs)
    }
  }
}
