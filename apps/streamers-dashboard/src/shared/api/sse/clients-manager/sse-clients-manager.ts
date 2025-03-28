import { BROADCAST_CHANNEL_NAMES } from '~shared/constants/broadcast-channels'

import { AuctionSlotsSSEClient } from '../clients/auction-slots'
import { DonationsSSEClient } from '../clients/donations'
import {
  SSEApiEventSourceMessage,
  SSEClientsManagerBroadcastChannel,
} from './sse-clients-manager-channel'

type SSEApiClientConnectOptions = {
  slotsLastMessageId?: number
  donationsLastMessageId?: number
}

class SSEClientsManager {
  private static _instance: SSEClientsManager

  private _broadcastChannel: SSEClientsManagerBroadcastChannel
  private _onConnectListeners: Array<() => void> = []
  private _connectedClients: Array<string> = []
  private _isConnectedToSSE: boolean = false

  private constructor(private _auctionId: string) {
    this._broadcastChannel = new SSEClientsManagerBroadcastChannel(
      BROADCAST_CHANNEL_NAMES.MANAGER,
      { auctionId: this._auctionId }
    )

    this._broadcastChannel.on('manager/leader-changed', () => {
      this._isConnectedToSSE = false
    })

    this.onLeadership(() => {
      this.postMessage({
        id: '-3000',
        event: 'manager/leader-changed',
        data: JSON.stringify({
          auctionId: this._auctionId,
        }),
      })
    })

    // Notify the new SSE manager (not a leader tab) about currently connection status
    this.onLeadership(() => {
      this._broadcastChannel.on('manager/get-status', () => {
        this.postMessage({
          id: '-1000',
          event: 'manager/status',
          data: JSON.stringify({
            auctionId: this._auctionId,
            isConnected: this._isConnectedToSSE,
          }),
        })
      })
    })

    this.postMessage({
      id: '-2000',
      event: 'manager/new',
      data: JSON.stringify({
        auctionId: this._auctionId,
      }),
    })
  }

  static init(auctionId: string) {
    if (this._instance) return this._instance

    this._instance = new SSEClientsManager(auctionId)

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
    this._broadcastChannel.onChannelLeadership(callback)
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
      this._broadcastChannel.on('manager/status', ([data]) => {
        if (data.isConnected && !this._broadcastChannel.isLeader) {
          resolve()
        }
      })

      this.auctionSlots().on('onerror', reject)
      this.donations().on('onerror', reject)

      this.onLeadership(() => {
        this.onConnect(() => {
          this.postMessage({
            id: '-1000',
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
        id: '-4000',
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

      this.auctionSlots().connectToServer(this._auctionId, {
        ...options,
        lastMessageId: options?.slotsLastMessageId,
      })

      this.donations().connectToServer(this._auctionId, {
        ...options,
        lastMessageId: options?.donationsLastMessageId,
      })
    })

    this.postMessage({
      id: '-3000',
      data: JSON.stringify({
        auctionId: this._auctionId,
      }),
      event: 'manager/get-status',
    })

    return connectPromise
  }
}

export { SSEClientsManager as SSEApiClient }
