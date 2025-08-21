import type { MiddlewareAPI } from '@reduxjs/toolkit'

import { isAction } from '@reduxjs/toolkit'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'

const reduxBroadcastChannel = new BroadcastLeaderChannel('$reduxStoreSyncChannel')

type SyncStoreMiddlewareOptions = {
  blacklist?: string[]
}

const createSyncStoreMiddleware = (options?: SyncStoreMiddlewareOptions) => {
  return (api: MiddlewareAPI) => {
    return (next: (action: unknown) => unknown) => (action: unknown) => {
      if (!isAction(action))
        return next(action)

      const isActionShouldBePassed = options?.blacklist?.includes(action.type)

      if (isActionShouldBePassed)
        return next(action)

      const isPayloadAction = 'payload' in action

      if (isPayloadAction) {
        reduxBroadcastChannel.emit(action.type, { api, action })
      }
      else {
        reduxBroadcastChannel.emit(action.type, { api })
      }

      return next(action)
    }
  }
}

export const syncReduxStoreMiddleware = createSyncStoreMiddleware()
