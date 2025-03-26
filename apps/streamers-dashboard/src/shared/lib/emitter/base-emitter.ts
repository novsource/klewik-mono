/*
  Important!!!
  A few words about implementation. In emitter should be smth like void or [] in methods but TS limitations :c

  First related issue: https://github.com/microsoft/TypeScript/issues/29131
  Second related issue: https://github.com/microsoft/TypeScript/issues/39600
*/

type EventHandler = (...args: any[]) => void

interface BaseEmitterMethods<T extends Record<string, EventHandler>> {
  /**
   * Calls all handlers with data corresponding to the event data type
   * @param eventName
   * @param eventArgs event related data
   */
  emit: <EventName extends keyof T>(
    eventName: EventName,
    ...eventArgs: Parameters<T[EventName]>
  ) => void

  /**
   * Adds a handler inside emitter
   * @param eventName
   * @param eventArgs
   * @returns A function for unsubscribing from event emitting
   */
  on: <EventName extends keyof T>(
    eventName: EventName,
    handler: (...eventArgs: Parameters<T[EventName]>) => void
  ) => void

  /**
   * Remove a handler from emitter
   * @param eventName
   * @param eventArgs
   */
  off: <EventName extends keyof T>(
    eventName: EventName,
    handler: (...eventArgs: Parameters<T[EventName]>) => void
  ) => void
}

/**
  Base implemention of EventEmitter
*/
class BaseEmitter<EventsMap extends Record<string, EventHandler>>
  implements BaseEmitterMethods<EventsMap>
{
  /**
    Map of event emitter handlers
  */
  private _subscriptions = new Map<keyof EventsMap, Array<EventHandler>>([])

  /*
    Here the problem. Emit method (and others methods like on, off, etc.) always require second argument -
    if we want call emit without any linked data, TS give us TypeError
  */
  emit<EventName extends keyof EventsMap>(
    eventName: EventName,
    ...eventArgs: Parameters<EventsMap[EventName]>
  ) {
    this._internalEmit(eventName, ...eventArgs)
  }

  on<EventName extends keyof EventsMap>(
    eventName: EventName,
    handler: (...eventArgs: Parameters<EventsMap[EventName]>) => void
  ) {
    return this._internalSubscribe(eventName, handler)
  }

  off<EventName extends keyof EventsMap>(
    eventName: EventName,
    handler: (...eventArgs: Parameters<EventsMap[EventName]>) => void
  ) {
    this._internalUnsubscribe(eventName, handler)
  }

  private _internalSubscribe<EventMap extends keyof EventsMap>(
    eventName: EventMap,
    handler: (...eventArgs: Parameters<EventsMap[EventMap]>) => void
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

  private _internalUnsubscribe<EventMap extends keyof EventsMap>(
    eventName: EventMap,
    handler: (...eventArgs: Parameters<EventsMap[EventMap]>) => void
  ) {
    const storedHandlers = this._subscriptions.get(eventName)

    if (!storedHandlers || storedHandlers.length === 0) return

    const filtredHandlers = storedHandlers.filter(
      (storedHandler) => storedHandler !== handler
    )

    this._subscriptions.set(eventName, filtredHandlers)
  }

  private _internalEmit<EventMap extends keyof EventsMap>(
    eventName: EventMap,
    ...eventArgs: Parameters<EventsMap[EventMap]>
  ) {
    const storedHandlers = this._subscriptions.get(eventName)

    if (!storedHandlers || storedHandlers.length === 0) return

    for (const subscription of storedHandlers) {
      subscription(eventArgs)
    }
  }
}

export { BaseEmitter }
