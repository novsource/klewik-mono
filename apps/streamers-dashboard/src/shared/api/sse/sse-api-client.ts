import { BROADCAST_CHANNEL_NAMES } from '~shared/constants/broadcast-channels'

import { AuctionSlotsSSEClient } from './auction-slots'
import { DonationsSSEClient } from './donations'
import {
  SSEApiBroadcastChannel,
  SSEApiEventSourceMessage,
} from './sse-api-channel'

type SSEApiClientConnectOptions = {
  slotsLastMessageId?: number
  donationsLastMessageId?: number
}

class SSEApiClient {
  private static _instance: SSEApiClient

  private _broadcastChannel: SSEApiBroadcastChannel
  private _onConnectListeners: Array<() => void> = []
  private _connectedClients: Array<string> = []
  private _isConnectedToSSE: boolean = false

  private constructor(private _auctionId: string) {
    this._broadcastChannel = new SSEApiBroadcastChannel(
      BROADCAST_CHANNEL_NAMES.MANAGER,
      { auctionId: this._auctionId }
    )

    const checkStatus = (message: SSEApiEventSourceMessage) => {
      const isLeader = this._broadcastChannel.isLeader
      // const isHasLeader = await this._broadcastChannel.hasLeader
      if (message.event === 'manager/status' && !isLeader) {
        const data = JSON.parse(message.data)

        if (data.auctionId !== this._auctionId) {
          return
        }

        this._isConnectedToSSE = data.isConnected

        if (data.status) {
          this._onConnectListeners.forEach((cb) => cb())
        }
      }
    }

    // Notify the new sse manager about currentlly connection status
    this.onLeadership(() => {
      this._broadcastChannel.removeOnMessageCallback(checkStatus)

      this._broadcastChannel.onMessage((message) => {
        if (message.event === 'manager/new') {
          this._broadcastChannel.postMessage({
            id: '',
            event: 'manager/status',
            data: JSON.stringify({
              auctionId: this._auctionId,
              isConnected: this._isConnectedToSSE,
            }),
          })
        }
      })
    })

    // Read message when create a new tab
    this._broadcastChannel.onMessage(checkStatus)
  }

  static init(auctionId: string) {
    if (this._instance) return this._instance

    this._instance = new SSEApiClient(auctionId)

    return this._instance
  }

  static getInstance() {
    if (!this._instance) {
      throw new Error('Instance of SSEApiClient not found')
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

  postMessage(message: SSEApiEventSourceMessage) {
    this._broadcastChannel.postMessage(message)
  }

  async connectToAllEvents(options?: SSEApiClientConnectOptions) {
    const onOpenEventHandler = (clientName: string) => () => {
      this._connectedClients.push(clientName)

      if (this._connectedClients.length === 2) {
        this._onConnectListeners.forEach((cb) => cb())
        this._isConnectedToSSE = true
      }
    }

    this.onLeadership(() => {
      this.onConnect(() => {
        this.postMessage({
          id: '',
          data: JSON.stringify({
            auctionId: this._auctionId,
            isConnected: true,
          }),
          event: 'manager/status',
          retry: undefined,
        })
      })
    })

    this.auctionSlots().on('onopen', onOpenEventHandler('auctionSlots'))
    this.donations().on('onopen', onOpenEventHandler('donations'))

    this.auctionSlots().connectToServer(
      this._auctionId,
      options?.slotsLastMessageId
    )

    this.donations().connectToServer(
      this._auctionId,
      options?.donationsLastMessageId
    )

    return new Promise<void>((resolve, reject) => {
      this.onConnect(resolve)

      this.auctionSlots().on('onerror', reject)
      this.donations().on('onerror', reject)
    })
  }
}

export { SSEApiClient }
