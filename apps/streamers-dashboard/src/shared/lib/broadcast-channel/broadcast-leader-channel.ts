import {
  BroadcastChannel,
  BroadcastChannelOptions,
  LeaderElector,
  createLeaderElection,
} from 'broadcast-channel'

import { EventSourceMessage } from '../fetch-event-source'

export class BroadcastLeaderChannel<T extends EventSourceMessage> {
  private _channel: BroadcastChannel<T>
  private _elector: LeaderElector
  private _onLeadershipListeners: Array<() => void | Promise<void>> = []

  constructor(channelName: string, options?: BroadcastChannelOptions) {
    this._channel = new BroadcastChannel<T>(channelName, options)
    this._elector = createLeaderElection(this._channel, {
      fallbackInterval: 2000,
      responseTime: 1000,
    })

    this._elector.awaitLeadership().then(() => this._callAllListeners())
  }

  get name() {
    return this._channel.name
  }

  get hasLeader() {
    return this._elector.hasLeader()
  }

  get isLeader() {
    return this._elector.isLeader
  }

  onLeadership(listener: () => void) {
    this._onLeadershipListeners.push(listener)
  }

  removeOnMessageCallback(callback: (message: T) => void) {
    this._elector.broadcastChannel.removeEventListener('message', callback)
  }

  async postMessage(msg: T) {
    return this._channel.postMessage(msg)
  }

  async onMessage(callback: (msg: T) => void) {
    return this._channel.addEventListener('message', callback)
  }

  async close() {
    return this._elector.die()
  }

  private _callAllListeners() {
    this._onLeadershipListeners.forEach((callbackfn) => {
      callbackfn()
    })
  }
}
