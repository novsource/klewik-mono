import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import { EventSourceMessage } from '~shared/lib/fetch-event-source'

import { BROADCAST_CHANNEL_NAMES } from '~shared/constants/broadcast-channels'

import { AuctionSlotsSSEClient } from './auction-slots'
import { DonationsSSEClient } from './donations'

class SSEApiClient {
  private static _instance: SSEApiClient

  private _broadcastChannel: BroadcastLeaderChannel<EventSourceMessage>
  private _onConnectListeners: Array<() => void> = []
  private _connectedClients: Array<string> = []
  private _isConnectedToSSE: boolean = false

  private constructor() {
    this._broadcastChannel = new BroadcastLeaderChannel<EventSourceMessage>(
      BROADCAST_CHANNEL_NAMES.MANAGER
    )

    this._broadcastChannel.postMessage({
      id: '0',
      data: '',
      event: 'manager/new',
      retry: undefined,
    })

    this._broadcastChannel.onMessage((message) => {
      if (message.event === 'manager/new' && this._broadcastChannel.isLeader) {
        this._broadcastChannel.postMessage({
          id: '0',
          event: 'manager/status',
          data: JSON.stringify({ status: this._isConnectedToSSE }),
        })
      }
    })

    this._broadcastChannel.onMessage((message) => {
      if (
        message.event === 'manager/status' &&
        !this._broadcastChannel.isLeader
      ) {
        const data = JSON.parse(message.data)

        this._isConnectedToSSE = data.status

        if (data.status) {
          this._onConnectListeners.forEach((cb) => cb())
        }
      }
    })
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new SSEApiClient()
    }

    return this._instance
  }

  auctionSlots() {
    return AuctionSlotsSSEClient.getInstance()
  }

  donations() {
    return DonationsSSEClient.getInstance()
  }

  onConnect(callback: () => void) {
    this._onConnectListeners.push(callback)
  }

  onLeadership(callback: () => void) {
    this._broadcastChannel.onLeadership(callback)
  }

  postMessage(message: EventSourceMessage) {
    this._broadcastChannel.postMessage(message)
  }

  async connectToAllEvents(auctionId: string) {
    const connectToSlots = this.auctionSlots().connectToServer(auctionId)
    const connectToDonations = this.donations().connectToServer(auctionId)

    this.auctionSlots().on('onopen', () => {
      this._connectedClients.push('auctionSlots')

      if (this._connectedClients.length === 2) {
        this._onConnectListeners.forEach((cb) => cb())
        this._isConnectedToSSE = true
      }
    })

    this.donations().on('onopen', () => {
      this._connectedClients.push('donations')

      if (this._connectedClients.length === 2) {
        this._onConnectListeners.forEach((cb) => cb())
        this._isConnectedToSSE = true
      }
    })

    return Promise.all([connectToSlots, connectToDonations])
  }
}

export { SSEApiClient }
