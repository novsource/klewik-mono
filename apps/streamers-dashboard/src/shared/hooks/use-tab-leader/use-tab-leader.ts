import { useEffect, useState } from 'react'

import { BroadcastLeaderChannel } from '~shared/lib/broadcast-channel'
import type { EventSourceMessage } from '~shared/lib/fetch-event-source'

let tabChannel: NullablePossible<BroadcastLeaderChannel<EventSourceMessage, any>> = null

export function getTabChannel() {
  if (!tabChannel) {
    tabChannel = new BroadcastLeaderChannel('tab-leader')
  }

  return tabChannel
}

export type UseTabLeaderOptions = {
  onAnyTabBecomesLeader?: () => void
  onCurrentTabBecomesLeader?: () => void
}

export const useTabLeader = (options?: UseTabLeaderOptions) => {
  const channel = getTabChannel()

  const [isTabLeader, setIsTabLeader] = useState(() => {
    channel.onChannelLeadership(() => {
      options?.onCurrentTabBecomesLeader?.()

      setIsTabLeader(true)
    })
    channel.onNewLeader(() => {
      options?.onAnyTabBecomesLeader?.()
    })

    return channel.isLeader
  })

  useEffect(() => {
    const handleUnload = () => {
      if (channel.isClosed)
        channel.close()
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      handleUnload()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [channel])

  const recreateChannel = async () => {
    channel.close()

    tabChannel = new BroadcastLeaderChannel('tab-leader')
  }

  return { channel, isTabLeader, recreateChannel }
}
