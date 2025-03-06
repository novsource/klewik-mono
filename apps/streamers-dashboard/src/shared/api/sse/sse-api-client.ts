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

    this._broadcastChannel.on('manager/leader-changed', () => {
      this._isConnectedToSSE = false
    })

    this.onLeadership(() => {
      this.postMessage({
        id: '',
        event: 'manager/leader-changed',
        data: '',
      })
    })

    // Notify the new SSE manager (not a leader tab) about currently connection status
    this.onLeadership(() => {
      this._broadcastChannel.on('manager/get-status', () => {
        this.postMessage({
          id: '',
          event: 'manager/status',
          data: JSON.stringify({
            auctionId: this._auctionId,
            isConnected: this._isConnectedToSSE,
          }),
        })
      })
    })

    this.postMessage({
      id: '',
      event: 'manager/new',
      data: JSON.stringify({
        auctionId: this._auctionId,
      }),
    })
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

    const connectPromise = new Promise<void>((resolve, reject) => {
      this._broadcastChannel.on('manager/status', (data) => {
        if (data.isConnected && !this._broadcastChannel.isLeader) {
          resolve()
        }
      })

      this.auctionSlots().on('onerror', reject)
      this.donations().on('onerror', reject)

      this.onLeadership(() => {
        console.log('leader')
        this.onConnect(() => {
          this.postMessage({
            id: '',
            event: 'manager/status',
            data: JSON.stringify({
              auctionId: this._auctionId,
              isConnected: true,
            }),
            retry: undefined,
          })

          resolve()
        })
      })

      this.postMessage({
        id: '',
        data: JSON.stringify({
          auctionId: this._auctionId,
        }),
        event: 'manager/get-status',
      })
    })

    // When leader changed we should connect again with elector
    // So, firstly we should set connect status to false
    // because when manager leader changing connect with server is aborting
    this.onLeadership(() => {
      this._isConnectedToSSE = false

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
    })

    this.postMessage({
      id: '',
      data: JSON.stringify({
        auctionId: this._auctionId,
      }),
      event: 'manager/get-status',
    })

    return connectPromise
  }
}

export { SSEApiClient }
