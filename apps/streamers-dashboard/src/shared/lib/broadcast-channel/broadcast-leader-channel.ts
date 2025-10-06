import type {
  BroadcastChannelOptions,
  LeaderElector,
} from 'broadcast-channel'

import type { EventSourceMessage as BaseEventSourceMessage } from '../fetch-event-source'
import type { DefaultChannelEventMap } from './model'

import {
  BroadcastChannel,
  createLeaderElection,
} from 'broadcast-channel'

import { BaseEmitter } from '../emitter'

/**
 * Methods of BroadcastLeaderChannel
 */
type BroadcastLeaderChannelMethods<
  SourceMessage extends BaseEventSourceMessage,
  ChannelEventMap extends Record<string, any>,
> = {
  on: <
    EventName extends keyof (ChannelEventMap
      & DefaultChannelEventMap<SourceMessage>),
  >(
    eventName: EventName,
    handler: (...args: Parameters<ChannelEventMap[EventName]>) => void
  ) => void

  emit: <
    EventName extends keyof (ChannelEventMap
      & DefaultChannelEventMap<SourceMessage>),
  >(
    eventName: EventName,
    ...args: Parameters<ChannelEventMap[EventName]>
  ) => void

  /**
   * Adds a handler to wait for a message to arrive from the server
   * @param handler - The function to which the message received from the server will be transmitted
   */
  onMessage: (handler: (message: SourceMessage) => void) => void

  /**
   * Removes the handler from waiting for a message from the server
   * @param handler - The handler function that needs to be removed
   * @returns
   */
  removeOnMessageHandler: (handler: (message: SourceMessage) => void) => void

  /**
   * Forwards the message to all channels with the same name
   * @param message - A message to send
   */
  postMessage: (message: SourceMessage) => Promise<void>

  /**
   * If the channel is the leader, then it closes the channel and begins the selection of a new leader.
    If the channel is not a leader, it simply removes the leaders from the race.
   * @returns A promise after which the channel will be removed from the leaderboard race.
   */
  close: () => Promise<void>

  /**
   * Returns the channel name specified during channel initialization
   * @returns Name of broadcast channel
   */
  name: string

  /**
   * Returns a boolean value indicating whether the channel is a leader or not
   * @returns True if the channel is the leader, false if not
   */
  isLeader: boolean

  /**
   * Returns a promise with the result whether there is a leader among all channels with the given name or not
   * @returns True if the leader exist, false if not
   */
  hasLeader: Promise<boolean>
}

export type BroadcastLeaderChannelOptions = BroadcastChannelOptions & {
  leaderBecomeAutomatic?: boolean
}

/**
 * A broadcast channel with the ability to automatically become the leader among all channels with the same name specified during creation.
 */
export class BroadcastLeaderChannel<
  SourceMessage extends BaseEventSourceMessage,
  ChannelEventMap extends Record<string, any>,
> implements BroadcastLeaderChannelMethods<SourceMessage, ChannelEventMap> {
  private readonly _elector: LeaderElector
  private readonly _emitter: BaseEmitter<
    ChannelEventMap & DefaultChannelEventMap<SourceMessage>
  > = new BaseEmitter()

  /**
   * Creates a broadcast channel with the opportunity to become a leader.
    If there is already a leader, he will join the leadership queue and notify the emitter when he becomes the leader.
   * @param channelName The name of the channel. It must match up with others so that he can compete for leadership.
   * @param options Standard broadcast channel options from the broadcast-channels library
   */
  constructor(channelName: string, options?: BroadcastLeaderChannelOptions) {
    const channel = new BroadcastChannel<SourceMessage>(channelName, options)

    this._elector = createLeaderElection(channel, {
      fallbackInterval: 2000,
      responseTime: 1000,
    })

    this._elector.awaitLeadership().then(() => {
      // @ts-expect-error Emitter can't give a opportunity emit without data
      this._emitter.emit('new-leader')
    })
  }

  get name() {
    return this._elector.broadcastChannel.name
  }

  get hasLeader() {
    return this._elector.hasLeader()
  }

  get isLeader() {
    return this._elector.isLeader
  }

  on<
    Event extends keyof (ChannelEventMap
      & DefaultChannelEventMap<SourceMessage>),
    EventMap extends ChannelEventMap & DefaultChannelEventMap<SourceMessage>,
  >(eventName: Event,
    handler: (...args: Parameters<EventMap[Event]>) => void,
  ) {
    this._emitter.on(eventName, handler)

    return () => {
      this.off(eventName, handler)
    }
  }

  // once<
  //   Event extends keyof (ChannelEventMap
  //     & DefaultChannelEventMap<SourceMessage>),
  //   EventMap extends ChannelEventMap & DefaultChannelEventMap<SourceMessage>,
  // >(eventName: Event,
  //   handler: (...args: Parameters<EventMap[Event]>) => void,
  // ) {
  //   // Delete handler if exist
  //   this.off(eventName, handler)

  //   const fn = (...args: EventMap[Event]) => handler(...args)

  //   this.on(eventName, (...args) => {
  //     handler(...args)

  //     this.off(eventName, fn)
  //   })
  // }

  off<
    Event extends keyof (ChannelEventMap
      & DefaultChannelEventMap<SourceMessage>),
    EventMap extends ChannelEventMap & DefaultChannelEventMap<SourceMessage>,
  >(eventName: Event,
    handler: (...args: Parameters<EventMap[Event]>) => void,
  ) {
    this._emitter.off(eventName, handler)
  }

  emit<
    Event extends keyof (ChannelEventMap
      & DefaultChannelEventMap<SourceMessage>),
    EventMap extends ChannelEventMap & DefaultChannelEventMap<SourceMessage>,
  >(eventName: Event,
    ...args: Parameters<EventMap[Event]>
  ) {
    this._emitter.emit(eventName, ...args)
  }

  onMessage(handler: (message: SourceMessage) => void) {
    this._elector.broadcastChannel.addEventListener('message', handler)

    return () => {
      this.removeOnMessageHandler(handler)
    }
  }

  onChannelLeadership(handler: () => void) {
    this.on('new-leader', () => {
      if (this.isLeader)
        handler()
    })
  }

  removeOnMessageHandler(handler: (message: SourceMessage) => void) {
    this._elector.broadcastChannel.removeEventListener('message', handler)
  }

  async postMessage(message: SourceMessage) {
    return this._elector.broadcastChannel.postMessage(message)
  }

  async close() {
    return this._elector.die()
  }
}
