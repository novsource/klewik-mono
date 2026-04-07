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

type BroadcastLeaderChannelEvents<T> = DefaultChannelEventMap<BaseEventSourceMessage> & T

/**
 * Methods of BroadcastLeaderChannel
 */
type BroadcastLeaderChannelMethods<
  SourceMessage,
  ChannelEventMap extends Record<string, any>,
> = {
  on: <
    EventName extends keyof ChannelEventMap,
  >(
    eventName: EventName,
    handler: (args: ChannelEventMap[EventName]) => void,
  ) => void

  emit: <
    EventName extends keyof ChannelEventMap,
  >(
    eventName: EventName,
    args: ChannelEventMap[EventName],
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
  SourceMessage,
  ChannelEventMap extends Record<string, any>,
> implements BroadcastLeaderChannelMethods<SourceMessage, BroadcastLeaderChannelEvents<ChannelEventMap>> {
  private readonly _channel: BroadcastChannel<SourceMessage>
  private readonly _elector: LeaderElector
  private readonly _emitter: BaseEmitter<BroadcastLeaderChannelEvents<ChannelEventMap>> = new BaseEmitter()

  /**
   * Creates a broadcast channel with the opportunity to become a leader.
    If there is already a leader, he will join the leadership queue and notify the emitter when he becomes the leader.
   * @param channelName The name of the channel. It must match up with others so that he can compete for leadership.
   * @param options Standard broadcast channel options from the broadcast-channels library
   */
  constructor(channelName: string, options?: BroadcastLeaderChannelOptions) {
    this._channel = new BroadcastChannel<SourceMessage>(channelName, options)

    this._elector = createLeaderElection(this._channel, {
      fallbackInterval: 500,
      responseTime: 100,
    })

    this._elector.awaitLeadership().then(() => {
      // @ts-expect-error Emitter can't give a opportunity emit without data
      this._emitter.emit('new-leader', null)
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

  get isClosed() {
    return this._channel.isClosed ?? false
  }

  on<Event extends keyof BroadcastLeaderChannelEvents<ChannelEventMap>>(
    eventName: Event,
    handler: (args: BroadcastLeaderChannelEvents<ChannelEventMap>[Event]) => void,
  ) {
    this._emitter.on(eventName, handler)

    return () => {
      this.off(eventName, handler)
    }
  }

  off<Event extends keyof BroadcastLeaderChannelEvents<ChannelEventMap>>(
    eventName: Event,
    handler: (args: BroadcastLeaderChannelEvents<ChannelEventMap>[Event]) => void,
  ) {
    this._emitter.off(eventName, handler)
  }

  emit<Event extends keyof BroadcastLeaderChannelEvents<ChannelEventMap>>(
    eventName: Event,
    args: BroadcastLeaderChannelEvents<ChannelEventMap>[Event],
  ) {
    this._emitter.emit(eventName, args)
  }

  async close() {
    if (!this._elector.isDead)
      await this._elector.die()

    if (!this._channel.isClosed)
      return this._channel.close()
  }

  onMessage(handler: (message: SourceMessage) => void) {
    this._elector.broadcastChannel.addEventListener('message', handler)

    return () => {
      this.removeOnMessageHandler(handler)
    }
  }

  onNewLeader(handler: () => void) {
    this.on('new-leader', handler)
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
}
